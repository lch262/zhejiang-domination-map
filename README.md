# 浙江制霸地图

一个可交互的浙江省足迹地图。点击城市即可切换足迹状态、自动计算分数，并导出可分享的 PNG 图片。

## 在线体验

[https://zhejiang-map.lch262.chatgpt.site](https://zhejiang-domination-map-sigma.vercel.app/)

## 功能

- 浙江省 11 个地级市折线矩形地图
- 六级足迹状态：没去过、路过、出差、游玩、短居、居住
- 简体中文、繁體中文与 English
- 自动保存本机选择
- 一键导出 1400 × 1750 PNG
- 响应式桌面与移动端界面

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
npm ci
npm run dev
```

浏览器打开终端显示的本地地址。

## 构建

```bash
npm run build
```

## 技术栈

- React 19
- Next.js 16
- Vinext / Vite
- TypeScript
- SVG

## 作者

`lch262`
