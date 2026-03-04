<!-- components/RequestEditor.vue -->
<template>
  <div class="request-editor">
    <div class="editor-header">
      <n-input
        v-model:value="localApiItem.name"
        placeholder="Request Name"
        size="large"
        style="max-width: 400px;"
      />
      <div class="method-url">
        <n-select
          v-model:value="localApiItem.config!.method"
          :options="methodOptions"
          :style="{ width: '120px', marginRight: '12px' }"
        />
        <n-input
          v-model:value="localApiItem.config!.url"
          placeholder="Enter URL"
          :style="{ width: '100%', flex: 1 }"
        />
      </div>
      <n-button
        @click="sendRequest"
        type="primary"
        size="large"
        :loading="isLoading"
        :style="{ marginLeft: '12px' }"
      >
        Send
      </n-button>
    </div>
    
    <n-tabs type="line" animated>
      <n-tab-pane name="params" tab="Query Params">
        <KeyValueEditor
          :items="localApiItem.config!.params"
          @update-items="(items) => localApiItem.config!.params = items"
          key-name="Key"
          value-name="Value"
        />
      </n-tab-pane>
      <n-tab-pane name="headers" tab="Headers">
        <KeyValueEditor
          :items="localApiItem.config!.headers"
          @update-items="(items) => localApiItem.config!.headers = items"
          key-name="Header"
          value-name="Value"
        />
      </n-tab-pane>
      <n-tab-pane name="body" tab="Body">
        <div class="body-section">
          <n-radio-group v-model:value="localApiItem.config!.body!.type" name="body-type" size="medium">
            <n-space>
              <n-radio value="none">None</n-radio>
              <n-radio value="json">JSON</n-radio>
              <n-radio value="form-data">Form Data</n-radio>
              <n-radio value="x-www-form-urlencoded">x-www-form-urlencoded</n-radio>
            </n-space>
          </n-radio-group>
          
          <div v-if="localApiItem.config!.body!.type !== 'none'" class="body-content">
            <n-input
              v-model:value="localApiItem.config!.body!.content"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 10 }"
              placeholder="Enter body content"
            />
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
    
    <!-- Response Display -->
    <div v-if="localApiItem.response" class="response-section">
      <ResponseDisplay :response="localApiItem.response" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  NInput, 
  NSelect, 
  NButton, 
  NTabs, 
  NTabPane, 
  NRadioGroup, 
  NSpace, 
  NRadio,
  useMessage
} from 'naive-ui';
import { ref, watch, nextTick } from 'vue';
import { ApiItem } from '../types';
import axios from 'axios';
import KeyValueEditor from './KeyValueEditor.vue';
import ResponseDisplay from './ResponseDisplay.vue';

interface Props {
  apiItem: ApiItem;
}

const props = defineProps<Props>();
const apiStore = useApiStore();
const message = useMessage();

// Local copy to prevent direct mutation of prop
const localApiItem = ref<ApiItem>({ ...props.apiItem });
localApiItem.value.config = { ...props.apiItem.config! };
localApiItem.value.config.headers = [...props.apiItem.config!.headers];
localApiItem.value.config.params = [...props.apiItem.config!.params];
localApiItem.value.config.body = { ...props.apiItem.config!.body! };

// Watch for changes in the prop and update local copy
watch(() => props.apiItem, (newVal) => {
  localApiItem.value = { ...newVal };
  localApiItem.value.config = { ...newVal.config! };
  localApiItem.value.config.headers = [...newVal.config!.headers];
  localApiItem.value.config.params = [...newVal.config!.params];
  localApiItem.value.config.body = { ...newVal.config!.body! };
}, { deep: true });

// Update the original item when local changes occur
watch(localApiItem, (newVal) => {
  apiStore.updateItem(props.apiItem.id, newVal);
}, { deep: true });

// Method options
const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'HEAD', value: 'HEAD' },
  { label: 'OPTIONS', value: 'OPTIONS' }
];

// Loading state for request sending
const isLoading = ref(false);

