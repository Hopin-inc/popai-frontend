<template lang="pug">
v-card(flat).rounded-lg
  v-card-title.d-flex.align-center.pa-6.w-100
    .flex-fill
      CardTitle {{ title }}
      CardSubtitle(v-if="subtitle").mt-1 {{ subtitle }}
    v-switch(
      v-if="appendType === 'switch'"
      :model-value="props.switch"
      @update:model-value="onSwitched"
      hide-details
      color="primary"
    ).ml-4.flex-grow-0
  template(v-if="appendType !== 'switch' || props.switch")
    v-card-item.pa-6.pt-0
      slot(name="content")
    v-card-actions(v-if="withActions").pa-6.pt-0
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
  switch: false,
  withActions: false
});
const emits = defineEmits<Emits>();

const onSwitched = () => {
  emits("update:switch", !props.switch);
};
</script>
