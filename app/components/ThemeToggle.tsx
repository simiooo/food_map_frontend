import React from 'react';
import { Button, Tooltip, ConfigProvider } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';

interface ThemeToggleProps {
  size?: 'small' | 'middle' | 'large';
  type?: 'default' | 'primary' | 'text';
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'middle', 
  type = 'text',
  className 
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        components: {
          Tooltip: {
            // 确保Tooltip在两种主题下都有良好的对比度
            colorBgSpotlight: isDark ? '#434343' : '#ffffff',
            colorTextLightSolid: isDark ? '#ffffff' : '#000000',
            boxShadow: isDark 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          Button: {
            // 主题切换按钮的特殊样式
            borderRadius: 8,
            colorText: isDark ? '#ffffff' : '#000000',
            colorTextHover: isDark ? '#4096ff' : '#1890ff',
            colorBgTextHover: isDark ? 'rgba(64, 150, 255, 0.1)' : 'rgba(24, 144, 255, 0.06)',
            colorBgTextActive: isDark ? 'rgba(64, 150, 255, 0.2)' : 'rgba(24, 144, 255, 0.1)',
          },
        },
      }}
    >
      <Tooltip 
        title={isDark ? '切换到浅色模式' : '切换到深色模式'}
        placement="bottom"
      >
        <Button
          type={type}
          size={size}
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          className={className}
          aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
        />
      </Tooltip>
    </ConfigProvider>
  );
};

export default ThemeToggle;
