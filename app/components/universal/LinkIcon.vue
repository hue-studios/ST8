<template>
  <span class="link-icon">
    <Icon name="lucide:arrow-right" size="20" />
  </span>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/vars' as *;

.link-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: $green;
  border-radius: 50%;
  color: $white;
  width: 30px;
  height: 30px;
  margin-top: -3px;
  vertical-align: middle;
}
</style>
