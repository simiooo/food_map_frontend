import React from 'react';
import { Card, Button, Space, Typography, Image, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EnvironmentOutlined, StarOutlined } from '@ant-design/icons';
import type { Restaurant } from '../types/restaurant';

const { Text, Title } = Typography;

interface MobileRestaurantCardProps {
  restaurant: Restaurant;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
  onLocate: (restaurant: Restaurant) => void;
}

const MobileRestaurantCard: React.FC<MobileRestaurantCardProps> = ({
  restaurant,
  onEdit,
  onDelete,
  onLocate,
}) => {
  const handleDelete = () => {
    onDelete(restaurant.id);
  };

  return (
    <Card
      className="mobile-restaurant-card"
      bodyStyle={{ padding: '12px' }}
      bordered={false}
    >
      <div className="card-content">
        {/* 餐厅图片 */}
        <div className="restaurant-image">
          {restaurant.photo ? (
            <Image
              src={restaurant.photo}
              alt={restaurant.name}
              width={80}
              height={80}
              style={{ objectFit: 'cover', borderRadius: '8px' }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            />
          ) : (
            <div className="placeholder-image">
              <StarOutlined style={{ fontSize: '24px', color: '#d9d9d9' }} />
            </div>
          )}
        </div>

        {/* 餐厅信息 */}
        <div className="restaurant-info">
          {/* 标题行 */}
          <div className="title-row">
            <Title 
              level={5} 
              className="restaurant-name"
              title={restaurant.name}
            >
              {restaurant.name}
            </Title>
            <Tag color="blue" className="category-tag">
              {restaurant.category}
            </Tag>
          </div>

          {/* 地址 */}
          <div className="address-row">
            <EnvironmentOutlined className="location-icon" />
            <Text type="secondary" className="address-text" ellipsis={{ tooltip: restaurant.address }}>
              {restaurant.address}
            </Text>
          </div>

          {/* 描述 */}
          {restaurant.description && (
            <Text 
              type="secondary" 
              className="description-text"
              ellipsis={{ rows: 2, tooltip: restaurant.description }}
            >
              {restaurant.description}
            </Text>
          )}

          {/* 操作按钮 */}
          <div className="action-buttons">
            <Button
              type="text"
              size="small"
              icon={<EnvironmentOutlined />}
              onClick={() => onLocate(restaurant)}
              className="action-btn locate-btn"
            >
              定位
            </Button>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(restaurant)}
              className="action-btn edit-btn"
            >
              编辑
            </Button>
            <Popconfirm
              title="确定要删除这个餐厅吗？"
              description="删除后无法恢复，请谨慎操作。"
              onConfirm={handleDelete}
              okText="确定"
              cancelText="取消"
              placement="topRight"
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                className="action-btn delete-btn"
              >
                删除
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mobile-restaurant-card {
          margin-bottom: 12px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid #f0f0f0;
        }

        .card-content {
          display: flex;
          gap: 12px;
        }

        .restaurant-image {
          flex-shrink: 0;
        }

        .placeholder-image {
          width: 80px;
          height: 80px;
          background: #f5f5f5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .restaurant-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .restaurant-name {
          margin: 0 !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          line-height: 1.3 !important;
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .category-tag {
          flex-shrink: 0;
          margin: 0 !important;
          font-size: 12px;
          padding: 2px 8px;
          height: auto;
          line-height: 1.2;
        }

        .address-row {
          display: flex;
          align-items: flex-start;
          gap: 6px;
        }

        .location-icon {
          color: #8c8c8c;
          font-size: 12px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .address-text {
          font-size: 13px !important;
          line-height: 1.4 !important;
          flex: 1;
          min-width: 0;
        }

        .description-text {
          font-size: 12px !important;
          line-height: 1.4 !important;
          color: #8c8c8c !important;
        }

        .action-buttons {
          display: flex;
          gap: 4px;
          margin-top: 4px;
        }

        .action-btn {
          padding: 4px 8px !important;
          height: auto !important;
          font-size: 12px !important;
          border-radius: 6px !important;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .locate-btn {
          color: #1890ff !important;
          background: rgba(24, 144, 255, 0.06) !important;
        }

        .edit-btn {
          color: #52c41a !important;
          background: rgba(82, 196, 26, 0.06) !important;
        }

        .delete-btn {
          color: #ff4d4f !important;
          background: rgba(255, 77, 79, 0.06) !important;
        }

        .action-btn:hover {
          transform: scale(1.02);
        }
      `}</style>
    </Card>
  );
};

export default MobileRestaurantCard;
