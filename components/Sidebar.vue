<!-- components/Sidebar.vue -->
<template>
  <div class="sidebar">
    <div class="header">
      <n-button-group style="width: 100%; margin-bottom: 8px;">
        <n-button 
          @click="addFolder" 
          size="small" 
          type="primary" 
          ghost
          :disabled="!canAddToRoot"
        >
          <template #icon>
            <n-icon><FolderAddOutline /></n-icon>
          </template>
          Folder
        </n-button>
        <n-button 
          @click="addRequest" 
          size="small" 
          type="primary" 
          ghost
          :disabled="!canAddToRoot"
        >
          <template #icon>
            <n-icon><DocumentTextOutline /></n-icon>
          </template>
          Request
        </n-button>
      </n-button-group>
    </div>
    <div class="tree-container">
      <n-tree
        block-line
        expand-on-click
        :data="treeData"
        :render-label="renderLabel"
        :on-update:selected-keys="handleSelect"
        :selected-keys="selectedKeys"
        :node-props="nodeProps"
      />
    </div>
    <div class="environment-selector">
      <n-select
        v-model:value="currentEnvironmentId"
        :options="environmentOptions"
        size="small"
        placeholder="Select environment"
        style="width: 100%;"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  NTree, 
  NButton, 
  NButtonGroup, 
  NIcon, 
  NSwitch,
  NInput,
  NSelect,
  useMessage
} from 'naive-ui';
import { h, computed, reactive } from 'vue';
import { FolderAddOutline, DocumentTextOutline, TrashOutline, AddCircleOutline } from '@vicons/ionicons5';
import { useApiStore } from '../stores/apiStore';
import { ApiItem } from '../types';

const apiStore = useApiStore();
const message = useMessage();

// Computed properties
const treeData = computed(() => {
  return convertToTreeData(apiStore.apiCollection);
});

const selectedKeys = computed(() => {
  return apiStore.currentSelectedItem ? [apiStore.currentSelectedItem.id] : [];
});

const currentEnvironmentId = computed({
  get: () => apiStore.currentEnvironmentId,
  set: (value: string) => {
    apiStore.currentEnvironmentId = value;
  }
});

const environmentOptions = computed(() => {
  return apiStore.environments.map(env => ({
    label: env.name,
    value: env.id
  }));
});

const canAddToRoot = computed(() => {
  return apiStore.apiCollection.length < 100; // Prevent too many root items
});

// Convert ApiItem array to tree structure
const convertToTreeData = (items: ApiItem[]) => {
  return items.map(item => {
    const node: any = {
      key: item.id,
      label: item.name,
      item: item
    };

    if (item.type === 'folder' && item.children) {
      node.children = convertToTreeData(item.children);
    }

    return node;
  });
};

// Custom label renderer to show controls
const renderLabel = ({ item }: { item: ApiItem }) => {
  return h('span', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}, [
    h('span', { style: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}, item.name),
    h('span', { style: { display: 'flex', gap: '4px', opacity: 0, marginLeft: '8px' }}, [
      h(NIcon, {
        component: AddCircleOutline,
        depth: 4,
        size: 16,
        onClick: (e: Event) => {
          e.stopPropagation();
          if (item.type === 'folder') {
            addRequest(item.id);
          }
        },
        style: { cursor: 'pointer', display: item.type === 'folder' ? 'inline-block' : 'none' }
      }),
      h(NIcon, {
        component: TrashOutline,
        depth: 3,
        size: 16,
        onClick: (e: Event) => {
          e.stopPropagation();
          deleteItem(item.id);
        },
        style: { cursor: 'pointer' }
      })
    ])
  ]);
};

// Handle node selection
const handleSelect = (keys: string[]) => {
  if (keys.length > 0) {
    const selectedItem = apiStore.findItemById(keys[0], apiStore.apiCollection);
    if (selectedItem) {
      apiStore.selectItem(selectedItem);
    }
  } else {
    apiStore.selectItem(null);
  }
};

// Node props to handle hover effects
const nodeProps = ({ item }: { item: ApiItem }) => {
  return {
    onClick: () => {
      handleSelect([item.id]);
    },
    onmouseenter: (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const icons = target.querySelector('span:last-child');
      if (icons) {
        icons.style.opacity = '1';
      }
    },
    onmouseleave: (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const icons = target.querySelector('span:last-child');
      if (icons) {
        icons.style.opacity = '0';
      }
    }
  };
};

// Add new folder
const addFolder = (parentId?: string) => {
  const name = window.prompt('Enter folder name:', 'New Folder');
  if (name) {
    const newItem = apiStore.addItem({
      name: name.trim(),
      type: 'folder',
      children: []
    }, parentId);
    apiStore.selectItem(newItem);
  }
};

// Add new request
const addRequest = (parentId?: string) => {
  const name = window.prompt('Enter request name:', 'New Request');
  if (name) {
    const newItem = apiStore.addItem({
      name: name.trim(),
      type: 'request',
      config: {
        method: 'GET',
        url: '',
        headers: [],
        params: [],
        body: {
          type: 'none',
          content: ''
        }
      }
    }, parentId);
    apiStore.selectItem(newItem);
  }
};

// Delete item
const deleteItem = (id: string) => {
  if (confirm('Are you sure you want to delete this item?')) {
    if (apiStore.currentSelectedItem?.id === id) {
      apiStore.selectItem(null);
    }
    apiStore.removeItem(id);
    message.success('Item deleted');
  }
};
</script>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px 4px;
}

.environment-selector {
  padding: 12px;
  border-top: 1px solid #eee;
  background-color: #fafafa;
}
</style>