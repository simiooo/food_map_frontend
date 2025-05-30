# Zustand状态管理集成指南

## 🎯 重构目标

本次重构将 `useRestaurants.ts` 与 `InfiniteRestaurantList.tsx` 中的异步部分合并，统一通过 Zustand 来管理共享状态，实现：
1. **统一状态管理**: 所有餐厅数据通过 Zustand store 管理
2. **消除重复逻辑**: 移除分散的异步处理代码
3. **状态共享**: 多个组件可以共享同一份数据状态
4. **性能优化**: 减少不必要的API调用和重渲染

## 🏗️ 架构设计

### 📊 Zustand Store 架构

**核心文件**: `app/stores/restaurantStore.ts`

```typescript
// 状态接口
interface RestaurantListState {
  // 数据状态
  restaurants: Restaurant[];           // 当前列表数据
  allRestaurants: Restaurant[];        // 完整数据（用于地图）
  searchParams: SearchParams;         // 搜索参数
  
  // 分页状态
  currentPage: number;                // 当前页码
  pageSize: number;                   // 页面大小
  hasMore: boolean;                   // 是否有更多数据
  total: number;                      // 总数量
  
  // 加载状态
  loading: boolean;                   // 主加载状态
  loadingMore: boolean;               // 加载更多状态
  loadingCreate: boolean;             // 创建加载状态
  loadingUpdate: boolean;             // 更新加载状态
  loadingDelete: boolean;             // 删除加载状态
  
  // 错误状态
  error: string | null;               // 错误信息
  
  // 缓存状态
  lastSearchParams: SearchParams | null;  // 上次搜索参数
  cacheTimestamp: number;             // 缓存时间戳
}
```

**操作接口**:
```typescript
interface RestaurantActions {
  // 数据获取
  fetchRestaurants: (params?: SearchParams, reset?: boolean) => Promise<void>;
  loadMoreRestaurants: () => Promise<void>;
  refreshRestaurants: () => Promise<void>;
  
  // CRUD操作
  createRestaurant: (data: Omit<Restaurant, 'id' | 'createdTime' | 'modifiedTime'>) => Promise<Restaurant | null>;
  updateRestaurant: (id: string, data: Partial<Restaurant>) => Promise<Restaurant | null>;
  deleteRestaurant: (id: string) => Promise<boolean>;
  
  // 搜索操作
  searchRestaurants: (params: SearchParams) => Promise<void>;
  resetSearch: () => Promise<void>;
  
  // 状态管理
  setSearchParams: (params: SearchParams) => void;
  clearError: () => void;
  resetState: () => void;
  
  // 缓存管理
  invalidateCache: () => void;
  isCacheValid: () => boolean;
}
```

### 🎯 选择器优化

**性能选择器**:
```typescript
export const restaurantSelectors = {
  // 基础数据选择器
  restaurants: (state: RestaurantStore) => state.restaurants,
  allRestaurants: (state: RestaurantStore) => state.allRestaurants,
  searchParams: (state: RestaurantStore) => state.searchParams,
  
  // 状态选择器
  loading: (state: RestaurantStore) => state.loading,
  loadingMore: (state: RestaurantStore) => state.loadingMore,
  hasMore: (state: RestaurantStore) => state.hasMore,
  error: (state: RestaurantStore) => state.error,
  
  // 组合状态选择器
  isAnyLoading: (state: RestaurantStore) => 
    state.loading || state.loadingCreate || state.loadingUpdate || state.loadingDelete,
  
  listState: (state: RestaurantStore) => ({
    restaurants: state.restaurants,
    loading: state.loading,
    loadingMore: state.loadingMore,
    hasMore: state.hasMore,
    error: state.error,
  }),
  
  operationState: (state: RestaurantStore) => ({
    loadingCreate: state.loadingCreate,
    loadingUpdate: state.loadingUpdate,
    loadingDelete: state.loadingDelete,
  }),
};
```

## 🔄 重构对比

### ❌ 重构前的问题

**useRestaurants.ts**:
```typescript
// 使用 ahooks 的 useRequest，状态分散
const { loading: loadingList, run: fetchRestaurants } = useRequest(
  async (params: SearchParams) => {
    // 异步逻辑
  }
);

const { loading: loadingCreate, run: createRestaurant } = useRequest(
  async (data) => {
    // 创建逻辑
  }
);
```

**InfiniteRestaurantList.tsx**:
```typescript
// 使用 ahooks 的 useInfiniteScroll，重复的异步逻辑
const getLoadMoreList = async (currentData) => {
  // 重复的API调用逻辑
  const response = await restaurantApi.searchRestaurants(params);
  // 重复的错误处理
};

const { data, loading, loadingMore, noMore, reload } = useInfiniteScroll(
  getLoadMoreList
);
```

**问题**:
- 状态分散在多个组件中
- 异步逻辑重复实现
- 数据不能在组件间共享
- 缓存机制缺失
- 错误处理不统一

