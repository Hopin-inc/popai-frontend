<template lang="pug">
v-card(
  :class="{'selected': data.selected}"
  :disabled="props.data.toolName === TodoAppName[TodoAppId.SPREADSHEET]"
  flat
  rounded="s"
  height="64"
  @click.stop="onClick"
).d-flex.align-center.py-4.px-6
  img(:src="props.data.iconSrc" width="24").mr-2
  span.text-h6 {{ props.data.toolName }}
</template>

<script setup lang="ts">
import type { LinkToolBtnData } from "~/types/settings";
import { TodoAppName, TodoAppId } from "~~/src/consts/enum";

type Props = {
  data: LinkToolBtnData;
};
const props = withDefaults(defineProps<Props>(), {
  data: () => ({} as LinkToolBtnData),
});

type Emits = {
  (e: "click-card", id: number, toolName: string): void
};
const emits = defineEmits<Emits>();

const onClick = () => {
  emits("click-card", props.data.id, props.data.toolName);
};
</script>

<style scoped lang="sass">
.selected
  box-shadow: 0 0 0 2px rgb(var(--v-theme-primary)) inset
</style>
