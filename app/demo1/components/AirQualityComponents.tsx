'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Thermometer, Droplets, Wind, Flame, Skull, CloudSnow } from 'lucide-react';

// 空气质量统计组件
export function AirQualityStats() {
  const [stats, setStats] = useState({
    totalSensors: 24,
    onlineSensors: 24,
    alertCount: 2,
    safetyLevel: '良好'
  });

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

// 安全预警组件
export function SafetyAlerts() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: '甲烷浓度', level: 'warning', value: '2.8 ppm', time: '14:32', location: 'A区-3号点' },
    { id: 2, type: '氧气浓度', level: 'info', value: '19.2%', time: '14:28', location: 'B区-1号点' },
    { id: 3, type: '硫化氢', level: 'normal', value: '0.03 ppm', time: '14:25', location: 'C区-2号点' }
  ]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'warning': return '#feca57';
      case 'danger': return '#ff6b6b';
      case 'info': return '#45b7d1';
      default: return '#4ecdc4';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'warning': return <AlertTriangle size={16} />;
      case 'danger': return <AlertTriangle size={16} />;
      default: return <CheckCircle size={16} />;
    }
  };

  return (
    <div className="air-quality-stats-container">
      <h3 className="chart-title">安全预警</h3>
      <div className="alerts-content">
        {alerts.map((alert) => (
          <div key={alert.id} className="alert-item">
            <div className="alert-icon" style={{ color: getLevelColor(alert.level) }}>
              {getLevelIcon(alert.level)}
            </div>
            <div className="alert-info">
              <div className="alert-header">
                <span className="alert-type">{alert.type}</span>
                <span className="alert-time">{alert.time}</span>
              </div>
              <div className="alert-details">
                <span className="alert-value">{alert.value}</span>
                <span className="alert-location">{alert.location}</span>
              </div>
            </div>
          </div>
        ))}
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