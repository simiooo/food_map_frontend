import React from 'react';
import { Card, Input, Select, Button, Space, Form } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import type { SearchParams } from '../types/restaurant';

const { Option } = Select;

interface SearchPanelProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
  className?: string;
}

// 模拟餐厅分类数据
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

const SearchPanel: React.FC<SearchPanelProps> = ({
  onSearch,
  loading = false,
  className,
}) => {
  const [form] = Form.useForm();

  const handleSearch = (values: any) => {
    const searchParams: SearchParams = {
      keywords: values.keywords?.trim(),
      categoryId: values.categoryId,
      pageNum: '1',
      pageSize: '20',
    };
    
    // 过滤空值
    const filteredParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== undefined && value !== '')
    );
    
    onSearch(filteredParams);
  };

  const handleReset = () => {
    form.resetFields();
    onSearch({
      pageNum: '1',
      pageSize: '20',
    });
  };

  return (
    <Card 
      title="搜索餐厅" 
      className={className}
      size="small"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSearch}
        initialValues={{
          keywords: '',
          categoryId: undefined,
        }}
      >
        <Form.Item
          label="关键词"
          name="keywords"
        >
          <Input
            placeholder="请输入餐厅名称、地址等关键词"
            allowClear
            prefix={<SearchOutlined />}
          />
        </Form.Item>

        <Form.Item
          label="餐厅分类"
          name="categoryId"
        >
          <Select
            placeholder="请选择餐厅分类"
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SearchOutlined />}
            >
              搜索
            </Button>
            <Button
              onClick={handleReset}
              icon={<ClearOutlined />}
            >
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SearchPanel;
