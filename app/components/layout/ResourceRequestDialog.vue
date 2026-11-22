<script setup lang="ts">
import { toast } from 'vue-sonner'
import { useForm } from 'vee-validate'
import { RESEARCH_OPTIONS, resourceRequestFormSchema } from '#shared/utils/resource-request'

// The overlay a gated download opens (it replaces layout/resourceInfo.vue). Posts to /api/resource-requests, which
// forwards to the CMS; the Directus Flow on requests.create sends the confirmation email.
const { open, target } = useResourceRequest()

const { handleSubmit, errors, defineField, resetForm, isSubmitting } = useForm({
  validationSchema: toZodSchema(resourceRequestFormSchema),
  initialValues: { name: '', email: '', company: '', research: undefined },
})
const [name] = defineField('name')
const [email] = defineField('email')
const [company] = defineField('company')
const [research] = defineField('research')

const complete = ref(false)
const firstName = computed(() => (name.value || '').trim().split(' ')[0])

const submit = handleSubmit(async (values) => {
  try {
    await $fetch('/api/resource-requests', {
      method: 'POST',
      body: { ...values, company: values.company || undefined, resource: target.value.id },
    })
    complete.value = true
  }
  catch {
    toast.error('Sorry, we could not save your request. Please try again.')
  }
})

// Each time the overlay closes the next resource starts from a clean form.
watch(open, (isOpen) => {
  if (!isOpen) {
    complete.value = false
    resetForm()
  }
})

const selectClass = 'border-input h-9 w-full rounded-md border bg-white px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50'
</script>

<template>
  <St8Dialog
    v-model:open="open"
    :title="complete ? 'Thank you' : target.title"
    :description="complete
      ? 'Your request was saved.'
      : `To access ${target.title} you need to complete the form below. Once complete, you will be able to download the resource.`"
    class="resource-info__form"
  >
    <form v-if="!complete" class="flex flex-col gap-4" novalidate @submit.prevent="submit">
      <St8Field label="Name" for="request-name" :error="errors.name">
        <St8Input id="request-name" v-model="name" name="name" autocomplete="name" />
      </St8Field>
      <St8Field label="Email" for="request-email" :error="errors.email">
        <St8Input id="request-email" v-model="email" name="email" type="email" autocomplete="email" />
      </St8Field>
      <St8Field label="Company/Organization" for="request-company" :error="errors.company">
        <St8Input id="request-company" v-model="company" name="company" autocomplete="organization" />
      </St8Field>
      <St8Field label="How did you learn about ST8?" for="request-research" :error="errors.research">
        <select id="request-research" v-model="research" name="research" :class="selectClass">
          <option :value="undefined" disabled>Tell us how you heard about us.</option>
          <option v-for="option in RESEARCH_OPTIONS" :key="option" :value="option">{{ option }}</option>
        </select>
      </St8Field>
      <St8Button type="submit" class="w-full mt-2" :disabled="isSubmitting">
        {{ isSubmitting ? 'Sending…' : 'Submit' }}
      </St8Button>
    </form>
    <div v-else class="w-full text-center">
      <h3 class="uppercase tracking-wider mb-2">
        Thank you <strong>{{ firstName }}</strong>!
      </h3>
      <p class="mb-8">
        We appreciate your interest in Southern Tier 8. Click the button below to view
        <span class="font-bold">{{ target.title }}</span>.
      </p>
      <St8Button as="a" :href="target.link" target="_blank" rel="noreferrer" class="w-full">
        View resource
      </St8Button>
    </div>
  </St8Dialog>
</template>
