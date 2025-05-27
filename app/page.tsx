'use client';

import { useState, useEffect } from 'react';
import ThreeJSViewer from './components/ThreeJSViewer';
import DataDisplay from './components/DataDisplay';
import { TrendChart, LevelChart } from './components/Charts';

export default function Home() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      setCurrentDate(`${year}年${month}月${day}日`);
    };

    updateDate();
    const interval = setInterval(updateDate, 60000); // 每分钟更新一次

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      {/* 头部 */}
      <header className="dashboard-header">
        <h3 className="header-title">有限空间空气质量监测</h3>
        <div className="header-info header-info-l">数据来源：环境监测传感器</div>
        <div className="header-info header-info-r">监测时间：<span>{currentDate}</span></div>
      </header>

      {/* 底部 */}
      <footer className="dashboard-footer"></footer>

      {/* 主要内容区域 */}
      <div className="dashboard-content">
        <div className="flex-container">
          {/* 第一行 */}
          <div className="flex-row">
            {/* 左侧和中间：3D模型展示 */}
            <div className="flex-cell flex-cell-lc">
              <div className="chart-wrapper">
                <h3 className="chart-title">3D模型展示</h3>
                <div className="chart-div">
                  <ThreeJSViewer />
                </div>
              </div>
            </div>

            {/* 右侧：实时监测数据 */}
            <div className="flex-cell flex-cell-r">
              <div className="chart-wrapper">
                <h3 className="chart-title">实时监测数据</h3>
                <div className="chart-div">
                  <DataDisplay />
                </div>
              </div>
            </div>
          </div>

          {/* 第二行 */}
          <div className="flex-row">
            {/* 左侧：危险气体监测 */}
            <div className="flex-cell flex-cell-lc" style={{paddingBottom: 0}}>
              <div className="chart-wrapper">
                <h3 className="chart-title">危险气体监测（最近30分钟）</h3>
                <div className="chart-div">
                  <TrendChart />
                </div>
              </div>
            </div>

            {/* 右侧：空气质量等级分布 */}
            <div className="flex-cell flex-cell-r" style={{paddingBottom: 0}}>
              <div className="chart-wrapper">
                <h3 className="chart-title">空气质量等级分布（近12小时）</h3>
                <div className="chart-div">
                  <LevelChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
