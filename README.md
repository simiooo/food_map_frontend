# 美食地图 - Food Map

一个基于React的地图餐厅管理Web应用，支持在地图上查看、标记、编辑、删除餐厅信息。

## 功能特性

### 🗺️ 地图功能
- 使用Leaflet地图库，集成高德地图瓦片服务
- 支持地图缩放、拖拽等基本操作
- 餐厅位置标记，使用自定义图标
- 点聚合功能，优化大量标记点的显示体验

### 🍽️ 餐厅管理
- **查看餐厅**: 在地图和列表中查看所有餐厅信息
- **添加餐厅**: 支持添加新的餐厅，包含名称、地址、分类、坐标等信息
- **编辑餐厅**: 修改现有餐厅的详细信息
- **删除餐厅**: 删除不需要的餐厅记录
- **餐厅定位**: 点击列表中的定位按钮，地图自动跳转到对应位置

### 🔍 搜索功能
- **关键词搜索**: 支持按餐厅名称、地址、描述进行模糊搜索
- **分类筛选**: 按餐厅类型（中餐、西餐、日料、韩料等）进行筛选
- **实时搜索**: 搜索结果实时更新地图标记和列表显示

### 💡 用户体验
- 响应式设计，适配不同屏幕尺寸
- 优雅的加载状态和错误处理
- 直观的操作界面和交互反馈
- 支持图片展示和详细信息查看

## 技术栈

### 前端框架
- **React 19** - 现代化的前端框架
- **React Router v7** - 路由管理
- **TypeScript** - 类型安全的JavaScript

### UI组件库
- **Ant Design (antd)** - 企业级UI设计语言和组件库
- **React Icons** - 丰富的图标库

### 地图相关
- **Leaflet** - 开源地图库
- **React Leaflet** - Leaflet的React封装
- **React Leaflet Cluster** - 地图点聚合功能
- **高德地图瓦片服务** - 地图数据源

### 状态管理与请求
- **ahooks** - React Hooks工具库
- **axios** - HTTP请求库

### 开发工具
- **Vite** - 快速的构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **pnpm** - 高效的包管理器

## 项目结构

```
app/
├── components/           # 通用组件
│   ├── Map/             # 地图相关组件
│   │   ├── MapContainer.tsx      # 主地图容器
│   │   └── RestaurantMarker.tsx  # 餐厅标记组件
│   ├── SearchPanel.tsx   # 搜索面板
│   ├── RestaurantList.tsx # 餐厅列表
│   └── RestaurantForm.tsx # 餐厅表单（添加/编辑）
├── hooks/               # 自定义Hooks
│   └── useRestaurants.ts # 餐厅数据管理Hook
├── services/            # API服务
│   └── api.ts           # API接口定义和模拟数据
├── types/               # TypeScript类型定义
│   └── restaurant.ts    # 餐厅相关类型
├── data/                # 数据文件
│   └── mockData.ts      # 模拟数据
└── routes/              # 路由页面
    └── home.tsx         # 主页面
```

## 快速开始

### 环境要求
- Node.js >= 18
- pnpm >= 8

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

应用将在 http://localhost:5173 启动

### 构建生产版本
```bash
pnpm build
```

### 启动生产服务器
```bash
pnpm start
```

## 使用说明

### 1. 查看餐厅
- 应用启动后，地图会显示所有餐厅的标记点
- 左侧面板显示餐厅列表，包含详细信息
- 点击地图上的标记或列表项可查看餐厅详情

### 2. 搜索餐厅
- 在搜索面板中输入关键词进行搜索
- 选择餐厅分类进行筛选
- 点击"搜索"按钮执行搜索，"重置"按钮清空搜索条件

### 3. 添加餐厅
- 点击右上角"添加餐厅"按钮
- 填写餐厅信息（名称、地址、分类、坐标等）
- 点击"添加"按钮保存

### 4. 编辑餐厅
- 在餐厅列表中点击"编辑"按钮
- 修改餐厅信息
- 点击"更新"按钮保存修改

### 5. 删除餐厅
- 在餐厅列表中点击"删除"按钮
- 确认删除操作

### 6. 餐厅定位
- 在餐厅列表中点击"定位"按钮
- 地图会自动跳转到对应餐厅位置并放大

## API接口

应用支持以下API接口（当前使用模拟数据）：

### 1. 分页获取餐厅数据
```
POST /api/restaurants/list
Body: { pageNum?: string, pageSize?: string }
```

### 2. 条件搜索餐厅数据
```
POST /api/restaurants/search
Body: {
  pageNum?: string,
  pageSize?: string,
  keywords?: string,
  categoryId?: string
}
```

### 3. 创建餐厅
```
POST /api/restaurants
Body: Restaurant对象（不包含id、createdTime、modifiedTime）
```

### 4. 更新餐厅
```
PUT /api/restaurants/:id
Body: 部分Restaurant对象
```

### 5. 删除餐厅
```
DELETE /api/restaurants/:id
```

## 开发说明

### 模拟数据
当前应用在开发环境下使用模拟数据，包含8个示例餐厅。生产环境下可以替换为真实的API接口。

### 地图配置
- 默认中心点：北京市中心（39.9042, 116.4074）
- 默认缩放级别：13
- 瓦片服务：高德地图

### 自定义样式
- 餐厅标记使用红色圆形图标
- 聚合点使用红色圆形背景显示数量
- 支持hover效果和点击交互

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
