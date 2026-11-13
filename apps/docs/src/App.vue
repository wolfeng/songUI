<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import {
  useTheme,
  useSound,
  useToast,
  SesButton,
  SesSeal,
  SesCard,
  SesSwitch,
  SesInput,
  SesAlert,
  SesToast,
  SesSelect,
  SesStepper,
  SesAccordion,
  SesTable,
  SesPagination,
  SesWoodblockReader,
  SesScrollModal,
  SesScreenDrawer,
  SesTimepiece,
  SesIncenseTimer,
  SesAstrolabeGauge,
  SesMountainChart,
  SesTag,
  SesTabs,
  SesForm,
  SesCheckbox,
  SesRadioGroup,
  SesTooltip,
  SesProgress,
  SesDianchaLoader,
  SesBreadcrumbs,
  SesGuqinSlider,
  SesUpload,
  SesAvatarGroup,
  SesRating
} from '@wolfeng/song-ui-vue';
import { songTokens } from '@wolfeng/song-ui-tokens';
import { getShichenName, getNightWatchLabel, songRules } from '@wolfeng/song-ui-core';
import ApiReference from './components/ApiReference.vue';
import { componentApiMap } from './data/componentApi';

const theme = useTheme();
const sound = useSound();
const toast = useToast();

type SectionId =
  | 'overview'
  | 'tokens'
  | 'button'
  | 'switch'
  | 'input'
  | 'select'
  | 'stepper'
  | 'slider'
  | 'table'
  | 'accordion'
  | 'woodblock'
  | 'timepiece'
  | 'incense'
  | 'mountain'
  | 'astrolabe'
  | 'overlays'
  | 'alert'
  | 'tabs'
  | 'tags'
  | 'radio'
  | 'checkbox'
  | 'widgets';
const activeSection = ref<SectionId>('overview');

const navItems: { id: SectionId; title: string; subtitle: string }[] = [
  // 一、总纲与设计基石
  { id: 'overview', title: '总纲 · 架构与接入', subtitle: 'createSongUI & Core' },
  { id: 'tokens', title: 'Tokens · 样式库与规范', subtitle: 'Colors, Spacing & Type' },
  // 二、宋韵特色器物与交互（优先展示）
  { id: 'slider', title: 'SesGuqinSlider · 七弦琴轸', subtitle: 'Guqin String Slider' },
  { id: 'timepiece', title: 'SesTimepiece · 司辰日晷', subtitle: 'Sundial & Clepsydra' },
  { id: 'incense', title: 'SesIncenseTimer · 一柱燃香', subtitle: 'Incense Timer' },
  { id: 'mountain', title: 'SesMountainChart · 青绿叠嶂', subtitle: 'Mountain Area Chart' },
  { id: 'astrolabe', title: 'SesAstrolabeGauge · 司南仪盘', subtitle: 'Astrolabe Gauge' },
  { id: 'woodblock', title: 'SesWoodblockReader · 乌丝栏善本', subtitle: 'Woodblock Reader' },
  { id: 'widgets', title: 'SesDiancha · 点茶与进度', subtitle: 'Diancha Loader, Progress & Tooltip' },
  { id: 'overlays', title: 'SesScrollModal · 古卷与屏风', subtitle: 'Scroll Modal & Screen Drawer' },
  // 三、基础与表单控件
  { id: 'button', title: 'SesButton · 玉质玲珑钮', subtitle: 'Button & Seal' },
  { id: 'switch', title: 'SesSwitch · 榫卯滑闩', subtitle: 'Switch' },
  { id: 'radio', title: 'SesRadioGroup · 螺钿单选', subtitle: 'RadioGroup' },
  { id: 'checkbox', title: 'SesCheckbox · 茶百戏多选', subtitle: 'Checkbox' },
  { id: 'input', title: 'SesInput · 素笺与奏疏校验', subtitle: 'Input & Form Validation' },
  { id: 'select', title: 'SesSelect · 牙签书帙', subtitle: 'Ivory Tag Select' },
  { id: 'stepper', title: 'SesStepper · 筹算步进', subtitle: 'Counting Rods Stepper' },
  { id: 'upload', title: 'SesUpload · 素笺入画', subtitle: 'File Upload' },
  { id: 'avatarGroup', title: 'SesAvatarGroup · 雅集头像组', subtitle: 'Avatar Group' },
  { id: 'rating', title: 'SesRating · 器物品鉴', subtitle: 'Rating' },
  // 四、导航、表格与反馈
  { id: 'tabs', title: 'SesTabs · 卷首题签', subtitle: 'Tabs' },
  { id: 'tags', title: 'SesTag · 竹签牙牌', subtitle: 'Tag Chips' },
  { id: 'accordion', title: 'SesAccordion · 经折装', subtitle: 'Accordion' },
  { id: 'table', title: 'SesTable · 鱼鳞图与活字', subtitle: 'Table & Clay-Type Pagination' },
  { id: 'alert', title: 'SesAlert · 金字牌警示', subtitle: 'Banner & Toast' }
];

// Interactive demo states
const switchQuiet = ref(true);
const switchStar = ref(false);
const scrollTitle = ref('宣和丙午岁清明上河图跋');
const scrollBody = ref('建盏兔毫，宜用建溪灵芽，候汤眼如蟹目鱼眼，七汤点拂，盏面乳雾汹涌。');

const selectedBook = ref('chongwen');
const bookOptions = [
  { value: 'chongwen', label: '崇文总目 · 经部易类（秘书省校）', meta: '卷一 · 秘书省校定' },
  { value: 'yingzao', label: '营造法式 · 大木作制度（李诫编）', meta: '卷四 · 李诫奉敕编修' },
  { value: 'mengxi', label: '梦溪笔谈 · 象数器用（沈括撰）', meta: '卷七 · 沈括撰' },
  { value: 'xuanhe', label: '宣和画谱 · 山水门（内府秘藏）', meta: '卷十 · 内府秘藏' }
];
const stepperCount = ref(27);

const tableColumns = [
  { key: 'name', title: '州府名号' },
  { key: 'item', title: '主产雅物' },
  { key: 'tag', title: '贡赋评级' },
  { key: 'val', title: '岁入（贯）', sortable: true },
  { key: 'seal', title: '御批钤印' }
];
const tablePage = ref(1);
const tablePageData: Record<number, Record<string, unknown>[]> = {
  1: [
    { id: 1, name: '汝州 · 清凉寺', item: '天青釉裹足支烧瓷', tag: '御用甲等', val: 92000, seal: '宣和御览', green: false },
    { id: 2, name: '建州 · 北苑', item: '龙凤团茶·小龙团', tag: '贡茶首品', val: 78500, seal: '已验入库', green: true },
    { id: 3, name: '苏州 · 织造局', item: '八答晕宋锦·青绿', tag: '内府特供', val: 114000, seal: '宣和御览', green: false },
    { id: 4, name: '歙州 · 龙尾山', item: '罗纹金星砚·徽墨', tag: '文房上品', val: 64200, seal: '已验入库', green: true }
  ],
  2: [
    { id: 5, name: '定州 · 曲阳窑', item: '白釉刻花萱草纹碗', tag: '尚食局供', val: 81300, seal: '宣和御览', green: false },
    { id: 6, name: '杭州 · 官作院', item: '澄心堂仿古生宣笺', tag: '翰林院用', val: 59400, seal: '已验入库', green: true },
    { id: 7, name: '钧州 · 神垕镇', item: '玫瑰紫窑变海棠盆', tag: '艮岳御赏', val: 106800, seal: '宣和御览', green: false },
    { id: 8, name: '湖州 · 善琏镇', item: '紫毫鸡距宣笔', tag: '御书院备', val: 49000, seal: '已验入库', green: true }
  ]
};
const currentTableRows = computed(() => tablePageData[tablePage.value] ?? tablePageData[1]);

