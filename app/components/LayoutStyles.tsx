import React from 'react';
import { ConfigProvider } from 'antd';
import { useTheme } from '../theme/ThemeContext';

// 主布局样式配置
export const MainLayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerBg: isDark ? '#1f1f1f' : '#ffffff',
            headerPadding: '0 24px',
            headerHeight: 64,
            siderBg: isDark ? '#1f1f1f' : '#ffffff',
            bodyBg: isDark ? '#141414' : '#f5f5f5',
            triggerBg: isDark ? '#262626' : '#ffffff',
          },
          Typography: {
            titleMarginBottom: 0,
            titleMarginTop: 0,
            colorText: '#1890ff',
            fontSize: 24,
            fontWeightStrong: 600,
          },
          Button: {
            borderRadius: 8,
            controlHeight: 40,
            fontWeight: 500,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

// Header样式配置
export const HeaderStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Space: {
            size: 16,
          },
          Typography: {
            titleMarginBottom: 0,
            titleMarginTop: 0,
            colorText: '#1890ff',
            fontSize: 20,
            fontWeightStrong: 600,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

// Sider样式配置
export const SiderStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            siderBg: isDark ? '#1f1f1f' : '#ffffff',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

// 搜索面板样式配置
export const SearchPanelStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <ConfigProvider
      theme={{
        token: {
          padding: 16,
          colorBorder: isDark ? '#424242' : '#f0f0f0',
        },
        components: {
          Card: {
            bodyPadding: 16,
            borderRadius: 0,
            boxShadow: 'none',
          },
          Space: {
            size: 0,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

// 全高度容器组件
export const FullHeightContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  );
};

// 搜索区域容器
export const SearchAreaContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div 
      style={{
        padding: '16px',
        borderBottom: `1px solid ${isDark ? '#424242' : '#f0f0f0'}`,
        flexShrink: 0
      }}
    >
      {children}
    </div>
  );
};

// 列表区域容器
export const ListAreaContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ flex: 1 }}>
      {children}
    </div>
  );
};

// Header内容容器
export const HeaderContentContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      {children}
    </div>
  );
};