### ✅ 重构后的优势

**统一的 Zustand Store**:
```typescript
// 所有状态集中管理
export const useRestaurantStore = create<RestaurantStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // 统一的状态定义
      ...initialState,

      // 统一的异步操作
      fetchRestaurants: async (params, reset = false) => {
        // 统一的加载状态管理
        set({ loading: true, error: null });
        
        try {
          const response = await restaurantApi.searchRestaurants(params);
          // 统一的成功处理
          set({
            restaurants: response.data,
            loading: false,
            cacheTimestamp: Date.now(),
          });
        } catch (error) {
          // 统一的错误处理
          set({ error: errorMessage, loading: false });
          message.error(errorMessage);
        }
      },
    }))
  )
);
```

**简化的组件使用**:
```typescript
// useRestaurants.ts - 简化为状态选择器
export const useRestaurants = (initialParams?: SearchParams) => {
  const restaurants = useRestaurantStore(restaurantSelectors.restaurants);
  const loading = useRestaurantStore(restaurantSelectors.loading);
  const { fetchRestaurants, createRestaurant } = useRestaurantStore();
  
  return {
    restaurants,
    loading,
    fetchRestaurants,
    createRestaurant,
    // ...其他方法
  };
};
```

```typescript
// InfiniteRestaurantList.tsx - 直接使用 store
const InfiniteRestaurantList = ({ searchParams }) => {
  const restaurants = useRestaurantStore(restaurantSelectors.restaurants);
  const loading = useRestaurantStore(restaurantSelectors.loading);
  const { loadMoreRestaurants } = useRestaurantStore();
  
  // 简化的逻辑，无需重复实现异步处理
};
```

## 🚀 核心功能实现

### 📊 数据获取与分页

**初始加载**:
```typescript
fetchRestaurants: async (params, reset = false) => {
  const state = get();
  const searchParams = params || state.searchParams;
  
  // 重置或新搜索时清空数据
  if (reset || JSON.stringify(searchParams) !== JSON.stringify(state.lastSearchParams)) {
    set({
      restaurants: [],
      currentPage: 1,
      hasMore: true,
      lastSearchParams: searchParams,
    });
  }

  set({ loading: true, error: null });

  try {
    const response = await restaurantApi.searchRestaurants({
      ...searchParams,
      pageNum: '1',
      pageSize: searchParams.pageSize || '10',
    });

    const newRestaurants = response.data || [];
    const pageSize = parseInt(searchParams.pageSize || '10');
    
    set({
      restaurants: newRestaurants,
      allRestaurants: newRestaurants,
      searchParams,
      currentPage: 1,
      hasMore: newRestaurants.length >= pageSize,
      total: newRestaurants.length,
      loading: false,
      cacheTimestamp: Date.now(),
    });
  } catch (error) {
    // 错误处理
  }
},
```

**无限滚动加载**:
```typescript
loadMoreRestaurants: async () => {
  const state = get();
  if (state.loadingMore || !state.hasMore) return;

  set({ loadingMore: true, error: null });

  try {
    const nextPage = state.currentPage + 1;
    const response = await restaurantApi.searchRestaurants({
      ...state.searchParams,
      pageNum: nextPage.toString(),
    });

    const newRestaurants = response.data || [];
    const pageSize = parseInt(state.searchParams.pageSize || '10');
    
    set({
      restaurants: [...state.restaurants, ...newRestaurants],
      allRestaurants: [...state.allRestaurants, ...newRestaurants],
      currentPage: nextPage,
      hasMore: newRestaurants.length >= pageSize,
      total: state.total + newRestaurants.length,
      loadingMore: false,
    });
  } catch (error) {
    // 错误处理
  }
},
```

### 🔧 CRUD操作

**创建餐厅**:
```typescript
createRestaurant: async (data) => {
  set({ loadingCreate: true, error: null });

  try {
    const response = await restaurantApi.createRestaurant(data);
    
    if (response.code === '200' || response.code === 'success') {
      message.success('餐厅添加成功！');
      
      // 刷新列表
      await get().refreshRestaurants();
      
      set({ loadingCreate: false });
      return response.data;
    } else {
      throw new Error(response.message || '添加餐厅失败');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '添加餐厅失败，请重试';
    set({ error: errorMessage, loadingCreate: false });
    message.error(errorMessage);
    return null;
  }
},
```

### 🔍 搜索与缓存

**智能搜索**:
```typescript
searchRestaurants: async (params) => {
  await get().fetchRestaurants(params, true);
},

// 缓存管理
isCacheValid: () => {
  const state = get();
  return Date.now() - state.cacheTimestamp < CACHE_DURATION;
},

invalidateCache: () => {
  set({ cacheTimestamp: 0 });
},
```

## 📱 组件集成

### 🔄 InfiniteRestaurantList 重构