const accordionItems = [
  {
    id: 'fold-1',
    title: '第一折 · 宋刻本刀法与字怀特征',
    content: '北宋国子监刻本崇尚欧阳询、颜真卿楷法，横画收笔有顿角，竖画雄健挺拔。'
  },
  {
    id: 'fold-2',
    title: '第二折 · 宣和瘦金体之铁画银钩',
    content: '宋徽宗赵佶独创「瘦金书」，运笔疾速如鹤膝竹节，于大题与金字牌处点睛使用。'
  },
  {
    id: 'fold-3',
    title: '第三折 · 昼晷夜漏的天文历法同构',
    content: '白昼仰赖日光投射赤道石晷，入夜则启用苏颂水运浮箭莲花漏，器道合一。'
  }
];
const readerVertical = ref(true);
const showScrollModal = ref(false);
const showScreenDrawer = ref(false);
const mountainMode = ref<'grain' | 'kiln'>('grain');
const mountainSeries = computed(() =>
  mountainMode.value === 'grain'
    ? [
        { label: '正月', backValue: 320, frontValue: 215, unit: '万石' },
        { label: '二月', backValue: 445, frontValue: 310, unit: '万石' },
        { label: '三月', backValue: 390, frontValue: 275, unit: '万石' },
        { label: '四月', backValue: 520, frontValue: 395, unit: '万石' },
        { label: '五月', backValue: 425, frontValue: 305, unit: '万石' },
        { label: '六月', backValue: 612, frontValue: 485, unit: '万石' },
        { label: '七月', backValue: 460, frontValue: 340, unit: '万石' },
        { label: '八月', backValue: 568, frontValue: 432, unit: '万石' }
      ]
    : [
        { label: '正月', backValue: 1.4, frontValue: 0.9, unit: '万器' },
        { label: '二月', backValue: 2.1, frontValue: 1.5, unit: '万器' },
        { label: '三月', backValue: 1.8, frontValue: 1.2, unit: '万器' },
        { label: '四月', backValue: 2.8, frontValue: 2.0, unit: '万器' },
        { label: '五月', backValue: 2.0, frontValue: 1.4, unit: '万器' },
        { label: '六月', backValue: 2.9, frontValue: 2.2, unit: '万器' },
        { label: '七月', backValue: 3.3, frontValue: 2.6, unit: '万器' },
        { label: '八月', backValue: 3.8, frontValue: 3.1, unit: '万器' }
      ]
);

const now = new Date();
const minsNow = now.getHours() * 60 + now.getMinutes();
const shichenNow = getShichenName(minsNow);
const watchNow = getNightWatchLabel(minsNow);

const activeTab = ref('jing');
const tabItems = [
  { value: 'jing', label: '经部', badge: '易书诗礼' },
  { value: 'shi', label: '史部', badge: 24 },
  { value: 'zi', label: '子部', badge: '理学' },
  { value: 'ji', label: '集部', disabled: true }
];
const demoTags = ref([
  { id: 1, label: '天青釉 · 汝窑', variant: 'celadon' as const },
  { id: 2, label: '宣和御览', variant: 'cinnabar' as const },
  { id: 3, label: '泥金题签', variant: 'gold' as const },
  { id: 4, label: '崇文总目', variant: 'ink' as const }
]);

const formRef = ref<InstanceType<typeof SesForm> | null>(null);
const formValid = ref(true);
const titleRules = [songRules.required('题跋卷名不可留白'), songRules.minLength(4, '卷名至少须四字')];
const bodyRules = [songRules.required('手札正文须落墨陈述'), songRules.minLength(8, '正文至少须八字')];

const agreedCheck = ref(true);
const partialCheck = ref(true);
const thirdCheck = ref(false);
const selectedKiln = ref('ding');
const kilnOptions = [
  { label: '定窑白瓷 · 印花', value: 'ding' },
  { label: '钧窑窑变 · 玫瑰紫', value: 'jun' },
  { label: '建窑黑釉 · 兔毫盏', value: 'jian' }
];
const progressVal = ref(68);
const dianchaPct = ref(68);
const guqinVal = ref(64);
const uploadFiles = ref<File[]>([]);
const ratingScore = ref(4);

// 安装指引
const installPkgMgr = ref<'npm' | 'pnpm' | 'yarn'>('npm');
const installCmd = computed(() => {
  if (installPkgMgr.value === 'pnpm') return 'pnpm add @wolfeng/song-ui-vue';
  if (installPkgMgr.value === 'yarn') return 'yarn add @wolfeng/song-ui-vue';
  return 'npm install @wolfeng/song-ui-vue';
});
function copyInstallCmd() {
  sound.playChime(784);
  if (navigator.clipboard) {
    void navigator.clipboard.writeText(installCmd.value);
  }
  toast.show(`已复制安装命令：${installCmd.value}`);
}
const avatarScholars = [
  { name: '苏轼', title: '翰林学士 · 眉山', tone: 'celadon' as const },
  { name: '欧阳修', title: '参知政事 · 庐陵', tone: 'gold' as const },
  { name: '沈括', title: '翰林学士 · 钱塘', tone: 'ink' as const },
  { name: '司马光', title: '尚书左仆射 · 夏县', tone: 'cinnabar' as const },
  { name: '李诫', title: '将作监 · 管城', tone: 'celadon' as const },
  { name: '黄庭坚', title: '著作郎 · 分宁', tone: 'gold' as const },
  { name: '米芾', title: '书画博士 · 襄阳', tone: 'ink' as const }
];

// ⌘K 组件快捷搜索
const searchOpen = ref(false);
const searchQuery = ref('');
const searchActiveIdx = ref(0);
const searchInputRef = ref<HTMLInputElement | null>(null);

const filteredNavItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return navItems;
  return navItems.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q)
  );
});

watch(searchQuery, () => {
  searchActiveIdx.value = 0;
});

function openSearch() {
  searchOpen.value = true;
  searchQuery.value = '';
  searchActiveIdx.value = 0;
  sound.playChime(659.25);
  void nextTick(() => {
    searchInputRef.value?.focus();
  });
}

function closeSearch() {
  searchOpen.value = false;
}

function chooseSearchResult(id: SectionId) {
  selectSection(id);
  closeSearch();
}

function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (searchOpen.value) {
      closeSearch();
    } else {
      openSearch();
    }
    return;
  }

  if (!searchOpen.value) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    closeSearch();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (filteredNavItems.value.length > 0) {
      searchActiveIdx.value = (searchActiveIdx.value + 1) % filteredNavItems.value.length;
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (filteredNavItems.value.length > 0) {
      searchActiveIdx.value =
        (searchActiveIdx.value - 1 + filteredNavItems.value.length) % filteredNavItems.value.length;
    }
  } else if (e.key === 'Enter') {
    const target = filteredNavItems.value[searchActiveIdx.value];
    if (target) {
      e.preventDefault();
      chooseSearchResult(target.id);
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown);
});
const customGuqinVal = ref(50);
const customMarks = [
  { label: '静默', badge: '无声' },
  { label: '微吟', badge: '轻音' },
  { label: '清越', badge: '中音' },
  { label: '洪亮', badge: '高音' }
];
const breadcrumbItems = [
  { label: '尚书省', value: 'shangshu' },
  { label: '秘阁典籍库', value: 'mige' },
  { label: '崇文总目 · 卷一' }
];

