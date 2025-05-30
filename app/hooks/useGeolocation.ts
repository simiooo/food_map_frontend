import { useState, useEffect } from 'react';
import { message } from 'antd';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  onSuccess?: (position: { lat: number; lng: number }) => void;
  onError?: (error: string) => void;
  showMessages?: boolean;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000, // 5分钟缓存
    onSuccess,
    onError,
    showMessages = true,
  } = options;

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: false,
    error: null,
  });

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      const error = '您的浏览器不支持地理位置服务';
      setState(prev => ({ ...prev, error, loading: false }));
      if (showMessages) {
        message.warning(error);
      }
      onError?.(error);
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    if (showMessages) {
      message.loading('正在获取您的位置...', 0);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        setState({
          latitude,
          longitude,
          accuracy,
          loading: false,
          error: null,
        });

        if (showMessages) {
          message.destroy();
          message.success('位置获取成功！');
        }

        onSuccess?.({ lat: latitude, lng: longitude });
      },
      (error) => {
        let errorMessage = '位置获取失败';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '用户拒绝了位置访问请求';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置信息不可用';
            break;
          case error.TIMEOUT:
            errorMessage = '位置获取超时';
            break;
          default:
            errorMessage = '未知的位置获取错误';
            break;
        }

        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: errorMessage 
        }));

        if (showMessages) {
          message.destroy();
          message.warning(`${errorMessage}，将使用默认位置`);
        }

        onError?.(errorMessage);
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  };

  // 自动获取位置（仅在组件挂载时）
  useEffect(() => {
    getCurrentPosition();
  }, []); // 空依赖数组，只在挂载时执行一次

  return {
    ...state,
    getCurrentPosition,
    isSupported: !!navigator.geolocation,
  };
};
