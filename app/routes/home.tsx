import React, { useState, useRef } from 'react';
import { Layout, Button, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Route } from "./+types/home";
import FoodMap from '../components/Map/MapContainer';
import SearchPanel from '../components/SearchPanel';
import RestaurantList from '../components/RestaurantList';
import MobileLayout from '../components/MobileLayout';
import MobileRestaurantList from '../components/MobileRestaurantList';
import RestaurantForm from '../components/RestaurantForm';
import { useRestaurants } from '../hooks/useRestaurants';
import { useResponsive } from '../hooks/useResponsive';
import { useGeolocation } from '../hooks/useGeolocation';
import type { Restaurant, MapPosition, SearchParams } from '../types/restaurant';

const { Header, Content, Sider } = Layout;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "美食地图 - 发现身边的美味" },
    { name: "description", content: "在地图上查看、标记、编辑、删除餐厅信息" },
  ];
}

export default function Home() {
  const {
    restaurants,
    loading,
    loadingCreate,
    loadingUpdate,
    handleSearch,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
  } = useRestaurants();

  const { isMobile } = useResponsive();

  const [formVisible, setFormVisible] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

  // 默认位置（北京市中心）
  const defaultPosition = {
    lat: 39.9042,
    lng: 116.4074,
    zoom: 13,
  };

  const [mapCenter, setMapCenter] = useState<MapPosition>(defaultPosition);
  const [isInitialLocationSet, setIsInitialLocationSet] = useState(false);

  // 获取用户地理位置
  const { latitude, longitude, loading: locationLoading, error: locationError } = useGeolocation({
    onSuccess: (position) => {
      if (!isInitialLocationSet) {
        setMapCenter({
          lat: position.lat,
          lng: position.lng,
          zoom: 15, // 用户位置使用更高的缩放级别
        });
        setIsInitialLocationSet(true);
      }
    },
    onError: (error) => {
      console.log('地理位置获取失败:', error);
      if (!isInitialLocationSet) {
        setMapCenter(defaultPosition);
        setIsInitialLocationSet(true);
      }
    },
    showMessages: true,
  });

  // 地图交互状态
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isEditingLocation, setIsEditingLocation] = useState(false); // 标记是否在编辑位置

  const mapRef = useRef<any>(null);

  // 处理搜索
  const handleSearchSubmit = (params: SearchParams) => {
    handleSearch(params);
  };

  // 处理添加餐厅
  const handleAddRestaurant = () => {
    setEditingRestaurant(null);
    setSelectedLocation(null);
    setIsSelectingLocation(true);
    message.info('请在地图上点击选择餐厅位置');
  };

  // 处理编辑餐厅
  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormVisible(true);
  };

  // 处理表单提交
  const handleFormSubmit = async (data: Partial<Restaurant>) => {
    try {
      if (editingRestaurant) {
        await updateRestaurant(editingRestaurant.id, data);
      } else {
        await createRestaurant(data as Omit<Restaurant, 'id' | 'createdTime' | 'modifiedTime'>);
      }
      setFormVisible(false);
      setEditingRestaurant(null);
    } catch (error) {
      // 错误已在hook中处理
    }
  };

  // 处理删除餐厅
  const handleDeleteRestaurant = async (id: string) => {
    try {
      await deleteRestaurant(id);
    } catch (error) {
      // 错误已在hook中处理
    }
  };

  // 处理餐厅定位
  const handleLocateRestaurant = (restaurant: Restaurant) => {
    setMapCenter({
      lat: restaurant.latitude,
      lng: restaurant.longitude,
      zoom: 16,
    });
    message.info(`已定位到 ${restaurant.name}`);
  };

  // 处理地图点击
  const handleMapClick = (position: { lat: number; lng: number }) => {
    if (isSelectingLocation) {
      setSelectedLocation(position);
      setIsSelectingLocation(false);
      setFormVisible(true);
      message.success(`已选择位置: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`);

      // 如果是编辑位置，重置编辑状态
      if (isEditingLocation) {
        setIsEditingLocation(false);
      }
    }
  };

  // 处理餐厅标记点击
  const handleRestaurantClick = (restaurant: Restaurant) => {
    if (!isSelectingLocation) {
      message.info(`点击了餐厅: ${restaurant.name}`);
      // 可以在这里实现显示餐厅详情的功能
    }
  };

  // 开始选择位置（用于编辑餐厅）
  const handleStartLocationSelection = () => {
    setIsEditingLocation(true);
    setIsSelectingLocation(true);
    message.info('请在地图上点击选择新的餐厅位置');
  };

  // 取消位置选择
  const handleCancelLocationSelection = () => {
    setIsSelectingLocation(false);
    setSelectedLocation(null);

    // 如果是在编辑位置过程中取消，重新打开表单
    if (isEditingLocation) {
      setIsEditingLocation(false);
      setFormVisible(true);
    }

    message.info('已取消位置选择');
  };

  // 移动端布局
  if (isMobile) {
    return (
      <>
        <MobileLayout
          restaurants={restaurants}
          mapCenter={mapCenter}
          loading={loading}
          isSelectingLocation={isSelectingLocation}
          selectedLocation={selectedLocation}
          userLocation={latitude && longitude ? { lat: latitude, lng: longitude } : null}
          onRestaurantClick={handleRestaurantClick}
          onMapClick={handleMapClick}
          onCancelLocationSelection={handleCancelLocationSelection}
          onSearch={handleSearchSubmit}
          onEdit={handleEditRestaurant}
          onDelete={handleDeleteRestaurant}
          onLocate={handleLocateRestaurant}
          onAddRestaurant={handleAddRestaurant}
        />

        <RestaurantForm
          visible={formVisible}
          restaurant={editingRestaurant}
          selectedLocation={selectedLocation}
          onSubmit={handleFormSubmit}
          onStartLocationSelection={handleStartLocationSelection}
          onCancel={() => {
            setFormVisible(false);
            setEditingRestaurant(null);
            setSelectedLocation(null);
            setIsSelectingLocation(false);
            setIsEditingLocation(false);
          }}
          loading={loadingCreate || loadingUpdate}
        />
      </>
    );
  }

  // 桌面端布局
  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{
        background: '#fff',
        padding: '0 24px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{ margin: 0, color: '#1890ff' }}>美食地图</h1>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRestaurant}
          >
            添加餐厅
          </Button>
        </Space>
      </Header>

      <Layout>
        <Sider width={400} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '16px', height: '100%', overflow: 'auto' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <SearchPanel
                onSearch={handleSearchSubmit}
                loading={loading}
              />
              <RestaurantList
                restaurants={restaurants}
                loading={loading}
                onEdit={handleEditRestaurant}
                onDelete={handleDeleteRestaurant}
                onLocate={handleLocateRestaurant}
              />
            </Space>
          </div>
        </Sider>

        <Content>
          <FoodMap
            restaurants={restaurants}
            center={mapCenter}
            onRestaurantClick={handleRestaurantClick}
            onMapClick={handleMapClick}
            isSelectingLocation={isSelectingLocation}
            selectedLocation={selectedLocation}
            userLocation={latitude && longitude ? { lat: latitude, lng: longitude } : null}
            onCancelLocationSelection={handleCancelLocationSelection}
            className="h-full w-full"
          />
        </Content>
      </Layout>

      <RestaurantForm
        visible={formVisible}
        restaurant={editingRestaurant}
        selectedLocation={selectedLocation}
        onSubmit={handleFormSubmit}
        onStartLocationSelection={handleStartLocationSelection}
        onCancel={() => {
          setFormVisible(false);
          setEditingRestaurant(null);
          setSelectedLocation(null);
          setIsSelectingLocation(false);
          setIsEditingLocation(false);
        }}
        loading={loadingCreate || loadingUpdate}
      />
    </Layout>
  );
}
