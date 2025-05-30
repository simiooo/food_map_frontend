import type { ThemeConfig } from 'antd';

// Tailwind风格的主题配置
export const tailwindTheme: ThemeConfig = {
  token: {
    // 颜色系统 - 基于Tailwind CSS的颜色调色板
    colorPrimary: '#3b82f6', // blue-500
    colorSuccess: '#10b981', // emerald-500
    colorWarning: '#f59e0b', // amber-500
    colorError: '#ef4444',   // red-500
    colorInfo: '#6366f1',    // indigo-500
    
    // 中性色系
    colorText: '#111827',        // gray-900
    colorTextSecondary: '#6b7280', // gray-500
    colorTextTertiary: '#9ca3af',  // gray-400
    colorTextQuaternary: '#d1d5db', // gray-300
    
    // 背景色
    colorBgContainer: '#ffffff',     // white
    colorBgElevated: '#ffffff',      // white
    colorBgLayout: '#f9fafb',        // gray-50
    colorBgSpotlight: '#f3f4f6',     // gray-100
    colorBgMask: 'rgba(0, 0, 0, 0.45)',
    
    // 边框色
    colorBorder: '#e5e7eb',          // gray-200
    colorBorderSecondary: '#f3f4f6', // gray-100
    
    // 圆角 - 大圆角设计
    borderRadius: 12,        // 基础圆角
    borderRadiusLG: 16,      // 大圆角
    borderRadiusSM: 8,       // 小圆角
    borderRadiusXS: 6,       // 超小圆角
    
    // 阴影 - 浅阴影
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // shadow-sm
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
    boxShadowTertiary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
    
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
    
    // 行高
    lineHeight: 1.5714285714285714,
    lineHeightLG: 1.5,
    lineHeightSM: 1.66,
    
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
    
    // 透明度
    opacityLoading: 0.65,
    
    // 线条宽度 - 去线留白
    lineWidth: 0,        // 移除边框线
    lineWidthBold: 0,    // 移除粗边框线
    
    // 焦点轮廓
    lineWidthFocus: 2,
    
    // 网格单位
    wireframe: false,
  },
  
  components: {
    // Button 组件
    Button: {
      borderRadius: 12,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      fontWeight: 500,
      borderWidth: 0, // 无边框
      primaryShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)', // 主按钮阴影
      defaultShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', // 默认按钮阴影
    },
    
    // Card 组件
    Card: {
      borderRadius: 16,
      borderWidth: 0, // 无边框
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      headerBg: 'transparent',
      bodyPadding: 24,
      headerPadding: '16px 24px',
    },
    
    // Input 组件
    Input: {
      borderRadius: 12,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      borderWidth: 0, // 无边框
      activeBg: '#f9fafb',
      hoverBg: '#f3f4f6',
      activeBorderColor: '#3b82f6',
      hoverBorderColor: '#d1d5db',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      activeShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    
    // Select 组件
    Select: {
      borderRadius: 12,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      borderWidth: 0,
      optionSelectedBg: '#eff6ff', // blue-50
      optionActiveBg: '#f3f4f6',   // gray-100
      selectorBg: '#f9fafb',       // gray-50
    },
    
    // Modal 组件
    Modal: {
      borderRadius: 16,
      borderWidth: 0,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
      headerBg: 'transparent',
      contentBg: '#ffffff',
      footerBg: 'transparent',
    },
    
    // Drawer 组件
    Drawer: {
      borderRadius: 16,
      borderWidth: 0,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      headerBg: 'transparent',
      bodyBg: '#ffffff',
      footerBg: 'transparent',
    },
    
    // Table 组件
    Table: {
      borderRadius: 12,
      borderWidth: 0,
      headerBg: '#f9fafb',     // gray-50
      headerColor: '#374151',   // gray-700
      rowHoverBg: '#f3f4f6',   // gray-100
      cellPaddingBlock: 16,
      cellPaddingInline: 16,
    },
    
    // List 组件
    List: {
      borderRadius: 12,
      borderWidth: 0,
      itemPadding: '16px 24px',
      itemPaddingLG: '20px 24px',
      itemPaddingSM: '12px 16px',
    },
    
    // Menu 组件
    Menu: {
      borderRadius: 12,
      borderWidth: 0,
      itemBg: 'transparent',
      itemSelectedBg: '#eff6ff',   // blue-50
      itemActiveBg: '#f3f4f6',     // gray-100
      itemHoverBg: '#f9fafb',      // gray-50
      itemPadding: '8px 16px',
      itemMarginBlock: 4,
      itemMarginInline: 8,
      itemBorderRadius: 8,
    },
    
    // Tabs 组件
    Tabs: {
      borderRadius: 12,
      borderWidth: 0,
      cardBg: '#f9fafb',           // gray-50
      itemSelectedColor: '#3b82f6', // blue-500
      itemHoverColor: '#6b7280',    // gray-500
      itemActiveColor: '#3b82f6',   // blue-500
      inkBarColor: '#3b82f6',       // blue-500
      cardPadding: '16px 24px',
    },
    
    // Form 组件
    Form: {
      itemMarginBottom: 24,
      verticalLabelPadding: '0 0 8px',
      labelRequiredMarkColor: '#ef4444', // red-500
      labelColor: '#374151',              // gray-700
      labelFontSize: 14,
      labelHeight: 32,
    },
    
    // Message 组件
    Message: {
      borderRadius: 12,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      borderWidth: 0,
    },
    
    // Notification 组件
    Notification: {
      borderRadius: 12,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      borderWidth: 0,
      padding: 20,
    },
    
    // Popover 组件
    Popover: {
      borderRadius: 12,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      borderWidth: 0,
    },
    
    // Tooltip 组件
    Tooltip: {
      borderRadius: 8,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      borderWidth: 0,
    },
    
    // Spin 组件
    Spin: {
      colorPrimary: '#3b82f6', // blue-500
    },
    
    // Progress 组件
    Progress: {
      borderRadius: 12,
      colorSuccess: '#10b981', // emerald-500
    },
    
    // Switch 组件
    Switch: {
      borderRadius: 12,
      handleBg: '#ffffff',
      handleShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    },
    
    // Radio 组件
    Radio: {
      borderRadius: 12,
      buttonBg: '#f9fafb',         // gray-50
      buttonCheckedBg: '#3b82f6',  // blue-500
      buttonColor: '#6b7280',      // gray-500
      buttonCheckedColor: '#ffffff',
    },
    
    // Checkbox 组件
    Checkbox: {
      borderRadius: 6,
      colorPrimary: '#3b82f6',     // blue-500
    },
    
    // DatePicker 组件
    DatePicker: {
      borderRadius: 12,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      borderWidth: 0,
    },
    
    // Upload 组件
    Upload: {
      borderRadius: 12,
      borderWidth: 0,
      colorBorder: '#d1d5db',      // gray-300
      colorBorderHover: '#9ca3af', // gray-400
    },
  },
  
  // 算法配置
  algorithm: [], // 使用默认算法
};
