import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { tailwindTheme } from './tailwindTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ConfigProvider
      theme={tailwindTheme}
      locale={zhCN}
      componentSize="middle"
      wave={{ disabled: false }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider;