const props = defineProps<Props>();
const apiStore = useApiStore();
const message = useMessage();

// Local copy to prevent direct mutation of prop
const localApiItem = ref<ApiItem>({ ...props.apiItem });
localApiItem.value.config = { ...props.apiItem.config! };
localApiItem.value.config.headers = [...props.apiItem.config!.headers];
localApiItem.value.config.params = [...props.apiItem.config!.params];
localApiItem.value.config.body = { ...props.apiItem.config!.body! };

// Watch for changes in the prop and update local copy
watch(() => props.apiItem, (newVal) => {
  localApiItem.value = { ...newVal };
  localApiItem.value.config = { ...newVal.config! };
  localApiItem.value.config.headers = [...newVal.config!.headers];
  localApiItem.value.config.params = [...newVal.config!.params];
  localApiItem.value.config.body = { ...newVal.config!.body! };
  // Also sync response if it exists
  if (newVal.response) {
    localApiItem.value.response = newVal.response;
  }
}, { deep: true });

// Update the original item when local changes occur
watch(localApiItem, (newVal) => {
  apiStore.updateItem(props.apiItem.id, newVal);
}, { deep: true });

// Method options
const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'HEAD', value: 'HEAD' },
  { label: 'OPTIONS', value: 'OPTIONS' }
];

// Loading state for request sending
const isLoading = ref(false);

// Interface definition moved to top
interface Props {
  apiItem: ApiItem;
}

// Send request
const sendRequest = async () => {
  if (!localApiItem.value.config!.url) {
    message.warning('Please enter a URL');
    return;
  }
  
  isLoading.value = true;
  
  try {
    // Replace environment variables in the URL
    const currentEnv = apiStore.getCurrentEnvironment();
    let processedUrl = localApiItem.value.config!.url;
    
    if (currentEnv) {
      for (const variable of currentEnv.variables) {
        const regex = new RegExp(`{{${variable.key}}}`, 'g');
        processedUrl = processedUrl.replace(regex, variable.value);
      }
    }
    
    // Prepare request config
    const requestConfig: any = {
      method: localApiItem.value.config!.method,
      url: processedUrl,
      headers: {},
      params: {}
    };
    
    // Add enabled headers
    for (const header of localApiItem.value.config!.headers) {
      if (header.enabled && header.key.trim() !== '') {
        requestConfig.headers[header.key] = header.value;
      }
    }
    
    // Add enabled params
    for (const param of localApiItem.value.config!.params) {
      if (param.enabled && param.key.trim() !== '') {
        requestConfig.params[param.key] = param.value;
      }
    }
    
    // Add body if applicable
    if (localApiItem.value.config!.body!.type !== 'none' && localApiItem.value.config!.body!.content) {
      if (localApiItem.value.config!.body!.type === 'json') {
        try {
          requestConfig.data = JSON.parse(localApiItem.value.config!.body!.content);
        } catch (e) {
          message.error('Invalid JSON in request body');
          return;
        }
      } else {
        requestConfig.data = localApiItem.value.config!.body!.content;
      }
    }
    
    // Make the actual API request
    const startTime = Date.now();
    const response = await axios(requestConfig);
    const duration = Date.now() - startTime;
    
    // Format the response
    const formattedResponse = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
      duration: duration
    };
    
    // Store response in the item for display
    localApiItem.value.response = formattedResponse;
    
    message.success(`Request completed in ${duration}ms`);
  } catch (error: any) {
    console.error('Request failed:', error);
    
    // Handle axios errors
    if (error.response) {
      const formattedResponse = {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
        duration: 0 // We can't measure duration for failed requests easily
      };
      
      localApiItem.value.response = formattedResponse;
      message.error(`Request failed: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      message.error('Network error: Request failed to reach the server');
    } else {
      message.error(`Request failed: ${error.message}`);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.request-editor {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 12px;
}

.method-url {
  display: flex;
  flex: 1;
  gap: 12px;
}

.body-section {
  padding: 16px 0;
}

.body-content {
  margin-top: 16px;
}
</style>
</template>
</file_text>