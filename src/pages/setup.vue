<template lang="pug">
h1 ここにタイトルを入れる
</template>

<script setup lang="ts">
useHead({
  title: "TODO",
});

const { startLoading, finishLoading, loading } = useLoading();
// const { implementedChatToolId, implementedTodoAppId, chatToolAccounts, todoAppAccounts, fetchConfigStatus } = useInfo();

onMounted(async () => {
});

</script>

<style scoped lang="sass">
$widths: 40, 80, 120, 160, 200, 240, 280
@each $width in $widths
  .w-#{$width}px
    width: #{$width}px
    min-width: #{$width}px
</style>
