# Song Elegance UI（大宋 · 清晖 UI 框架）

以宋代审美（汝窑天青、澄心生宣、泥金描边、乌丝栏、七弦琴轸、司辰刻漏、一柱燃香等）为核心视觉语言，构建的工程化 Vue 3 设计系统与组件库。

## 在线体验

- **交互式文档站**：https://wolfeng.github.io/songUI/
- **大宋官网示例 Demo**：https://wolfeng.github.io/songUI/?demo=song

## 架构分层

```text
packages/
├── tokens/     # @wolfeng/song-ui-tokens — 单一数据源 (colors, spacing, typography, radius, breakpoints)
├── core/       # @wolfeng/song-ui-core   — 框架无关算法（十二时辰、夜漏水比、日晷角度、算筹编码、五声音阶、校验规则）
└── song-ui/    # @wolfeng/song-ui-vue    — Vue 3 插件、Composables、25+ 宋韵组件与 CSS 样式库
apps/
└── docs/       # @wolfeng/song-ui-docs   — 交互式文档站与 API 参考
```

## 安装与快速上手

组件库通过 **GitHub Packages** 分发。首次安装前请先配置 `.npmrc`（需具备 `read:packages` 权限的 GitHub Token）：

```ini
# 项目根目录 .npmrc 或 ~/.npmrc
@wolfeng:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=你的_GITHUB_TOKEN
```

然后安装组件库：

```bash
npm install @wolfeng/song-ui-vue
```

在 `main.ts` 中注册插件与样式：

```ts
import { createApp } from 'vue';
import { createSongUI } from '@wolfeng/song-ui-vue';
import '@wolfeng/song-ui-vue/styles';
import App from './App.vue';

createApp(App)
  .use(createSongUI({ theme: 'dark', sound: true }))
  .mount('#app');
```

在页面中按需引入组件、组合式 API 与样式工具类：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { SesButton, SesCard, SesGuqinSlider, useToast } from '@wolfeng/song-ui-vue';

const tension = ref(50);
const toast = useToast();
</script>

<template>
  <SesCard corners class="ses-pa-6 ses-flex-col ses-gap-4">
    <h2 class="ses-text-h2">七弦调音</h2>
    <SesGuqinSlider v-model="tension" label="琴弦张力" />
    <SesButton variant="gold" @click="toast.show('定音完成')">定音</SesButton>
  </SesCard>
</template>
```

## 样式库与设计令牌 (`@wolfeng/song-ui-tokens` & `@wolfeng/song-ui-vue/styles`)

- **颜色与主题**：`data-theme="dark"`（暗夜青瓷）与 `data-theme="light"`（澄心昼景）。
- **文字层级**：`.ses-text-display`、`.ses-text-h1` – `.ses-text-h3`、`.ses-text-body`、`.ses-text-caption`、`.ses-text-mono`。
- **4px 基准间距**：`.ses-pa-*`、`.ses-px-*`、`.ses-py-*`、`.ses-ma-*`、`.ses-mt-*`、`.ses-mb-*`、`.ses-gap-*`（对应 `--ses-space-0` ~ `--ses-space-12`）。
- **布局与圆角**：`.ses-flex`、`.ses-flex-col`、`.ses-flex-wrap`、`.ses-items-center`、`.ses-justify-between`、`.ses-rounded-*`、`.ses-divider`。

## 本地开发与验证

```bash
npm install
npm run build        # 构建 tokens -> core -> vue
npm run build:docs   # 构建文档站
npm run dev:docs     # 启动本地文档预览 (http://localhost:5173)
npm test             # 运行 core 与 vue 全量单元测试
```
