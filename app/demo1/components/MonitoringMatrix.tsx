'use client';

import { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface MonitoringPoint {
  id: string;
  name: string;
  location: string;
  status: 'normal' | 'warning' | 'danger' | 'offline';
  methane: number;
  h2s: number;
  oxygen: number;
  lastUpdate: string;
}

export function MonitoringMatrix() {
  const [monitoringPoints, setMonitoringPoints] = useState<MonitoringPoint[]>([
    { id: 'A01', name: 'A区-1号点', location: '入口通道', status: 'normal', methane: 1.8, h2s: 0.02, oxygen: 20.9, lastUpdate: '14:35' },
    { id: 'A02', name: 'A区-2号点', location: '主作业区', status: 'normal', methane: 2.1, h2s: 0.03, oxygen: 20.8, lastUpdate: '14:35' },
    { id: 'A03', name: 'A区-3号点', location: '深度作业区', status: 'warning', methane: 2.8, h2s: 0.05, oxygen: 20.2, lastUpdate: '14:34' },
    { id: 'B01', name: 'B区-1号点', location: '通风口', status: 'normal', methane: 1.5, h2s: 0.01, oxygen: 20.9, lastUpdate: '14:35' },
    { id: 'B02', name: 'B区-2号点', location: '储存区域', status: 'normal', methane: 1.9, h2s: 0.02, oxygen: 20.7, lastUpdate: '14:35' },
    { id: 'C01', name: 'C区-1号点', location: '排水区域', status: 'offline', methane: 0, h2s: 0, oxygen: 0, lastUpdate: '14:20' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#4ecdc4';
      case 'warning': return '#feca57';
      case 'danger': return '#ff6b6b';
      case 'offline': return '#666';
      default: return '#4ecdc4';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'danger': return <AlertTriangle size={16} />;
      case 'offline': return <XCircle size={16} />;
      default: return <CheckCircle size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '正常';
      case 'warning': return '警告';
      case 'danger': return '危险';
      case 'offline': return '离线';
      default: return '正常';
    }
  };

  useEffect(() => {
    // 模拟数据更新
    const interval = setInterval(() => {
      setMonitoringPoints(prev => prev.map(point => {
        if (point.status === 'offline') return point;
        
        return {
          ...point,
          methane: Math.max(1.0, Math.min(3.5, point.methane + (Math.random() - 0.5) * 0.2)),
          h2s: Math.max(0.01, Math.min(0.1, point.h2s + (Math.random() - 0.5) * 0.01)),
          oxygen: Math.max(19.0, Math.min(21.0, point.oxygen + (Math.random() - 0.5) * 0.1)),
          lastUpdate: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="air-quality-stats-container">
      <h3 className="chart-title">监测点矩阵</h3>
      <div className="monitoring-matrix">
        {monitoringPoints.map((point) => (
          <div key={point.id} className="monitoring-point">
            <div className="point-header">
              <div className="point-info">
                <div className="point-id">{point.id}</div>
                <div className="point-name">{point.name}</div>
                <div className="point-location">{point.location}</div>
              </div>
              <div className="point-status" style={{ color: getStatusColor(point.status) }}>
                {getStatusIcon(point.status)}
                <span>{getStatusText(point.status)}</span>
              </div>
            </div>
            
            <div className="point-data">
              {point.status !== 'offline' ? (
                <>
                  <div className="data-item">
                    <span className="data-label">甲烷</span>
                    <span className="data-value" style={{ color: point.methane > 2.5 ? '#feca57' : '#4ecdc4' }}>
                      {point.methane.toFixed(1)} ppm
                    </span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">硫化氢</span>
                    <span className="data-value" style={{ color: point.h2s > 0.05 ? '#ff9ff3' : '#4ecdc4' }}>
                      {point.h2s.toFixed(2)} ppm
                    </span>
                  </div>
                  <div className="data-item">
                    <span className="data-label">氧气</span>
                    <span className="data-value" style={{ color: point.oxygen < 20.5 ? '#ff6b6b' : '#4ecdc4' }}>
                      {point.oxygen.toFixed(1)}%
                    </span>
                  </div>
                </>
              ) : (
                <div className="offline-message">
                  <span>设备离线</span>
                  <span>请检查连接</span>
                </div>
              )}
            </div>
            
            <div className="point-footer">
              <span className="update-time">更新: {point.lastUpdate}</span>
              <div className="signal-strength">
                <div className="signal-bar"></div>
                <div className="signal-bar"></div>
                <div className="signal-bar"></div>
                <div className="signal-bar"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 