import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

// 黑暗模式主题配置
export const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    // 颜色系统 - 黑暗模式调色板
    colorPrimary: '#4096ff', // blue-500 (稍微亮一些)
    colorSuccess: '#52c41a', // green-500
    colorWarning: '#faad14', // orange-500
    colorError: '#ff4d4f',   // red-500
    colorInfo: '#722ed1',    // purple-500
    
    // 中性色系 - 黑暗模式
    colorText: '#ffffff',           // 主文字颜色
    colorTextSecondary: '#a6adb4', // 次要文字颜色
    colorTextTertiary: '#6c7b7f',  // 三级文字颜色
    colorTextQuaternary: '#5a6169', // 四级文字颜色
    
    // 背景色 - 黑暗模式
    colorBgContainer: '#1f1f1f',     // 容器背景
    colorBgElevated: '#262626',      // 悬浮背景
    colorBgLayout: '#141414',        // 布局背景
    colorBgSpotlight: '#262626',     // 聚光灯背景
    colorBgMask: 'rgba(0, 0, 0, 0.65)',
    
    // 边框色 - 黑暗模式
    colorBorder: '#424242',          // 主边框色
    colorBorderSecondary: '#303030', // 次要边框色
    
    // 圆角 - 大圆角设计
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,
    borderRadiusXS: 6,
    
    // 阴影 - 黑暗模式阴影
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    boxShadowTertiary: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
    
    // 间距
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,
    
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    marginXS: 8,
    marginXXS: 4,
    
    // 字体
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    
    // 控件高度
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
    controlHeightXS: 24,
    
    // 运动效果
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
    motionEaseIn: 'cubic-bezier(0.4, 0, 1, 1)',
    
    // 线条宽度 - 去线留白
    lineWidth: 0,
    lineWidthBold: 0,
    lineWidthFocus: 2,
    
    wireframe: false,
  },
  
  components: {
    // Button 组件 - 黑暗模式
    Button: {
      borderRadius: 12,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      fontWeight: 500,
      borderWidth: 0,
      primaryShadow: '0 4px 6px -1px rgba(64, 150, 255, 0.4)',
      defaultShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
      defaultBg: '#262626',
      defaultColor: '#ffffff',
      defaultHoverBg: '#303030',
      defaultHoverColor: '#ffffff',
    },
    
    // Card 组件 - 黑暗模式
    Card: {
      borderRadius: 16,
      borderWidth: 0,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
      headerBg: 'transparent',
      bodyPadding: 24,
      headerPadding: '16px 24px',
      colorBg: '#1f1f1f',
      colorBorderSecondary: '#424242',
    },
    
    // Input 组件 - 黑暗模式
    Input: {
      borderRadius: 12,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      borderWidth: 0,
      colorBg: '#262626',
      colorBgContainer: '#262626',
      activeBg: '#303030',
      hoverBg: '#303030',
      activeBorderColor: '#4096ff',
      hoverBorderColor: '#424242',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
      activeShadow: '0 0 0 3px rgba(64, 150, 255, 0.2)',
    },
    
    // Tooltip 组件 - 黑暗模式优化
    Tooltip: {
      borderRadius: 8,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
      borderWidth: 0,
      colorBgSpotlight: '#434343',
      colorTextLightSolid: '#ffffff',
      fontSize: 12,
      padding: '8px 12px',
    },
    
    // Typography 组件 - 黑暗模式
    Typography: {
      titleMarginBottom: '0.5em',
      titleMarginTop: '1.2em',
      colorText: '#ffffff',
      colorTextSecondary: '#a6adb4',
      colorTextTertiary: '#6c7b7f',
      colorTextQuaternary: '#5a6169',
    },
    
    // Tag 组件 - 黑暗模式
    Tag: {
      borderRadius: 8,
      borderWidth: 0,
      colorBg: '#262626',
      colorText: '#ffffff',
      colorBorder: '#424242',
      fontSize: 12,
      fontSizeSM: 11,
      lineHeight: 1.2,
      paddingInline: 8,
      paddingBlock: 4,
    },
    
    // Image 组件 - 黑暗模式
    Image: {
      borderRadius: 8,
    },
    
    // Popconfirm 组件 - 黑暗模式
    Popconfirm: {
      borderRadius: 12,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      borderWidth: 0,
      colorBg: '#262626',
      colorText: '#ffffff',
    },
    
    // Modal 组件 - 黑暗模式
    Modal: {
      borderRadius: 16,
      borderWidth: 0,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      headerBg: 'transparent',
      contentBg: '#1f1f1f',
      footerBg: 'transparent',
    },
    
    // List 组件 - 黑暗模式
    List: {
      borderRadius: 12,
      borderWidth: 0,
      itemPadding: '16px 24px',
      itemPaddingLG: '20px 24px',
      itemPaddingSM: '12px 16px',
      colorBg: '#1f1f1f',
    },
    
    // Empty 组件 - 黑暗模式
    Empty: {
      colorTextDescription: '#6c7b7f',
      fontSize: 14,
    },
    
    // Spin 组件 - 黑暗模式
    Spin: {
      colorPrimary: '#4096ff',
    },
    
    // Divider 组件 - 黑暗模式
    Divider: {
      colorSplit: '#424242',
      fontSize: 14,
      fontSizeLG: 16,
      fontSizeSM: 12,
      textPaddingInline: 16,
    },
  },
};
