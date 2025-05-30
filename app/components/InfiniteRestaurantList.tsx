import React, { useMemo, useRef, useEffect } from "react";
import { Spin, Empty, Button, Divider } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { VList, type VListHandle } from "virtua";
import MobileRestaurantCard from "./MobileRestaurantCard";
import type { Restaurant, SearchParams } from "../types/restaurant";
import { useRestaurantStore, restaurantSelectors } from "../stores/restaurantStore";

interface InfiniteRestaurantListProps {
  searchParams?: SearchParams;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
  onLocate: (restaurant: Restaurant) => void;
  height?: number | string;
  className?: string;
}

const InfiniteRestaurantList: React.FC<InfiniteRestaurantListProps> = ({
  searchParams = { pageNum: "1", pageSize: "10" },
  onEdit,
  onDelete,
  onLocate,
  height = 400,
  className,
}) => {
  const containerRef = useRef<VListHandle>(null);

  // 使用 Zustand store
  const restaurants = useRestaurantStore(restaurantSelectors.restaurants);
  const loading = useRestaurantStore(restaurantSelectors.loading);
  const loadingMore = useRestaurantStore(restaurantSelectors.loadingMore);
  const hasMore = useRestaurantStore(restaurantSelectors.hasMore);
  const error = useRestaurantStore(restaurantSelectors.error);
  const initialized = useRestaurantStore(restaurantSelectors.initialized);
  const currentSearchParams = useRestaurantStore(restaurantSelectors.searchParams);

  const {
    loadMoreRestaurants,
    refreshRestaurants,
    searchRestaurants,
    clearError,
  } = useRestaurantStore();

  // 当搜索参数变化时，重新获取数据
  useEffect(() => {
    const paramsChanged = JSON.stringify(searchParams) !== JSON.stringify(currentSearchParams);
    if (paramsChanged && initialized) {
      console.log('InfiniteRestaurantList: search params changed, fetching new data');
      searchRestaurants(searchParams);
    }
  }, [searchParams, currentSearchParams, initialized]);

  // 加载更多函数
  const loadMore = async () => {
    if (!loadingMore && hasMore) {
      await loadMoreRestaurants();
    }
  };

  // 重新加载函数
  const reload = async () => {
    clearError();
    await refreshRestaurants();
  };

  // 准备虚拟列表数据
  const listData = useMemo(() => {
    const items = [...restaurants];

    // 如果正在加载更多，添加加载项
    if (loadingMore) {
      items.push({
        id: "loading-more",
        name: "",
        address: "",
        longitude: 0,
        latitude: 0,
        creator: "",
        create_time: "",
        isLoading: true,
      } as Restaurant & { isLoading: boolean });
    }

    // 如果没有更多数据且有数据，添加结束提示
    if (!hasMore && restaurants.length > 0) {
      items.push({
        id: "no-more",
        name: "",
        address: "",
        longitude: 0,
        latitude: 0,
        creator: "",
        create_time: "",
        isNoMore: true,
      } as Restaurant & { isNoMore: boolean });
    }

    return items;
  }, [restaurants, loadingMore, hasMore]);

  // 渲染单个列表项
  const renderItem = (
    item: Restaurant & { isLoading?: boolean; isNoMore?: boolean }
  ) => {
    // 加载更多指示器
    if ((item as any).isLoading) {
      return (
        <div
          style={{
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <Spin size="small" />
          <span style={{ marginLeft: "8px", color: "#8c8c8c" }}>
            加载更多...
          </span>
        </div>
      );
    }

    // 没有更多数据提示
    if ((item as any).isNoMore) {
      return (
        <div
          style={{
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            color: "#8c8c8c",
            fontSize: "14px",
          }}
        >
          <Divider>已显示全部餐厅</Divider>
        </div>
      );
    }

    // 餐厅卡片
    return (
      <div style={{ padding: "0 16px", marginBottom: "12px" }}>
        <MobileRestaurantCard
          restaurant={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onLocate={onLocate}
        />
      </div>
    );
  };

  // 初始加载状态
  if (loading && restaurants.length === 0) {
    return (
      <div className={`loading-container ${className || ""}`}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            height: height,
          }}
        >
          <Spin size="large" />
          <p style={{ marginTop: "16px", color: "#8c8c8c" }}>加载中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error && restaurants.length === 0) {
    return (
      <div className={`error-container ${className || ""}`}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            height: height,
          }}
        >
          <Empty description="加载失败" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={reload}
            style={{ marginTop: "16px" }}
          >
            重新加载
          </Button>
        </div>
      </div>
    );
  }

  // 空状态
  if (!loading && restaurants.length === 0) {
    return (
      <div className={`empty-container ${className || ""}`}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            height: height,
          }}
        >
          <Empty
            description="暂无餐厅数据"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={reload}
            style={{ marginTop: "16px" }}
          >
            重新加载
          </Button>
        </div>
      </div>
    );
  }



  return (
    <div
      style={{
        height: "100%",
      }}
      className={`infinite-restaurant-list ${className || ""}`}
    >
      <VList
      ref={containerRef}
        count={listData.length}
        onScroll={(offset) => {

          if ((offset + (containerRef.current?.viewportSize ?? 0) > 151 * (listData.length - 2)) && !loadingMore && hasMore) {
            loadMore();
          }
        }}
        style={{
          padding: "16px 0",
          height: '100%',
        }}
      >
        {(index) => renderItem(listData[index])}
      </VList>
    </div>
  );
};

export default InfiniteRestaurantList;
