import axios from 'axios';
import type { Restaurant, ApiResponse, PaginationParams, SearchParams } from '../types/restaurant';
import { mockRestaurants } from '../data/mockData';

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 根据实际API地址调整
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 餐厅相关API
export const restaurantApi = {
  // 分页获取所有餐厅数据
  getRestaurants: (params: PaginationParams): Promise<ApiResponse<Restaurant[]>> => {
    return api.post('/restaurants/list', params);
  },

  // 条件搜索餐厅数据
  searchRestaurants: (params: SearchParams): Promise<ApiResponse<Restaurant[]>> => {
    return api.post('/restaurants/search', params);
  },

  // 获取单个餐厅详情
  getRestaurant: (id: string): Promise<ApiResponse<Restaurant>> => {
    return api.get(`/restaurants/${id}`);
  },

  // 创建餐厅
  createRestaurant: (data: Omit<Restaurant, 'id' | 'createdTime' | 'modifiedTime'>): Promise<ApiResponse<Restaurant>> => {
    return api.post('/restaurants', data);
  },

  // 更新餐厅
  updateRestaurant: (id: string, data: Partial<Restaurant>): Promise<ApiResponse<Restaurant>> => {
    return api.put(`/restaurants/${id}`, data);
  },

  // 删除餐厅
  deleteRestaurant: (id: string): Promise<ApiResponse<void>> => {
    return api.delete(`/restaurants/${id}`);
  },
};

// 模拟API功能（开发环境使用）
const isDev = import.meta.env.DEV;
let mockData = [...mockRestaurants];

const mockApi = {
  // 模拟搜索餐厅
  searchRestaurants: async (params: SearchParams): Promise<ApiResponse<Restaurant[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟

    let filteredData = [...mockData];

    // 关键词搜索
    if (params.keywords) {
      const keywords = params.keywords.toLowerCase();
      filteredData = filteredData.filter(restaurant =>
        restaurant.name.toLowerCase().includes(keywords) ||
        restaurant.address.toLowerCase().includes(keywords) ||
        restaurant.description.toLowerCase().includes(keywords)
      );
    }

    // 分类筛选
    if (params.categoryId) {
      const categoryName = getCategoryNameById(params.categoryId);
      if (categoryName) {
        filteredData = filteredData.filter(restaurant =>
          restaurant.category === categoryName
        );
      }
    }

    return {
      code: 'success',
      message: '获取成功',
      description: '',
      data: filteredData,
    };
  },

  // 模拟创建餐厅
  createRestaurant: async (data: Omit<Restaurant, 'id' | 'createdTime' | 'modifiedTime'>): Promise<ApiResponse<Restaurant>> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const newRestaurant: Restaurant = {
      ...data,
      id: Date.now().toString(),
      createdTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
    };

    mockData.push(newRestaurant);

    return {
      code: 'success',
      message: '创建成功',
      description: '',
      data: newRestaurant,
    };
  },

  // 模拟更新餐厅
  updateRestaurant: async (id: string, data: Partial<Restaurant>): Promise<ApiResponse<Restaurant>> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = mockData.findIndex(restaurant => restaurant.id === id);
    if (index === -1) {
      throw new Error('餐厅不存在');
    }

    const updatedRestaurant = {
      ...mockData[index],
      ...data,
      modifiedTime: new Date().toISOString(),
    };

    mockData[index] = updatedRestaurant;

    return {
      code: 'success',
      message: '更新成功',
      description: '',
      data: updatedRestaurant,
    };
  },

  // 模拟删除餐厅
  deleteRestaurant: async (id: string): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = mockData.findIndex(restaurant => restaurant.id === id);
    if (index === -1) {
      throw new Error('餐厅不存在');
    }

    mockData.splice(index, 1);

    return {
      code: 'success',
      message: '删除成功',
      description: '',
      data: undefined as any,
    };
  },
};

// 根据分类ID获取分类名称
function getCategoryNameById(categoryId: string): string | null {
  const categories: Record<string, string> = {
    '1': '中餐',
    '2': '西餐',
    '3': '日料',
    '4': '韩料',
    '5': '快餐',
    '6': '火锅',
    '7': '烧烤',
    '8': '甜品',
    '9': '咖啡',
    '10': '其他',
  };
  return categories[categoryId] || null;
}

// 导出API（开发环境使用模拟API，生产环境使用真实API）
export const finalRestaurantApi = isDev ? {
  getRestaurants: mockApi.searchRestaurants,
  searchRestaurants: mockApi.searchRestaurants,
  getRestaurant: async (id: string) => {
    const restaurant = mockData.find(r => r.id === id);
    if (!restaurant) throw new Error('餐厅不存在');
    return {
      code: 'success',
      message: '获取成功',
      description: '',
      data: restaurant,
    };
  },
  createRestaurant: mockApi.createRestaurant,
  updateRestaurant: mockApi.updateRestaurant,
  deleteRestaurant: mockApi.deleteRestaurant,
} : restaurantApi;

export default api;
