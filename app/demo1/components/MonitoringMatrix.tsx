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

  // ClickHouse 数据请求函数
  const fetchClickHouseData = async () => {
    try {
      console.log('🔄 开始请求 ClickHouse 数据...');
      const response = await fetch('/api/clickhouse/monitoring-points');
      
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      console.log('📊 ClickHouse 响应数据概览:', {
        success: result.success,
        timestamp: result.timestamp,
        message: result.message,
        source: result.source,
        dataCount: result.data?.length || 0,
        rows: result.rows,
        hasMetadata: !!result.meta
      });
      
      if (result.success && result.data) {
        console.log('✅ ClickHouse 数据请求成功');
        console.log('📋 数据源:', result.source);
        console.log('📏 数据行数:', result.rows);
        
        // 打印元数据信息
        if (result.meta) {
          console.log('📋 数据字段元信息:');
          console.table(result.meta);
        }
        
        // 打印完整的数据
        console.log('📊 完整数据列表:');
        console.table(result.data);
        
        // 分析并打印数据统计
        const deviceIds = [...new Set(result.data.map((item: any) => item.device_id))];
        const nodeTypes = [...new Set(result.data.map((item: any) => item.node_name).filter((name: any) => name))];
        
        console.log('📈 数据统计分析:');
        console.log(`- 设备总数: ${deviceIds.length}`);
        console.log(`- 设备ID列表: ${deviceIds.join(', ')}`);
        console.log(`- 节点类型: ${nodeTypes.join(', ')}`);
        
        // 按节点类型分组显示最新数据
        const latestByNodeType: { [key: string]: any } = {};
        result.data.forEach((item: any) => {
          if (item.node_name && (!latestByNodeType[item.node_name] || 
              new Date(item.create_time) > new Date(latestByNodeType[item.node_name].create_time))) {
            latestByNodeType[item.node_name] = item;
          }
        });
        
        console.log('🔄 各节点类型最新数据:');
        Object.entries(latestByNodeType).forEach(([nodeType, data]: [string, any]) => {
          console.log(`${nodeType}:`, {
            设备ID: data.device_id,
            温度: data.temperature,
            湿度: data.humidity,
            气体浓度: data.gas_concentration,
            记录时间: data.record_time,
            创建时间: data.create_time
          });
        });
        
      } else {
        console.error('❌ ClickHouse 数据请求失败:', result.message || result.error || 'Unknown error');
        if (result.error) {
          console.error('🔍 错误详情:', result.error);
        }
      }
    } catch (error) {
      console.error('🚨 ClickHouse 请求异常:', error instanceof Error ? error.message : error);
    }
  };

  useEffect(() => {
    // 立即执行一次数据请求
    fetchClickHouseData();
    
    // 设置定时器，每10秒请求一次ClickHouse数据
    const clickhouseInterval = setInterval(fetchClickHouseData, 10000);
    
    // 保留原有的模拟数据更新（用于UI展示）
    const simulationInterval = setInterval(() => {
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

    return () => {
      clearInterval(clickhouseInterval);
      clearInterval(simulationInterval);
    };
  }, []);

  return (
    <div className="air-quality-stats-container">
      <h3 className="chart-title">监测点矩阵</h3>
      <div className="monitoring-matrix-container" style={{
        height: 'calc(100% - 40px)',
        overflowY: 'auto',
        padding: '0 5px',
        /* 自定义滚动条样式 */
        scrollbarWidth: 'thin',
        scrollbarColor: '#4ecdc4 transparent'
      }}>
        <style jsx>{`
          .monitoring-matrix-container::-webkit-scrollbar {
            width: 6px;
          }
          .monitoring-matrix-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          .monitoring-matrix-container::-webkit-scrollbar-thumb {
            background: #4ecdc4;
            border-radius: 3px;
            transition: background 0.3s ease;
          }
          .monitoring-matrix-container::-webkit-scrollbar-thumb:hover {
            background: #45b7d1;
          }
        `}</style>
        <div className="monitoring-matrix" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          padding: '10px 5px'
        }}>
          {monitoringPoints.map((point) => (
            <div key={point.id} className="monitoring-point" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(78, 205, 196, 0.3)',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '11px',
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div className="point-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '6px'
              }}>
                <div className="point-info">
                  <div className="point-id" style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#4ecdc4',
                    marginBottom: '2px'
                  }}>{point.id}</div>
                  <div className="point-name" style={{
                    fontSize: '10px',
                    color: '#fff',
                    marginBottom: '1px'
                  }}>{point.name}</div>
                  <div className="point-location" style={{
                    fontSize: '9px',
                    color: '#999',
                    opacity: 0.8
                  }}>{point.location}</div>
                </div>
                <div className="point-status" style={{ 
                  color: getStatusColor(point.status),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontSize: '9px'
                }}>
                  {getStatusIcon(point.status)}
                  <span>{getStatusText(point.status)}</span>
                </div>
              </div>
              
              <div className="point-data" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}>
                {point.status !== 'offline' ? (
                  <>
                    <div className="data-item" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span className="data-label" style={{
                        fontSize: '9px',
                        color: '#ccc'
                      }}>甲烷</span>
                      <span className="data-value" style={{ 
                        color: point.methane > 2.5 ? '#feca57' : '#4ecdc4',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        {point.methane.toFixed(1)} ppm
                      </span>
                    </div>
                    <div className="data-item" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span className="data-label" style={{
                        fontSize: '9px',
                        color: '#ccc'
                      }}>硫化氢</span>
                      <span className="data-value" style={{ 
                        color: point.h2s > 0.05 ? '#ff9ff3' : '#4ecdc4',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        {point.h2s.toFixed(2)} ppm
                      </span>
                    </div>
                    <div className="data-item" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span className="data-label" style={{
                        fontSize: '9px',
                        color: '#ccc'
                      }}>氧气</span>
                      <span className="data-value" style={{ 
                        color: point.oxygen < 20.5 ? '#ff6b6b' : '#4ecdc4',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        {point.oxygen.toFixed(1)}%
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="offline-message" style={{
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '9px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}>
                    <span>设备离线</span>
                    <span>请检查连接</span>
                  </div>
                )}
              </div>
              
              <div className="point-footer" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '6px',
                paddingTop: '4px',
                borderTop: '1px solid rgba(78, 205, 196, 0.2)'
              }}>
                <span className="update-time" style={{
                  fontSize: '8px',
                  color: '#999'
                }}>更新: {point.lastUpdate}</span>
                <div className="signal-strength" style={{
                  display: 'flex',
                  gap: '1px',
                  alignItems: 'flex-end'
                }}>
                  <div className="signal-bar" style={{
                    width: '2px',
                    height: '4px',
                    backgroundColor: point.status === 'offline' ? '#666' : '#4ecdc4',
                    borderRadius: '1px'
                  }}></div>
                  <div className="signal-bar" style={{
                    width: '2px',
                    height: '6px',
                    backgroundColor: point.status === 'offline' ? '#666' : '#4ecdc4',
                    borderRadius: '1px'
                  }}></div>
                  <div className="signal-bar" style={{
                    width: '2px',
                    height: '8px',
                    backgroundColor: point.status === 'offline' ? '#666' : '#4ecdc4',
                    borderRadius: '1px'
                  }}></div>
                  <div className="signal-bar" style={{
                    width: '2px',
                    height: '10px',
                    backgroundColor: point.status === 'offline' ? '#666' : '#4ecdc4',
                    borderRadius: '1px'
                  }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 