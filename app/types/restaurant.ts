// 餐厅数据类型定义
export interface Restaurant {
  id?: string;
  name: string;
  address: string;
  description?: string | null;
  category?: string | null;
  type?: string | null;
  longitude: number;
  latitude: number;
  creator?: string | null;
  create_time: string;
  updated_time?: string | null;
  photo?: string | null;
}

// API响应类型
export interface ApiResponse<T> {
  code: string;
  message: string;
  description: string;
  data: T;
}

// 分页参数
export interface PaginationParams {
  pageNum?: string;
  pageSize?: string;
}

// 搜索参数
export interface SearchParams extends PaginationParams {
  keywords?: string;
  categoryId?: string;
}

// 餐厅分类
export interface Category {
  id: string;
  name: string;
}

// 地图相关类型
export interface MapPosition {
  lat: number;
  lng: number;
  zoom?: number;
}