function onMemorialSubmit({ valid }: { valid: boolean }) {
  if (valid) {
    toast.show('奏疏校验无误，已钤印呈递！');
  } else {
    toast.show('尚有朱批未校，请补全奏疏');
  }
}

function handleToggleTheme() {
  const next = theme.toggle();
  sound.playPluck(next === 'dark' ? 293.66 : 440);
  toast.show(next === 'dark' ? '已入「暗夜洒金」' : '已切「澄心昼景」');
}

function handleToggleSound() {
  const enabled = sound.toggle();
  toast.show(enabled ? '已开启汝窑瓷器与古琴泛音反馈' : '已切换为静默模式');
}

function copySwatch(hex: string, name: string, freq: number) {
  sound.playChime(freq);
  if (navigator.clipboard) {
    void navigator.clipboard.writeText(hex);
  }
  toast.show(`已复制宋韵色票「${name}」 ${hex}`);
}

const mainRef = ref<HTMLElement | null>(null);

function selectSection(id: SectionId) {
  activeSection.value = id;
  sound.playChime(587.33);
  if (mainRef.value && mainRef.value.scrollHeight > mainRef.value.clientHeight) {
    mainRef.value.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
</script>

<template>
  <div class="docs-shell">
    <div class="ses-paper-grain" aria-hidden="true" />

    <!-- 顶部栏 -->
    <header class="docs-header">
      <div class="docs-header-inner">
        <div class="docs-brand">
          <SesSeal>大宋<br />清晖</SesSeal>
          <div>
            <div class="docs-brand-title">
              <h1 class="ses-slender-gold" style="margin: 0; font-size: 1.15rem">清晖 UI 框架文档</h1>
              <span class="docs-badge ses-slender-display">v0.1.0</span>
            </div>
            <p class="docs-brand-sub">Song Elegance UI · Design Tokens + Layered Core + Vue 3</p>
          </div>
        </div>

        <div class="docs-actions">
          <span class="ses-brocade-tag" style="font-size: 0.72rem">
            {{ shichenNow }} · {{ watchNow.text }}
          </span>
          <a
            href="?demo=song"
            target="_blank"
            rel="noopener noreferrer"
            class="ses-btn-jade ses-btn-jade--sm ses-btn-jade--gold"
            style="text-decoration: none"
          >
            大宋官网 Demo ↗
          </a>
          <SesButton size="sm" :sound-freq="0" @click="handleToggleSound">
            {{ sound.enabled.value ? '🎵 雅音：开' : '🔇 雅音：静' }}
          </SesButton>
          <SesButton size="sm" variant="gold" :sound-freq="0" @click="handleToggleTheme">
            {{ theme.isDark.value ? '🌙 暗夜洒金' : '☀️ 澄心昼景' }}
          </SesButton>
        </div>
      </div>
    </header>

    <!-- 主体两栏布局：左侧文档导航 + 右侧交互演示与 API 表 -->
    <div class="docs-layout">
      <aside class="docs-sidebar">
        <button type="button" class="docs-search-trigger" @click="openSearch">
          <span>⌕ 寻一件器物</span>
          <kbd>⌘K</kbd>
        </button>
        <nav aria-label="文档目录" class="docs-nav">
          <button
            v-for="item in navItems"
            :key="item.id"
            type="button"
            class="docs-nav-item"
            :class="{ active: activeSection === item.id }"
            @click="selectSection(item.id)"
          >
            <div class="docs-nav-title">{{ item.title }}</div>
            <div class="docs-nav-sub">{{ item.subtitle }}</div>
          </button>
        </nav>
      </aside>

      <main ref="mainRef" class="docs-main">
        <!-- 1. 总纲 -->
        <section v-if="activeSection === 'overview'" class="docs-section">
          <SesCard class="docs-panel">
            <span class="ses-brocade-tag ses-slender-display">工程化 UI 框架架构</span>
            <h2 class="ses-slender-gold docs-h2">分层内核 × 样式规范 × Vue 3 组件库</h2>
            <p class="docs-lead">
              <code>@song-ui</code> 采用 Monorepo 分层设计：
              <strong>@wolfeng/song-ui-tokens</strong>（单一数据源，同步生成 CSS 变量与 TypeScript 类型）、
              <strong>@wolfeng/song-ui-core</strong>（框架无关的时辰、算筹、音律与校验算法）、
              <strong>@wolfeng/song-ui-vue</strong>（Vue 3 插件、样式库、Composables 与完整类型化组件）。
              前置要求：<code>Vue &gt;= 3.4.0</code>。
            </p>

            <h3 class="ses-slender-gold" style="margin: 1.15rem 0 0.5rem; font-size: 0.95rem">一、安装组件库（GitHub Packages）</h3>
            <SesAlert variant="jade" style="margin-bottom: 0.75rem">
              组件库已发布至 GitHub Packages（<code>https://npm.pkg.github.com</code>）。首次安装前，请先配置 <code>.npmrc</code> 或使用具有 <code>read:packages</code> 权限的 GitHub Token 登录一次，再执行下方安装命令。
            </SesAlert>
            <pre class="docs-code" style="margin-bottom: 0.75rem"><code># 方式 A：在项目 .npmrc 或全局 ~/.npmrc 中配置源与 Token
@wolfeng:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=你的_GITHUB_TOKEN

# 方式 B：或通过 npm CLI 登录一次
npm login --scope=@wolfeng --auth-type=legacy --registry=https://npm.pkg.github.com</code></pre>
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem">
              <div class="docs-demo-row">
                <SesButton
                  v-for="mgr in (['npm', 'pnpm', 'yarn'] as const)"
                  :key="mgr"
                  size="sm"
                  :variant="installPkgMgr === mgr ? 'gold' : 'outline'"
                  @click="installPkgMgr = mgr"
                >
                  {{ mgr }}
                </SesButton>
              </div>
              <SesButton size="sm" variant="jade" :sound-freq="0" @click="copyInstallCmd">
                拓印命令
              </SesButton>
            </div>
            <pre class="docs-code"><code>{{ installCmd }}</code></pre>

            <h3 class="ses-slender-gold" style="margin: 1.25rem 0 0.5rem; font-size: 0.95rem">二、全局注册与按需引入</h3>
            <pre class="docs-code"><code>// 1. 全局安装插件（注入主题、声律与 SVG 宣纸滤镜）
import { createApp } from 'vue'
import { createSongUI } from '@wolfeng/song-ui-vue'
import '@wolfeng/song-ui-vue/styles'

createApp(App)
  .use(createSongUI({ theme: 'dark', sound: true }))
  .mount('#app')

// 2. 在业务组件中按需引入组件与组合式 API
import { SesButton, SesInput, SesForm, useTheme, useToast } from '@wolfeng/song-ui-vue'
import { songRules } from '@wolfeng/song-ui-core'</code></pre>

            <h3 class="ses-slender-gold" style="margin: 1.25rem 0 0.5rem; font-size: 0.95rem">三、从 GitHub 克隆并本地构建</h3>
            <pre class="docs-code"><code>git clone https://github.com/wolfeng/songUI.git
cd songUI
npm install
npm run build        # 依次构建 tokens / core / vue
npm run dev:docs     # 启动文档与大宋官网示例站</code></pre>
          </SesCard>
        </section>

        <!-- 2. Tokens & Style Library -->
        <section v-else-if="activeSection === 'tokens'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">Tokens &amp; 宋韵样式库 (<code>@wolfeng/song-ui-tokens</code> + <code>@wolfeng/song-ui-vue/styles</code>)</h2>
            <p class="docs-lead">不仅定义暗夜洒金与澄心昼景两套矿物色谱，还内置 4px 基准间距比例尺、文字排版层级、圆角与布局工具类，并同步导出 CSS 变量与 TypeScript 类型。</p>

            <h3 class="docs-h3">一、矿物色谱（点击色票复制并触发五声音阶共振）</h3>
            <div class="docs-swatch-grid">
              <button
                v-for="s in songTokens.paletteSwatches"
                :key="s.id"
                type="button"
                class="docs-swatch"
                @click="copySwatch(s.hex, s.name, s.freq)"
              >
                <div class="docs-swatch-color" :style="{ backgroundColor: s.hex }" />
                <div class="docs-swatch-name">{{ s.name }}</div>
                <div class="docs-swatch-hex">{{ s.hex }}</div>
              </button>
            </div>

            <hr class="ses-divider" />

            <h3 class="docs-h3">二、排版文字层级 (Typography Classes)</h3>
            <div class="ses-flex-col ses-gap-3 ses-mb-6">
              <div class="ses-flex ses-items-center ses-justify-between ses-pa-3 ses-rounded-md" style="border: 1px solid var(--ses-border-subtle)">
                <span class="ses-text-display">宋韵雅集</span>
                <code class="ses-text-mono">.ses-text-display (--ses-text-display: 2.25rem)</code>
              </div>
              <div class="ses-flex ses-items-center ses-justify-between ses-pa-3 ses-rounded-md" style="border: 1px solid var(--ses-border-subtle)">
                <span class="ses-text-h1">一级标题 · 宣和博古</span>
                <code class="ses-text-mono">.ses-text-h1 (1.75rem)</code>
              </div>
              <div class="ses-flex ses-items-center ses-justify-between ses-pa-3 ses-rounded-md" style="border: 1px solid var(--ses-border-subtle)">
                <span class="ses-text-h2">二级标题 · 汝窑天青</span>
                <code class="ses-text-mono">.ses-text-h2 (1.375rem)</code>
              </div>
              <div class="ses-flex ses-items-center ses-justify-between ses-pa-3 ses-rounded-md" style="border: 1px solid var(--ses-border-subtle)">
                <span class="ses-text-h3">三级标题 · 建隆元祐</span>
                <code class="ses-text-mono">.ses-text-h3 (1.125rem)</code>
              </div>
              <div class="ses-flex ses-items-center ses-justify-between ses-pa-3 ses-rounded-md" style="border: 1px solid var(--ses-border-subtle)">
                <span class="ses-text-body">正文排印 · 宋刻本线装书体，行高疏朗</span>
                <code class="ses-text-mono">.ses-text-body (0.9375rem / 1.6)</code>
              </div>
              <div class="ses-flex ses-items-center ses-justify-between ses-pa-3 ses-rounded-md" style="border: 1px solid var(--ses-border-subtle)">
                <span class="ses-text-caption">辅注题跋 · 用于图注、时辰标尺与元信息</span>
                <code class="ses-text-mono">.ses-text-caption (0.8125rem)</code>
              </div>
            </div>

            <h3 class="docs-h3">三、4px 基准间距与圆角比例尺 (Spacing &amp; Radius)</h3>
            <div class="ses-flex-col ses-gap-2 ses-mb-6">
              <div
                v-for="(val, key) in songTokens.spacing"
                :key="key"
                class="ses-flex ses-items-center ses-gap-4"
              >
                <code class="ses-text-mono" style="width: 130px">--ses-space-{{ key }}</code>
                <div
                  class="ses-rounded-xs"
                  :style="{ width: val === '0px' ? '2px' : val, height: '12px', background: 'var(--ses-gold)' }"
                />
                <span class="ses-text-caption">{{ val }} · <code>.ses-pa-{{ key }}</code> / <code>.ses-gap-{{ key }}</code></span>
              </div>
            </div>

            <div class="ses-flex ses-flex-wrap ses-gap-3 ses-mb-6">
              <div
                v-for="(val, key) in songTokens.radius"
                :key="key"
                :class="`ses-pa-3 ses-rounded-${key}`"
                style="border: 1px solid var(--ses-gold-dim); background: var(--ses-bg-elevated)"
              >
                <div class="ses-text-caption">.ses-rounded-{{ key }} ({{ val }})</div>
              </div>
            </div>
          </SesCard>
        </section>

        <!-- 3. SesButton & SesSeal -->
        <section v-else-if="activeSection === 'button'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesButton · 玉质玲珑钮 &amp; SesSeal · 朱砂闲章</h2>
            <p class="docs-lead">支持 <code>jade</code> / <code>gold</code> / <code>outline</code> 三种变体、茶盏水波涟漪与叩瓷声律。</p>

            <div class="docs-demo-row">
              <SesButton @click="toast.show('点击了天青主钮')">天青主钮</SesButton>
              <SesButton variant="gold" :sound-freq="784" @click="toast.show('点击了描金御赐')">描金御赐</SesButton>
              <SesButton variant="outline" :sound-freq="523.25" @click="toast.show('点击了素宣线框')">素宣线框</SesButton>
              <SesButton disabled>禁用状态</SesButton>
              <SesSeal interactive @click="toast.show('已钤盖「御书之宝」朱砂闲章')">钤印确认</SesSeal>
              <SesSeal color="malachite">已验入库</SesSeal>
            </div>
          </SesCard>
        </section>

        <!-- 4. SesSwitch -->
        <section v-else-if="activeSection === 'switch'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesSwitch · 榫卯滑闩开关</h2>
            <p class="docs-lead">支持标准 Vue 3 <code>v-model</code> 双向绑定与完整 <code>role="switch"</code> 无障碍语义。</p>

            <div class="docs-demo-col">
              <SesSwitch v-model="switchQuiet" label="焚香静室" />
              <SesSwitch v-model="switchStar" label="夜观星象" />
              <SesSwitch :model-value="false" label="禁闭状态" disabled />
            </div>
          </SesCard>
        </section>

        <!-- 5. SesInput & SesForm -->
        <section v-else-if="activeSection === 'input'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesInput · 素笺留痕与 SesForm · 奏疏校验</h2>
            <p class="docs-lead">
              支持单行题跋与多行手札，内置 32px 乌丝栏竖向水印网格与毫端落纸声效；配合 <code>SesForm</code> 与 <code>@wolfeng/song-ui-core</code> 的 <code>songRules</code> 规则引擎，可在失焦或呈递时自动呈现朱砂批注。
            </p>

            <SesForm ref="formRef" v-model="formValid" style="max-width: 560px" @submit="onMemorialSubmit">
              <div class="docs-demo-col">
                <SesInput
                  v-model="scrollTitle"
                  label="题跋卷名"
                  placeholder="例如：宣和丙午岁清明上河图跋"
                  :rules="titleRules"
                />
                <SesInput
                  v-model="scrollBody"
                  label="格物手札正文"
                  multiline
                  :rows="4"
                  placeholder="请陈条目（至少八字）……"
                  :rules="bodyRules"
                />
                <div class="docs-demo-row">
                  <SesButton type="submit" variant="gold">钤印呈递</SesButton>
                  <SesButton type="button" variant="outline" @click="formRef?.resetValidation()">拭去朱批</SesButton>
                  <SesSeal :color="formValid ? 'malachite' : 'cinnabar'">
                    {{ formValid ? '合乎程式' : '尚待校勘' }}
                  </SesSeal>
                </div>
              </div>
            </SesForm>
          </SesCard>
        </section>

        <!-- 5.5a SesSelect -->
        <section v-else-if="activeSection === 'select'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesSelect · 牙签书帙下拉选择器</h2>
            <p class="docs-lead">宋人藏书以象牙签题名垂于书衣之外，支持 <code>v-model</code>、点击外部收起与 <code>Escape</code> 键关闭。</p>

            <div class="docs-demo-col" style="max-width: 480px">
              <SesSelect v-model="selectedBook" :options="bookOptions" @change="(opt) => toast.show(`已抽选：《${opt.label}》`)" />
            </div>
          </SesCard>
        </section>

        <!-- 5.5b SesStepper -->
        <section v-else-if="activeSection === 'stepper'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesStepper · 筹算纵横步进器</h2>
            <p class="docs-lead">实时调用 <code>@wolfeng/song-ui-core</code> 中的秦九韶《数书九章》纵横筹策算法（个位纵式、十位横式交替）。</p>

            <div class="docs-demo-col" style="max-width: 480px">
              <SesStepper v-model="stepperCount" :min="1" :max="99" />
            </div>
          </SesCard>
        </section>

        <!-- 5.5b2 SesUpload -->
        <section v-else-if="activeSection === 'upload'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesUpload · 素笺入画呈卷上传</h2>
            <p class="docs-lead">支持点击择取与拖拽文书画卷上传，内置体积校验、文件列表展示与撤回移除操作。</p>

            <div class="docs-demo-col" style="max-width: 560px">
              <SesUpload
                v-model="uploadFiles"
                accept=".png,.jpg,.jpeg,.webp,.pdf,.txt,.md"
                :max-size-mb="5"
                @change="(files) => toast.show(`已收录 ${files.length} 份卷宗`)"
                @reject="(reason) => toast.show(reason)"
              />
              <SesUpload
                :model-value="[]"
                disabled
                title="秘阁封存 · 暂禁呈卷"
                hint="禁用状态示例"
              />
            </div>
          </SesCard>
        </section>

        <!-- 5.5b3 SesAvatarGroup -->
        <section v-else-if="activeSection === 'avatarGroup'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesAvatarGroup · 群贤毕至头像组</h2>
            <p class="docs-lead">叠翠圆章式人物群像组件，支持 <code>max</code> 折叠计数、三种尺寸、多种宋韵色调与悬停抬起交互。</p>

            <div class="docs-demo-col" style="gap: 1.25rem">
              <div class="docs-demo-row">
                <SesAvatarGroup
                  :items="avatarScholars"
                  :max="5"
                  size="sm"
                  @select="(item) => toast.show(`${item.name} · ${item.title ?? ''}`)"
                />
                <span class="ses-text-caption">小号（sm · max=5）</span>
              </div>
              <div class="docs-demo-row">
                <SesAvatarGroup
                  :items="avatarScholars"
                  :max="5"
                  size="md"
                  @select="(item) => toast.show(`${item.name} · ${item.title ?? ''}`)"
                />
                <span class="ses-text-caption">中号（md · max=5）</span>
              </div>
              <div class="docs-demo-row">
                <SesAvatarGroup
                  :items="avatarScholars"
                  :max="4"
                  size="lg"
                  @select="(item) => toast.show(`${item.name} · ${item.title ?? ''}`)"
                />
                <span class="ses-text-caption">大号（lg · max=4）</span>
              </div>
            </div>
          </SesCard>
        </section>

        <!-- 5.5b4 SesRating -->
        <section v-else-if="activeSection === 'rating'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesRating · 器物品鉴星等</h2>
            <p class="docs-lead">以「凡品、中品、佳品、妙品、神品」五等鉴赏器物优劣，点击播响五声音阶，支持悬停预览与方向键微调。</p>

            <div class="docs-demo-col" style="gap: 1rem">
              <div class="docs-demo-row">
                <SesRating
                  v-model="ratingScore"
                  size="lg"
                  @change="(val) => toast.show(`已品定为第 ${val} 等`)"
                />
              </div>
              <div class="docs-demo-row">
                <SesRating :model-value="5" size="md" readonly />
                <span class="ses-text-caption">只读御览（readonly）</span>
              </div>
              <div class="docs-demo-row">
                <SesRating :model-value="3" size="sm" :show-label="false" readonly />
                <span class="ses-text-caption">小号无标签（sm）</span>
              </div>
            </div>
          </SesCard>
        </section>

        <!-- 5.5c SesGuqinSlider -->
        <section v-else-if="activeSection === 'slider'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesGuqinSlider · 七弦琴轸滑块</h2>
            <p class="docs-lead">拖动古铜琴轸调节数值，琴弦随张力产生实时弧度形变并拨响五声音阶（宫商角徵羽），同时支持键盘方向键微调。</p>

            <div class="docs-demo-col" style="max-width: 560px">
              <SesGuqinSlider v-model="guqinVal" label="默认五音年号刻度" />
              <SesGuqinSlider v-model="customGuqinVal" label="自定义刻度（marks）" :marks="customMarks" />
            </div>
          </SesCard>
        </section>

        <!-- 5.6 SesTable & SesPagination -->
        <section v-else-if="activeSection === 'table'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesTable · 鱼鳞图册 &amp; SesPagination · 胶泥活字分页</h2>
            <p class="docs-lead">支持列排序、自定义单元格插槽（<code>#cell-&#123;key&#125;</code>）以及大写汉字活字印版分页。</p>

            <SesTable :columns="tableColumns" :rows="currentTableRows">
              <template #cell-name="{ value }">
                <strong style="color: var(--ses-ink-heavy)">{{ value }}</strong>
              </template>
              <template #cell-tag="{ value }">
                <span class="ses-brocade-tag" style="padding: 0.12rem 0.55rem; font-size: 0.72rem">{{ value }}</span>
              </template>
              <template #cell-val="{ value }">
                <span style="font-family: monospace">{{ Number(value).toLocaleString() }}</span>
              </template>
              <template #cell-seal="{ row, value }">
                <SesSeal :color="row.green ? 'malachite' : 'cinnabar'" style="font-size: 0.68rem">
                  {{ value }}
                </SesSeal>
              </template>
            </SesTable>

            <div style="margin-top: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem">
              <span style="font-size: 0.78rem; color: var(--ses-ink-light)">毕昇胶泥活字印版 · 共贰版</span>
              <SesPagination v-model="tablePage" :total-pages="2" />
            </div>
          </SesCard>
        </section>

        <!-- 5.7a SesAccordion -->
        <section v-else-if="activeSection === 'accordion'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesAccordion · 经折装册页</h2>
            <p class="docs-lead">仿宋代梵夹装与经折装折叠面板，展开时自动居中并触发拂袖声效。</p>
            <SesAccordion :items="accordionItems" />
          </SesCard>
        </section>

        <!-- 5.7b SesWoodblockReader -->
        <section v-else-if="activeSection === 'woodblock'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesWoodblockReader · 乌丝栏竖排善本</h2>
            <p class="docs-lead">42px 严格对齐乌丝栏竖排善本容器，支持直排与横排阅读一键切换。</p>
            <SesWoodblockReader v-model:vertical="readerVertical" title="钦定宣和博古图录·汝窑青瓷说">
              <p style="margin: 0">
                汝州新窑器，出北地清凉寺。色若雨过天青云破之处，汁水莹厚如堆脂，汁中棕眼隐若蟹爪，底有细小芝麻挣针。凡立器、饮器、花囊、水仙盆之属，皆温润静穆，诚本朝诸窑之冠冕也。
              </p>
            </SesWoodblockReader>
          </SesCard>
        </section>

        <!-- 5.8a SesTimepiece -->
        <section v-else-if="activeSection === 'timepiece'" class="docs-section">
          <SesCard class="docs-panel">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.65rem">
              <h2 class="ses-slender-gold docs-h2" style="margin: 0">SesTimepiece · 赤道式日晷与莲花铜壶滴漏</h2>
              <SesButton size="sm" variant="gold" @click="handleToggleTheme">
                {{ theme.isDark.value ? '☀️ 切换澄心昼景 · 观赤道日晷' : '🌙 切换暗夜洒金 · 观铜壶滴漏' }}
              </SesButton>
            </div>
            <p class="docs-lead">
              <strong>双态器物联动</strong>：澄心昼景自动呈现「赤道式日晷」，切换至暗夜洒金则自动切换为「浮箭莲花刻漏」（也可点击右上角或上方按钮切换主题体验）。
            </p>
            <SesTimepiece />
          </SesCard>
        </section>

        <!-- 5.8b SesIncenseTimer -->
        <section v-else-if="activeSection === 'incense'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesIncenseTimer · 一柱燃香计时器</h2>
            <p class="docs-lead">模拟线香燃尽余烬微光与青烟袅袅，香尽自动鸣响古刹铜磬并触发 <code>@finish</code> 回调。</p>
            <SesIncenseTimer @finish="toast.show('一柱香尽，古刹铜磬清鸣')" />
          </SesCard>
        </section>

        <!-- 5.9a SesMountainChart -->
        <section v-else-if="activeSection === 'mountain'" class="docs-section">
          <SesCard class="docs-panel">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem">
              <h2 class="ses-slender-gold docs-h2" style="margin: 0">SesMountainChart · 千里江山青绿叠嶂图</h2>
              <div style="display: flex; gap: 0.5rem">
                <SesButton size="sm" :variant="mountainMode === 'grain' ? 'gold' : 'jade'" @click="mountainMode = 'grain'">汴京漕粮</SesButton>
                <SesButton size="sm" :variant="mountainMode === 'kiln' ? 'gold' : 'jade'" @click="mountainMode = 'kiln'">官窑岁贡</SesButton>
              </div>
            </div>
            <p class="docs-lead">师法王希孟青绿设色，采用 Catmull-Rom 样条曲线平滑过渡，悬停山脊可检视月令详数。</p>
            <SesMountainChart
              :data="mountainSeries"
              :series-back-name="mountainMode === 'grain' ? '石青主峰（总入库）' : '石青主峰（岁贡总量）'"
              :series-front-name="mountainMode === 'grain' ? '石绿前坡（御仓留存）' : '石绿前坡（拣退余器）'"
            />
          </SesCard>
        </section>

        <!-- 5.9b SesAstrolabeGauge -->
        <section v-else-if="activeSection === 'astrolabe'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesAstrolabeGauge · 司南与浑天仪盘</h2>
            <p class="docs-lead">二十四节气青铜罗盘刻度，点击「拨动司南」触发磁勺阻尼旋转与叩瓷清音。</p>
            <div style="max-width: 360px">
              <SesAstrolabeGauge />
            </div>
          </SesCard>
        </section>

        <!-- 5.10 SesScrollModal & SesScreenDrawer -->
        <section v-else-if="activeSection === 'overlays'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesScrollModal · 古卷徐开 &amp; SesScreenDrawer · 折枝屏风</h2>
            <p class="docs-lead">突破传统居中黑框弹窗，还原卷轴左右徐展与紫檀独扇屏风侧滑意境（支持 Escape 键与遮罩收起）。</p>
            <div class="docs-demo-row">
              <SesButton @click="showScrollModal = true">📜 展阅《千里江山》古卷弹窗</SesButton>
              <SesButton variant="gold" @click="showScreenDrawer = true">🪟 推开《折枝山水》屏风抽屉</SesButton>
            </div>
          </SesCard>
        </section>

        <!-- 6. SesAlert & Toast -->
        <section v-else-if="activeSection === 'alert'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesAlert · 急脚递金字牌 &amp; useToast</h2>
            <p class="docs-lead">内置朱漆泥金「金字牌」急件告警与温润青瓷提示，配合全局 <code>useToast()</code> 使用。</p>

            <div class="docs-demo-col" style="max-width: 620px">
              <SesAlert title="⚡ 御前急脚递 · 金字牌" badge="日行五百里">
                汴河桃花汛水位已逾岸标三尺，请即刻启闭汴口水门，调拨漕船入避风澳。
              </SesAlert>
              <SesAlert variant="celadon" title="秘阁修撰通知" badge="澄心堂">
                今日卯时已校定《营造法式》大木作图谱三卷，可于挂画篇检视。
              </SesAlert>
              <div>
                <SesButton size="sm" @click="toast.show('已发出「双龙小玺」全局通知')">触发全局 Toast</SesButton>
              </div>
            </div>
          </SesCard>
        </section>

        <section v-else-if="activeSection === 'tabs'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesTabs · 卷首题签分页</h2>
            <p class="docs-lead">支持键盘左右方向键切换题签、徽章计数、禁用态与琴音反馈。</p>

            <div class="docs-demo-col">
              <SesTabs v-model="activeTab" :items="tabItems" />
              <div style="padding: 1rem; border-radius: 4px; background: var(--ses-bg-subtle); font-size: 0.85rem; line-height: 1.8">
                <template v-if="activeTab === 'jing'">
                  <strong>经部</strong>：收录周易、尚书、毛诗、三礼、春秋诸疏，秘书省校定善本。
                </template>
                <template v-else-if="activeTab === 'shi'">
                  <strong>史部</strong>：收录资治通鉴、新唐书及宋代会要诸典，计二十四门。
                </template>
                <template v-else>
                  <strong>子部</strong>：收录梦溪笔谈、营造法式及周张二程理学著述。
                </template>
              </div>
            </div>
          </SesCard>
        </section>

        <section v-else-if="activeSection === 'tags'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesTag · 竹签牙牌标签</h2>
            <p class="docs-lead">支持青瓷、朱砂、泥金、淡墨四种釉色，并提供 <code>sm</code> / <code>md</code> 尺寸与可移除关闭按钮。</p>

            <div class="docs-demo-col">
              <div class="docs-demo-row">
                <SesTag
                  v-for="tag in demoTags"
                  :key="tag.id"
                  :variant="tag.variant"
                  closable
                  @close="demoTags = demoTags.filter((t) => t.id !== tag.id)"
                >
                  {{ tag.label }}
                </SesTag>
                <SesButton
                  v-if="demoTags.length < 4"
                  size="sm"
                  variant="outline"
                  @click="demoTags = [
                    { id: 1, label: '天青釉 · 汝窑', variant: 'celadon' },
                    { id: 2, label: '宣和御览', variant: 'cinnabar' },
                    { id: 3, label: '泥金题签', variant: 'gold' },
                    { id: 4, label: '崇文总目', variant: 'ink' }
                  ]"
                >
                  重置牙牌
                </SesButton>
              </div>
              <div class="docs-demo-row">
                <SesTag size="sm" variant="celadon">小号 · 青瓷</SesTag>
                <SesTag size="sm" variant="cinnabar">小号 · 朱砂</SesTag>
                <SesTag size="sm" variant="gold">小号 · 泥金</SesTag>
                <SesTag size="sm" variant="ink">小号 · 淡墨</SesTag>
              </div>
            </div>
          </SesCard>
        </section>

        <section v-else-if="activeSection === 'radio'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesRadioGroup · 螺钿印章单选</h2>
            <p class="docs-lead">朱砂印泥配象牙白螺钿内点，支持横/纵向排列、禁用项与 <code>SesForm</code> 规则校验。</p>

            <div class="docs-demo-col" style="max-width: 480px">
              <SesRadioGroup v-model="selectedKiln" label="螺钿印章单选 (Radio)" direction="vertical" :options="kilnOptions" />
            </div>
          </SesCard>
        </section>

        <section v-else-if="activeSection === 'checkbox'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesCheckbox · 茶百戏多选</h2>
            <p class="docs-lead">青瓷微透底色配水波纹（<code>~</code>）勾选符号，支持 <code>v-model</code>、半选态、禁用态及 <code>SesForm</code> 校验。</p>

            <div class="docs-demo-col" style="gap: 0.55rem; max-width: 480px">
              <SesCheckbox v-model="agreedCheck" label="汤花拂面(水丹青)" />
              <SesCheckbox v-model="partialCheck" label="龙凤团茶(研膏)" />
              <SesCheckbox v-model="thirdCheck" label="七汤点茶法" />
              <SesCheckbox :model-value="false" indeterminate label="部分入库（半选态）" />
              <SesCheckbox :model-value="false" disabled label="封存禁阅（禁用态）" />
            </div>
          </SesCard>
        </section>

        <section v-else-if="activeSection === 'widgets'" class="docs-section">
          <SesCard class="docs-panel">
            <h2 class="ses-slender-gold docs-h2">SesDianchaLoader · 建盏斗茶加载、SesProgress · 进度与浮笺</h2>
            <p class="docs-lead">
              还原兔毫黑釉建盏注水击拂、七汤乳雾渐盈的宋代点茶加载器，并与水墨进度条、浮笺提示及卷次面包屑同台展示。
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; align-items: center">
              <div style="display: flex; justify-content: center; padding: 0.5rem 0">
                <SesDianchaLoader
                  v-model="dianchaPct"
                  @complete="toast.show('七汤点茶已成，乳雾咬盏不散！')"
                />
              </div>

              <div class="docs-demo-col">
                <SesBreadcrumbs
                  :items="breadcrumbItems"
                  @navigate="(item) => toast.show(`跳转至「${item.label}」`)"
                />

                <SesProgress :value="progressVal" label="秘阁典籍校勘进度" variant="celadon" />
                <SesProgress indeterminate label="汴河漕运实时调拨中" variant="gold" />

                <div class="docs-demo-row">
                  <SesButton size="sm" variant="outline" @click="progressVal = Math.max(0, progressVal - 15)">− 15%</SesButton>
                  <SesButton size="sm" variant="outline" @click="progressVal = Math.min(100, progressVal + 15)">+ 15%</SesButton>
                  <SesTooltip text="雨过天青云破处，这般颜色做将来" placement="top">
                    <SesButton size="sm" variant="jade">悬停观浮笺（上）</SesButton>
                  </SesTooltip>
                  <SesTooltip text="宣和御览 · 秘阁珍藏" placement="bottom">
                    <SesButton size="sm" variant="gold">悬停观浮笺（下）</SesButton>
                  </SesTooltip>
                </div>
              </div>
            </div>
          </SesCard>
        </section>

        <SesCard v-if="componentApiMap[activeSection]" class="docs-panel" style="margin-top: 1.25rem">
          <ApiReference :entries="componentApiMap[activeSection]" />
        </SesCard>
      </main>
    </div>

    <SesScrollModal v-model="showScrollModal" title="《千里江山图》卷跋批阅" subtitle="宣和御览 · 秘阁珍藏">
      政和三年闰四月八日赐。希孟年十八岁，昔在画学为生徒，召入禁中文书库，数以画献，未甚工。上知其性可教，遂诲谕之，亲授其法，不逾半岁，乃以此图进。
      <template #footer="{ close }">
        <SesButton size="sm" variant="outline" @click="close">缓缓收卷</SesButton>
        <SesButton size="sm" variant="gold" @click="toast.show('已钤盖「双龙小玺」御印'); close()">钤印批复</SesButton>
      </template>
    </SesScrollModal>

    <SesScreenDrawer v-model="showScreenDrawer" title="藏经百宝嵌 · 器物录" badge="屏风">
      <p style="font-size: 0.8rem; line-height: 1.7; color: var(--ses-ink-medium)">
        宋代文人书斋常设“独扇山水屏风”以隔尘嚣。此抽屉边缘采用紫檀木榫卯收边，内置设计系统核心交互参数：
      </p>
      <div style="margin-top: 1rem; padding: 0.85rem; border-radius: 4px; border: 0.5px solid var(--ses-border-hairline); background: var(--ses-bg-subtle); font-size: 0.78rem">
        <strong>缓动曲线：</strong> <code>cubic-bezier(0.22, 1, 0.36, 1)</code>
      </div>
    </SesScreenDrawer>

    <SesToast />

    <!-- ⌘K 组件快捷搜索面板 -->
    <div
      v-if="searchOpen"
      class="docs-search-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="寻一件器物"
      @click.self="closeSearch"
    >
      <div class="docs-search-dialog">
        <div class="docs-search-input-row">
          <span class="docs-search-icon" aria-hidden="true">⌕</span>
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            class="docs-search-input"
            placeholder="输入器物名、组件名（如 日晷 / Upload / Slider）..."
          />
          <button type="button" class="docs-search-esc" @click="closeSearch">ESC</button>
        </div>

        <div class="docs-search-results">
          <button
            v-for="(item, idx) in filteredNavItems"
            :key="item.id"
            type="button"
            class="docs-search-item"
            :class="{ 'is-active': idx === searchActiveIdx }"
            @mouseenter="searchActiveIdx = idx"
            @click="chooseSearchResult(item.id)"
          >
            <div>
              <div class="docs-search-item-title">{{ item.title }}</div>
              <div class="docs-search-item-sub">{{ item.subtitle }}</div>
            </div>
            <span class="docs-search-item-go">↵</span>
          </button>

          <div v-if="filteredNavItems.length === 0" class="docs-search-empty">
            未寻得「{{ searchQuery }}」相关器物，可换个关键词试试
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:global(html),
:global(body) {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.docs-shell {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--ses-bg-canvas);
  color: var(--ses-ink-medium);
  font-family: var(--ses-font-serif);
  transition: background-color 0.75s var(--ses-ease-scroll), color 0.75s var(--ses-ease-scroll);
}

.docs-header {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(12px);
  background-color: color-mix(in srgb, var(--ses-bg-sidebar) 90%, transparent);
  border-bottom: 1px solid var(--ses-border-hairline);
}

.docs-header-inner {
  max-width: var(--ses-bp-xl);
  margin: 0 auto;
  padding: var(--ses-space-3) var(--ses-space-6);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--ses-space-4);
}

