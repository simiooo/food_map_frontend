import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import type { Restaurant, MapPosition } from '../../types/restaurant';

interface MapProps {
  restaurants: Restaurant[];
  center: MapPosition;
  onRestaurantClick?: (restaurant: Restaurant) => void;
  onMapClick?: (position: { lat: number; lng: number }) => void;
  isSelectingLocation?: boolean;
  selectedLocation?: { lat: number; lng: number } | null;
  onCancelLocationSelection?: () => void;
  userLocation?: { lat: number; lng: number; accuracy?: number } | null;
  showUserLocation?: boolean;
  className?: string;
}

// 动态导入地图组件
const DynamicMap = React.lazy(() => import('./MapComponent'));

const FoodMap: React.FC<MapProps> = (props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={props.className || 'h-96 w-full'} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <Spin size="large">
          <div style={{ padding: '20px' }}>地图加载中...</div>
        </Spin>
      </div>
    );
  }

  return (
    <React.Suspense fallback={
      <div className={props.className || 'h-96 w-full'} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <Spin size="large">
          <div style={{ padding: '20px' }}>地图加载中...</div>
        </Spin>
      </div>
    }>
      <DynamicMap {...props} />
    </React.Suspense>
  );
};

export default FoodMap;
