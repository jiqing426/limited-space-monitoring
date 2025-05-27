'use client';

import { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  CloudSnow, 
  Flame, 
  Skull 
} from 'lucide-react';

interface AirQualityData {
  temperature: number;
  humidity: number;
  oxygen: number;
  co2: number;
  methane: number;
  h2s: number;
}

// 图标组件配置
const IconWrapper = ({ 
  children, 
  bgColor, 
  iconColor 
}: { 
  children: React.ReactNode; 
  bgColor: string; 
  iconColor: string; 
}) => (
  <div 
    className="icon-wrapper"
    style={{
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      backgroundColor: bgColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: iconColor
    }}
  >
    {children}
  </div>
);

export default function DataDisplay() {
  const [data, setData] = useState<AirQualityData>({
    temperature: 0,
    humidity: 0,
    oxygen: 0,
    co2: 0,
    methane: 0,
    h2s: 0
  });

  useEffect(() => {
    // 模拟数据更新
    const updateData = () => {
      setData({
        temperature: 23.5 + (Math.random() - 0.5) * 2,
        humidity: 65.2 + (Math.random() - 0.5) * 10,
        oxygen: 20.8 + (Math.random() - 0.5) * 0.5,
        co2: 450 + (Math.random() - 0.5) * 50,
        methane: 2.1 + (Math.random() - 0.5) * 0.5,
        h2s: 0.05 + (Math.random() - 0.5) * 0.02
      });
    };

    updateData();
    const interval = setInterval(updateData, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <table className="data-table">
      <tbody>
        <tr>
          <th>
            <IconWrapper bgColor="#ff6b6b20" iconColor="#ff6b6b">
              <Thermometer size={24} />
            </IconWrapper>
          </th>
          <td>
            <p><span>{data.temperature.toFixed(1)}</span></p>
            <p>温度（℃）</p>
          </td>
          <th>
            <IconWrapper bgColor="#4ecdc420" iconColor="#4ecdc4">
              <Droplets size={24} />
            </IconWrapper>
          </th>
          <td>
            <p><span>{data.humidity.toFixed(1)}</span></p>
            <p>湿度（%）</p>
          </td>
        </tr>
        <tr>
          <th>
            <IconWrapper bgColor="#45b7d120" iconColor="#45b7d1">
              <Wind size={24} />
            </IconWrapper>
          </th>
          <td>
            <p><span>{data.oxygen.toFixed(1)}</span></p>
            <p>氧气浓度（%）</p>
          </td>
          <th>
            <IconWrapper bgColor="#96ceb420" iconColor="#96ceb4">
              <CloudSnow size={24} />
            </IconWrapper>
          </th>
          <td>
            <p><span>{data.co2.toFixed(0)}</span></p>
            <p>二氧化碳（ppm）</p>
          </td>
        </tr>
        <tr>
          <th>
            <IconWrapper bgColor="#feca5720" iconColor="#feca57">
              <Flame size={24} />
            </IconWrapper>
          </th>
          <td>
            <p><span>{data.methane.toFixed(1)}</span></p>
            <p>甲烷（ppm）</p>
          </td>
          <th>
            <IconWrapper bgColor="#ff9ff320" iconColor="#ff9ff3">
              <Skull size={24} />
            </IconWrapper>
          </th>
          <td>
            <p><span>{data.h2s.toFixed(2)}</span></p>
            <p>硫化氢（ppm）</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
} 