'use client';

import { useState, useEffect } from 'react';
import { Play, Maximize2, RotateCcw } from 'lucide-react';

interface MonitorItem {
  id: number;
  title: string;
  location: string;
  status: 'online' | 'offline';
  thumbnail: string;
}

export function MonitorMatrix() {
  const [monitors, setMonitors] = useState<MonitorItem[]>([
    { id: 1, title: '1号厂房', location: '生产区域', status: 'online', thumbnail: '/img/monitor1.jpg' },
    { id: 2, title: '2号厂房', location: '装配区域', status: 'online', thumbnail: '/img/monitor2.jpg' },
    { id: 3, title: '3号厂房', location: '仓储区域', status: 'online', thumbnail: '/img/monitor3.jpg' },
    { id: 4, title: '4号厂房', location: '办公区域', status: 'offline', thumbnail: '/img/monitor4.jpg' }
  ]);

  return (
    <div className="factory-stats-container">
      <h3 className="chart-title">监控矩阵</h3>
      <div className="monitor-matrix">
        {monitors.map((monitor) => (
          <div key={monitor.id} className="monitor-item">
            <div className="monitor-header">
              <div className="monitor-info">
                <span className="monitor-title">{monitor.title}</span>
                <span className="monitor-location">{monitor.location}</span>
              </div>
              <div className={`monitor-status ${monitor.status}`}>
                <div className="status-dot"></div>
              </div>
            </div>
            
            <div className="monitor-screen">
              {monitor.status === 'online' ? (
                <div className="monitor-video">
                  <div className="video-placeholder">
                    <Play size={24} color="#4ecdc4" />
                    <span>实时监控</span>
                  </div>
                </div>
              ) : (
                <div className="monitor-offline">
                  <span>设备离线</span>
                </div>
              )}
              
              <div className="monitor-controls">
                <button className="control-btn">
                  <Maximize2 size={14} />
                </button>
                <button className="control-btn">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 