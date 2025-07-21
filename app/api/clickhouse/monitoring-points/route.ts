import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@clickhouse/client';

// ClickHouse客户端配置
const clickhouseClient = createClient({
  url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USERNAME || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
  database: process.env.CLICKHOUSE_DATABASE || 'fsm',
  clickhouse_settings: {
    max_execution_time: 30,
    output_format_json_quote_64bit_integers: 0,
  }
});

// ClickHouse查询函数
async function queryClickHouse(sql: string) {
  try {
    console.log('🔗 尝试连接ClickHouse数据库...');
    console.log('SQL查询:', sql);
    
    // 使用官方客户端查询
    const resultSet = await clickhouseClient.query({
      query: sql,
      format: 'JSONEachRow'
    });
    
    const rows = await resultSet.json() as any[];  // 添加类型断言
    console.log('✅ ClickHouse连接成功，返回数据条数:', rows.length);
    
    return { 
      data: rows, 
      source: 'clickhouse',
      rows: rows.length
    };
    
  } catch (error) {
    console.error('❌ ClickHouse连接失败:', error instanceof Error ? error.message : error);
    return {
      data: [],
      source: 'clickhouse',
      rows: 0,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

// GET 请求处理器
export async function GET(request: NextRequest) {
  try {
    console.log('📥 接收到监测点数据请求');
    
    // 第一步：查询最新一条数据的create_time
    const latestTimeQuery = `
      SELECT create_time
      FROM lsm_summary_data 
      ORDER BY create_time DESC
      LIMIT 1
    `;
    
    const latestTimeResult = await queryClickHouse(latestTimeQuery);
    const latestCreateTime = latestTimeResult.data[0]?.create_time;
    
    if (!latestCreateTime) {
      console.log('⚠️ 未找到任何数据');
      return NextResponse.json({
        success: true,
        data: [],
        source: 'clickhouse',
        rows: 0,
        meta: null,
        timestamp: new Date().toISOString(),
        message: '数据表中没有数据'
      });
    }
    
    console.log('📅 最新数据时间:', latestCreateTime);
    
    // 第二步：基于最新时间查询当前时间的数据
    const sql = `
      SELECT 
        device_id,
        tem as temperature,
        hum as humidity,
        oxygen,
        hyd as h2s,
        dioxide as co2,
        monoxide as co,
        methane,
        record_time,
        create_time,
        remark
      FROM lsm_summary_data 
      WHERE create_time >= '${latestCreateTime}'
      ORDER BY device_id, create_time DESC
      LIMIT 50
    `;

    const result = await queryClickHouse(sql);
    
    console.log('📊 查询结果:', {
      source: result.source,
      dataCount: result.data?.length || 0,
      rows: result.rows,
      hasMetadata: false, // ClickHouse 不直接返回 meta 信息
      latestCreateTime: latestCreateTime
    });
    
    // 确保返回的数据格式正确
    return NextResponse.json({
      success: true,
      data: result.data || [],  // 确保data字段始终是数组
      source: result.source,
      rows: result.rows || 0,   // 确保rows字段始终是数字
      meta: null, // ClickHouse 不直接返回 meta 信息
      latestCreateTime: latestCreateTime,
      timestamp: new Date().toISOString(),
      message: 'ClickHouse连接成功，基于最新时间查询数据'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('🚨 API错误:', error);
    
    // 修改错误响应格式
    return NextResponse.json({
      success: false,
      data: [],  // 确保错误时也返回空数组
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString(),
      message: 'ClickHouse连接失败'
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}