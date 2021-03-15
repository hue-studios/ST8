<template>
  <div id="error" class="container flex h-screen justify-center items-center">
    <div class="flex flex-col justify-center items-center mb-20">
      <h1 v-if="error.statusCode === 404" class="">Uh oh...page not found.</h1>
      <h1 v-else>Uh oh...an error occurred.</h1>
      <NuxtLink to="/" class="uppercase mt-8 text-center tracking-widest bold"
        >Home page <link-icon></link-icon
      ></NuxtLink>
    </div>
  </div>
</template>
<script>
import linkIcon from '~/components/universal/linkIcon'
export default {
  components: {
    linkIcon,
  },
  layout: 'error',
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      imageUrl: process.env.imageUrl,
    }
  },
  created() {},
  methods: {},
}
</script>
<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/layout/mobileNav';
@import './assets/scss/layout/mobileNavBtn';
@import './assets/scss/layout/mobileToolbar';
#error {
  .link-icon {
    transform: scale(0.8);
  }
}
</style>
