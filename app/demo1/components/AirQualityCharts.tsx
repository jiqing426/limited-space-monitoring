'use client';

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

// 实时气体浓度监测图表
export function RealTimeChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState({
    timeLabels: [] as string[],
    methaneData: [] as number[],
    h2sData: [] as number[],
    oxygenData: [] as number[]
  });

  // 生成时间标签（最近1小时，每2分钟一个点）
  const generateTimeLabels = () => {
    const labels = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2 * 60 * 1000); // 每2分钟一个点
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      labels.push(`${hours}:${minutes}`);
    }
    
    return labels;
  };

  // 生成模拟数据
  const generateData = () => {
    const methaneData = [];
    const h2sData = [];
    const oxygenData = [];
    
    // 基础值
    let methaneBase = 2.1;
    let h2sBase = 0.05;
    let oxygenBase = 20.8;
    
    for (let i = 0; i < 30; i++) {
      // 甲烷数据：1.5-3.0 ppm 范围
      methaneBase += (Math.random() - 0.5) * 0.1;
      methaneBase = Math.max(1.5, Math.min(3.0, methaneBase));
      methaneData.push(Number(methaneBase.toFixed(2)));
      
      // 硫化氢数据：0.01-0.1 ppm 范围
      h2sBase += (Math.random() - 0.5) * 0.005;
      h2sBase = Math.max(0.01, Math.min(0.1, h2sBase));
      h2sData.push(Number(h2sBase.toFixed(3)));
      
      // 氧气数据：19.5-21.0% 范围
      oxygenBase += (Math.random() - 0.5) * 0.1;
      oxygenBase = Math.max(19.5, Math.min(21.0, oxygenBase));
      oxygenData.push(Number(oxygenBase.toFixed(1)));
    }
    
    return { methaneData, h2sData, oxygenData };
  };

  useEffect(() => {
    // 初始化数据
    const timeLabels = generateTimeLabels();
    const { methaneData, h2sData, oxygenData } = generateData();
    
    setChartData({
      timeLabels,
      methaneData,
      h2sData,
      oxygenData
    });

    // 每2分钟更新一次数据
    const interval = setInterval(() => {
      const newTimeLabels = generateTimeLabels();
      const { methaneData: newMethaneData, h2sData: newH2sData, oxygenData: newOxygenData } = generateData();
      
      setChartData({
        timeLabels: newTimeLabels,
        methaneData: newMethaneData,
        h2sData: newH2sData,
        oxygenData: newOxygenData
      });
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!chartRef.current || chartData.timeLabels.length === 0) return;

    // 延迟初始化，确保DOM完全渲染
    const timer = setTimeout(() => {
      const container = chartRef.current;
      if (!container) return;

      // 确保容器有尺寸
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        console.warn('Chart container has no size');
        return;
      }

      const chart = echarts.init(container);
      
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          formatter: function(params: any) {
            let result = `时间: ${params[0].axisValue}<br/>`;
            params.forEach((param: any) => {
              let unit = 'ppm';
              if (param.seriesName === '氧气浓度') unit = '%';
              result += `${param.marker}${param.seriesName}: ${param.value} ${unit}<br/>`;
            });
            return result;
          }
        },
        legend: {
          left: "center",
          bottom: 3,
          itemWidth: 15,
          itemHeight: 10,
          textStyle: {
            fontSize: 12,
            color: "#b0c2f9"
          },
          data: ["甲烷浓度", "硫化氢浓度", "氧气浓度"]
        },
        grid: {
          top: 40,
          bottom: 50,
          left: 60,
          right: 60
        },
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {color: "#b0c2f9"}
          },
          axisTick: {show: false},
          axisLabel: {
            fontSize: 10,
            color: "#b0c2f9",
            interval: 4 // 每5个点显示一个标签
          },
          data: chartData.timeLabels
        },
        yAxis: [{
          name: "浓度 (ppm)",
          type: "value",
          position: "left",
          splitNumber: 5,
          min: 0,
          max: 3.5,
          axisLine: {
            lineStyle: {color: "#feca57"}
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#333",
              type: "dashed"
            }
          },
          axisTick: {color: "#feca57"},
          axisLabel: {
            fontSize: 12,
            color: "#feca57"
          }
        }, {
          name: "氧气浓度 (%)",
          type: "value",
          position: "right",
          splitNumber: 5,
          min: 19,
          max: 21.5,
          axisLine: {
            lineStyle: {color: "#45b7d1"}
          },
          splitLine: {show: false},
          axisTick: {color: "#45b7d1"},
          axisLabel: {
            fontSize: 12,
            color: "#45b7d1",
            formatter: '{value}%'
          }
        }],
        series: [{
          name: "甲烷浓度",
          type: "line",
          yAxisIndex: 0,
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: {
            width: 2
          },
          itemStyle: {
            color: "#feca57"
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {offset: 0, color: 'rgba(254, 202, 87, 0.3)'},
              {offset: 1, color: 'rgba(254, 202, 87, 0.1)'}
            ])
          },
          data: chartData.methaneData
        }, {
          name: "硫化氢浓度",
          type: "line",
          yAxisIndex: 0,
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: {
            width: 2
          },
          itemStyle: {
            color: "#ff9ff3"
          },
          data: chartData.h2sData
        }, {
          name: "氧气浓度",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          lineStyle: {
            width: 2
          },
          itemStyle: {
            color: "#45b7d1"
          },
          data: chartData.oxygenData
        }]
      };

      chart.setOption(option);

      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);

      // 清理函数
      const cleanup = () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };

      // 将清理函数存储到容器上，以便在组件卸载时调用
      (container as any)._chartCleanup = cleanup;
    }, 100);

    return () => {
      clearTimeout(timer);
      const container = chartRef.current;
      if (container && (container as any)._chartCleanup) {
        (container as any)._chartCleanup();
      }
    };
  }, [chartData]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
}

