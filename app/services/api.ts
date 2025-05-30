import axios from 'axios';
import type { Restaurant, ApiResponse, PaginationParams, SearchParams } from '../types/restaurant';
import rawRestaurants from '../data/output_new.json'
// 内联模拟数据
const generateMockRestaurants = (): Restaurant[] => {
  const restaurants: Restaurant[] = rawRestaurants.map(restaurant => {
    return {
      ...restaurant,
      longitude: restaurant?.longitude ? Number(restaurant?.longitude) : -1,
      latitude: restaurant?.latitude ? Number(restaurant?.latitude) : -1,

    }
  });
  // for (let i = 1; i <= 50; i++) {
  //   const nameIndex = (i - 1) % baseNames.length;
  //   const categoryIndex = (i - 1) % categories.length;

  //   restaurants.push({
  //     id: i.toString(),
  //     name: `${baseNames[nameIndex]}${i > 25 ? '(分店)' : ''}`,
  //     address: `北京市${['东城区', '西城区', '朝阳区', '海淀区', '丰台区'][i % 5]}某某街道${i}号`,
  //     description: `精选优质食材，传统工艺制作，口味地道，环境舒适，是您用餐的好选择。店铺编号：${i}`,
  //     category: categories[categoryIndex],
  //     longitude: 116.4074 + (Math.random() - 0.5) * 0.1,
  //     latitude: 39.9042 + (Math.random() - 0.5) * 0.1,
  //     creator: `user${i}`,
  //     create_time: `2024-01-${String(15 + (i % 15)).padStart(2, '0')} ${String(10 + (i % 12)).padStart(2, '0')}:${String(30 + (i % 30)).padStart(2, '0')}:00`,
  //     photo: i % 3 === 0 ? `https://images.unsplash.com/photo-${1569718212165 + i}?w=400` : null,
  //   });
  // }

  return restaurants;
};

const mockRestaurants = generateMockRestaurants();

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
    await new Promise(resolve => setTimeout(resolve, 800)); // 模拟网络延迟

    let filteredData = [...mockData];

    // 关键词搜索
    if (params.keywords) {
      const keywords = params.keywords.toLowerCase();
      filteredData = filteredData.filter(restaurant =>
        restaurant.name.toLowerCase().includes(keywords) ||
        restaurant.address.toLowerCase().includes(keywords) ||
        (restaurant.description && restaurant.description.toLowerCase().includes(keywords))
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

    // 分页处理
    const pageNum = parseInt(params.pageNum || '1');
    const pageSize = parseInt(params.pageSize || '10');
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    console.log(`分页请求: 第${pageNum}页, 每页${pageSize}条, 总共${filteredData.length}条, 返回${paginatedData.length}条`);

    return {
      code: 'success',
      message: '获取成功',
      description: '',
      data: paginatedData,
    };
  },

  // 模拟创建餐厅
  createRestaurant: async (data: Omit<Restaurant, 'id' | 'createdTime' | 'modifiedTime'>): Promise<ApiResponse<Restaurant>> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const newRestaurant: Restaurant = {
      ...data,
      id: Date.now().toString(),
      create_time: new Date().toISOString(),
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
