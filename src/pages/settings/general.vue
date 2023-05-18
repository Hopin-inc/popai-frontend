<template lang="pug">
CommonPage(title="利用設定")
  v-row
    v-col(cols="12")
      h2.font-weight-bold POPAIにできること
      p チャンネルに追加する機能を選んでください。
      v-row.mt-4
        v-col(cols="12" sm="6")
          v-card(flat rounded="xl").pa-8.pt-6
            .d-flex.justify-center.align-center
              img(:src="Icons.HANDSHAKE" width="32")
              h3.text-h5.font-weight-bold.mx-2 シェア
            p.mt-4
              | スケジュール通りに進めたくても、進捗共有だけのミーティングは何かとタイヘン。
              | メンバーそれぞれの始業時に質問に答えるだけで、タスクごとの遅延リスクを可視化することができます。
            .d-flex.align-center.mt-4
              v-btn(
                @click.stop="switchProspect"
                :prepend-icon="features.prospect ? 'mdi-check' : 'mdi-plus'"
                :variant="features.prospect ? 'outlined' : undefined"
                color="primary"
                size="large"
                flat
              ).flex-fill {{ features.prospect ? "追加済み" : "チャンネルに追加" }}
              v-btn(
                v-if="features.prospect"
                nuxt
                to="/features/prospect"
                icon="mdi-cog"
                variant="text"
                color="secondary"
                flat
              ).ml-2
</template>

<script setup lang="ts">
import { getFeatures, updateProspectConfig } from "~/apis/config";
import { useLoading } from "~/composables/loading";
import { Icons } from "~/consts/images";

type ConfigFeatures = {
  prospect: boolean;
};

const { startLoading, finishLoading } = useLoading();
const features: ConfigFeatures = reactive<ConfigFeatures>({ prospect: false });

onMounted(async () => {
  startLoading();
  const configs = await getFeatures();
  features.prospect = configs?.prospect ?? false;
  finishLoading();
});

const switchProspect = async () => {
  startLoading();
  await updateProspectConfig({ enabled: !features.prospect });
  features.prospect = !features.prospect;
  finishLoading();
};
</script>

<style scoped lang="sass">
.date-picker
  z-index: 1000
  :deep(.v-field__input)
    gap: 8px
</style>
