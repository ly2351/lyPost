<!-- components/KeyValueEditor.vue -->
<template>
  <div class="key-value-editor">
    <div class="table-header">
      <span class="key-column">{{ keyName }}</span>
      <span class="value-column">{{ valueName }}</span>
      <span class="actions-column">Actions</span>
    </div>
    <div class="table-body">
      <div 
        v-for="(item, index) in itemsWithIds" 
        :key="item.id"
        class="table-row"
      >
        <div class="input-cell">
          <n-input
            v-model:value="item.key"
            :placeholder="`${keyName}...`"
          />
        </div>
        <div class="input-cell">
          <n-input
            v-model:value="item.value"
            :placeholder="`${valueName}...`"
          />
        </div>
        <div class="action-cell">
          <n-switch
            v-model:value="item.enabled"
            :rail-style="switchRailStyle"
          />
          <n-button
            @click="removeItem(index)"
            type="error"
            size="small"
            quaternary
          >
            <template #icon>
              <n-icon><TrashOutline /></n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </div>
    <div class="table-footer">
      <n-button @click="addItem" size="small" type="primary" ghost>
        <template #icon>
          <n-icon><AddOutline /></n-icon>
        </template>
        Add {{ keyName }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  NInput, 
  NSwitch, 
  NButton, 
  NIcon 
} from 'naive-ui';
import { 
  TrashOutline, 
  AddOutline 
} from '@vicons/ionicons5';
import { ref, watch, onMounted } from 'vue';

interface Item {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface Props {
  items: Array<{ key: string; value: string; enabled: boolean }>;
  keyName?: string;
  valueName?: string;
}

interface Emits {
  (e: 'updateItems', items: Array<{ key: string; value: string; enabled: boolean }>): void;
}

const props = withDefaults(defineProps<Props>(), {
  keyName: 'Key',
  valueName: 'Value'
});

const emit = defineEmits<Emits>();

// Add unique IDs to items for Vue key tracking
const itemsWithIds = ref<Item[]>([]);

// Initialize items with IDs
onMounted(() => {
  updateItemsWithIds();
});

// Watch for changes in props.items and update our internal list
watch(() => props.items, () => {
  updateItemsWithIds();
}, { deep: true });

// Update items with IDs
const updateItemsWithIds = () => {
  itemsWithIds.value = props.items.map(item => ({
    id: generateId(),
    key: item.key,
    value: item.value,
    enabled: item.enabled
  }));
};

// Add a new item
const addItem = () => {
  itemsWithIds.value.push({
    id: generateId(),
    key: '',
    value: '',
    enabled: true
  });
  emitUpdate();
};

// Remove an item
const removeItem = (index: number) => {
  itemsWithIds.value.splice(index, 1);
  emitUpdate();
};

// Emit updated items
const emitUpdate = () => {
  const updatedItems = itemsWithIds.value.map(({ key, value, enabled }) => ({
    key,
    value,
    enabled
  }));
  emit('updateItems', updatedItems);
};

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Switch rail style
const switchRailStyle = (checked: boolean) => {
  return {
    backgroundColor: checked ? '#007bff' : '#cccccc'
  };
};
</script>

<style scoped>
.key-value-editor {
  padding: 12px 0;
}

.table-header {
  display: flex;
  padding: 8px 0;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}

.key-column {
  flex: 1;
  padding: 0 8px;
}

.value-column {
  flex: 1;
  padding: 0 8px;
}

.actions-column {
  width: 120px;
  padding: 0 8px;
  text-align: right;
}

.table-body {
  max-height: 400px;
  overflow-y: auto;
}

.table-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.input-cell {
  flex: 1;
  padding: 0 8px;
}

.action-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 120px;
  padding: 0 8px;
  gap: 8px;
}

.table-footer {
  padding-top: 12px;
}
</style>
</template>
</file_text>