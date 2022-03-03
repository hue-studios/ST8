<template>
  <div
    :id="'report-card-' + item.id"
    class="w-full flex items-center justify-start flex-row mb-6 shadow-lg relative report-card"
  >
    <div
      class="w-full flex flex-col items-start justify-center report-card__content"
    >
      <h2 class="uppercase tracking-wider w-full mb-1 report-card__title">
        {{ item.title }}
      </h2>

      <h5
        v-if="item.date"
        class="w-full uppercase navy tracking-widest report-card__date"
      >
        {{ $moment(item.date).format('dddd MMMM Do, YYYY') }}
      </h5>
      <h5
        v-else
        class="w-full uppercase navy tracking-widest report-card__date"
      >
        {{ $moment(item.modified_on).format('dddd MMMM Do, YYYY') }}
      </h5>
    </div>

    <a
      v-if="item.file"
      :href="imageLocation + item.file.private_hash"
      target="_blank"
      rel="noreferrer"
      class="flex items-center justify-center flex-row uppercase report-card__link"
    >
      <span class="inline-block parent"
        >Download <span class="hidden sm:inline-block">Document</span></span
      >
      <icons-document-download class="inline-block" />
    </a>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      imageLocation: process.env.imageUrl,
    }
  },
  created() {},
  methods: {},
}
</script>

<style lang="scss">
@import './assets/scss/vars';
.report-card {
  border: thin solid rgba($grey, 0.2);
  background: rgba($grey, 0.05);
  backdrop-filter: blur(2px);
  max-width: 680px;
  .report-card__content {
    @apply p-4;

    .report-card__title {
      font-size: 12px;
      line-height: 15px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-weight: 400;
      color: $navy;
      letter-spacing: 0.2em;

      @media (min-width: $breakpoint-small) {
        font-size: 18px;

        line-height: 20px;
      }
      @media (min-width: $breakpoint-medium) {
        font-size: 18px;

        line-height: 20px;
      }
      @media (min-width: $breakpoint-large) {
        // font-size: 18px;
      }
    }
    .report-card__date {
      font-size: 8px;
    }
  }
  .report-card__link {
    // width: 40px;
    // @media (min-width: $breakpoint-small) {
    //   width: 50px;
    // }
    font-size: 10px;
    letter-spacing: 0.2em;
    @apply p-4;
    .parent {
      width: 75px;
      @media (min-width: $breakpoint-small) {
        width: 150px;
      }
    }
    svg {
      height: 20px;
      width: auto;

      path {
        fill: $green;
      }
    }
  }
}
</style>
