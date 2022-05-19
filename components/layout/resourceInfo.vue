<template>
  <div
    class="fixed top-0 left-0 w-full h-screen flex items-center justify-center resource-info"
  >
    <div class="max-w-7xl relative resource-info__form">
      <div class="close-btn" @click="closeResourceInfo()"><icons-close /></div>
      <transition
        :enter-active-class="animateIn"
        :leave-active-class="animateOut"
        mode="out-in"
      >
        <div v-if="!complete && !loading">
          <h2
            class="mb-2 uppercase bold tracking-wider w-full text-center leading-5"
          >
            {{ title }}
          </h2>
          <p class="text-center mb-4 bold">
            To access the {{ title }} you need to complete the form below. Once
            complete, you will be able to download the resource.
          </p>
          <div class="relative w-full mb-3">
            <label for="name" class="block mb-1">Name:</label>
            <input
              id="name"
              v-model="name"
              v-validate="'required'"
              name="name"
              type="text"
              class="w-full p-2"
              required
            />
            <transition name="fade" mode="out-in">
              <span
                v-show="errors.has('name')"
                class="absolute bottom-0 right-0 yellow"
                ><icons-error
              /></span>
            </transition>
          </div>
          <div class="relative w-full mb-3">
            <label for="email" class="block mb-1">Email</label>
            <input
              id="email"
              v-model="email"
              v-validate="'required|email'"
              name="email"
              type="email"
              class="w-full p-2"
              required
            />
            <transition name="fade" mode="out-in">
              <span
                v-show="errors.has('email')"
                class="absolute bottom-0 right-0 yellow"
                ><icons-error
              /></span>
            </transition>
          </div>
          <div class="relative w-full mb-3">
            <label for="company" class="block mb-1"
              >Company/Organization:</label
            >
            <input
              id="company"
              v-model="company"
              name="company"
              type="text"
              class="w-full p-2"
            />
          </div>
          <div class="relative w-full mb-3">
            <label for="research" class="block w-full mb-1"
              >How did you learn about ST8?</label
            >
            <select
              id="research"
              v-model="research"
              v-validate="'required'"
              name="research"
              class="w-full p-2"
              required
            >
              <option selected>Tell us how you heard about us.</option>
              <option value="Print">Print</option>
              <option value="TV">TV</option>
              <option value="Online">Online</option>
              <option value="Social Media">Social Media</option>
              <option value="Referral">Referral</option>
              <option value="Other">Other</option>
            </select>
            <transition name="fade" mode="out-in">
              <span
                v-show="errors.has('research')"
                class="absolute bottom-0 right-0 yellow"
                ><icons-error
              /></span>
            </transition>
          </div>
          <button
            type="submit"
            class="uppercase w-full tracking-wider mt-4 bold"
            @click.prevent="submitResourceInfo()"
          >
            Submit
          </button>
        </div>
      </transition>
      <transition
        :enter-active-class="animateIn"
        :leave-active-class="animateOut"
        mode="out-in"
      >
        <div v-if="complete && !loading" class="w-full text-center">
          <h3 class="uppercase tracking-wider mb-2">
            Thank you <strong>{{ first_name }}</strong
            >!
          </h3>
          <p class="mb-8">
            We appreciate your interest in Southern Tier 8. Click the button
            below to view <span class="font-bold">{{ title }}</span
            >.
          </p>
          <a :href="link" target="_blank">VIEW RESOURCE</a>
        </div>
      </transition>
      <transition name="fade" mode="out-in">
        <div
          v-if="loading"
          class="flex items-center justify-center w-full h-full"
        >
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
    resource: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      name: '',
      company: '',
      email: '',
      research: '',
      animateIn: 'uk-animation-slide-right-small uk-animation-fast',
      animateOut:
        'uk-animation-slide-left-small uk-animation-reverse uk-animation-fast',
      loading: false,
      complete: false,
    }
  },
  computed: {
    first_name() {
      return this.name.split(' ')[0]
    },
  },
  created() {},
  methods: {
    closeResourceInfo() {
      console.log('test')
      this.$store.commit('UPDATE_RESOURCE', {
        title: '',
        link: '',
        resource: '',
      })
      this.$store.commit('UPDATE_RESOURCE_INFO', false)
    },
    submitResourceInfo() {
      const app = this
      this.$validator.validateAll().then((result) => {
        if (result) {
          app.loading = true
          axios({
            method: 'post',
            url: process.env.apiUrl + '/items/requests',
            data: {
              name: app.name,
              email: app.email,
              research: app.research,
              company: app.company,
              status: 'published',
              resource: app.resource,
            },
          })
            .then(function (response) {
              app.loading = false
              app.complete = true
              axios
                .post(
                  'https://admin.steny.org/email/requestConfirmation.php?first_name=' +
                    app.first_name +
                    '&email=' +
                    app.email +
                    '&resource=' +
                    app.title
                )
                .catch(function (error) {
                  console.log(error)
                })
            })
            .catch(function (error) {
              console.log(error)
            })
        } else {
          console.log(result)
          this.$notify.warning({
            title: 'Ummm sorry.',
            message: 'You need to complete the form.',
            overlay: true,
            position: 'bottomRight',
            icon: 'ico-warning',
          })
        }
      })
    },
    getOrganizationInfo() {
      this.$axios
        .$get('/items/organization?fields=*.*.*&single=1')
        .then((response) => {
          this.organization = response.data
          this.social_links = response.data.social_links
          this.locations = response.data.locations
        })
        .catch(function (error) {
          console.log(error)
        })
    },
  },
}
</script>
<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/layout/pageFooter';
.resource-info {
  background: rgba($white, 0.75);
  z-index: 1000;
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background: none;
    -webkit-backdrop-filter: blur(20px);
    backdrop-filter: blur(20px);
  }

  &__form {
    width: 375px;
    padding: 20px;
    background: rgba($white, 0.75);
    @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
      background: none;
    }
    .close-btn {
      position: absolute;
      right: 0px;
      top: -40px;
      width: 40px;
      height: 40px;

      border-radius: 50%;
      background: $navy;
      cursor: pointer;
      @media (min-width: $breakpoint-small) {
        right: -25px;
        top: -25px;
      }
      @media (min-width: $breakpoint-medium) {
      }
      #close-icon {
        width: 40px;
        height: 40px;
        padding: 10px;
        stroke: $white;
      }
    }
    p {
      line-height: 1.3em;
      font-size: 13px;
    }
    label {
      text-transform: uppercase;
      font-family: $bold-font;
      letter-spacing: 0.1em;
    }
    input {
      background: $white;
    }
    button,
    a {
      background: $navy;
      color: $white;
      padding: 15px 30px;
      width: 100%;
    }
  }
}
</style>