.docs-brand {
  display: flex;
  align-items: center;
  gap: var(--ses-space-3);
}

.docs-brand-title {
  display: flex;
  align-items: center;
  gap: var(--ses-space-2);
}

.docs-badge {
  font-size: 0.65rem;
  padding: 2px var(--ses-space-2);
  border: 1px solid var(--ses-border-gold);
  border-radius: var(--ses-radius-xs);
  color: var(--ses-gold);
}

.docs-brand-sub {
  margin: 2px 0 0;
  font-size: 0.72rem;
  letter-spacing: var(--ses-tracking-wide);
  color: var(--ses-ink-light);
}

.docs-actions {
  display: flex;
  align-items: center;
  gap: var(--ses-space-2);
}

.docs-layout {
  width: 100%;
  max-width: var(--ses-bp-xl);
  margin: 0 auto;
  padding: var(--ses-space-6) var(--ses-space-6) 0;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: minmax(0, 1fr);
  gap: var(--ses-space-6);
}

.docs-sidebar {
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--ses-space-3);
}

.docs-search-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 0.5px solid var(--ses-border-gold);
  border-radius: var(--ses-radius-sm);
  background: var(--ses-bg-subtle);
  color: var(--ses-ink-medium);
  font-size: var(--ses-text-caption);
  cursor: pointer;
  transition: border-color 0.25s ease, color 0.25s ease;
}

