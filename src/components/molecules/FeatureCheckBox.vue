<template lang="pug">
v-card(
  :class="{'checked': props.checked}"
  flat
  rounded="s"
  @click.stop="checked = !checked"
  width="428"
).pa-8
  div.d-flex.align-center.mb-2
    v-icon(v-if="checked" size="large").mr-1 mdi-checkbox-outline
    v-icon(v-else size="large").mr-1 mdi-checkbox-blank-outline
    h3 {{ props.title }}
  p.line-break.mb-4 {{ props.description }}
  img(:src="props.imgSrc")
</template>

<script setup lang="ts">
type Props = {
  title: string;
  description: string;
  checked: boolean;
  imgSrc: string;
};
const props = withDefaults(defineProps<Props>(), {
  title: "",
  description: "",
  checked: false,
  imgSrc: "",
});

type Emits = {
  (e: "click-card", title: string): void
};
const emits = defineEmits<Emits>();

const onClick = () => {
  emits("click-card", props.title);
};
</script>

<style scoped lang="sass">
.line-break
  white-space: pre-wrap

.checked
  box-shadow: 0 0 0 2px rgb(var(--v-theme-primary)) inset
</style>
