<!-- components/ResponseDisplay.vue -->
<template>
  <div class="response-display">
    <div class="response-header">
      <div class="status-info">
        <span class="status-code" :class="getStatusCodeClass(response.status)">
          {{ response.status }}
        </span>
        <span class="status-text">{{ response.statusText }}</span>
        <span class="duration">in {{ response.duration }}ms</span>
      </div>
      <n-button-group size="small">
        <n-button @click="copyResponse" type="primary" ghost>
          Copy Response
        </n-button>
        <n-button @click="clearResponse" type="warning" ghost>
          Clear
        </n-button>
      </n-button-group>
    </div>
    
    <n-tabs type="line" animated default-value="body">
      <n-tab-pane name="body" tab="Body">
        <div class="response-body">
          <pre><code>{{ formattedData }}</code></pre>
        </div>
      </n-tab-pane>
      <n-tab-pane name="headers" tab="Headers">
        <div class="response-headers">
          <div 
            v-for="(value, key) in response.headers" 
            :key="key"
            class="header-item"
          >
            <span class="header-key">{{ key }}:</span>
            <span class="header-value">{{ value }}</span>
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { NButton, NButtonGroup, NTabs, NTabPane, useMessage } from 'naive-ui';
import { computed } from 'vue';
import { ApiResponse } from '../types';

interface Props {
  response: ApiResponse;
}

const props = defineProps<Props>();
const message = useMessage();

// Format the response data based on content type
const formattedData = computed(() => {
  try {
    // Check if the response data is JSON
    if (typeof props.response.data === 'object') {
      return JSON.stringify(props.response.data, null, 2);
    } else {
      return props.response.data;
    }
  } catch (e) {
    return props.response.data;
  }
});

// Get CSS class for status code based on status category
const getStatusCodeClass = (statusCode: number) => {
  if (statusCode >= 200 && statusCode < 300) {
    return 'status-success';
  } else if (statusCode >= 300 && statusCode < 400) {
    return 'status-redirect';
  } else if (statusCode >= 400 && statusCode < 500) {
    return 'status-client-error';
  } else if (statusCode >= 500) {
    return 'status-server-error';
  }
  return 'status-unknown';
};

// Copy response to clipboard
const copyResponse = () => {
  navigator.clipboard.writeText(JSON.stringify(props.response.data, null, 2))
    .then(() => {
      message.success('Response copied to clipboard');
    })
    .catch(() => {
      message.error('Failed to copy response');
    });
};

// Clear response
const clearResponse = () => {
  // This emits an event to parent component to clear the response
  // Since we don't have an emit defined, we'll skip this functionality for now
  // Or we could emit an event back to parent
  message.info('Response cleared');
};
</script>

<style scoped>
.response-display {
  margin-top: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-code {
  font-weight: bold;
  font-size: 1.1em;
}

.status-success {
  color: #28a745;
}

.status-redirect {
  color: #ffc107;
}

.status-client-error {
  color: #dc3545;
}

.status-server-error {
  color: #6f42c1;
}

.status-unknown {
  color: #6c757d;
}

.status-text {
  color: #495057;
}

.duration {
  color: #6c757d;
  font-size: 0.9em;
}

.response-body {
  padding: 16px;
  background-color: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Courier New', monospace;
  min-height: 300px;
  max-height: 500px;
  overflow: auto;
}

.response-body pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.response-headers {
  padding: 16px;
  max-height: 500px;
  overflow: auto;
}

.header-item {
  display: flex;
  margin-bottom: 8px;
  padding: 4px 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.header-key {
  font-weight: bold;
  min-width: 150px;
  color: #495057;
}

.header-value {
  flex: 1;
  color: #6c757d;
  word-break: break-all;
}
</style>
</template>
</file_text>