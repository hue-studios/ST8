<template>
  <div :id="'product-card-' + id" class="uk-card product-card">
    <div
      class="uk-card-body uk-background-cover uk-background-blend-darken uk-panel uk-flex uk-flex-start uk-flex-top uk-flex-column"
    >
      <div
        :id="'product-card-description-' + id"
        class="product-card-description"
      >
        <img :data-src="imageLocation + image + '?key=small'" :alt="title" />
        <h3 class="uk-text-center condensed uk-text-uppercase">{{ title }}</h3>
        <p class="uk-text-center">{{ description }}</p>
      </div>
    </div>
    <div
      class="uk-card-footer uk-padding-remove uk-flex uk-flex-row uk-flex-middle uk-flex-around"
    >
      <a
        class="condensed uk-text-center uk-text-uppercase"
        @click.prevent="toggleResourceForm('show')"
        >DOWNLOAD {{ title }}<span uk-icon="icon: download"></span
      ></a>
    </div>
    <div
      class="uk-flex uk-flex-center uk-flex-middle uk-flex-column product-card-form"
    >
      <a id="close-btn" @click.prevent="closeResourceForm"
        ><span uk-icon="icon: close; ratio: 1"></span
      ></a>

      <div class="uk-width-5-6 uk-text-center product-card-form-header">
        <h1>{{ title }}</h1>
      </div>

      <div
        class="uk-width-5-6 uk-flex uk-flex-center uk-flex-middle product-card-form-body"
      >
        <transition
          :enter-active-class="animateIn"
          :leave-active-class="animateOut"
          mode="out-in"
        >
          <div v-if="!response_box && !loading" key="0" class="form-section">
            <p class="white">
              To access {{ title }} you need to complete the form below. Once
              complete, you will be able to download the catalog.
            </p>
            <div class="uk-flex uk-flex-center uk-flex-middle" uk-grid>
              <div
                class="uk-width-1-1 uk-margin-remove-top uk-position-relative"
              >
                <h3 class="label middle">name:</h3>
                <input
                  v-model="name"
                  v-validate="'required'"
                  class="required uk-input"
                  type="text"
                  name="name"
                  required
                  placeholder="first and last name"
                />
                <span
                  v-show="errors.has('name')"
                  uk-icon="icon: warning"
                  class="white"
                ></span>
              </div>
              <div
                class="uk-width-1-1 uk-margin-remove-top uk-position-relative"
              >
                <h3 class="label middle">company:</h3>
                <input
                  v-model="company"
                  class="required uk-input"
                  type="tel"
                  name="phone"
                  maxlength="15"
                />
              </div>
              <div
                class="uk-width-1-1 uk-margin-remove-top uk-position-relative"
              >
                <h3 class="label middle">email:</h3>
                <input
                  v-model="email"
                  v-validate="'required|email'"
                  class="required uk-input"
                  type="email"
                  name="email"
                  required
                  placeholder="email@domain.com"
                />
                <span
                  v-show="errors.has('email')"
                  uk-icon="icon: warning"
                  class="white"
                ></span>
              </div>
              <div
                class="uk-width-1-1 uk-margin-remove-top uk-position-relative"
              >
                <h3 class="label middle">How did you learn about us:</h3>
                <select
                  v-model="research"
                  v-validate="'required'"
                  class="required uk-select"
                  name="research"
                >
                  <option selected>Tell us how you heard about this.</option>
                  <option value="Print">Print</option>
                  <option value="TV">TV</option>
                  <option value="Online">Online</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Referral">Referral</option>
                  <option value="Other">Other</option>
                </select>
                <span
                  v-show="errors.has('research')"
                  uk-icon="icon: warning"
                  class="white"
                ></span>
              </div>
            </div>
            <h5 class="uk-width-1-1 uk-text-center">
              <a
                class="condensed next-button white"
                @click.prevent="submitResourceInfo()"
                >SUBMIT
              </a>
            </h5>
          </div>

          <div
            v-if="response_box && !loading"
            id="response-box"
            key="6"
            class="form-section six"
            style="margin-top: 60px"
          >
            <div class="uk-flex uk-flex-center uk-text-center" uk-grid>
              <p class="white">
                <span class="yellow bold">Great {{ first_name }}!</span> It
                looks like you've entered everything correctly. Now click the
                button below to download the {{ title }}.
              </p>
              <p class="uk-text-center">
                <a
                  target="_blank"
                  class="condensed uk-text-uppercase download-btn"
                  :href="imageLocation + document"
                  :onclick="
                    `ga('send', 'event', 'Media File', 'download', '` +
                    title +
                    `')`
                  "
                >
                  DOWNLOAD {{ title }}<br /><span
                    uk-icon="icon: download"
                  ></span>
                </a>
              </p>
            </div>
          </div>
          <div v-if="loading" id="spinner-loader"></div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
