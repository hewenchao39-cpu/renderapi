# LZT Market API Proxy for Render

这是一个部署在 Render 上的 LZT Market API 代理服务。

## 🚀 部署到 Render

### 方法 1：通过 GitHub（推荐）

1. 将此项目推送到 GitHub
2. 访问 [Render Dashboard](https://dashboard.render.com/)
3. 点击 "New +" → "Web Service"
4. 选择 "Build and deploy from a Git repository"
5. 连接你的 GitHub 仓库
6. 配置如下：
   - **Name**: `lzt-proxy`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
7. 点击 "Create Web Service"
8. 等待部署完成

### 方法 2：手动部署

1. 访问 [Render Dashboard](https://dashboard.render.com/)
2. 点击 "New +" → "Web Service"
3. 选择 "Deploy an existing image from a registry"
4. 或者选择 "Public Git repository"
5. 输入此仓库的 URL

## 📡 使用

部署完成后，你会得到一个 URL，例如：
```
https://lzt-proxy.onrender.com
```

将此 URL 配置到你的后端 `config.yaml` 中：

```yaml
lzt:
  proxy_nodes:
    - url: https://lzt-proxy.onrender.com
      name: Render节点
      priority: 2
      functions:
        - search
        - categories
        - profile
```

## 🧪 测试

部署完成后，访问健康检查接口：
```
https://lzt-proxy.onrender.com/health
```

应该返回：
```json
{
  "status": "ok",
  "timestamp": "2025-10-25T12:00:00.000Z",
  "service": "LZT Render Proxy"
}
```

## ⚠️ 注意事项

### 免费版限制
- 15 分钟无请求后休眠
- 下次请求需要 30-60 秒唤醒
- 建议使用 [UptimeRobot](https://uptimerobot.com) 每 14 分钟 ping 一次

### 保持服务活跃
在 UptimeRobot 中设置监控：
- URL: `https://lzt-proxy.onrender.com/health`
- 监控间隔: 5 分钟
- 监控类型: HTTP(s)

## 📊 性能

- 位置: 美国俄勒冈州（免费版）
- 延迟: 中国访问约 200-300ms
- 带宽: 无限制（免费版）

## 🔧 本地开发

```bash
# 安装依赖
npm install

# 启动服务
npm start

# 访问
curl http://localhost:3000/health
```

## 📝 环境变量

| 变量 | 说明 | 默认值 |
|-----|------|--------|
| `PORT` | 服务端口 | 3000 |
| `NODE_ENV` | 运行环境 | development |
| `RENDER_REGION` | 部署区域 | us-west |

## 📄 许可证

MIT License

