import { useEffect } from 'react';
import { useRestaurantStore, restaurantSelectors } from '../stores/restaurantStore';
import type { Restaurant, SearchParams } from '../types/restaurant';

interface UseRestaurantsReturn {
  restaurants: Restaurant[];
  allRestaurants: Restaurant[];
  loading: boolean;
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;
  error: string | null;
  searchParams: SearchParams;
  fetchRestaurants: (params?: SearchParams, reset?: boolean) => Promise<void>;
  createRestaurant: (data: Omit<Restaurant, 'id' | 'createdTime' | 'modifiedTime'>) => Promise<Restaurant | null>;
  updateRestaurant: (id: string, data: Partial<Restaurant>) => Promise<Restaurant | null>;
  deleteRestaurant: (id: string) => Promise<boolean>;
  searchRestaurants: (params: SearchParams) => Promise<void>;
  resetSearch: () => Promise<void>;
  refreshRestaurants: () => Promise<void>;
  clearError: () => void;
}

export const useRestaurants = (initialParams?: SearchParams): UseRestaurantsReturn => {
  // 从 Zustand store 获取状态
  const restaurants = useRestaurantStore(restaurantSelectors.restaurants);
  const allRestaurants = useRestaurantStore(restaurantSelectors.allRestaurants);
  const loading = useRestaurantStore(restaurantSelectors.loading);
  const error = useRestaurantStore(restaurantSelectors.error);
  const searchParams = useRestaurantStore(restaurantSelectors.searchParams);
  const initialized = useRestaurantStore(restaurantSelectors.initialized);

  // 分别获取操作加载状态，避免创建新对象
  const loadingCreate = useRestaurantStore(restaurantSelectors.loadingCreate);
  const loadingUpdate = useRestaurantStore(restaurantSelectors.loadingUpdate);
  const loadingDelete = useRestaurantStore(restaurantSelectors.loadingDelete);

  // 获取操作方法
  const {
    fetchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    searchRestaurants,
    resetSearch,
    refreshRestaurants,
    clearError,
  } = useRestaurantStore();


  // 初始化数据 - 只在第一次使用时执行
  useEffect(() => {
    if (!initialized && !loading && restaurants.length === 0) {
      console.log('useRestaurants: initializing data');
      const params = initialParams || { pageNum: '1', pageSize: '20' };
      fetchRestaurants(params, true);
    }
  }, [initialized, loading, restaurants.length]); // 依赖这些状态

  return {
    // 数据
    restaurants,
    allRestaurants,
    searchParams,

    // 加载状态
    loading,
    loadingCreate,
    loadingUpdate,
    loadingDelete,
    error,

    // 操作方法
    fetchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    searchRestaurants,
    resetSearch,
    refreshRestaurants,
    clearError,
  };
};
