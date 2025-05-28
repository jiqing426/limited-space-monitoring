'use client';

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

// 趋势分析图表 - 危险气体监测
export function TrendChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState({
    timeLabels: [] as string[],
    methaneData: [] as number[],
    h2sData: [] as number[]
  });

  // 生成时间标签（最近30分钟，每30秒一个点）
  const generateTimeLabels = () => {
    const labels = [];
    const now = new Date();
    
    for (let i = 59; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 30 * 1000); // 每30秒一个点
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const seconds = time.getSeconds().toString().padStart(2, '0');
      labels.push(`${minutes}:${seconds}`);
    }
    
    return labels;
  };

  // 生成模拟数据
  const generateData = () => {
    const methaneData = [];
    const h2sData = [];
    
    // 基础值
    let methaneBase = 2.1;
    let h2sBase = 0.05;
    
    for (let i = 0; i < 60; i++) {
      // 甲烷数据：1.5-3.0 ppm 范围，有一定趋势变化
      methaneBase += (Math.random() - 0.5) * 0.1;
      methaneBase = Math.max(1.5, Math.min(3.0, methaneBase));
      methaneData.push(Number(methaneBase.toFixed(2)));
      
      // 硫化氢数据：0.01-0.1 ppm 范围，变化较小
      h2sBase += (Math.random() - 0.5) * 0.005;
      h2sBase = Math.max(0.01, Math.min(0.1, h2sBase));
      h2sData.push(Number(h2sBase.toFixed(3)));
    }
    
    return { methaneData, h2sData };
  };

  useEffect(() => {
    // 初始化数据
    const timeLabels = generateTimeLabels();
    const { methaneData, h2sData } = generateData();
    
    setChartData({
      timeLabels,
      methaneData,
      h2sData
    });

    // 每30秒更新一次数据（模拟实时数据）
    const interval = setInterval(() => {
      const newTimeLabels = generateTimeLabels();
      const { methaneData: newMethaneData, h2sData: newH2sData } = generateData();
      
      setChartData({
        timeLabels: newTimeLabels,
        methaneData: newMethaneData,
        h2sData: newH2sData
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!chartRef.current || chartData.timeLabels.length === 0) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross"
        },
        formatter: function(params: any) {
          let result = `时间: ${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            const unit = param.seriesName === '甲烷' ? 'ppm' : 'ppm';
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
        data: ["甲烷", "硫化氢"]
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
          interval: 9 // 每10个点显示一个标签
        },
        data: chartData.timeLabels
      },
      yAxis: [{
        name: "甲烷 (ppm)",
        type: "value",
        position: "left",
        splitNumber: 5,
        min: 1.0,
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
        name: "硫化氢 (ppm)",
        type: "value",
        position: "right",
        splitNumber: 5,
        min: 0,
        max: 0.12,
        axisLine: {
          lineStyle: {color: "#ff9ff3"}
        },
        splitLine: {show: false},
        axisTick: {color: "#ff9ff3"},
        axisLabel: {
          fontSize: 12,
          color: "#ff9ff3",
          formatter: '{value}'
        }
      }],
      series: [{
        name: "甲烷",
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
        name: "硫化氢",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          width: 2
        },
        itemStyle: {
          color: "#ff9ff3"
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: 'rgba(255, 159, 243, 0.3)'},
            {offset: 1, color: 'rgba(255, 159, 243, 0.1)'}
          ])
        },
        data: chartData.h2sData
      }]
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [chartData]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
}

// 空气质量等级分布饼图（近12小时）
export function LevelChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [levelData, setLevelData] = useState([
    {name: "优秀", value: 0, color: "#4ecdc4"},
    {name: "良好", value: 0, color: "#45b7d1"},
    {name: "轻微危险", value: 0, color: "#feca57"},
    {name: "非常危险", value: 0, color: "#ff6b6b"}
  ]);

  // 生成近12小时的空气质量等级数据
  const generateLevelData = () => {
    // 模拟12小时内每10分钟一次检测，共72个数据点
    const totalPoints = 72;
    
    // 按照指定比例分配：优秀 30%，良好 60%，轻微危险 9%，非常危险 1%
    const excellent = Math.round(totalPoints * 0.30); // 30%
    const good = Math.round(totalPoints * 0.60); // 60%
    const slightDanger = Math.round(totalPoints * 0.09); // 9%
    const veryDanger = totalPoints - excellent - good - slightDanger; // 剩余的1%

    return [
      {name: "优秀", value: excellent, color: "#4ecdc4"},
      {name: "良好", value: good, color: "#45b7d1"},
      {name: "轻微危险", value: slightDanger, color: "#feca57"},
      {name: "非常危险", value: veryDanger, color: "#ff6b6b"}
    ];
  };

  useEffect(() => {
    // 初始化数据
    setLevelData(generateLevelData());

    // 每5分钟更新一次数据
    const interval = setInterval(() => {
      setLevelData(generateLevelData());
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
      tooltip: {
        trigger: "item",
        formatter: function(params: any) {
          const total = levelData.reduce((sum, item) => sum + item.value, 0);
          const percentage = ((params.value / total) * 100).toFixed(1);
          return `${params.name}<br />检测次数：${params.value}<br />占比：${percentage}%<br />时间范围：近12小时`;
        }
      },
      legend: {
        type: "scroll",
        orient: "vertical",
        padding: 0,
        top: 15,
        right: 0,
        itemGap: 8,
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          fontSize: 11,
          color: "#b0c2f9"
        },
        formatter: function(name: string) {
          const item = levelData.find(d => d.name === name);
          return `${name} (${item?.value || 0})`;
        }
      },
      series: [{
        name: "空气质量等级",
        type: "pie",
        center: ["45%", "55%"],
        radius: ["35%", "80%"],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: 'bold',
            color: '#fff'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: levelData.map(item => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: item.color
          }
        }))
      }]
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [levelData]);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
} 