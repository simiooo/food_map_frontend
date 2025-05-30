import React from "react";
import {
  Card,
  Button,
  Typography,
  Image,
  Popconfirm,
  Tag,
  ConfigProvider,
  Space,
  Flex,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  StarOutlined,
} from "@ant-design/icons";
import type { Restaurant } from "../types/restaurant";
import { useTheme } from "../theme/ThemeContext";

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
  const { isDark } = useTheme();

  const handleDelete = () => {
    if (restaurant.id) {
      onDelete(restaurant.id);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            bodyPadding: 12,
            borderRadius: 12,
            boxShadow: isDark
              ? '0 2px 8px rgba(0, 0, 0, 0.3)'
              : '0 2px 8px rgba(0, 0, 0, 0.06)',
          },
          Image: {
            borderRadius: 8,
          },
          Tag: {
            borderRadius: 8,
            fontSize: 12,
          },
          Button: {
            borderRadius: 6,
            fontSize: 12,
            controlHeight: 28,
          },
          Tooltip: {
            borderRadius: 8,
            boxShadow: isDark
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            colorBgSpotlight: isDark ? '#434343' : '#ffffff',
            colorTextLightSolid: isDark ? '#ffffff' : '#000000',
            fontSize: 12,
          },
          Popconfirm: {
            borderRadius: 12,
            boxShadow: isDark
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      }}
    >
      <Card
      >
        <Flex
        gap={6}
        style={{width: '100%'}}
        align="start">
          {/* 餐厅图片 */}
          {restaurant.photo ? (
            <Image
              src={restaurant.photo}
              alt={restaurant.name}
              width={80}
              height={80}
              style={{ objectFit: "cover" }}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            />
          ) : (
            <div style={{
              width: '80px',
              height: '80px',
              background: isDark ? '#262626' : '#f5f5f5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <StarOutlined style={{
                fontSize: "24px",
                color: isDark ? '#6c7b7f' : '#d9d9d9'
              }} />
            </div>
          )}

          {/* 餐厅信息 */}
          <Space direction="vertical" size={6} style={{ flex: 1, minWidth: 0,  }}>
            {/* 标题行 */}
            <Space size={8} style={{ width: '100%', justifyContent: 'space-between' }}>
              <Title
                level={5}
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: 600,
                  flex: 1,
                  minWidth: 0
                }}
                ellipsis={{ tooltip: restaurant.name }}
              >
                {restaurant.name}
              </Title>
              <Tag color="blue" style={{ margin: 0, fontSize: '12px' }}>
                {restaurant.category}
              </Tag>
            </Space>

            {/* 地址 */}
            <Flex
            gap={6}
            style={{
              width: '100%'
            }}
            align="start">
              <EnvironmentOutlined style={{

                color: isDark ? '#6c7b7f' : '#8c8c8c',
                fontSize: '12px',
                marginTop: '2px'

              }} />
              <Text
                type="secondary"
                style={{ fontSize: '13px',flex: 1 }}
                ellipsis={{ tooltip: restaurant.address }}
              >
                {restaurant.address}
              </Text>
            </Flex>

            {/* 描述 */}
            {restaurant.description && (
              <Text
                type="secondary"
                style={{ fontSize: '12px', width: '100%' }}
                ellipsis={{ tooltip: restaurant.description }}
              >
                {restaurant.description}
              </Text>
            )}

            {/* 操作按钮 */}
            <Space size={4} style={{ marginTop: '4px' }}>
              <Button
                type="text"
                size="small"
                icon={<EnvironmentOutlined />}
                onClick={() => onLocate(restaurant)}
                style={{
                  color: '#1890ff',
                  background: isDark ? 'rgba(24, 144, 255, 0.15)' : 'rgba(24, 144, 255, 0.06)',
                  fontSize: '12px',
                  height: 'auto',
                  padding: '4px 8px'
                }}
              >
                定位
              </Button>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(restaurant)}
                style={{
                  color: '#52c41a',
                  background: isDark ? 'rgba(82, 196, 26, 0.15)' : 'rgba(82, 196, 26, 0.06)',
                  fontSize: '12px',
                  height: 'auto',
                  padding: '4px 8px'
                }}
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
                  style={{
                    color: '#ff4d4f',
                    background: isDark ? 'rgba(255, 77, 79, 0.15)' : 'rgba(255, 77, 79, 0.06)',
                    fontSize: '12px',
                    height: 'auto',
                    padding: '4px 8px'
                  }}
                >
                  删除
                </Button>
              </Popconfirm>
            </Space>
          </Space>
        </Flex>
      </Card>
    </ConfigProvider>
  );
};

export default MobileRestaurantCard;
