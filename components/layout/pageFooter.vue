<template>
  <div
    id="page-footer"
    class="flex items-start justify-center flex-col md:flex-row pt-10 pb-10"
  >
    <div
      class="flex flex-col items-start justify-start w-full md:w-1/3 pr-8 pl-8 footer-col"
    >
      <h4 class="uppercase w-full">Initiatives</h4>
      <nuxt-link
        v-for="initiative in initiatives"
        :key="initiative.sort"
        :to="'/economic-development-initiatives/' + initiative.url"
        class="uppercase footer-link"
        >{{ initiative.title }}</nuxt-link
      >
    </div>
    <div
      class="flex flex-col items-start justify-start w-full md:w-1/3 pr-8 pl-8 footer-col"
    >
      <h4 class="uppercase w-full">Site Links</h4>
      <nuxt-link to="" class="uppercase footer-link">Programs</nuxt-link>
      <nuxt-link to="" class="uppercase footer-link">Services</nuxt-link>
      <nuxt-link to="" class="uppercase footer-link"
        >Regional Profile</nuxt-link
      >
      <nuxt-link to="" class="uppercase footer-link">ST8 Counties</nuxt-link>
      <nuxt-link to="" class="uppercase footer-link">News</nuxt-link>
      <nuxt-link to="" class="uppercase footer-link">Events</nuxt-link>
      <nuxt-link to="" class="uppercase footer-link">Resources</nuxt-link>
      <nuxt-link to="" class="uppercase footer-link">Board / Team</nuxt-link>
    </div>
    <div
      class="flex flex-col items-start justify-start w-full md:w-1/3 pr-8 pl-8 footer-col"
    >
      <h4 class="uppercase w-full">Contact Info</h4>
      <div
        class="flex flex-col items-start justify-start footer-col__contact-section"
      >
        <p class="uppercase">
          <span class="label">Phone:</span> {{ organization.phone }}
        </p>
        <p class="uppercase">
          <span class="label">Fax:</span> {{ organization.fax }}
        </p>
        <p class="uppercase">
          <span class="label">Email:</span>
          <a href="mailto:organization.email" target="_blank">{{
            organization.email
          }}</a>
        </p>
      </div>
      <div
        v-for="item in locations"
        class="flex flex-col items-start justify-start footer-col__contact-section location"
      >
        <h5 class="uppercase">{{ item.locations_id.title }}</h5>
        <p class="uppercase">{{ item.locations_id.address }}</p>
      </div>
      <div
        class="flex flex-row flex-wrap items-start justify-start footer-col__contact-section social"
      >
        <div v-for="(item, index) in social_links" :key="index">
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
        .$get('/items/organization?fields=*.*.*')
        .then((response) => {
          this.organization = response.data[0]
          this.social_links = response.data[0].social_links
          this.locations = response.data[0].locations
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
