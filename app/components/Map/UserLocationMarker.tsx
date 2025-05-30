import React, { useEffect, useState } from 'react';
import { Marker, Circle } from 'react-leaflet';
import * as L from 'leaflet'
interface UserLocationMarkerProps {
  latitude: number;
  longitude: number;
  accuracy?: number;
  showAccuracyCircle?: boolean;
}

const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({
  latitude,
  longitude,
  accuracy,
  showAccuracyCircle = true,
}) => {
  const [icon, setIcon] = useState<any>(null);

  useEffect(() => {
    // 只在客户端创建图标
    if (typeof window !== 'undefined') {
      // const L = require('leaflet');
      
      const userLocationIcon = L.divIcon({
        html: `
          <div class="user-location-marker">
            <div class="location-dot"></div>
            <div class="location-pulse"></div>
          </div>
        `,
        className: 'custom-user-location-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      
      setIcon(userLocationIcon);
    }
  }, []);

  if (!icon) {
    return null; // 服务端渲染时不显示
  }

  return (
    <>
      {/* 精度圆圈 */}
      {showAccuracyCircle && accuracy && (
        <Circle
          center={[latitude, longitude]}
          radius={accuracy}
          pathOptions={{
            color: '#1890ff',
            fillColor: '#1890ff',
            fillOpacity: 0.1,
            weight: 1,
          }}
        />
      )}
      
      {/* 用户位置标记 */}
      <Marker
        position={[latitude, longitude]}
        icon={icon}
      />

      {/* 用户位置标记样式 */}
      <style jsx global>{`
        .custom-user-location-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .user-location-marker {
          position: relative;
          width: 20px;
          height: 20px;
        }
        
        .location-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          background: #1890ff;
          border: 2px solid #fff;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          z-index: 2;
        }
        
        .location-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          background: rgba(24, 144, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 2s infinite;
          z-index: 1;
        }
        
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default UserLocationMarker;
