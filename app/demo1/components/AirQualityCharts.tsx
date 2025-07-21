'use client';

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

// 实时气体浓度监测图表
// 删除整个 RealTimeChart 组件
// 从第7行到第268行的 RealTimeChart 函数定义

// 24小时历史数据图表（美化版）
export function HistoryChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const peakDataRef = useRef<HTMLDivElement>(null);
  const [historyData, setHistoryData] = useState({
    hours: [] as string[],
    avgMethane: [] as number[],
    avgH2s: [] as number[],
    avgOxygen: [] as number[],
    maxMethane: [] as number[],
    maxH2s: [] as number[],
    maxOxygen: [] as number[],
    coData: [] as number[],
    maxCo: [] as number[],
    co2Data: [] as number[],
    maxCo2: [] as number[]
  });

  // 获取最新的峰值数据
  const getLatestPeakValues = () => {
    if (historyData.hours.length === 0) return null;

    // 使用实际的平均值数据计算峰值
    return {
      methane: {
        peak: Math.max(...historyData.avgMethane)  // 使用avgMethane
      },
      h2s: {
        peak: Math.max(...historyData.avgH2s)  // 使用avgH2s
      },
      oxygen: {
        peak: Math.max(...historyData.avgOxygen)  // 使用avgOxygen
      },
      co: {
        peak: Math.max(...historyData.coData)  // 使用coData
      },
      co2: {
        peak: Math.max(...historyData.co2Data)  // 使用co2Data
      }
    };
  };

  useEffect(() => {
    // 生成24小时的历史数据
    const hours: string[] = [];
    const avgMethane: number[] = [];
    const avgH2s: number[] = [];
    const avgOxygen: number[] = [];
    const maxMethane: number[] = [];
    const maxH2s: number[] = [];
    const maxOxygen: number[] = [];
    const coData: number[] = [];
    const maxCo: number[] = [];
    const co2Data: number[] = [];
    const maxCo2: number[] = [];
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(Date.now() - i * 60 * 60 * 1000).getHours();
      hours.push(`${hour.toString().padStart(2, '0')}:00`);
      
      // 生成模拟的历史数据
      const baseMethane = 1.8 + Math.random() * 0.8;
      const baseH2s = 0.02 + Math.random() * 0.06;
      const baseOxygen = 20.2 + Math.random() * 0.6;
      const baseCo = 5 + Math.random() * 10;
      const baseCo2 = 400 + Math.random() * 200;
      
      avgMethane.push(Number(baseMethane.toFixed(2)));
      avgH2s.push(Number(baseH2s.toFixed(3)));
      avgOxygen.push(Number(baseOxygen.toFixed(1)));
      coData.push(Number(baseCo.toFixed(1)));
      co2Data.push(Number(baseCo2.toFixed(0)));
    }
    
    setHistoryData({
      hours,
      avgMethane,
      avgH2s,
      avgOxygen,
      maxMethane,  // 这些数组是空的
      maxH2s,      // 这些数组是空的
      maxOxygen,   // 这些数组是空的
      coData,
      maxCo,       // 这些数组是空的
      co2Data,
      maxCo2       // 这些数组是空的
    });
  }, []);

  useEffect(() => {
    if (!chartRef.current || historyData.hours.length === 0) return;

    const timer = setTimeout(() => {
      const container = chartRef.current;
      if (!container) return;

      const chart = echarts.init(container);
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#777',
          borderWidth: 1,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          data: ['甲烷', '硫化氢', '氧气', '一氧化碳', '二氧化碳'],
          top: -5,
          left: 'center',
          textStyle: {
            color: '#b0c2f9',
            fontSize: 11
          },
          itemWidth: 12,
          itemHeight: 8,
          itemGap: 0  // 增加间距
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '40px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: historyData.hours,
          axisLine: {
            lineStyle: { 
              color: '#b0c2f9',
              width: 1
            }
          },
          axisLabel: {
            color: '#b0c2f9',
            fontSize: 10,
            interval: 2  // 每隔2个显示一个标签
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(176, 194, 249, 0.1)',
              type: 'dashed'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '浓度 (ppm)',
            position: 'left',
            axisLine: {
              lineStyle: { 
                color: '#feca57',
                width: 1
              }
            },
            axisLabel: {
              color: '#feca57',
              fontSize: 10
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(176, 194, 249, 0.1)',
                type: 'dashed'
              }
            },
            nameTextStyle: {
              color: '#feca57',
              fontSize: 11,
              padding: [0, 0, 0, -10]  // 调整名称位置
            }
          },
          {
            type: 'value',
            name: '浓度 (%)',
            position: 'right',
            axisLine: {
              lineStyle: { 
                color: '#45b7d1',
                width: 1
              }
            },
            axisLabel: {
              color: '#45b7d1',
              fontSize: 10
            },
            splitLine: { show: false },
            nameTextStyle: {
              color: '#45b7d1',
              fontSize: 11,
              padding: [0, -10, 0, 0]  // 调整名称位置
            }
          }
        ],
        series: [
          {
            name: '甲烷',
            type: 'line',
            data: historyData.avgMethane,
            smooth: true,
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: {
              width: 2,
              color: '#feca57'
            },
            itemStyle: { 
              color: '#feca57',
              borderColor: '#fff',
              borderWidth: 1
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(254, 202, 87, 0.2)' },
                { offset: 1, color: 'rgba(254, 202, 87, 0.05)' }
              ])
            }
          },
          {
            name: '硫化氢',
            type: 'line',
            data: historyData.avgH2s,
            smooth: true,
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: {
              width: 2,
              color: '#ff9ff3'
            },
            itemStyle: { color: '#ff9ff3' }
          },
          {
            name: '氧气',
            type: 'line',
            yAxisIndex: 1,
            data: historyData.avgOxygen,
            smooth: true,
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: {
              width: 2,
              color: '#45b7d1'
            },
            itemStyle: { color: '#45b7d1' }
          },
          {
            name: '一氧化碳',
            type: 'line',
            data: historyData.coData,
            smooth: true,
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: {
              width: 2,
              color: '#fd79a8'
            },
            itemStyle: { color: '#fd79a8' }
          },
          {
            name: '二氧化碳',
            type: 'line',
            data: historyData.co2Data,
            smooth: true,
            symbol: 'circle',
            symbolSize: 4,
            lineStyle: {
              width: 2,
              color: '#a29bfe'
            },
            itemStyle: { color: '#a29bfe' }
          }
        ]
      };

      chart.setOption(option);

      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [historyData]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 折线图 */}
      <div ref={chartRef} style={{ 
        height: 'calc(100% - 65px)',
        marginBottom: '15px',  // 增加与峰值的间距
        paddingTop: '25px'
      }} />

      {/* 峰值数据展示 */}
      {getLatestPeakValues() && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          height: '70px',  // 增加整体高度
          marginTop: '5px'
        }}>
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '4px',
            padding: '8px 12px',
            transform: 'scale(0.82)',  // 缩小比例
            transformOrigin: 'center top',
            border: '1px solid rgba(176, 194, 249, 0.2)',
            boxShadow: '0 0 4px rgba(176, 194, 249, 0.1)',
            position: 'relative',
            bottom: '10px',
            display: 'flex',
            flexDirection: 'column',  // 改为纵向排列
            alignItems: 'flex-start', // 左对齐
            width: 'auto',
            whiteSpace: 'nowrap',
            maxWidth: '600px'  // 限制最大宽度
          }}>
            <div style={{ 
              fontSize: '13px',
              color: '#94a3b8',
              marginBottom: '8px',  // 添加底部间距
              fontWeight: '500',
              paddingLeft: '4px'    // 稍微缩进
            }}>
              气体峰值
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row',
              gap: '12px',  // 减小间距
              flexWrap: 'nowrap',
              justifyContent: 'center',
              lineHeight: '1',
              minWidth: 'fit-content',
              width: '100%'  // 确保数据占满宽度
            }}>
              {Object.entries(getLatestPeakValues()!).map(([key, data]) => (
                <div key={key} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '0 4px'  // 减小内边距
                }}>
                  <span style={{
                    fontSize: '10px',
                    color: '#f8fafc',
                    lineHeight: '1.2'
                  }}>
                    {key === 'methane' ? '甲烷' :
                     key === 'h2s' ? '硫化氢' :
                     key === 'oxygen' ? '氧气' :
                     key === 'co' ? '一氧化碳' : '二氧化碳'}
                  </span>
                  <span style={{ 
                    fontSize: '11px',
                    color: '#fbbf24',
                    fontWeight: '500',
                    lineHeight: '1.2'
                  }}>
                    {data.peak}{key === 'oxygen' ? '%' : 'ppm'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 在文件末尾添加预测图表组件
// 气体预测图表组件
export function PredictionChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [predictionData, setPredictionData] = useState({
    times: [] as string[],
    methanePredict: [] as number[],
    h2sPredict: [] as number[],
    oxygenPredict: [] as number[],
    actualData: [] as any[]
  });

  // Generate data when component mounts
  useEffect(() => {
    // 生成模拟数据
    const now = new Date();
    const times = [];
    const methanePredict = [];
    const h2sPredict = [];
    const oxygenPredict = [];
    const actualData = [];

    // 生成过去30分钟的历史数据（每5分钟一个点）
    for (let i = 6; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5 * 60 * 1000);
      times.push(time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
      
      actualData.push({
        time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        methane: Number((1.8 + Math.random() * 0.5).toFixed(2)),
        h2s: Number((0.02 + Math.random() * 0.04).toFixed(3)),
        oxygen: Number((20.5 + Math.random() * 0.3).toFixed(1))
      });
    }

    // 生成未来30分钟的预测数据（每5分钟一个点）
    for (let i = 1; i <= 6; i++) {
      const time = new Date(now.getTime() + i * 5 * 60 * 1000);
      times.push(time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    }

    // 基于最后一个实际数据生成预测数据
    const lastActual = actualData[actualData.length - 1];
    for (let i = 0; i < 6; i++) {
      const trendFactor = Math.sin(i * 0.5) * 0.1;
      
      methanePredict.push(Number((lastActual.methane + trendFactor + (Math.random() - 0.5) * 0.2).toFixed(2)));
      h2sPredict.push(Number((lastActual.h2s + trendFactor * 0.01 + (Math.random() - 0.5) * 0.01).toFixed(3)));
      oxygenPredict.push(Number((lastActual.oxygen - trendFactor * 0.1 + (Math.random() - 0.5) * 0.2).toFixed(1)));
    }

    setPredictionData({
      times,
      methanePredict,
      h2sPredict,
      oxygenPredict,
      actualData
    });
  }, []);

  // Initialize and update chart when data changes
  useEffect(() => {
    if (!chartRef.current || predictionData.times.length === 0) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#777',
        borderWidth: 1,
        textStyle: { color: '#fff' },
        formatter: function(params: any) {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            // 检查值是否存在且不为null
            if (param.value != null) {  // 使用 != null 同时检查 null 和 undefined
              const value = typeof param.value === 'number' ? param.value.toFixed(2) : param.value;
              const unit = param.seriesName.includes('氧气') ? '%' : 'ppm';
              result += `${param.marker}${param.seriesName}: ${value}${unit}<br/>`;
            }
          });
          return result;
        }
      },
      legend: {
        data: ['甲烷实际', '甲烷预测', '硫化氢实际', '硫化氢预测', '氧气实际', '氧气预测'],
        top: 5,
        textStyle: { color: '#b0c2f9', fontSize: 11 }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '35%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: predictionData.times,
        axisLine: { lineStyle: { color: '#b0c2f9' } },
        axisLabel: { color: '#b0c2f9', fontSize: 10 }
      },
      yAxis: [
        {
          type: 'value',
          name: '浓度 (ppm)',
          position: 'left',
          axisLine: { lineStyle: { color: '#feca57' } },
          axisLabel: { color: '#feca57', fontSize: 10 },
          splitLine: { lineStyle: { color: 'rgba(176, 194, 249, 0.1)' } }
        },
        {
          type: 'value',
          name: '浓度 (%)',
          position: 'right',
          axisLine: { lineStyle: { color: '#45b7d1' } },
          axisLabel: { color: '#45b7d1', fontSize: 10 },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: '甲烷实际',
          type: 'line',
          yAxisIndex: 0,
          data: predictionData.actualData.map(d => d.methane),
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { width: 2, color: '#feca57' },
          itemStyle: { color: '#feca57' }
        },
        {
          name: '甲烷预测',
          type: 'line',
          yAxisIndex: 0,
          data: [...Array(7).fill(null), ...predictionData.methanePredict],
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: 4,
          lineStyle: { width: 2, color: '#feca57' },
          itemStyle: { color: '#feca57' },
          connectNulls: false  // 不连接 null 值点
        },
        {
          name: '硫化氢实际',
          type: 'line',
          yAxisIndex: 0,
          data: predictionData.actualData.map(d => d.h2s),
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { width: 2, color: '#ff9ff3' },
          itemStyle: { color: '#ff9ff3' }
        },
        {
          name: '硫化氢预测',
          type: 'line',
          yAxisIndex: 0,
          data: [...Array(7).fill(null), ...predictionData.h2sPredict],
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: 4,
          lineStyle: { width: 2, color: '#ff9ff3' },
          itemStyle: { color: '#ff9ff3' },
          connectNulls: false  // 不连接 null 值点
        },
        {
          name: '氧气实际',
          type: 'line',
          yAxisIndex: 1,
          data: predictionData.actualData.map(d => d.oxygen),
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: { width: 2, color: '#45b7d1' },
          itemStyle: { color: '#45b7d1' }
        },
        {
          name: '氧气预测',
          type: 'line',
          yAxisIndex: 1,
          data: [...Array(7).fill(null), ...predictionData.oxygenPredict],
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: 4,
          lineStyle: { width: 2, color: '#45b7d1' },
          itemStyle: { color: '#45b7d1' },
          connectNulls: false  // 不连接 null 值点
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [predictionData]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
}