**重构前**:
```typescript
// 复杂的异步逻辑
const getLoadMoreList = async (currentData) => {
  const currentPage = currentData ? Math.floor(currentData.list.length / pageSize) + 1 : 1;
  const response = await restaurantApi.searchRestaurants(params);
  return { list: response.data, hasMore: response.data.length >= pageSize };
};

const { data, loading, loadingMore, noMore, reload } = useInfiniteScroll(getLoadMoreList);
```

**重构后**:
```typescript
// 简洁的状态使用
const restaurants = useRestaurantStore(restaurantSelectors.restaurants);
const loading = useRestaurantStore(restaurantSelectors.loading);
const loadingMore = useRestaurantStore(restaurantSelectors.loadingMore);
const hasMore = useRestaurantStore(restaurantSelectors.hasMore);

const { loadMoreRestaurants, refreshRestaurants } = useRestaurantStore();

// 简化的加载更多
const loadMore = async () => {
  if (!loadingMore && hasMore) {
    await loadMoreRestaurants();
  }
};
```

### 🎣 useRestaurants Hook 重构

**重构前**:
```typescript
// 复杂的 useRequest 配置
const { loading: loadingList, run: fetchRestaurants } = useRequest(async (params) => {
  // 重复的异步逻辑
});

const { loading: loadingCreate, run: createRestaurant } = useRequest(async (data) => {
  // 重复的异步逻辑
});
```

**重构后**:
```typescript
// 简洁的状态选择和方法获取
export const useRestaurants = (initialParams?: SearchParams) => {
  const restaurants = useRestaurantStore(restaurantSelectors.restaurants);
  const loading = useRestaurantStore(restaurantSelectors.loading);
  const operationState = useRestaurantStore(restaurantSelectors.operationState);
  
  const {
    fetchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
  } = useRestaurantStore();

  return {
    restaurants,
    loading,
    loadingCreate: operationState.loadingCreate,
    fetchRestaurants,
    createRestaurant,
    // ...
  };
};
```

## 🎯 性能优化

### 📊 选择器优化
```typescript
// 使用选择器避免不必要的重渲染
const restaurants = useRestaurantStore(restaurantSelectors.restaurants);
const loading = useRestaurantStore(restaurantSelectors.loading);

// 而不是
const { restaurants, loading } = useRestaurantStore(); // 会导致整个 store 变化时重渲染
```

### 🔄 缓存机制
```typescript
// 5分钟缓存有效期
const CACHE_DURATION = 5 * 60 * 1000;

// 检查缓存有效性
isCacheValid: () => {
  const state = get();
  return Date.now() - state.cacheTimestamp < CACHE_DURATION;
},
```

### 📱 状态订阅优化
```typescript
// 使用 subscribeWithSelector 中间件
subscribeWithSelector((set, get) => ({
  // store 实现
}))

// 支持精确的状态订阅
useRestaurantStore.subscribe(
  (state) => state.restaurants,
  (restaurants) => {
    // 只在 restaurants 变化时触发
  }
);
```

## 🧪 测试验证

### 场景1: 数据共享测试
1. **打开应用**: 访问 http://localhost:5173/
2. **添加餐厅**: 在表单中添加新餐厅
3. **验证结果**:
   - ✅ 列表自动更新
   - ✅ 地图标记同步显示
   - ✅ 搜索结果包含新数据

### 场景2: 无限滚动测试
1. **切换移动端**: 调整窗口宽度 < 768px
2. **滚动列表**: 向下滚动触发加载更多
3. **验证结果**:
   - ✅ 平滑加载更多数据
   - ✅ 加载状态正确显示
   - ✅ 没有重复数据

### 场景3: 搜索缓存测试
1. **执行搜索**: 输入关键词搜索
2. **切换页面**: 导航到其他页面再返回
3. **验证结果**:
   - ✅ 搜索结果被缓存
   - ✅ 5分钟内不重复请求
   - ✅ 缓存过期后自动刷新

### 场景4: 错误处理测试
1. **断网测试**: 断开网络连接
2. **执行操作**: 尝试添加/编辑/删除餐厅
3. **验证结果**:
   - ✅ 显示友好的错误提示
   - ✅ 加载状态正确重置
   - ✅ 重连后可以重试操作

## 🎯 预期效果

重构完成后应该：
- 🏗️ **统一状态管理**: 所有餐厅数据通过 Zustand 集中管理
- 🚀 **性能优化**: 减少重复API调用，优化渲染性能
- 🔄 **状态共享**: 多个组件共享同一份数据状态
- 📱 **简化组件**: 组件逻辑更简洁，专注于UI渲染
- 🎯 **类型安全**: 完整的 TypeScript 类型支持
- 🔧 **易于维护**: 状态逻辑集中，便于调试和维护
- 📊 **缓存优化**: 智能缓存机制减少不必要的网络请求

这个重构大大提升了应用的架构质量和性能表现，为后续功能开发奠定了坚实基础！🏗️🚀✨
