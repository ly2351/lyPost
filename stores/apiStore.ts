// stores/apiStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ApiItem, Environment, RequestConfig } from '../types';

export const useApiStore = defineStore('api', () => {
  // API collection
  const apiCollection = ref<ApiItem[]>([]);
  
  // Current selected item
  const currentSelectedItem = ref<ApiItem | null>(null);
  
  // Environments
  const environments = ref<Environment[]>([
    {
      id: 'default',
      name: 'Default Environment',
      variables: [
        { key: 'baseUrl', value: 'https://httpbin.org' }
      ]
    }
  ]);
  
  // Currently selected environment ID
  const currentEnvironmentId = ref<string>('default');
  
  // Add a new folder or request
  const addItem = (item: Omit<ApiItem, 'id'>, parentId?: string) => {
    const newItem: ApiItem = {
      ...item,
      id: generateId()
    };
    
    if (parentId) {
      const parent = findItemById(parentId, apiCollection.value);
      if (parent && parent.type === 'folder') {
        if (!parent.children) parent.children = [];
        parent.children.push(newItem);
      }
    } else {
      apiCollection.value.push(newItem);
    }
    
    return newItem;
  };
  
  // Remove an item
  const removeItem = (id: string) => {
    const index = apiCollection.value.findIndex(item => item.id === id);
    if (index !== -1) {
      apiCollection.value.splice(index, 1);
      return true;
    }
    
    // Check in children recursively
    const removeRecursive = (items: ApiItem[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) {
          items.splice(i, 1);
          return true;
        }
        if (items[i].children) {
          if (removeRecursive(items[i].children!)) {
            return true;
          }
        }
      }
      return false;
    };
    
    return removeRecursive(apiCollection.value);
  };
  
  // Update an item
  const updateItem = (id: string, updates: Partial<ApiItem>) => {
    const item = findItemById(id, apiCollection.value);
    if (item) {
      Object.assign(item, updates);
    }
  };
  
  // Find item by ID
  const findItemById = (id: string, items: ApiItem[]): ApiItem | undefined => {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const found = findItemById(id, item.children);
        if (found) return found;
      }
    }
    return undefined;
  };
  
  // Select an item
  const selectItem = (item: ApiItem | null) => {
    currentSelectedItem.value = item;
  };
  
  // Get current environment
  const getCurrentEnvironment = (): Environment | undefined => {
    return environments.value.find(env => env.id === currentEnvironmentId.value);
  };
  
  // Add environment
  const addEnvironment = (env: Omit<Environment, 'id'>): Environment => {
    const newEnv: Environment = {
      ...env,
      id: generateId()
    };
    environments.value.push(newEnv);
    return newEnv;
  };
  
  // Update environment
  const updateEnvironment = (id: string, updates: Partial<Environment>) => {
    const env = environments.value.find(e => e.id === id);
    if (env) {
      Object.assign(env, updates);
    }
  };
  
  // Remove environment
  const removeEnvironment = (id: string) => {
    const index = environments.value.findIndex(e => e.id === id);
    if (index !== -1) {
      environments.value.splice(index, 1);
      if (currentEnvironmentId.value === id) {
        currentEnvironmentId.value = environments.value[0]?.id || '';
      }
    }
  };
  
  // Helper to generate unique IDs
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  // Initialize with sample data
  const initializeSampleData = () => {
    if (apiCollection.value.length === 0) {
      const folder1 = addItem({
        name: 'Sample APIs',
        type: 'folder'
      });
      
      addItem({
        name: 'Get Users',
        type: 'request',
        config: {
          method: 'GET',
          url: '{{baseUrl}}/get',
          headers: [],
          params: [
            { key: 'page', value: '1', enabled: true },
            { key: 'limit', value: '10', enabled: true }
          ],
          body: {
            type: 'none',
            content: ''
          }
        }
      }, folder1.id);
      
      addItem({
        name: 'Create User',
        type: 'request',
        config: {
          method: 'POST',
          url: '{{baseUrl}}/post',
          headers: [
            { key: 'Content-Type', value: 'application/json', enabled: true }
          ],
          params: [],
          body: {
            type: 'json',
            content: JSON.stringify({ name: 'John Doe', email: 'john@example.com' }, null, 2)
          }
        }
      }, folder1.id);
    }
  };
  
  return {
    apiCollection,
    currentSelectedItem,
    environments,
    currentEnvironmentId,
    addItem,
    removeItem,
    updateItem,
    findItemById,
    selectItem,
    getCurrentEnvironment,
    addEnvironment,
    updateEnvironment,
    removeEnvironment,
    initializeSampleData
  };
});