<template>
  <div class="container flex h-screen justify-center items-center">
    <div class="flex flex-col justify-center items-center mb-20">
      <h1 v-if="error.statusCode === 404" class="">Uh oh...page not found.</h1>
      <h1 v-else>Uh oh...an error occurred.</h1>
      <NuxtLink to="/" class="uppercase mt-8 text-center">Home page</NuxtLink>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: ['error'],
  layout: 'error',
  data() {
    return {
      imageUrl: process.env.imageUrl
    }
  },
  created() {},
  methods: {}
}
</script>
<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/layout/mobileNav';
@import './assets/scss/layout/mobileNavBtn';
@import './assets/scss/layout/mobileToolbar';
</style>
