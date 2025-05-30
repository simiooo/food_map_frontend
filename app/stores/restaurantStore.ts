import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { message } from 'antd';
import { finalRestaurantApi as restaurantApi } from '../services/api';
import type { Restaurant, SearchParams } from '../types/restaurant';

// 餐厅列表状态接口
interface RestaurantListState {
  // 数据状态
  restaurants: Restaurant[];
  allRestaurants: Restaurant[]; // 用于地图显示的完整列表
  searchParams: SearchParams;

  // 分页状态
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
  total: number;

  // 加载状态
  loading: boolean;
  loadingMore: boolean;
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;

  // 错误状态
  error: string | null;

  // 缓存状态
  lastSearchParams: SearchParams | null;
  cacheTimestamp: number;

  // 初始化状态
  initialized: boolean;
}

// 餐厅操作接口
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

type RestaurantStore = RestaurantListState & RestaurantActions;

// 初始状态
const initialState: RestaurantListState = {
  restaurants: [],
  allRestaurants: [],
  searchParams: { pageNum: '1', pageSize: '10' },
  currentPage: 1,
  pageSize: 10,
  hasMore: true,
  total: 0,
  loading: false,
  loadingMore: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
  error: null,
  lastSearchParams: null,
  cacheTimestamp: 0,
  initialized: false,
};

// 缓存有效期（5分钟）
const CACHE_DURATION = 5 * 60 * 1000;

export const useRestaurantStore = create<RestaurantStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // 获取餐厅列表
      fetchRestaurants: async (params, reset = false) => {
        const state = get();

        // 防止重复调用
        if (state.loading) {
          return;
        }

        const searchParams = params || state.searchParams;

        // 防止重复初始化
        if (!reset && state.initialized && !params) {
          console.log('Skipping fetch: already initialized');
          return;
        }

        console.log('fetchRestaurants called:', { params, reset, initialized: state.initialized });

        // 如果是重置或新搜索，清空现有数据
        if (reset || JSON.stringify(searchParams) !== JSON.stringify(state.lastSearchParams)) {
          set({
            restaurants: [],
            currentPage: 1,
            hasMore: true,
            error: null,
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

          if (response.code === '200' || response.code === 'success') {
            const newRestaurants = response.data || [];
            const pageSize = parseInt(searchParams.pageSize || '10');

            set({
              restaurants: newRestaurants,
              allRestaurants: newRestaurants, // 同时更新完整列表
              searchParams,
              currentPage: 1,
              hasMore: newRestaurants.length >= pageSize,
              total: newRestaurants.length,
              loading: false,
              cacheTimestamp: Date.now(),
              initialized: true, // 标记为已初始化
            });
          } else {
            throw new Error(response.message || '获取餐厅列表失败');
          }
        } catch (error) {
          console.error('获取餐厅列表失败:', error);
          const errorMessage = error instanceof Error ? error.message : '获取餐厅列表失败，请重试';
          set({ error: errorMessage, loading: false, initialized: true });
          message.error(errorMessage);
        }
      },

      // 加载更多餐厅
      loadMoreRestaurants: async () => {
        const state = get();
        if (state.loadingMore || !state.hasMore) return;

        set({ loadingMore: true, error: null });

        try {
          const nextPage = state.currentPage + 1;
          const response = await restaurantApi.searchRestaurants({
            ...state.searchParams,
            pageNum: nextPage.toString(),
            pageSize: state.searchParams.pageSize || '10',
          });

          if (response.code === '200' || response.code === 'success') {
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
          } else {
            throw new Error(response.message || '加载更多失败');
          }
        } catch (error) {
          console.error('加载更多失败:', error);
          const errorMessage = error instanceof Error ? error.message : '加载更多失败，请重试';
          set({ error: errorMessage, loadingMore: false });
          message.error(errorMessage);
        }
      },

      // 刷新餐厅列表
      refreshRestaurants: async () => {
        const state = get();
        await get().fetchRestaurants(state.searchParams, true);
      },

      // 创建餐厅
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
          console.error('添加餐厅失败:', error);
          const errorMessage = error instanceof Error ? error.message : '添加餐厅失败，请重试';
          set({ error: errorMessage, loadingCreate: false });
          message.error(errorMessage);
          return null;
        }
      },

      // 更新餐厅
      updateRestaurant: async (id, data) => {
        set({ loadingUpdate: true, error: null });

        try {
          const response = await restaurantApi.updateRestaurant(id, data);

          if (response.code === '200' || response.code === 'success') {
            message.success('餐厅信息更新成功！');

            // 刷新列表
            await get().refreshRestaurants();

            set({ loadingUpdate: false });
            return response.data;
          } else {
            throw new Error(response.message || '更新餐厅失败');
          }
        } catch (error) {
          console.error('更新餐厅失败:', error);
          const errorMessage = error instanceof Error ? error.message : '更新餐厅失败，请重试';
          set({ error: errorMessage, loadingUpdate: false });
          message.error(errorMessage);
          return null;
        }
      },

      // 删除餐厅
      deleteRestaurant: async (id) => {
        set({ loadingDelete: true, error: null });

        try {
          const response = await restaurantApi.deleteRestaurant(id);

          if (response.code === '200' || response.code === 'success') {
            message.success('餐厅删除成功！');

            // 刷新列表
            await get().refreshRestaurants();

            set({ loadingDelete: false });
            return true;
          } else {
            throw new Error(response.message || '删除餐厅失败');
          }
        } catch (error) {
          console.error('删除餐厅失败:', error);
          const errorMessage = error instanceof Error ? error.message : '删除餐厅失败，请重试';
          set({ error: errorMessage, loadingDelete: false });
          message.error(errorMessage);
          return false;
        }
      },

      // 搜索餐厅
      searchRestaurants: async (params) => {
        await get().fetchRestaurants(params, true);
      },

      // 重置搜索
      resetSearch: async () => {
        const defaultParams = { pageNum: '1', pageSize: '10' };
        await get().fetchRestaurants(defaultParams, true);
      },

      // 设置搜索参数
      setSearchParams: (params) => {
        set({ searchParams: params });
      },

      // 清除错误
      clearError: () => {
        set({ error: null });
      },

      // 重置状态
      resetState: () => {
        set(initialState);
      },

      // 使缓存失效
      invalidateCache: () => {
        set({ cacheTimestamp: 0 });
      },

      // 检查缓存是否有效
      isCacheValid: () => {
        const state = get();
        return Date.now() - state.cacheTimestamp < CACHE_DURATION;
      },
    })),
    {
      name: 'restaurant-store',
    }
  )
);

// 选择器函数，用于优化性能
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
  initialized: (state: RestaurantStore) => state.initialized,

  // 操作加载状态选择器 - 分别选择，避免创建新对象
  loadingCreate: (state: RestaurantStore) => state.loadingCreate,
  loadingUpdate: (state: RestaurantStore) => state.loadingUpdate,
  loadingDelete: (state: RestaurantStore) => state.loadingDelete,

  // 组合状态选择器
  isAnyLoading: (state: RestaurantStore) =>
    state.loading || state.loadingCreate || state.loadingUpdate || state.loadingDelete,
};
