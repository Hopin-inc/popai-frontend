<template lang="pug">
CommonPage(title="通知設定")
  v-row(v-if="!isInit")
    v-col(cols="12")
      SectionCard(
        title="通知日時の設定"
        description="POPAIにメッセージを送ってほしい日時・送ってほしくない日時を設定します。"
        icon-src="/images/calendar.svg"
      )
        SubSection(title="通知する曜日")
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
        SubSection(title="通知しない日")
          Switch(v-model="avoidHolidays" label="日本の祝日には通知しない")
          date-picker(
            v-model="excludedDates"
            ref="datepicker"
            @open="onDatePickerOpened"
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
import Datepicker from "@vuepic/vue-datepicker";
import type { SelectItem } from "~/types/common";
import { DAYS_OF_WEEK } from "~/consts";
import { getCommonConfig, updateCommonConfig } from "~/apis/config";

type ConfigCommon = {
  daysOfWeek: number[];
  disabledOnHolidaysJp: boolean;
  excludedDates: string[];
};

const { $dayjs } = useNuxtApp();
const { startLoading, finishLoading } = useLoading();

const isInit = ref<boolean>(true);
const datepicker = ref<InstanceType<typeof Datepicker> | null>(null);
const selectedDays = ref<number[]>([]);
const avoidHolidays = ref<boolean>(false);
const excludedDates = ref<string[]>([]);
const days: SelectItem[] = DAYS_OF_WEEK;

const displayExcludedDates = computed(() => {
  return excludedDates?.value.map(date => $dayjs(date).format("YYYY/MM/DD(ddd)"));
});

watch(() => [...selectedDays.value], async (next) => {
  await update({ daysOfWeek: next });
}, { deep: true });
watch(avoidHolidays, async (next) => {
  await update({ disabledOnHolidaysJp: next });
});
watch(() => [...excludedDates.value], async (next, prev) => {
  if (next.length !== prev.length) {
    excludedDates.value.sort();
    await update({ excludedDates: next });
  }
}, { deep: true });
const update = async (config: Partial<ConfigCommon>) => {
  if (!isInit.value) {
    startLoading();
    await updateCommonConfig(config);
    finishLoading();
  }
};

onMounted(async () => {
  await init();
});
const init = async () => {
  startLoading();
  await fetchConfig();
  isInit.value = false;
  finishLoading();
};
const fetchConfig = async () => {
  const config = await getCommonConfig();
  if (config) {
    selectedDays.value = config.daysOfWeek;
    avoidHolidays.value = config.disabledOnHolidaysJp;
    excludedDates.value = config.excludedDates;
  }
};

const onDatePickerOpened = () => {
  if (datepicker && excludedDates.value && excludedDates.value.length) {
    datepicker.value?.updateInternalModelValue(excludedDates.value.map(date => new Date(date)));
  }
};

const removeItem = (_: Event, index: number) => {
  excludedDates.value.splice(index, 1);
};
</script>

<style scoped lang="sass">
.date-picker
  z-index: 1000
  :deep(.v-field__input)
    gap: 8px
</style>
