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
  const [monitoringStatus, setMonitoringStatus] = useState<'正常' | '异常'>('异常');  // 初始状态设为异常

  useEffect(() => {
    // 获取传感器状态
    const fetchSensorStats = async () => {
      try {
        const response = await fetch('/api/clickhouse/monitoring-points', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {  // 添加数据长度检查
          // 获取所有设备ID
          const deviceIds = [...new Set(result.data.map((item: any) => item.device_id))];
          setSensorStats({
            total: Math.max(0, deviceIds.length),
            online: deviceIds.length
          });
          setMonitoringStatus('正常');
        } else {
          console.warn('API返回数据格式不正确或无数据:', result);
          setSensorStats({ total: 0, online: 0 });
          setMonitoringStatus('异常');
        }
      } catch (error) {
        console.error('获取传感器状态失败:', error);
        setSensorStats({ total: 0, online: 0 });
        setMonitoringStatus('异常');
      }
    };

    // 立即执行一次
    fetchSensorStats();
    
    // 设置定时器定期更新
    const statsInterval = setInterval(fetchSensorStats, 10000); // 每10秒更新一次

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
        <h2 className="header-title" style={{ fontWeight: '800' }}>地下管廊有害气体监测系统</h2>
        <div className="header-info header-info-l">
          <span className="time-display">{currentTime}</span>
          <span className="date-display">{currentDate}</span>
        </div>
        <div className="header-info header-info-r">
          <span className="weather-info" style={{
            color: monitoringStatus === '异常' ? '#ff6b6b' : '#4ecdc4'
          }}>监测状态：{monitoringStatus}</span>
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
            <div className="air-quality-panel" style={{ padding: '6px' }}>
              <AirQualityStats />
            </div>
            
            {/* 环境监测 */}
            <div className="air-quality-panel" style={{ padding: '6px' }}>
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
            
            {/* 24小时历史数据 */}
            <div className="air-quality-panel" style={{ 
              height: '40%',
              padding: '6px'
            }}>
              <h3 className="chart-title">24小时历史数据</h3>
              <div className="chart-div" style={{ flex: 1 }}>
                <HistoryChart showPeakValues={false} />
              </div>
            </div>
          </div>

          {/* 右侧列 */}
          <div className="air-quality-column right-column">
            {/* 监测点矩阵 */}
            <div className="air-quality-panel" style={{ 
              height: '32%',
              padding: '6px'  // 减小内边距
            }}>
              <MonitoringMatrix />
            </div>

            {/* 气体浓度预测 */}
            <div className="air-quality-panel" style={{ 
              height: '38%',
              padding: '6px'  // 保持一致的内边距
            }}>
              <h3 className="chart-title">气体浓度预测</h3>
              <div className="chart-div" style={{ flex: 1 }}>
                <PredictionChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}