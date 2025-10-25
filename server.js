import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// 解析 JSON body
app.use(express.json());

// CORS 中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 健康检查接口（用于防止休眠）
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'LZT Render Proxy'
  });
});

// 代理所有请求到 LZT Market API
app.all('*', async (req, res) => {
  try {
    // 排除健康检查
    if (req.path === '/health') {
      return;
    }

    // 构造目标 URL
    const targetUrl = `https://prod-api.lzt.market${req.path}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    
    // 准备请求头
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // 转发 Authorization 头
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
    
    // 发送请求到 LZT API
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    // 获取响应内容
    const data = await response.text();
    
    // 设置响应状态码
    res.status(response.status);
    
    // 添加代理标识
    res.header('X-Proxy-By', 'Render');
    res.header('X-Proxy-Region', process.env.RENDER_REGION || 'us-west');
    
    // 转发响应头（排除某些不需要的）
    response.headers.forEach((value, key) => {
      if (!['content-encoding', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        res.header(key, value);
      }
    });
    
    // 返回数据
    res.send(data);
    
    console.log(`[${new Date().toISOString()}] ✅ ${response.status} ${req.path}`);
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Proxy Error:`, error);
    res.status(500).json({
      error: 'Proxy Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 LZT Render Proxy running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌍 Region: ${process.env.RENDER_REGION || 'us-west'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

