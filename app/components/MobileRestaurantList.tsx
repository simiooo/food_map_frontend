import React from 'react';
import { Spin, Empty } from 'antd';
import MobileRestaurantCard from './MobileRestaurantCard';
import type { Restaurant } from '../types/restaurant';

interface MobileRestaurantListProps {
  restaurants: Restaurant[];
  loading?: boolean;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
  onLocate: (restaurant: Restaurant) => void;
}

const MobileRestaurantList: React.FC<MobileRestaurantListProps> = ({
  restaurants,
  loading = false,
  onEdit,
  onDelete,
  onLocate,
}) => {
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p style={{ marginTop: '16px', color: '#8c8c8c' }}>加载中...</p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="empty-container">
        <Empty
          description="暂无餐厅数据"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="mobile-restaurant-list">
      {restaurants.map((restaurant) => (
        <MobileRestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          onEdit={onEdit}
          onDelete={onDelete}
          onLocate={onLocate}
        />
      ))}

      <style jsx>{`
        .mobile-restaurant-list {
          padding: 16px 0;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
        }

        .empty-container {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          min-height: 200px;
        }
      `}</style>
    </div>
  );
};

export default MobileRestaurantList;
