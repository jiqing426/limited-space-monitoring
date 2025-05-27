'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

// 排行榜图表
export function RankChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        },
        formatter: function(params: any) {
          const param = params[0];
          const marker = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#e6b600;"></span>';
          const suffix = '<span style="margin-left:5px;font-size:12px;">ppm</span>';
          return param.name + "<br />" +
            marker + "排名：" + (param.dataIndex+1) + "<br />" +
            marker + "浓度值：" + param.value + suffix;
        }
      },
      grid: {
        top: 10,
        bottom: 10,
        left: 60
      },
      xAxis: {
        show: false,
        type: "value"
      },
      yAxis: {
        type: "category",
        inverse: true,
        axisLine: {show: false},
        axisTick: {show: false},
        axisLabel: {
          fontSize: 12,
          color: "#b0c2f9"
        },
        data: ["二氧化碳", "温度", "氧气", "甲烷", "湿度", "硫化氢"]
      },
      series: [{
        name: "空气质量指标",
        type: "bar",
        barCategoryGap: "60%",
        label: {
          show: true,
          position: "right",
          fontSize: 12,
          color: "#188df0"
        },
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 1, 1, 1,
              [
                {offset: 0, color: '#b0c2f9'},
                {offset: 0.5, color: '#188df0'},
                {offset: 1, color: '#185bff'}
              ]
            )
          }
        },
        data: [450, 23.5, 20.8, 2.1, 65.2, 0.05]
      }]
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
}

// 趋势分析图表
export function TrendChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "none"
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
        data: ["温度", "湿度", "氧气浓度"]
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
          fontSize: 12,
          color: "#b0c2f9"
        },
        data: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"]
      },
      yAxis: [{
        name: "温度/湿度",
        type: "value",
        splitNumber: 5,
        axisLine: {
          lineStyle: {color: "#b0c2f9"}
        },
        splitLine: {show: false},
        axisTick: {color: "#b0c2f9"},
        axisLabel: {
          fontSize: 12,
          color: "#b0c2f9"
        }
      }, {
        name: "氧气浓度(%)",
        type: "value",
        splitNumber: 5,
        min: 18,
        max: 22,
        axisLine: {
          lineStyle: {color: "#b0c2f9"}
        },
        splitLine: {show: false},
        axisTick: {color: "#b0c2f9"},
        axisLabel: {
          fontSize: 12,
          color: "#b0c2f9"
        }
      }],
      series: [{
        name: "温度",
        type: "line",
        itemStyle: {
          color: "#7760f6"
        },
        data: [22.1, 21.8, 21.5, 22.3, 23.1, 24.2, 25.8, 26.5, 25.9, 24.7, 23.8, 23.2]
      }, {
        name: "湿度",
        type: "line",
        itemStyle: {
          color: "#e6b600"
        },
        data: [68.5, 70.2, 72.1, 69.8, 66.4, 62.7, 58.3, 55.9, 57.2, 61.5, 64.8, 67.1]
      }, {
        name: "氧气浓度",
        type: "line",
        yAxisIndex: 1,
        itemStyle: {
          color: "#188df0"
        },
        data: [20.9, 20.8, 20.7, 20.8, 20.9, 21.0, 20.8, 20.7, 20.8, 20.9, 20.8, 20.9]
      }]
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
}

// 等级分布饼图
export function LevelChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b0}<br />监测点数：{c0}<br />占比：{d0}%"
      },
      legend: {
        type: "scroll",
        orient: "vertical",
        padding: 0,
        top: 15,
        right: 0,
        itemGap: 5,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 10,
          color: "#b0c2f9"
        }
      },
      series: [{
        name: "空气质量等级",
        type: "pie",
        center: ["47%", "55%"],
        radius: ["30%", "85%"],
        data: [
          {name: "优秀", value: 156},
          {name: "良好", value: 234},
          {name: "轻度污染", value: 89},
          {name: "中度污染", value: 45},
          {name: "重度污染", value: 23},
          {name: "严重污染", value: 8}
        ]
      }]
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
} 