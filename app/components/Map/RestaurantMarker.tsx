import React, { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Button, Typography, Space, ConfigProvider, Card } from 'antd';
import { MdRestaurant } from 'react-icons/md';
import type { Restaurant } from '../../types/restaurant';
import * as L from 'leaflet'

const { Text, Title } = Typography;

interface RestaurantMarkerProps {
  restaurant: Restaurant;
  onClick?: (restaurant: Restaurant) => void;
}

// 创建自定义餐厅图标
const createRestaurantIcon = () => {
  // 动态导入L，确保在客户端环境
  if (typeof window === 'undefined') return null;

  return L.divIcon({
    html: `
      <div class="restaurant-marker">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
        </svg>
      </div>
    `,
    className: 'custom-restaurant-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const RestaurantMarker: React.FC<RestaurantMarkerProps> = ({ restaurant, onClick }) => {
  const [icon, setIcon] = useState<any>(null);

  useEffect(() => {
    // 只在客户端创建图标
    if (typeof window !== 'undefined') {
      const restaurantIcon = createRestaurantIcon();
      setIcon(restaurantIcon);
    }
  }, []);

  const handleMarkerClick = () => {
    if (onClick) {
      onClick(restaurant);
    }
  };

  if (!icon) {
    return null; // 服务端渲染时不显示
  }

  return (
    <ConfigProvider
    theme={{
      token: {
        fontSize: 14,
      }
    }}
    >
      <Marker
        position={[restaurant.latitude, restaurant.longitude]}
        icon={icon}
        eventHandlers={{
          click: handleMarkerClick,
        }}
      >
        <Popup
        
        >
          <div style={{ minWidth: '200px', maxWidth: '300px',}}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Title level={5} style={{ margin: 0 }}>
                {restaurant.name}
              </Title>

              <Text style={{
                fontSize: 14
              }} type="secondary">
                <strong>地址:</strong> {restaurant.address}
              </Text>

              <Text style={{
                fontSize: 14
              }} type="secondary">
                <strong>分类:</strong> {restaurant.category}
              </Text>

              {restaurant.description && (
                <Text style={{
                fontSize: 14
              }} type="secondary">
                  <strong>描述:</strong> {restaurant.description}
                </Text>
              )}

              {restaurant.photo && (
                <img
                  src={restaurant.photo}
                  alt={restaurant.name}
                  style={{
                    width: '100%',
                    maxHeight: '150px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              )}

              <Space>
                <Button
                  type="primary"
                  size="small"
                  onClick={handleMarkerClick}
                >
                  查看详情
                </Button>
              </Space>
            </Space>
          </div>
        </Popup>
      </Marker>

      {/* 自定义标记样式 */}
      <style>{`
        .custom-restaurant-marker {
          background: transparent;
          border: none;
        }
        .restaurant-marker {
          width: 32px;
          height: 32px;
          background-color: #ff6b6b;
          border: 2px solid #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .restaurant-marker:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }

        .restaurant-marker svg {
          width: 18px;
          height: 18px;
        }
      `}</style>
    </ConfigProvider>
  );
};

export default RestaurantMarker;
