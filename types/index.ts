// types/index.ts
export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  url: string;
  headers: Array<{ key: string; value: string; enabled: boolean }>;
  params: Array<{ key: string; value: string; enabled: boolean }>;
  body?: {
    type: 'none' | 'json' | 'form-data' | 'x-www-form-urlencoded';
    content: string;
  };
}

export interface ApiItem {
  id: string;
  name: string;
  type: 'folder' | 'request';
  children?: ApiItem[];
  config?: RequestConfig;
  response?: ApiResponse;
  parentId?: string;
}

export interface Environment {
  id: string;
  name: string;
  variables: Array<{ key: string; value: string }>;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  duration: number;
}