.docs-search-trigger:hover {
  border-color: var(--ses-gold);
  color: var(--ses-ink-heavy);
}

.docs-search-trigger kbd {
  font-family: var(--ses-font-mono);
  font-size: 0.7rem;
  padding: 0.1rem 0.38rem;
  border: 0.5px solid var(--ses-border-hairline);
  border-radius: 3px;
  color: var(--ses-ink-light);
  background: var(--ses-bg-canvas);
}

.docs-nav {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: var(--ses-space-2);
  padding-bottom: var(--ses-space-8);
  display: flex;
  flex-direction: column;
  gap: var(--ses-space-2);
  scrollbar-width: thin;
  scrollbar-color: var(--ses-border-gold) transparent;
}

.docs-search-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(15, 20, 18, 0.52);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 12vh 1rem 2rem;
}

.docs-search-dialog {
  width: 100%;
  max-width: 540px;
  background: var(--ses-bg-canvas);
  border: 1px solid var(--ses-border-gold);
  border-radius: var(--ses-radius-md);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.docs-search-input-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.8rem 1rem;
  border-bottom: 0.5px solid var(--ses-border-hairline);
  background: var(--ses-bg-subtle);
}

.docs-search-icon {
  color: var(--ses-gold);
  font-size: 1rem;
}

