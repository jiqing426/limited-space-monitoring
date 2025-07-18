import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@clickhouse/client';

// ClickHouse客户端配置
const clickhouseClient = createClient({
  url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USERNAME || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
  database: process.env.CLICKHOUSE_DATABASE || 'fsm',
  clickhouse_settings: {
    // 查询超时设置
    max_execution_time: 10,
    // 输出格式
    output_format_json_quote_64bit_integers: 0,
  },
  // 连接超时设置
  request_timeout: 10000,
});



// ClickHouse查询函数
async function queryClickHouse(sql: string) {
  try {
    console.log('🔗 尝试连接ClickHouse数据库...');
    
    // 使用官方客户端查询
    const resultSet = await clickhouseClient.query({
      query: sql,
      format: 'JSON'
    });
    
    const data = await resultSet.json();
    console.log('✅ ClickHouse连接成功，返回真实数据');
    
    // 适配数据格式（官方客户端返回的格式可能不同）
    const formattedData = Array.isArray(data) ? data : data.data || [];
    
    return { 
      data: formattedData, 
      source: 'clickhouse',
      meta: data.meta || null,
      rows: data.rows || formattedData.length
    };
    
  } catch (error) {
    console.error('❌ ClickHouse连接失败:', error instanceof Error ? error.message : error);
    throw error; // 直接抛出错误，不使用模拟数据
  }
}

// GET 请求处理器
export async function GET(request: NextRequest) {
  try {
    console.log('📥 接收到监测点数据请求');
    
    // 构建查询SQL - 基于实际的lsm_data表结构查询最新监测数据
    const sql = `
      SELECT 
        device_id,
        node_id,
        node_name,
        tem as temperature,
        hum as humidity,
        float_value as gas_concentration,
        record_time,
        create_time,
        lng,
        lat,
        remark
      FROM lsm_data 
      WHERE create_time >= now() - INTERVAL 1 HOUR
      ORDER BY device_id, create_time DESC
      LIMIT 100
    `;

    const result = await queryClickHouse(sql);
    
    console.log('📊 查询结果:', {
      source: result.source,
      dataCount: result.data?.length || 0,
      rows: result.rows,
      hasMetadata: !!result.meta
    });
    
    return NextResponse.json({
      success: true,
      data: result.data,
      source: result.source,
      rows: result.rows,
      meta: result.meta,
      timestamp: new Date().toISOString(),
      message: 'ClickHouse连接成功，返回真实数据'
    });

  } catch (error) {
    console.error('🚨 API错误:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      message: 'ClickHouse连接失败'
    }, { status: 500 });
  }
} 