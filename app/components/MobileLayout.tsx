import React, { useState } from 'react';
import { Button, FloatButton, Badge } from 'antd';
import { PlusOutlined, SearchOutlined, FilterOutlined, MenuOutlined } from '@ant-design/icons';
import FoodMap from './Map/MapContainer';
import InfiniteRestaurantList from './InfiniteRestaurantList';
import SearchPanel from './SearchPanel';
import type { Restaurant, MapPosition, SearchParams } from '../types/restaurant';

interface MobileLayoutProps {
  restaurants: Restaurant[];
  mapCenter: MapPosition;
  loading: boolean;
  isSelectingLocation: boolean;
  selectedLocation: { lat: number; lng: number } | null;
  userLocation?: { lat: number; lng: number; accuracy?: number } | null;
  searchParams?: SearchParams;
  onRestaurantClick: (restaurant: Restaurant) => void;
  onMapClick: (position: { lat: number; lng: number }) => void;
  onCancelLocationSelection: () => void;
  onSearch: (params: SearchParams) => void;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
  onLocate: (restaurant: Restaurant) => void;
  onAddRestaurant: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  restaurants,
  mapCenter,
  loading,
  isSelectingLocation,
  selectedLocation,
  userLocation,
  searchParams,
  onRestaurantClick,
  onMapClick,
  onCancelLocationSelection,
  onSearch,
  onEdit,
  onDelete,
  onLocate,
  onAddRestaurant,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [listExpanded, setListExpanded] = useState(false);

  return (
    <div className="mobile-layout">
      {/* 顶部标题栏 */}
      <div className="mobile-header">
        <div className="header-content">
          <h1 className="app-title">美食地图</h1>
          <div className="header-actions">
            <Button
              type="text"
              icon={<SearchOutlined />}
              onClick={() => setShowSearch(!showSearch)}
              className="header-btn"
            />
            <Badge count={restaurants.length} size="small">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setListExpanded(!listExpanded)}
                className="header-btn"
              />
            </Badge>
          </div>
        </div>
      </div>

      {/* 搜索面板 */}
      {showSearch && (
        <div className="mobile-search-panel">
          <SearchPanel
            onSearch={(params) => {
              onSearch(params);
              setShowSearch(false);
            }}
            loading={loading}
          />
        </div>
      )}

      {/* 地图区域 */}
      <div className={`map-container ${listExpanded ? 'map-compressed' : ''}`}>
        <FoodMap
          restaurants={restaurants}
          center={mapCenter}
          onRestaurantClick={onRestaurantClick}
          onMapClick={onMapClick}
          isSelectingLocation={isSelectingLocation}
          selectedLocation={selectedLocation}
          userLocation={userLocation}
          onCancelLocationSelection={onCancelLocationSelection}
          className="mobile-map"
        />
      </div>

      {/* 底部列表区域 */}
      <div className={`bottom-sheet ${listExpanded ? 'expanded' : ''}`}>
        {/* 拖拽手柄 */}
        <div
          className="drag-handle"
          onClick={() => setListExpanded(!listExpanded)}
        >
          <div className="handle-bar"></div>
        </div>

        {/* 列表标题 */}
        <div className="list-header">
          <h3 className="list-title">
            附近餐厅 ({restaurants.length})
          </h3>
        </div>

        {/* 餐厅列表 */}
        <div className="list-content">
          <InfiniteRestaurantList
            searchParams={searchParams}
            onEdit={onEdit}
            onDelete={onDelete}
            onLocate={(restaurant) => {
              onLocate(restaurant);
              setListExpanded(false); // 定位后收起列表
            }}
            height={listExpanded ? window.innerHeight * 0.6 - 120 : window.innerHeight * 0.4 - 120}
          />
        </div>
      </div>

      {/* 悬浮添加按钮 */}
      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        onClick={onAddRestaurant}
        className="add-fab"
        tooltip="添加餐厅"
      />

      {/* 移动端样式 */}
      <style jsx>{`
        .mobile-layout {
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .mobile-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #f0f0f0;
          padding: 8px 16px;
          height: 56px;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .app-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1890ff;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .header-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-search-panel {
          position: fixed;
          top: 56px;
          left: 0;
          right: 0;
          z-index: 999;
          background: white;
          border-bottom: 1px solid #f0f0f0;
          padding: 16px;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .map-container {
          flex: 1;
          margin-top: 56px;
          transition: all 0.3s ease;
        }

        .map-container.map-compressed {
          height: 40vh;
          flex: none;
        }

        .mobile-map {
          height: 100%;
          width: 100%;
        }

        .bottom-sheet {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-radius: 16px 16px 0 0;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          height: 40vh;
          z-index: 998;
        }

        .bottom-sheet.expanded {
          height: 60vh;
        }

        .drag-handle {
          padding: 12px;
          display: flex;
          justify-content: center;
          cursor: pointer;
        }

        .handle-bar {
          width: 40px;
          height: 4px;
          background: #d9d9d9;
          border-radius: 2px;
        }

        .list-header {
          padding: 0 16px 12px;
          border-bottom: 1px solid #f0f0f0;
        }

        .list-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #262626;
        }

        .list-content {
          flex: 1;
          overflow-y: auto;
          padding: 0 16px;
          height: calc(100% - 80px);
        }

        .add-fab {
          position: fixed !important;
          bottom: 80px !important;
          right: 16px !important;
          z-index: 1001 !important;
        }

        /* 滚动条样式 */
        .list-content::-webkit-scrollbar {
          width: 4px;
        }

        .list-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .list-content::-webkit-scrollbar-thumb {
          background: #d9d9d9;
          border-radius: 2px;
        }

        .list-content::-webkit-scrollbar-thumb:hover {
          background: #bfbfbf;
        }
      `}</style>
    </div>
  );
};

export default MobileLayout;