.docs-search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none !important;
  box-shadow: none !important;
  background: transparent;
  color: var(--ses-ink-heavy);
  font-size: 0.92rem;
}

.docs-search-esc {
  font-family: var(--ses-font-mono);
  font-size: 0.68rem;
  padding: 0.15rem 0.45rem;
  border: 0.5px solid var(--ses-border-hairline);
  border-radius: 3px;
  background: var(--ses-bg-canvas);
  color: var(--ses-ink-light);
  cursor: pointer;
}

.docs-search-results {
  max-height: 360px;
  overflow-y: auto;
  padding: 0.45rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.docs-search-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0.85rem;
  border: none;
  border-radius: var(--ses-radius-sm);
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.docs-search-item.is-active,
.docs-search-item:hover {
  background: rgba(143, 160, 139, 0.16);
}

.docs-search-item-title {
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--ses-ink-heavy);
}

.docs-search-item-sub {
  font-size: 0.72rem;
  color: var(--ses-ink-light);
}

.docs-search-item-go {
  font-family: var(--ses-font-mono);
  font-size: 0.78rem;
  color: var(--ses-gold);
  opacity: 0;
}

.docs-search-item.is-active .docs-search-item-go {
  opacity: 1;
}

.docs-search-empty {
  padding: 2rem 1rem;
  text-align: center;
  font-size: var(--ses-text-caption);
  color: var(--ses-ink-light);
}

