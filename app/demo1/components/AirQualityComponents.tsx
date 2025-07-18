'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Thermometer, Droplets, Wind, Flame, Skull, CloudSnow } from 'lucide-react';

// 空气质量统计组件
export function AirQualityStats() {
  const [stats, setStats] = useState({
    totalSensors: 0,
    onlineSensors: 0,
    alertCount: 0,
    safetyLevel: '未知'
  });

  // 获取监测点数据
  const fetchMonitoringData = async () => {
    try {
      const response = await fetch('/api/clickhouse/monitoring-points');
      const result = await response.json();
      
      if (result.success && result.data) {
        // 统计设备数量
        const deviceIds = [...new Set(result.data.map((item: any) => item.device_id))];
        const totalDevices = deviceIds.length;
        
        // 统计在线设备数（有任意数据的设备视为在线）
        const onlineDevices = deviceIds.filter(deviceId => {
          const deviceData = result.data.find((item: any) => item.device_id === deviceId);
          return deviceData && (
            deviceData.temperature || 
            deviceData.humidity || 
            deviceData.oxygen || 
            deviceData.h2s || 
            deviceData.co2 || 
            deviceData.co || 
            deviceData.methane
          );
        }).length;
        
        // 统计告警数量（任意气体超标）
        const alerts = result.data.filter((item: any) => (
          (item.methane > 2.5) || 
          (item.h2s > 0.05) || 
          (item.oxygen < 20.0) || 
          (item.co2 > 1000) || 
          (item.co > 50)
        )).length;
        
        // 更新状态
        setStats({
          totalSensors: totalDevices,
          onlineSensors: onlineDevices,
          alertCount: alerts,
          safetyLevel: alerts > 0 ? '异常' : '良好'
        });
      }
    } catch (error) {
      console.error('获取监测点数据失败:', error);
    }
  };

  useEffect(() => {
    // 立即执行一次
    fetchMonitoringData();
    
    // 每10秒更新一次
    const interval = setInterval(fetchMonitoringData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="air-quality-stats-container">
      <h3 className="chart-title">空气质量统计</h3>
      <div className="stats-content">
        <div className="stat-item main-stat">
          <div className="stat-icon">
            <Wind size={32} color="#4ecdc4" />
          </div>
          <div className="stat-info">
            <div className="stat-label">当前安全等级</div>
            <div className="stat-label-en">SAFETY LEVEL</div>
            <div className="stat-value">{stats.safetyLevel}</div>
          </div>
        </div>
        
        <div className="stat-row">
          <div className="stat-item small-stat">
            <div className="stat-icon-small">
              <CheckCircle size={24} color="#4ecdc4" />
            </div>
            <div className="stat-info-small">
              <div className="stat-label-small">在线传感器</div>
              <div className="stat-value-small">{stats.onlineSensors}/{stats.totalSensors}</div>
            </div>
          </div>
          
          <div className="stat-item small-stat">
            <div className="stat-icon-small">
              <AlertTriangle size={24} color="#feca57" />
            </div>
            <div className="stat-info-small">
              <div className="stat-label-small">预警数量</div>
              <div className="stat-value-small">{stats.alertCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// 环境监测组件
export function EnvironmentMonitor() {
  const [envData, setEnvData] = useState({
    temperature: 23.5,
    humidity: 65.2,
    pressure: 1013.2,
    airFlow: 2.3
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setEnvData({
        temperature: 23.5 + (Math.random() - 0.5) * 2,
        humidity: 65.2 + (Math.random() - 0.5) * 10,
        pressure: 1013.2 + (Math.random() - 0.5) * 5,
        airFlow: 2.3 + (Math.random() - 0.5) * 0.5
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="air-quality-stats-container">
      <h3 className="chart-title">环境监测</h3>
      <div className="env-monitor-grid">
        <div className="env-item">
          <div className="env-icon">
            <Thermometer size={20} color="#ff6b6b" />
          </div>
          <div className="env-info">
            <div className="env-label">温度</div>
            <div className="env-value">{envData.temperature.toFixed(1)}°C</div>
          </div>
        </div>
        
        <div className="env-item">
          <div className="env-icon">
            <Droplets size={20} color="#4ecdc4" />
          </div>
          <div className="env-info">
            <div className="env-label">湿度</div>
            <div className="env-value">{envData.humidity.toFixed(1)}%</div>
          </div>
        </div>
        
        <div className="env-item">
          <div className="env-icon">
            <CloudSnow size={20} color="#96ceb4" />
          </div>
          <div className="env-info">
            <div className="env-label">气压</div>
            <div className="env-value">{envData.pressure.toFixed(1)} hPa</div>
          </div>
        </div>
        
        <div className="env-item">
          <div className="env-icon">
            <Wind size={20} color="#45b7d1" />
          </div>
          <div className="env-info">
            <div className="env-label">风速</div>
            <div className="env-value">{envData.airFlow.toFixed(1)} m/s</div>
          </div>
        </div>
      </div>
    </div>
  );
} 