<template>
  <div
    id="page-footer"
    class="flex items-center md:items-start justify-center flex-col md:flex-row pt-10 pb-10"
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
      <nuxt-link to="/regional-profile/" class="uppercase w-full footer-link"
        >Regional Profile</nuxt-link
      >
      <nuxt-link to="/regional-news/" class="uppercase w-full footer-link"
        >News</nuxt-link
      >
      <nuxt-link to="" class="uppercase w-full footer-link">Events</nuxt-link>
      <nuxt-link to="" class="uppercase w-full footer-link"
        >Resources</nuxt-link
      >
      <nuxt-link
        to="/regional-organization/"
        class="uppercase w-full footer-link"
        >Organization</nuxt-link
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
        class="flex flex-row flex-wrap items-center justify-center w-full footer-col__contact-section social"
      >
        <div
          v-for="(item, index) in social_links"
          :key="index"
          class="text-center"
        >
          <a
            :href="item.social_links_id.link"
            target="_blank"
            class="rounded-full w-12 h-12 flex justify-center items-center mr-4"
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
  </div>
</template>
<script>
import { LinkedinIcon, FacebookIcon, TwitterIcon } from 'vue-feather-icons'
export default {
  components: {
    LinkedinIcon,
    FacebookIcon,
    TwitterIcon
  },
  data() {
    return {
      initiatives: [],
      organization: {},
      social_links: [],
      locations: []
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
        .catch(function(error) {
          console.log(error)
        })
    },
    getInitiatives() {
      this.$axios
        .$get('/items/initiatives?fields=*.*.*')
        .then((response) => {
          this.initiatives = response.data
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  }
}
</script>
<style lang="scss">
@import './assets/scss/vars';
@import './assets/scss/layout/pageFooter';
</style>
