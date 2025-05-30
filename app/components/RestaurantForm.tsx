import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Restaurant } from '../types/restaurant';

const { Option } = Select;
const { TextArea } = Input;

interface RestaurantFormProps {
  visible: boolean;
  restaurant?: Restaurant | null;
  selectedLocation?: { lat: number; lng: number } | null;
  onSubmit: (data: Partial<Restaurant>) => Promise<void>;
  onStartLocationSelection?: () => void;
  onCancel: () => void;
  loading?: boolean;
}

// 餐厅分类选项
const categories = [
  { id: '1', name: '中餐' },
  { id: '2', name: '西餐' },
  { id: '3', name: '日料' },
  { id: '4', name: '韩料' },
  { id: '5', name: '快餐' },
  { id: '6', name: '火锅' },
  { id: '7', name: '烧烤' },
  { id: '8', name: '甜品' },
  { id: '9', name: '咖啡' },
  { id: '10', name: '其他' },
];

const RestaurantForm: React.FC<RestaurantFormProps> = ({
  visible,
  restaurant,
  selectedLocation,
  onSubmit,
  onStartLocationSelection,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!restaurant;

  useEffect(() => {
    if (visible) {
      if (restaurant) {
        // 编辑模式，填充表单数据
        form.setFieldsValue({
          name: restaurant.name,
          address: restaurant.address,
          description: restaurant.description,
          category: restaurant.category,
          longitude: restaurant.longitude,
          latitude: restaurant.latitude,
          photo: restaurant.photo,
        });
      } else {
        // 新增模式，重置表单
        form.resetFields();
      }
    }
  }, [visible, restaurant, form]);

  // 处理选中位置的变化
  useEffect(() => {
    if (selectedLocation && visible) {
      form.setFieldsValue({
        longitude: selectedLocation.lng,
        latitude: selectedLocation.lat,
      });
    }
  }, [selectedLocation, visible, form]);

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        longitude: parseFloat(values.longitude),
        latitude: parseFloat(values.latitude),
      };

      await onSubmit(formData);
      form.resetFields();
      message.success(isEdit ? '餐厅信息更新成功！' : '餐厅添加成功！');
    } catch (error) {
      message.error(isEdit ? '更新失败，请重试' : '添加失败，请重试');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // 图片上传前的验证
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <Modal
      title={isEdit ? '编辑餐厅' : '添加餐厅'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          category: '其他',
        }}
      >
        <Form.Item
          label="餐厅名称"
          name="name"
          rules={[
            { required: true, message: '请输入餐厅名称' },
            { max: 100, message: '餐厅名称不能超过100个字符' },
          ]}
        >
          <Input placeholder="请输入餐厅名称" />
        </Form.Item>

        <Form.Item
          label="餐厅地址"
          name="address"
          rules={[
            { required: true, message: '请输入餐厅地址' },
            { max: 200, message: '地址不能超过200个字符' },
          ]}
        >
          <Input placeholder="请输入餐厅地址" />
        </Form.Item>

        <Form.Item
          label="餐厅分类"
          name="category"
          rules={[{ required: true, message: '请选择餐厅分类' }]}
        >
          <Select placeholder="请选择餐厅分类">
            {categories.map((category) => (
              <Option key={category.id} value={category.name}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="餐厅位置">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <Form.Item
              name="longitude"
              style={{ flex: 1, marginBottom: 0 }}
              rules={[
                { required: true, message: '请输入经度' },
                {
                  pattern: /^-?((1[0-7]\d)|(\d{1,2}))(\.\d+)?$/,
                  message: '请输入有效的经度值',
                },
              ]}
            >
              <Input placeholder="经度 (例: 116.397428)" />
            </Form.Item>

            <Form.Item
              name="latitude"
              style={{ flex: 1, marginBottom: 0 }}
              rules={[
                { required: true, message: '请输入纬度' },
                {
                  pattern: /^-?([0-8]?\d)(\.\d+)?$/,
                  message: '请输入有效的纬度值',
                },
              ]}
            >
              <Input placeholder="纬度 (例: 39.90923)" />
            </Form.Item>

            {onStartLocationSelection && (
              <Button
                type="dashed"
                onClick={() => {
                  // 先关闭模态框，然后开始位置选择
                  onCancel();
                  setTimeout(() => {
                    onStartLocationSelection();
                  }, 100);
                }}
                style={{ marginBottom: 0 }}
              >
                {isEdit ? '修改位置' : '地图选择'}
              </Button>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
            {selectedLocation
              ? `已选择位置: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
              : '您可以手动输入坐标，或点击按钮在地图上选择位置'
            }
          </div>
        </Form.Item>

        <Form.Item
          label="餐厅描述"
          name="description"
          rules={[{ max: 500, message: '描述不能超过500个字符' }]}
        >
          <TextArea
            rows={4}
            placeholder="请输入餐厅描述（可选）"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="餐厅图片"
          name="photo"
        >
          <Input placeholder="请输入图片URL（可选）" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? '更新' : '添加'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RestaurantForm;