// 24小时历史数据图表
export function HistoryChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [historyData, setHistoryData] = useState({
    hours: [] as string[],
    avgMethane: [] as number[],
    avgH2s: [] as number[],
    avgOxygen: [] as number[],
    maxMethane: [] as number[]
  });

  useEffect(() => {
    // 生成24小时的历史数据
    const hours = [];
    const avgMethane = [];
    const avgH2s = [];
    const avgOxygen = [];
    const maxMethane = [];
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(Date.now() - i * 60 * 60 * 1000).getHours();
      hours.push(`${hour.toString().padStart(2, '0')}:00`);
      
      // 生成模拟的平均值数据
      avgMethane.push(Number((1.8 + Math.random() * 0.8).toFixed(2)));
      avgH2s.push(Number((0.02 + Math.random() * 0.06).toFixed(3)));
      avgOxygen.push(Number((20.2 + Math.random() * 0.6).toFixed(1)));
      maxMethane.push(Number((2.5 + Math.random() * 0.8).toFixed(2)));
    }
    
    setHistoryData({
      hours,
      avgMethane,
      avgH2s,
      avgOxygen,
      maxMethane
    });
  }, []);

  useEffect(() => {
    if (!chartRef.current || historyData.hours.length === 0) return;

    // 延迟初始化，确保DOM完全渲染
    const timer = setTimeout(() => {
      const container = chartRef.current;
      if (!container) return;

      // 确保容器有尺寸
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        console.warn('History chart container has no size');
        return;
      }

      const chart = echarts.init(container);
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['甲烷平均值', '甲烷峰值', '硫化氢', '氧气浓度'],
          top: 10,
          textStyle: {
            color: '#b0c2f9',
            fontSize: 12
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: historyData.hours,
          axisLine: {
            lineStyle: { color: '#b0c2f9' }
          },
          axisLabel: {
            color: '#b0c2f9',
            fontSize: 10
          }
        },
        yAxis: [{
          type: 'value',
          name: '浓度 (ppm)',
          position: 'left',
          axisLine: {
            lineStyle: { color: '#feca57' }
          },
          axisLabel: {
            color: '#feca57',
            fontSize: 10
          },
          splitLine: {
            lineStyle: {
              color: '#333',
              type: 'dashed'
            }
          }
        }, {
          type: 'value',
          name: '氧气浓度 (%)',
          position: 'right',
          axisLine: {
            lineStyle: { color: '#45b7d1' }
          },
          axisLabel: {
            color: '#45b7d1',
            fontSize: 10,
            formatter: '{value}%'
          },
          splitLine: { show: false }
        }],
        series: [{
          name: '甲烷平均值',
          type: 'line',
          yAxisIndex: 0,
          data: historyData.avgMethane,
          itemStyle: { color: '#feca57' },
          smooth: true
        }, {
          name: '甲烷峰值',
          type: 'line',
          yAxisIndex: 0,
          data: historyData.maxMethane,
          itemStyle: { color: '#ff6b6b' },
          lineStyle: { type: 'dashed' },
          smooth: true
        }, {
          name: '硫化氢',
          type: 'bar',
          yAxisIndex: 0,
          data: historyData.avgH2s,
          itemStyle: { color: '#ff9ff3' },
          barWidth: '20%'
        }, {
          name: '氧气浓度',
          type: 'line',
          yAxisIndex: 1,
          data: historyData.avgOxygen,
          itemStyle: { color: '#45b7d1' },
          smooth: true
        }]
      };

      chart.setOption(option);

      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);

      // 清理函数
      const cleanup = () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };

      // 将清理函数存储到容器上
      (container as any)._chartCleanup = cleanup;
    }, 100);

    return () => {
      clearTimeout(timer);
      const container = chartRef.current;
      if (container && (container as any)._chartCleanup) {
        (container as any)._chartCleanup();
      }
    };
  }, [historyData]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
} 