.docs-main {
  min-height: 0;
  height: 100%;
  overflow-y: auto;
  padding-right: var(--ses-space-2);
  padding-bottom: var(--ses-space-10);
  scrollbar-width: thin;
  scrollbar-color: var(--ses-border-gold) transparent;
}

@media (max-width: 860px) {
  :global(html),
  :global(body) {
    height: auto;
    overflow: auto;
  }
  .docs-shell {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }
  .docs-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    overflow: visible;
    padding-bottom: 2rem;
  }
  .docs-nav,
  .docs-main {
    height: auto;
    overflow-y: visible;
    padding-right: 0;
  }
}

.docs-nav-item {
  font-family: var(--ses-font-serif);
  text-align: left;
  padding: var(--ses-space-3) var(--ses-space-4);
  border-radius: var(--ses-radius-sm);
  background: var(--ses-bg-subtle);
  border: 0.5px solid var(--ses-border-hairline);
  color: var(--ses-ink-medium);
  cursor: pointer;
  transition: all 0.35s var(--ses-ease-scroll);
}

.docs-nav-item:hover {
  border-color: var(--ses-border-gold);
  color: var(--ses-ink-heavy);
}

.docs-nav-item.active {
  background: var(--ses-jade-grad);
  border-color: var(--ses-gold);
  color: var(--ses-ink-heavy);
}

