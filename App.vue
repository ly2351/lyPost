<!-- App.vue -->
<template>
  <n-message-provider>
    <n-config-provider :theme-overrides="themeOverrides">
      <MainLayout />
    </n-config-provider>
  </n-message-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider } from 'naive-ui';
import { onMounted } from 'vue';
import { useApiStore } from './stores/apiStore';
import MainLayout from './layouts/MainLayout.vue';

// Theme overrides for Naive UI
const themeOverrides = {
  common: {
    primaryColor: '#1890ff',
    primaryColorHover: '#40a9ff',
    primaryColorPressed: '#096dd9'
  }
};

const apiStore = useApiStore();

onMounted(() => {
  // Initialize sample data
  apiStore.initializeSampleData();
});
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
</template>
</file_text>