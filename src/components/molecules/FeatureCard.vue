<template lang="pug">
v-card(flat rounded="xl").pa-8.pt-6.h-100
  .d-flex.flex-column.feature-card
    .d-flex.justify-center.align-center
      img(:src="props.iconSrc" width="32")
      h3.text-h6.font-weight-bold.mx-2 {{ props.title }}
    .flex-grow-1
      slot(name="description")
    .d-flex.align-center
      v-btn(
        :prepend-icon="props.enabled ? 'mdi-check' : 'mdi-plus'"
        :variant="props.enabled ? 'outlined' : undefined"
        color="primary"
        size="large"
        flat
        @click.stop="onSwitched"
      ).flex-fill {{ props.enabled ? "追加済み" : "チャンネルに追加" }}
      v-btn(
        v-if="props.enabled"
        :to="props.configPath"
        nuxt
        icon="mdi-cog"
        variant="text"
        color="secondary"
        flat
      ).ml-2
</template>

<script lang="ts" setup>
type Props = {
  enabled: boolean;
  iconSrc: string;
  title: string;
  configPath: string;
};
type Emits = {
  (e: "switch"): void;
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  iconSrc: "",
  title: "",
  configPath: "",
});
const emits = defineEmits<Emits>();

const onSwitched = () => {
  if (props.enabled) {
    const confirmed = confirm(`本当に${ props.title }をOFFにしますか？`);
    if (confirmed) {
      emits("switch");
    }
  } else {
    emits("switch");
  }
};
</script>

<style lang="sass" scoped>
.feature-card
  height: 100%
  gap: 16px
</style>
