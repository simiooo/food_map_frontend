import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Button, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import 'leaflet/dist/leaflet.css';
import type { Restaurant, MapPosition } from '../../types/restaurant';
import RestaurantMarker from './RestaurantMarker';
import UserLocationMarker from './UserLocationMarker';
import * as L from 'leaflet'
// 修复leaflet默认图标问题（只在客户端执行）
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

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

// 地图点击事件处理组件
function MapClickHandler({ onMapClick }: { onMapClick?: (position: { lat: number; lng: number }) => void }) {
  const map = useMap();

  useEffect(() => {
    if (!onMapClick) return;

    const handleClick = (e: any) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);

  return null;
}

// 地图中心点更新组件
function MapCenterUpdater({ center }: { center: MapPosition }) {
  const map = useMap();

  useEffect(() => {
    if (center.lat && center.lng) {
      // 使用 flyTo 实现平滑的移动和缩放动画
      map.flyTo([center.lat, center.lng], center.zoom || 13, {
        duration: 1.5, // 动画持续时间（秒）
        easeLinearity: 0.25, // 动画缓动
      });
    }
  }, [map, center.lat, center.lng, center.zoom]);

  return null;
}

const MapComponent: React.FC<MapProps> = ({
  restaurants,
  center,
  onRestaurantClick,
  onMapClick,
  isSelectingLocation = false,
  selectedLocation,
  onCancelLocationSelection,
  userLocation,
  showUserLocation = true,
  className = 'h-96 w-full',
}) => {
  const mapRef = useRef<any>(null);

  // 自定义聚合图标
  const createClusterCustomIcon = (cluster: any) => {
    return L.divIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      className: 'custom-marker-cluster',
      iconSize: L.point(40, 40, true),
    });
  };

  // 创建临时位置标记图标
  const createTempLocationIcon = () => {
    if (typeof window === 'undefined') return null;

    return L.divIcon({
      html: `
        <div class="temp-location-marker">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      className: 'custom-temp-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  };

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* 位置选择提示 */}
      {isSelectingLocation && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '6px',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          <Space>
            <span>请在地图上点击选择餐厅位置</span>
            <Button
              size="small"
              type="text"
              icon={<CloseOutlined />}
              onClick={onCancelLocationSelection}
              style={{ color: 'white' }}
            >
              取消
            </Button>
          </Space>
        </div>
      )}

      <MapContainer
        center={[center.lat, center.lng]}
        zoom={center.zoom || 13}
        zoomControl={false}
        attributionControl={false}
        style={{
          height: '100%',
          width: '100%',
          cursor: isSelectingLocation ? 'crosshair' : 'grab'
        }}
        ref={mapRef}
      >
        {/* 高德地图瓦片图层 */}
        <TileLayer
          attribution='&copy; <a href="https://www.amap.com/">高德地图</a>'
          url="https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
        />

        {/* 地图点击事件处理 */}
        <MapClickHandler onMapClick={onMapClick} />

        {/* 地图中心点更新 */}
        <MapCenterUpdater center={center} />

        {/* 用户位置标记 */}
        {showUserLocation && userLocation && (
          <UserLocationMarker
            latitude={userLocation.lat}
            longitude={userLocation.lng}
            accuracy={userLocation.accuracy}
          />
        )}

        {/* 临时位置标记 */}
        {selectedLocation && createTempLocationIcon() && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={createTempLocationIcon()!}
          />
        )}

        {/* 餐厅标记点聚合 */}
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
        >
          {restaurants.map((restaurant) => (
            <RestaurantMarker
              key={restaurant.id}
              restaurant={restaurant}
              onClick={onRestaurantClick}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* 聚合图标样式 */}
      <style>{`
        .custom-marker-cluster {
          background-color: #ff6b6b !important;
          border: 2px solid #fff !important;
          border-radius: 50% !important;
          color: white !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-weight: bold !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
        }
        .cluster-icon {
          font-size: 14px !important;
        }
        .custom-temp-marker {
          background: transparent !important;
          border: none !important;
        }
        .temp-location-marker {
          width: 32px !important;
          height: 32px !important;
          color: #1890ff !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)) !important;
          animation: bounce 1s infinite !important;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default MapComponent;
