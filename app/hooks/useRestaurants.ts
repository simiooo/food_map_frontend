import { useState, useCallback } from 'react';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { finalRestaurantApi as restaurantApi } from '../services/api';
import type { Restaurant, SearchParams } from '../types/restaurant';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    pageNum: '1',
    pageSize: '20',
  });

  // 获取餐厅列表
  const {
    loading: loadingList,
    run: fetchRestaurants,
    refresh: refreshRestaurants,
  } = useRequest(
    async (params: SearchParams) => {
      try {
        const response = await restaurantApi.searchRestaurants(params);
        if (response.code === '200' || response.code === 'success') {
          setRestaurants(response.data || []);
          return response.data;
        } else {
          throw new Error(response.message || '获取餐厅列表失败');
        }
      } catch (error) {
        console.error('获取餐厅列表失败:', error);
        message.error('获取餐厅列表失败，请重试');
        return [];
      }
    },
    {
      defaultParams: [searchParams],
      refreshDeps: [searchParams],
    }
  );

  // 创建餐厅
  const { loading: loadingCreate, run: createRestaurant } = useRequest(
    async (data: Omit<Restaurant, 'id' | 'createdTime' | 'modifiedTime'>) => {
      try {
        const response = await restaurantApi.createRestaurant(data);
        if (response.code === '200' || response.code === 'success') {
          message.success('餐厅添加成功！');
          refreshRestaurants();
          return response.data;
        } else {
          throw new Error(response.message || '添加餐厅失败');
        }
      } catch (error) {
        console.error('添加餐厅失败:', error);
        message.error('添加餐厅失败，请重试');
        throw error;
      }
    },
    {
      manual: true,
    }
  );

  // 更新餐厅
  const { loading: loadingUpdate, run: updateRestaurant } = useRequest(
    async (id: string, data: Partial<Restaurant>) => {
      try {
        const response = await restaurantApi.updateRestaurant(id, data);
        if (response.code === '200' || response.code === 'success') {
          message.success('餐厅信息更新成功！');
          refreshRestaurants();
          return response.data;
        } else {
          throw new Error(response.message || '更新餐厅失败');
        }
      } catch (error) {
        console.error('更新餐厅失败:', error);
        message.error('更新餐厅失败，请重试');
        throw error;
      }
    },
    {
      manual: true,
    }
  );

  // 删除餐厅
  const { loading: loadingDelete, run: deleteRestaurant } = useRequest(
    async (id: string) => {
      try {
        const response = await restaurantApi.deleteRestaurant(id);
        if (response.code === '200' || response.code === 'success') {
          message.success('餐厅删除成功！');
          refreshRestaurants();
          return true;
        } else {
          throw new Error(response.message || '删除餐厅失败');
        }
      } catch (error) {
        console.error('删除餐厅失败:', error);
        message.error('删除餐厅失败，请重试');
        throw error;
      }
    },
    {
      manual: true,
    }
  );

  // 搜索餐厅
  const handleSearch = useCallback((params: SearchParams) => {
    setSearchParams(params);
    fetchRestaurants(params);
  }, [fetchRestaurants]);

  // 重置搜索
  const handleReset = useCallback(() => {
    const defaultParams = { pageNum: '1', pageSize: '20' };
    setSearchParams(defaultParams);
    fetchRestaurants(defaultParams);
  }, [fetchRestaurants]);

  return {
    // 数据
    restaurants,
    searchParams,

    // 加载状态
    loading: loadingList || loadingCreate || loadingUpdate || loadingDelete,
    loadingList,
    loadingCreate,
    loadingUpdate,
    loadingDelete,

    // 操作方法
    fetchRestaurants,
    refreshRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    handleSearch,
    handleReset,
  };
};
