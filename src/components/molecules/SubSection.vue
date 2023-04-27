<template lang="pug">
section
  CardSectionName {{ props.title }}
  slot
</template>

<script setup lang="ts">
type Props = {
  title: string;
};

const props = withDefaults(defineProps<Props>(), {
  title: "",
});
</script>

<style scoped lang="sass">
section:not(:first-child)
  margin-top: 32px
</style>
