<template lang="pug">
v-list(density="compact").pa-0.bg-transparent
  template(v-for="item in props.menus")
    template(v-if="item.type === 'item'")
      v-list-item(
        v-if="item.to"
        :prepend-icon="item.icon"
        :append-icon="item.disabled ? 'mdi-lock' : undefined"
        :disabled="item.disabled"
        :title="item.title"
        :to="item.to"
        active-color="primary"
        :rounded="props.rounded"
      )
      v-list-item(
        v-else-if="item.href"
        :prepend-icon="item.icon"
        :append-icon="item.disabled ? 'mdi-lock' : undefined"
        :disabled="item.disabled"
        :title="item.title"
        :href="item.href"
        target="_blank"
        active-color="primary"
        :rounded="props.rounded"
      )
      v-list-item(
        v-else-if="item.action"
        :prepend-icon="item.icon"
        :append-icon="item.disabled ? 'mdi-lock' : undefined"
        :disabled="item.disabled"
        :title="item.title"
        @click.stop="item.action"
        active-color="primary"
        :rounded="props.rounded"
      )
    v-list-subheader(v-else-if="item.type === 'subheader'" :title="item.title" sticky)
    v-divider.my-2(v-else-if="item.type === 'divider'")
</template>

<script setup lang="ts">
type Props = {
  menus: MenuItem[];
  rounded?: "xl" | "lg" | "md" | "sm" | "xs";
};
type MenuItem = {
  type: "item";
  title: string;
  disabled: boolean;
  icon?: string;
  to?: string;
  href?: string;
  action?: (...args: any[]) => any;
} | {
  type: "divider";
} | {
  type: "subheader";
  title: string;
};

const props = withDefaults(defineProps<Props>(), {
  menus: () => [],
  rounded: undefined,
});
</script>
