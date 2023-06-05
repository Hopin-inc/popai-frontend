<template lang="pug">
CommonPage(title="利用設定")
  v-row
    v-col(cols="12")
      h2.font-weight-bold POPAIにできること
      p チャンネルに追加する機能を選んでください。
      v-row(align="stretch").mt-4
        v-col(cols="12" sm="6")
          FeatureCard(
            @switch="switchFeature('todos')"
            :enabled="todosEnabled"
            :icon-src="Icons.CHECK"
            title="タスクのシェア"
            config-path="/features/todos"
          )
            template(#description)
              p
                | スケジュール通りに進めたくても、進捗共有だけのミーティングは何かとタイヘン。
                | メンバーそれぞれの始業時に質問に答えるだけで、タスクごとの遅延リスクを可視化することができます。
        v-col(cols="12" sm="6")
          FeatureCard(
            @switch="switchFeature('projects')"
            :enabled="projectsEnabled"
            :icon-src="Icons.FLAG"
            title="プロジェクトのシェア"
            config-path="/features/projects"
          )
            template(#description)
              p
                | スケジュール通りに進めたくても、進捗共有だけのミーティングは何かとタイヘン。
                | メンバーそれぞれの始業時に質問に答えるだけで、プロジェクトごとの遅延リスクを可視化することができます。
</template>

<script setup lang="ts">
import { getFeatures, updateProspectConfig } from "~/apis/config";
import { useLoading } from "~/composables/loading";
import { Icons } from "~/consts/images";
import FeatureCard from "~/components/molecules/FeatureCard.vue";
import { AskType } from "~/consts/enum";
import type { ComputedRef } from "vue";

type ConfigFeatures = {
  projects: boolean;
  todos: boolean;
};

const { startLoading, finishLoading } = useLoading();
const features: ConfigFeatures = reactive<ConfigFeatures>({ projects: false, todos: false });
const projectsEnabled: ComputedRef<boolean> = computed(() => features.projects);
const todosEnabled: ComputedRef<boolean> = computed(() => features.todos);

const switchFeature = async (feature: keyof ConfigFeatures) => {
  startLoading();
  if (feature === "projects" || feature === "todos") {
    await updateProspectConfig({
      type: feature === "projects" ? AskType.PROJECTS : AskType.TODOS,
      enabled: !features[feature],
    });
    features[feature] = !features[feature];
  }
  finishLoading();
};

onMounted(async () => {
  startLoading();
  const configs = await getFeatures();
  features.projects = configs?.projects ?? false;
  features.todos = configs?.todos ?? false;
  finishLoading();
});
</script>

<style scoped lang="sass">
.date-picker
  z-index: 1000
  :deep(.v-field__input)
    gap: 8px
</style>
