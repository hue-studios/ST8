<template>
  <div
    id="page-footer"
    class="flex items-center md:items-start justify-center flex-col md:flex-row md:flex-wrap pt-10 pb-20"
  >
    <div
      class="flex flex-col items-start justify-start w-full md:w-1/3 text-center md:text-left pr-8 pl-8 footer-col"
    >
      <h4 class="uppercase w-full">Initiatives</h4>
      <nuxt-link
        v-for="initiative in initiatives"
        :key="initiative.sort"
        :to="'/economic-development-initiatives/' + initiative.url"
        class="uppercase w-full footer-link"
        >{{ initiative.title }}</nuxt-link
      >
    </div>
    <div
      class="flex flex-col items-start justify-start w-full md:w-1/3 pr-8 pl-8 mt-8 md:mt-0 text-center md:text-left footer-col"
    >
      <h4 class="uppercase w-full">Site Links</h4>
      <nuxt-link
        to="/economic-development-programs/"
        class="uppercase w-full footer-link"
        >Programs</nuxt-link
      >
      <nuxt-link
        to="/economic-development-services/"
        class="uppercase w-full footer-link"
        >Services</nuxt-link
      >
      <nuxt-link
        to="/regional-partnerships"
        class="uppercase w-full footer-link"
        >Partnerships</nuxt-link
      >
      <nuxt-link to="/regional-profile" class="uppercase w-full footer-link"
        >Regional Profile</nuxt-link
      >
      <nuxt-link to="/regional-news" class="uppercase w-full footer-link"
        >News</nuxt-link
      >
      <nuxt-link to="/regional-events" class="uppercase w-full footer-link"
        >Events</nuxt-link
      >
      <nuxt-link
        to="/regional-news/resources"
        class="uppercase w-full footer-link"
        >Resources</nuxt-link
      >
      <nuxt-link
        to="/regional-organization/"
        class="uppercase w-full footer-link"
        >Organization</nuxt-link
      >
      <nuxt-link to="/how-to-apply" class="uppercase w-full footer-link"
        >How to Apply</nuxt-link
      >
    </div>
    <div
      class="flex flex-col items-start justify-start w-full md:w-1/3 pr-8 pl-8 mt-8 md:mt-0 text-center md:text-left footer-col"
    >
      <h4 class="uppercase w-full">Contact Info</h4>
      <div
        class="flex flex-col items-start justify-start w-full footer-col__contact-section"
      >
        <p class="w-full uppercase">
          <span class="label">Phone:</span> {{ organization.phone }}
        </p>
        <p class="w-full uppercase">
          <span class="label">Fax:</span> {{ organization.fax }}
        </p>
        <p class="w-full uppercase">
          <span class="label">Email:</span>
          <a href="mailto:organization.email" target="_blank">{{
            organization.email
          }}</a>
        </p>
      </div>
      <div
        v-for="item in locations"
        :key="item.id"
        class="flex flex-col items-start justify-start w-full footer-col__contact-section location"
      >
        <h5 class="w-full uppercase">{{ item.locations_id.title }}</h5>
        <p class="w-full uppercase">{{ item.locations_id.address }}</p>
      </div>
      <div
        class="flex flex-row flex-wrap items-center justify-center md:justify-start w-full footer-col__contact-section social"
      >
        <div
          v-for="(item, index) in social_links"
          :key="index"
          class="text-center"
        >
          <a
            :href="item.social_links_id.link"
            target="_blank"
            class="rounded-full w-10 h-10 flex justify-center items-center mr-1 ml-1 md:mr-2 md:ml-0"
            ><linkedin-icon
              v-if="item.social_links_id.platform == 'Linkedin'"
              size="1x"
              stroke-width="1"
              class="inline-block"
            ></linkedin-icon
            ><facebook-icon
              v-if="item.social_links_id.platform == 'Facebook'"
              size="1x"
              stroke-width="1"
              class="inline-block"
            ></facebook-icon
            ><twitter-icon
              v-if="item.social_links_id.platform == 'Twitter'"
              size="1x"
              stroke-width="1"
              class="inline-block"
            ></twitter-icon
          ></a>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center flex-col w-full">
      <h5 id="copyright" class="tracking-widest uppercase">
        &#169; {{ $moment().format('YYYY') }} Southern Tier 8 Regional Board
      </h5>
      <h5 id="web-designer" class="">
        <a
          href="https://huestudios.com"
          target="_blank"
          rel="noopener"
          class="columns shrink"
          >designed by
          <svg
            id="hue-logo"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 98.44 48.62"
          >
            <title>hue Creative Marketing - Binghamton, NY</title>
            <path
              class="h"
              d="M347.41,282.12h6.28v19.35c2-3.5,6.14-5.48,10.77-5.48,3.5,0,8.52,1.25,10.44,5.28.66,1.32,1.12,2.91,1.12,7.73v20.74h-3.56c-5.61,0-2.78-19.62-2.78-19.62,0-3,0-9.38-7.13-9.38a8.57,8.57,0,0,0-7.79,4.43c-1.06,1.85-1.06,5-1.06,7v17.57h-6.28Z"
              transform="translate(-347.41 -282.12)"
            />
            <path
              class="h"
              d="M388.17,296.59v21.34c0,3.24.73,7.33,7.07,7.33,3.1,0,6-1.06,7.79-3.7,1.39-2,1.39-4.56,1.39-6.21,0,0-1.87-18.76,2.07-18.76h4.33v27c0,.66.13,4.36.2,6.21h-6.47l-.13-5.68c-1.19,2.31-3.44,6-10.57,6-8.19,0-12-4.69-12-11.23V296.59Z"
              transform="translate(-347.41 -282.12)"
            />
            <path
              class="h"
              d="M422,314.29c-.13,6.87,2.71,12,9.51,12,5.93,0,6.3-6.87,9.67-6.87h4.33a11.26,11.26,0,0,1-2.84,6.94c-1.45,1.65-4.76,4.43-11.43,4.43-10.44,0-15.39-6.47-15.39-17,0-6.54,1.32-12,6.54-15.59,3.17-2.25,7.13-2.44,9.05-2.44,14.86,0,14.53,13.15,14.4,18.56Zm17.51-4.36c.07-3.17-.53-9.78-8.19-9.78-4,0-8.92,2.44-9,9.78Z"
              transform="translate(-347.41 -282.12)"
            /></svg
        ></a>
      </h5>
    </div>
  </div>
</template>
<script>
import { LinkedinIcon, FacebookIcon, TwitterIcon } from 'vue-feather-icons'
export default {
  components: {
    LinkedinIcon,
    FacebookIcon,
    TwitterIcon,
  },
  data() {
    return {
      initiatives: [],
      organization: {},
      social_links: [],
      locations: [],
    }
  },
  created() {
    this.getInitiatives()
    this.getOrganizationInfo()
  },
  methods: {
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
    getInitiatives() {
      this.$axios
        .$get('/items/initiatives?fields=*.*.*&filter[status]=published')
        .then((response) => {
          this.initiatives = response.data
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
</style>
