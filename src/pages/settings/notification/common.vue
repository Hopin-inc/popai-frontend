<template lang="pug">
SettingCard(
  title="通知日時設定"
  subtitle="通知する日時を設定します。"
)
  template(#content)
    CardSection(title="通知する曜日")
      .d-flex.flex-wrap
        v-checkbox(
          v-model="selectedDays"
          v-for="(day, index) in days"
          :key="index"
          :label="day.name"
          :value="day.id"
          color="primary"
          hide-details
        ).flex-grow-0.mr-4
    CardSection(title="通知しない日")
      Switch(v-model="avoidHolidays" label="日本の祝日には通知しない")
      date-picker(
        v-model="excludedDates"
        model-type="yyyy-MM-dd"
        :min-date="new Date()"
        :enable-time-picker="false"
        :month-change-on-scroll="false"
        locale="ja"
        multi-dates
        auto-apply
        :teleport="true"
        :close-on-auto-apply="false"
      ).date-picker
        template(#trigger)
          v-select(
            :model-value="displayExcludedDates"
            label="通知しない日を個別に指定"
            multiple
            variant="outlined"
            color="primary"
            hide-details
            readonly
          ).mt-4
            template(#selection="{ item, index }")
              v-chip(
                closable
                @click:close.prevent="removeItem(e, index)"
                :key="index"
                density="comfortable"
              ) {{ item.title }}
</template>

<script setup lang="ts">
import type { SelectItem } from "~/types";
import { DAYS_OF_WEEK } from "~/consts";

const { $dayjs } = useNuxtApp();

const selectedDays = ref<number[]>([]);
const avoidHolidays = ref<boolean>(false);
const excludedDates = ref<string[]>([]);
const days: SelectItem[] = DAYS_OF_WEEK;

const displayExcludedDates = computed(() => {
  return excludedDates.value.map(date => $dayjs(date).format("YYYY/MM/DD(ddd)"));
});
watch(excludedDates, () => {
  excludedDates.value.sort();
}, { deep: true });

const removeItem = (_: Event, index: number) => {
  excludedDates.value.splice(index, 1);
};
</script>

<style scoped lang="sass">
.date-picker
  :deep(.v-field__input)
    gap: 8px
</style>
