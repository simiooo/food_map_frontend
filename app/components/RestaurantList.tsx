import React from 'react';
import { Card, List, Button, Space, Typography, Image, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { Restaurant } from '../types/restaurant';

const { Text, Title } = Typography;

interface RestaurantListProps {
  restaurants: Restaurant[];
  loading?: boolean;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
  onLocate: (restaurant: Restaurant) => void;
  className?: string;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  loading = false,
  onEdit,
  onDelete,
  onLocate,
  className,
}) => {
  const handleDelete = (id: string) => {
    onDelete(id);
  };

  const renderItem = (restaurant: Restaurant) => (
    <List.Item key={restaurant.id}>
      <div style={{ width: '100%' }}>
        {/* 主要内容区域 */}
        <div style={{ display: 'flex', marginBottom: '12px' }}>
          {/* 头像区域 */}
          <div style={{ marginRight: '16px', flexShrink: 0 }}>
            {restaurant.photo ? (
              <Image
                width={80}
                height={80}
                src={restaurant.photo}
                alt={restaurant.name}
                style={{ objectFit: 'cover', borderRadius: '8px' }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              />
            ) : (
              <div
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                }}
              >
                暂无图片
              </div>
            )}
          </div>

          {/* 内容区域 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* 标题行 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
              <Title
                level={5}
                style={{
                  margin: 0,
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={restaurant.name}
              >
                {restaurant.name}
              </Title>
              <Tag color="blue" style={{ flexShrink: 0 }}>
                {restaurant.category}
              </Tag>
            </div>

            {/* 描述信息 */}
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text type="secondary">
                <EnvironmentOutlined /> {restaurant.address}
              </Text>
              {restaurant.description && (
                <Text type="secondary" ellipsis={{ tooltip: restaurant.description }}>
                  {restaurant.description}
                </Text>
              )}
              <Text type="secondary" style={{ fontSize: '12px' }}>
                坐标: {restaurant.longitude.toFixed(6)}, {restaurant.latitude.toFixed(6)}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                创建时间: {new Date(restaurant.createdTime).toLocaleString()}
              </Text>
            </Space>
          </div>
        </div>

        {/* 操作按钮区域 */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '8px',
          paddingTop: '8px',
          paddingLeft: '96px', // 96px = 80px(头像宽度) + 16px(间距)
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button
            type="text"
            size="small"
            icon={<EnvironmentOutlined />}
            onClick={() => onLocate(restaurant)}
            title="在地图上定位"
          >
            定位
          </Button>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(restaurant)}
            title="编辑"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个餐厅吗？"
            description="删除后无法恢复，请谨慎操作。"
            onConfirm={() => handleDelete(restaurant.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              title="删除"
            >
              删除
            </Button>
          </Popconfirm>
        </div>
      </div>
    </List.Item>
  );

  return (
    <Card
      title="餐厅列表"
      className={className}
      size="small"
    >
      <List
        loading={loading}
        dataSource={restaurants}
        renderItem={renderItem}
        locale={{
          emptyText: '暂无餐厅数据',
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        }}
      />
    </Card>
  );
};

export default RestaurantList;
