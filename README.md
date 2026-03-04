Vue 3 + TypeScript + Vite + Naive UI + Pinia + Axios 网页版 Postman
这是一个基于现代前端技术栈构建的网页版 Postman 工具，提供完整的 API 测试功能。

功能特性
目录树管理：可视化管理接口目录和请求
灵活创建：支持创建目录和接口
请求配置：支持 Method / URL 编辑
参数编辑：支持 Query / Header / Body 编辑
环境变量：支持环境变量管理
请求发送：支持发送各种类型的 HTTP 请求
响应展示：美观的响应数据展示
类型安全：完整的 TypeScript 类型定义
代码规范：无 any 类型，结构清晰
技术栈
Vue 3 (Composition API)
TypeScript
Vite (构建工具)
Naive UI (UI 组件库)
Pinia (状态管理)
Axios (HTTP 客户端)
项目结构
12345678910111213141516
src/
├── App.vue                 # 主应用组件
├── main.ts                # 应用入口文件
├── types/                 # 类型定义
│   └── index.ts           # 接口类型定义
├── stores/                # Pinia 状态管理
│   └── apiStore.ts        # API 数据存储
├── components/            # 可复用组件
│   ├── KeyValueEditor.vue # 键值对编辑器
│   ├── RequestEditor.vue  # 请求编辑器

快速开始
环境要求
Node.js (版本 >= 14.18.0 或 >= 16.0.0)
npm 或 yarn
安装依赖
bash
123
开发模式运行
bash
123
然后在浏览器中打开 http://localhost:5173 即可开始使用。

构建生产版本
bash
123
预览生产版本
bash
123
使用说明
创建目录和请求
在左侧边栏点击 "Folder" 按钮创建新目录
在左侧边栏点击 "Request" 按钮创建新请求
也可以在某个目录上点击 "+" 图标在该目录下创建请求
配置请求
选择一个请求后，在右侧编辑器中可以配置：
请求名称
HTTP 方法 (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
URL (支持环境变量如 {{baseUrl}})
查询参数 (Query Params)
请求头 (Headers)
请求体 (Body)，支持多种格式：
None
JSON
Form Data
x-www-form-urlencoded
环境变量
在底部环境选择器中选择当前使用的环境
默认提供了 "Default Environment" 包含 baseUrl 变量
可以通过修改 stores/apiStore.ts 中的初始化代码添加更多环境变量
发送请求
配置好请求参数后，点击 "Send" 按钮发送请求
查看下方的响应结果
响应查看
响应状态码和状态文本
响应时间
响应体（自动格式化 JSON）
响应头信息
调试说明
代码调试
在开发模式下 (npm run dev)，代码变更会实时热重载
使用浏览器开发者工具的 Console 和 Sources 标签进行调试
状态管理使用 Pinia，可在 Vue DevTools 中查看状态变化
常见问题
如果组件没有正确更新，请检查是否有未处理的异步操作
确保所有 API 配置都符合 TypeScript 类型定义
注意环境变量的格式为 {{variableName}}
扩展功能
本项目设计为模块化结构，可以轻松扩展：

添加新的 HTTP 方法支持
扩展更多的请求体类型
添加认证机制
实现历史记录功能
导入/导出集合功能
依赖说明
主要依赖包括：

vue: 3.x 版本的渐进式 JavaScript 框架
typescript: JavaScript 的超集，提供静态类型检查
vite: 下一代前端构建工具
naive-ui: Vue 3 的 UI 组件库
pinia: Vue 的轻量级状态管理库
axios: 基于 Promise 的 HTTP 客户端
许可证
MIT License

该项目为学习和参考用途而创建，可根据需要进行定制和扩展。