.docs-nav-title {
  font-size: var(--ses-text-body);
  font-weight: 600;
  letter-spacing: var(--ses-tracking-normal);
}

.docs-nav-sub {
  font-size: 0.72rem;
  color: var(--ses-ink-light);
  margin-top: 2px;
}

.docs-panel {
  padding: var(--ses-space-8);
}

.docs-h2 {
  margin: var(--ses-space-3) 0 var(--ses-space-2);
  font-size: var(--ses-text-h2);
  line-height: var(--ses-leading-tight);
}

.docs-h3 {
  margin: var(--ses-space-6) 0 var(--ses-space-3);
  font-size: var(--ses-text-h3);
  color: var(--ses-ink-heavy);
  letter-spacing: var(--ses-tracking-wide);
}

.docs-lead {
  font-size: var(--ses-text-body);
  line-height: var(--ses-leading-relaxed);
  margin-bottom: var(--ses-space-6);
}

.docs-code {
  background: var(--ses-bg-sidebar);
  border: 0.5px solid var(--ses-border-hairline);
  border-radius: var(--ses-radius-sm);
  padding: var(--ses-space-4) var(--ses-space-5);
  font-family: var(--ses-font-mono);
  font-size: var(--ses-text-mono);
  line-height: var(--ses-leading-normal);
  overflow-x: auto;
  color: var(--ses-celadon-deep);
}

.docs-core-preview {
  margin-top: var(--ses-space-6);
  padding: var(--ses-space-4) var(--ses-space-5);
  border-radius: var(--ses-radius-sm);
  border: 0.5px solid var(--ses-border-gold);
  background: var(--ses-bg-canvas);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ses-space-4);
}

.docs-swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--ses-space-3);
}

.docs-swatch {
  font-family: var(--ses-font-serif);
  padding: var(--ses-space-3);
  border-radius: var(--ses-radius-sm);
  border: 0.5px solid var(--ses-border-hairline);
  background: var(--ses-bg-canvas);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.docs-swatch:hover {
  border-color: var(--ses-gold);
}

.docs-swatch-color {
  height: 36px;
  border-radius: var(--ses-radius-xs);
  margin-bottom: var(--ses-space-2);
  border: 1px solid rgba(128, 128, 128, 0.2);
}

.docs-swatch-name {
  font-size: var(--ses-text-caption);
  font-weight: 600;
  color: var(--ses-ink-heavy);
}

.docs-swatch-hex {
  font-size: 0.72rem;
  font-family: var(--ses-font-mono);
  color: var(--ses-ink-light);
}

.docs-demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ses-space-3);
}

.docs-demo-col {
  display: flex;
  flex-direction: column;
  gap: var(--ses-space-4);
}

.docs-api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--ses-text-caption);
}

.docs-api-table th {
  text-align: left;
  padding: var(--ses-space-3) var(--ses-space-4);
  border-top: 1.5px solid var(--ses-ink-heavy);
  border-bottom: 1.5px solid var(--ses-ink-heavy);
  background: var(--ses-bg-subtle);
  color: var(--ses-ink-heavy);
}

.docs-api-table td {
  padding: var(--ses-space-3) var(--ses-space-4);
  border-bottom: 0.5px solid var(--ses-border-hairline);
}
</style>