export default {
  props: [
    {
      item: {
        type: Object,
        default: null,
      },
    },
  ],
  data() {
    return {
      imageLocation: process.env.imageUrl,
      name: '',
      email: '',
      company: '',
      research: '',
      animateIn: 'uk-animation-slide-right-small uk-animation-fast',
      animateOut:
        'uk-animation-slide-left-small uk-animation-reverse uk-animation-fast',
      loading: false,
      response_box: false,
      ip_address: '',
    }
  },
  computed: {
    // first_name() {
    //   const app = this
    //   const firstWords = []
    //   for (let i = 0; i < app.name.length; i++) {
    //     const codeLine = app.name[i]
    //     const firstWord = app.name.substr(0, app.name.indexOf(' '))
    //     firstWords.push(firstWord)
    //     if (firstWord.length > 1) {
    //       return firstWord
    //     } else {
    //       return app.name
    //     }
    //   }
    // },
  },

  created() {
    axios
      .get('https://api.ipify.org')
      .then((res) => {
        this.ip_address = res.data
      })
      .catch((error) => {
        console.log(error.response)
      })
  },
  methods: {
    toggleResourceForm(direction) {
      const app = this
      const resourceCard = document.getElementById('product-card-' + app.id)
      if (direction === 'hide') {
        resourceCard.classList.remove('show')
      } else if (direction === 'show') {
        resourceCard.classList.add('show')
      }
    },
    closeResourceForm() {
      this.toggleResourceForm('hide')
      this.loading = false
      this.response_box = false
      this.name = ''
      this.email = ''
      this.company = ''
      this.research = ''
    },
    submitResourceInfo() {
      const app = this
      this.$validator.validateAll().then((result) => {
        if (result) {
          app.loading = true
          axios({
            method: 'post',
            url: process.env.apiUrl + '/items/product_downloads',
            data: {
              ip_address: app.ip_address,
              name: app.name,
              email: app.email,
              research: app.research,
              company: app.company,
              status: 'published',
              product: app.title,
              date_submitted: moment().format('MMMM D, YYYY h:mm A'),
            },
          })
            .then(function (response) {
              app.sendEmailNotification()
              app.loading = false
              app.response_box = true
            })
            .catch(function (error) {
              console.log(error)
            })
        } else {
          console.log(result)
          app.$toast.error(
            ' ',
            'You need to complete the form properly before continuing.',
            app.$parent.toastOptions.error
          )
        }
      })
    },
    sendEmailNotification() {
      const app = this
      axios
        .post(
          process.env.emailUrl +
            'productDownload.php?product=' +
            app.title +
            '&email=' +
            app.email +
            '&name=' +
            app.name +
            '&company=' +
            app.company +
            '&research=' +
            app.research +
            '&date_submitted=' +
            moment().format('MMMM D, YYYY h:mm A') +
            '&ip_address=' +
            app.ip_address
        )
        .then((response) => {
          console.log('PROMO CODE RESPONSE: ' + response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>
<style lang="scss">
// @import '../../sass/components/productCard';
</style>
