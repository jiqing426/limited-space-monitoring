'use client';

import { useState, useEffect } from 'react';

interface AirQualityData {
  temperature: number;
  humidity: number;
  oxygen: number;
  co2: number;
  methane: number;
  h2s: number;
}

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
          <th><img src="/img/icon-01.png" alt="温度" /></th>
          <td>
            <p><span>{data.temperature.toFixed(1)}</span></p>
            <p>温度（℃）</p>
          </td>
          <th><img src="/img/icon-02.png" alt="湿度" /></th>
          <td>
            <p><span>{data.humidity.toFixed(1)}</span></p>
            <p>湿度（%）</p>
          </td>
        </tr>
        <tr>
          <th><img src="/img/icon-03.png" alt="氧气" /></th>
          <td>
            <p><span>{data.oxygen.toFixed(1)}</span></p>
            <p>氧气浓度（%）</p>
          </td>
          <th><img src="/img/icon-04.png" alt="二氧化碳" /></th>
          <td>
            <p><span>{data.co2.toFixed(0)}</span></p>
            <p>二氧化碳（ppm）</p>
          </td>
        </tr>
        <tr>
          <th><img src="/img/icon-05.png" alt="甲烷" /></th>
          <td>
            <p><span>{data.methane.toFixed(1)}</span></p>
            <p>甲烷（ppm）</p>
          </td>
          <th><img src="/img/icon-06.png" alt="硫化氢" /></th>
          <td>
            <p><span>{data.h2s.toFixed(2)}</span></p>
            <p>硫化氢（ppm）</p>
          </td>
        </tr>
      </tbody>
    </table>
  );
} 