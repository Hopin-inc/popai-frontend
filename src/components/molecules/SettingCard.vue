<template lang="pug">
v-card
  v-card-title.d-flex.pt-4.w-100
    .flex-fill
      CardTitle {{ title }}
      CardSubtitle(v-if="subtitle").mt-1 {{ subtitle }}
    v-switch(v-if="appendType === 'switch'" v-model="props.switch" @update:model-value="onSwitched")
  v-card-item
    slot(name="content")
  v-card-actions(v-if="withActions")
    slot(name="actions")
</template>

<script setup lang="ts">
type Props = {
  title: string;
  subtitle?: string;
  appendType?: "switch";
  switch?: boolean;
  withActions?: boolean;
};
type Emits = {
  (e: "update:switch", value: boolean): void
};

const props = withDefaults(defineProps<Props>(), {
  title: "",
});
const emits = defineEmits<Emits>();

const onSwitched = () => emits("update:switch", props.switch);
</script>