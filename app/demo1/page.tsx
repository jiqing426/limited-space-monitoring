'use client';

import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import ThreeJSViewer from '../demo2/components/ThreeJSViewer';
import { AirQualityStats, EnvironmentMonitor } from './components/AirQualityComponents';
import { HistoryChart, PredictionChart } from './components/AirQualityCharts';
import { MonitoringMatrix } from './components/MonitoringMatrix';

export default function Demo1(): ReactElement {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showVideo, setShowVideo] = useState(true);
  const [has3DLoaded, setHas3DLoaded] = useState(false);
  const [sensorStats, setSensorStats] = useState({ total: 0, online: 0 });

  useEffect(() => {
    // 获取传感器状态
    const fetchSensorStats = async () => {
      try {
        const response = await fetch('/api/clickhouse/monitoring-points');
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          // 获取所有设备ID
          const deviceIds = [...new Set(result.data.map((item: any) => item.device_id))];
          setSensorStats({
            total: deviceIds.length,
            online: deviceIds.length
          });
        }
      } catch (error) {
        console.error('获取传感器状态失败:', error);
      }
    };

    // 立即执行一次
    fetchSensorStats();
    
    // 设置定时器定期更新
    const statsInterval = setInterval(fetchSensorStats, 30000); // 每30秒更新一次

    return () => clearInterval(statsInterval);
  }, []);

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
        <h4 className="header-title">地下管廊有害气体监测系统</h4>
        <div className="header-info header-info-l">
          <span className="time-display">{currentTime}</span>
          <span className="date-display">{currentDate}</span>
        </div>
        <div className="header-info header-info-r">
          <span className="weather-info">监测状态：正常</span>
          <span className="location-info">传感器在线：{sensorStats.online}/{sensorStats.total}</span>
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
            
            {/* 环境监测 */}
            <div className="air-quality-panel">
              <EnvironmentMonitor />
            </div>
          </div>

          {/* 中间区域 - 3D模型 + 实时图表 */}
          <div className="air-quality-column center-column">
            {/* 3D模型展示 */}
            <div className="air-quality-3d-container">
              {/* 切换按钮 */}
              <div className="view-toggle-controls">
                <button 
                  className={`toggle-btn ${showVideo ? 'active' : ''}`}
                  onClick={() => setShowVideo(true)}
                >
                  介绍视频
                </button>
                <button 
                  className={`toggle-btn ${!showVideo ? 'active' : ''}`}
                  onClick={() => {
                    setShowVideo(false);
                    setHas3DLoaded(true);
                  }}
                >
                  3D模型
                </button>
              </div>

              <div className="air-quality-3d-content">
                {showVideo ? (
                  <div className="video-container">
                    <video
                      controls
                      autoPlay
                      muted
                      loop
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    >
                      <source src="/intro.mp4" type="video/mp4" />
                      您的浏览器不支持视频播放。
                    </video>
                  </div>
                ) : (
                  <div className="threejs-lazy-container">
                    {has3DLoaded ? (
                      <ThreeJSViewer />
                    ) : (
                      <div className="loading-placeholder">
                        <div className="loading-spinner"></div>
                        <p>正在加载3D模型...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* 监测点矩阵 */}
            <div className="air-quality-panel" style={{ height: '40%' }}>
              <MonitoringMatrix />
            </div>
          </div>

          {/* 右侧列 */}
          <div className="air-quality-column right-column">
            {/* 气体预测 - 现在放在上面 */}
            <div className="air-quality-panel" style={{ height: '32%' }}> {/* 减小高度 */}
              <h3 className="chart-title">气体浓度预测</h3>
              <div className="chart-div" style={{ flex: 1, marginTop: '5px' }}> {/* 添加上边距，避免与按钮重叠 */}
                <PredictionChart />
              </div>
            </div>
            
            {/* 历史数据分析 - 现在放在下面 */}
            <div className="air-quality-panel" style={{ height: '38%' }}> {/* 增加高度 */}
              <h3 className="chart-title">24小时历史数据</h3>
              <div className="chart-div" style={{ flex: 1 }}>
                <HistoryChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}