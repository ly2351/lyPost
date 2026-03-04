<!-- layouts/MainLayout.vue -->
<template>
  <div class="main-layout">
    <n-layout has-sider sider-placement="left" style="height: 100vh;">
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :native-scrollbar="false"
      >
        <Sidebar />
      </n-layout-sider>
      <n-layout-content embedded>
        <RequestEditor v-if="currentSelectedItem?.type === 'request'" :api-item="currentSelectedItem" />
        <n-empty v-else description="Select an API request to edit" style="margin-top: 100px;" />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { NLayout, NLayoutSider, NLayoutContent, NEmpty } from 'naive-ui';
import { useApiStore } from '../stores/apiStore';
import { computed } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import RequestEditor from '../components/RequestEditor.vue';

const apiStore = useApiStore();
const currentSelectedItem = computed(() => apiStore.currentSelectedItem);
</script>

<style scoped>
.main-layout {
  height: 100vh;
  width: 100vw;
}
</style>