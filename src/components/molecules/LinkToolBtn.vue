<template lang="pug">
v-card(
  :class="{'card-disabled': !props.enabled, 'selected': props.selected}"
  flat
  rounded="s"
  @click.stop="onClick"
  height="64"
).d-flex.align-center.py-4.px-6
  img(:src="props.iconSrc" width="24").mr-2
  span.text-h6 {{ props.toolName }}
</template>

<script setup lang="ts">
type Props = {
  toolName: string;
  enabled: boolean;
  selected: boolean
  iconSrc: string;
};
const props = withDefaults(defineProps<Props>(), {
  toolName: "",
  enabled: true,
  selected: false,
  iconSrc: "",
});

type Emits = {
  (e: "click-card", toolName: string): void
};
const emits = defineEmits<Emits>();

const onClick = () => {
  emits("click-card", props.toolName);
};
</script>

<style scoped lang="sass">
.card-disabled
  background-color: gray
  opacity: 0.4
.selected
  box-shadow: 0 0 0 2px rgb(var(--v-theme-primary)) inset
</style>
