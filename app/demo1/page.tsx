'use client';

import { useState, useEffect } from 'react';
import ThreeJSViewer from '../demo2/components/ThreeJSViewer';
import { AirQualityStats, SafetyAlerts, EnvironmentMonitor } from './components/AirQualityComponents';
import { RealTimeChart, HistoryChart } from './components/AirQualityCharts';
import { MonitoringMatrix } from './components/MonitoringMatrix';

export default function Demo1() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
      setCurrentDate(`${year}-${month}-${day}`);
    };

    // 立即执行一次
    updateDateTime();
    
    // 设置定时器
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container air-quality-dashboard">
      {/* 头部 */}
      <header className="dashboard-header">
        <h3 className="header-title">有限空间空气质量监测系统</h3>
        <div className="header-info header-info-l">
          <span className="time-display">{currentTime}</span>
          <span className="date-display">{currentDate}</span>
        </div>
        <div className="header-info header-info-r">
          <span className="weather-info">监测状态：正常</span>
          <span className="location-info">传感器在线：24/24</span>
        </div>
      </header>

      {/* 底部 */}
      <footer className="dashboard-footer"></footer>

      {/* 主要内容区域 */}
      <div className="dashboard-content">
        <div className="air-quality-layout">
          {/* 左侧列 */}
          <div className="air-quality-column left-column">
            {/* 空气质量统计 */}
            <div className="air-quality-panel">
              <AirQualityStats />
            </div>
            
            {/* 安全预警 */}
            <div className="air-quality-panel">
              <SafetyAlerts />
            </div>
            
            {/* 环境监测 */}
            <div className="air-quality-panel">
              <EnvironmentMonitor />
            </div>
          </div>

          {/* 中间区域 - 3D模型 + 实时图表 */}
          <div className="air-quality-column center-column">
            {/* 3D模型展示 */}
            <div className="air-quality-3d-container">
              <div className="air-quality-3d-content">
                <ThreeJSViewer />
              </div>
              
              {/* 底部状态指示 */}
              <div className="air-quality-status">
                <div className="status-item safe">
                  <div className="status-dot"></div>
                  <span>安全区域</span>
                </div>
                <div className="status-item warning">
                  <div className="status-dot"></div>
                  <span>警告区域</span>
                </div>
                <div className="status-item danger">
                  <div className="status-dot"></div>
                  <span>危险区域</span>
                </div>
              </div>
            </div>
            
            {/* 实时数据图表 */}
            <div className="air-quality-panel" style={{ height: '40%' }}>
              <h3 className="chart-title">实时气体浓度监测</h3>
              <div className="chart-div" style={{ flex: 1 }}>
                <RealTimeChart />
              </div>
            </div>
          </div>

          {/* 右侧列 */}
          <div className="air-quality-column right-column">
            {/* 历史数据分析 */}
            <div className="air-quality-panel" style={{ height: '50%' }}>
              <h3 className="chart-title">24小时历史数据</h3>
              <div className="chart-div" style={{ flex: 1 }}>
                <HistoryChart />
              </div>
            </div>
            
            {/* 监测点矩阵 */}
            <div className="air-quality-panel" style={{ height: '50%' }}>
              <MonitoringMatrix />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 