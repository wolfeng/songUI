<script setup lang="ts">
import { computed, ref } from 'vue';
import { getShichenName, getNightWatchLabel, songRules } from '@song-ui/core';
import {
  useTheme,
  useSound,
  useToast,
  SesAlert,
  SesAccordion,
  SesAstrolabeGauge,
  SesBreadcrumbs,
  SesButton,
  SesCard,
  SesCheckbox,
  SesDianchaLoader,
  SesForm,
  SesGuqinSlider,
  SesIncenseTimer,
  SesInput,
  SesMountainChart,
  SesPagination,
  SesProgress,
  SesRadioGroup,
  SesScreenDrawer,
  SesScrollModal,
  SesSeal,
  SesSelect,
  SesStepper,
  SesSwitch,
  SesTable,
  SesTabs,
  SesTag,
  SesTimepiece,
  SesToast,
  SesTooltip,
  SesUpload,
  SesWoodblockReader
} from '@song-ui/vue';

type PageId = 'home' | 'governance' | 'culture' | 'crafts';

const theme = useTheme();
const sound = useSound();
const toast = useToast();

const activePage = ref<PageId>('home');
const siteLoading = ref(true);
const loadPct = ref(8);
const pageTabs = [
  { value: 'home', label: '国朝首页' },
  { value: 'governance', label: '政务民生' },
  { value: 'culture', label: '文教典籍' },
  { value: 'crafts', label: '百工名窑' }
];

const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
const shichenNow = getShichenName(nowMins);
const timepieceMins = ref(nowMins);

// 首页：大晟雅乐与四方政通仪盘
const courtTerms = [
  { label: '京畿路', value: 94, deg: 35 },
  { label: '两浙路', value: 96, deg: 125 },
  { label: '成都府路', value: 86, deg: 215 },
  { label: '广南东路', value: 81, deg: 305 }
];
const courtMusicTension = ref(58);
const taixueProgress = ref(82);
const canalProgress = ref(68);

// 政务民生：户部岁入走势、州府鱼鳞册、奏疏呈递
const revenueYear = ref<'yuanyou' | 'xining'>('yuanyou');
const revenueDatasets = {
  yuanyou: [
    { label: '正月', backValue: 310, frontValue: 185, unit: '万石' },
    { label: '二月', backValue: 480, frontValue: 320, unit: '万石' },
    { label: '三月', backValue: 645, frontValue: 470, unit: '万石' },
    { label: '四月', backValue: 410, frontValue: 265, unit: '万石' },
    { label: '五月', backValue: 335, frontValue: 210, unit: '万石' },
    { label: '六月', backValue: 590, frontValue: 430, unit: '万石' },
    { label: '七月', backValue: 465, frontValue: 315, unit: '万石' },
    { label: '八月', backValue: 730, frontValue: 540, unit: '万石' },
    { label: '九月', backValue: 860, frontValue: 655, unit: '万石' },
    { label: '十月', backValue: 690, frontValue: 510, unit: '万石' },
    { label: '冬月', backValue: 390, frontValue: 245, unit: '万石' },
    { label: '腊月', backValue: 560, frontValue: 380, unit: '万石' }
  ],
  xining: [
    { label: '正月', backValue: 350, frontValue: 215, unit: '万石' },
    { label: '二月', backValue: 590, frontValue: 410, unit: '万石' },
    { label: '三月', backValue: 520, frontValue: 365, unit: '万石' },
    { label: '四月', backValue: 360, frontValue: 225, unit: '万石' },
    { label: '五月', backValue: 495, frontValue: 340, unit: '万石' },
    { label: '六月', backValue: 780, frontValue: 590, unit: '万石' },
    { label: '七月', backValue: 420, frontValue: 280, unit: '万石' },
    { label: '八月', backValue: 615, frontValue: 455, unit: '万石' },
    { label: '九月', backValue: 745, frontValue: 560, unit: '万石' },
    { label: '十月', backValue: 810, frontValue: 615, unit: '万石' },
    { label: '冬月', backValue: 340, frontValue: 205, unit: '万石' },
    { label: '腊月', backValue: 620, frontValue: 445, unit: '万石' }
  ]
};
const revenueData = computed(() => revenueDatasets[revenueYear.value]);
const totalBackRevenue = computed(() => revenueData.value.reduce((s, d) => s + d.backValue, 0));
const totalFrontRevenue = computed(() => revenueData.value.reduce((s, d) => s + d.frontValue, 0));
const canalSharePct = computed(() => ((totalFrontRevenue.value / totalBackRevenue.value) * 100).toFixed(1));
const peakRevenueMonth = computed(() =>
  revenueData.value.reduce((best, d) => (d.backValue > best.backValue ? d : best), revenueData.value[0])
);

const ledgerPage = ref(1);
const ledgerColumns = [
  { key: 'prefecture', title: '州府名号', sortable: true },
  { key: 'specialty', title: '土贡 / 专司', sortable: true },
  { key: 'tier', title: '贡赋评级', sortable: false },
  { key: 'grain', title: '岁运粮米（万石）', sortable: true },
  { key: 'status', title: '核验钤印', sortable: false }
];
const allLedgerRows = [
  { prefecture: '东京 · 开封府', specialty: '京畿漕转 · 皇城宿卫', tier: '京畿首辅', grain: 145, status: '已入太仓', verified: true },
  { prefecture: '杭州 · 临安府', specialty: '两浙丝绸 · 秘色瓷器', tier: '东南财赋', grain: 192, status: '已入太仓', verified: true },
  { prefecture: '益州 · 成都府', specialty: '蜀锦交子 · 建茶转运', tier: '蜀道专司', grain: 118, status: '在途核验', verified: false },
  { prefecture: '泉州 · 清源郡', specialty: '市舶海商 · 香药瓷器', tier: '海舶重镇', grain: 94, status: '已入太仓', verified: true },
  { prefecture: '苏州 · 平江府', specialty: '苏湖熟粮 · 太湖水利', tier: '吴越粮仓', grain: 215, status: '已入太仓', verified: true },
  { prefecture: '潭州 · 长沙郡', specialty: '岳麓书院 · 湘茶铜铁', tier: '湖广枢纽', grain: 108, status: '在途核验', verified: false }
];
const pagedLedgerRows = computed(() => {
  const start = (ledgerPage.value - 1) * 3;
  return allLedgerRows.slice(start, start + 3);
});

const memorialValid = ref(true);
const targetMinistry = ref('zhongshu');
const ministryOptions = [
  { value: 'zhongshu', label: '中书门下（政事堂）', meta: '宰执参知政事' },
  { value: 'sansi', label: '三司使（户部盐铁度支）', meta: '天下财赋总司' },
  { value: 'mishu', label: '秘书省（崇文院秘阁）', meta: '典籍编修校勘' }
];
const memorialTitle = ref('请疏浚汴河广济渠并设平准仓奏');
const memorialTitleRules = [songRules.required('奏疏标题不可留白'), songRules.minLength(5, '标题不少于五字')];
const memorialUrgency = ref('normal');
const urgencyOptions = [
  { label: '常程递', value: 'normal' },
  { label: '急脚递', value: 'express' },
  { label: '金字牌递', value: 'gold' }
];
const memorialChecked = ref(true);
const submittedMemorials = ref([
  {
    title: '请修汴京内城水门兼疏惠民河疏',
    ministry: '三司使（户部盐铁度支）',
    urgency: '急脚递',
    time: '元祐三年九月初八'
  },
  {
    title: '崇文院请增刻《资治通鉴》善本奏',
    ministry: '秘书省（崇文院秘阁）',
    urgency: '常程递',
    time: '元祐三年九月初十'
  }
]);

function submitMemorial({ valid }: { valid: boolean }) {
  if (valid && memorialChecked.value) {
    sound.playChime(784);
    const ministryObj = ministryOptions.find((m) => m.value === targetMinistry.value);
    const urgencyLabel =
      memorialUrgency.value === 'gold'
        ? '金字牌递'
        : memorialUrgency.value === 'express'
          ? '急脚递'
          : '常程递';
    submittedMemorials.value.unshift({
      title: memorialTitle.value,
      ministry: ministryObj?.label ?? '中书门下',
      urgency: urgencyLabel,
      time: `今日 · ${shichenNow}`
    });
    toast.show(`奏疏《${memorialTitle.value}》已按「${urgencyLabel}」发往政事堂并归档`);
  } else {
    toast.show('请补全奏疏标题并确认印信核验');
  }
}

// 文教典籍：善本切换、经折制度、静修焚香
const verticalReading = ref(true);
const submittedScrolls = ref<File[]>([]);
const activeClassicId = ref('mengxi');
const classics = [
  {
    id: 'mengxi',
    title: '《梦溪笔谈 · 技艺》',
    paragraphs: [
      '庆历中，有布衣毕昇，又为活版。其法用胶泥刻字，薄如钱唇，每字为一印，火烧令坚。',
      '先设一铁板，其上以松脂、蜡和纸灰之类冒之。欲印，则以一铁范置铁板上，乃密布字印，满铁范为一板，持就火炀之；药稍镕，则以一平板按其面，则字平如砥。',
      '若止印三二本，未为简易；若印数十百千本，则极为神速。常作二铁板，一板印刷，一板已自布字，此印者才毕，则第二板已具，更互用之，瞬息可就。'
    ]
  },
  {
    id: 'yingzao',
    title: '《营造法式 · 总释》',
    paragraphs: [
      '凡构屋之制，皆以材为祖。材有八等，度屋之大小因而用之：广九分，厚六分，谓之单材；加栔三分，谓之足材。',
      '各以其材之广，分为十五分，以十分为其厚。凡屋宇之高深，名物之短长，曲直举折之势，规矩绳墨之宜，皆以所用材之分，以为制度焉。'
    ]
  }
];
const activeClassic = computed(
  () => classics.find((c) => c.id === activeClassicId.value) ?? classics[0]
);
const cultureAccordions = [
  {
    id: 'c1',
    title: '糊名誊录 · 宋朝科举取士新制',
    content: '真宗朝推行糊名与誊录制度，试院由专人将考生姓名弥封、朱笔誊写试卷，彻底杜绝门第请托，寒门俊彦得以登第入仕。'
  },
  {
    id: 'c2',
    title: '庆历活字 · 毕昇胶泥活字印书',
    content: '庆历年间布衣毕昇创制胶泥活字，火烧令坚，设铁板松脂蜡按印，一版印刷同时另一版排字，使《崇文总目》与儒学经典广布天下。'
  },
  {
    id: 'c3',
    title: '水运仪象台 · 苏颂浑天天文钟',
    content: '元祐年间苏颂、韩公廉造水运仪象台，以枢轮水力恒速驱动浑仪、浑象与报时木偶，兼备观测、演示与报时三重功用。'
  }
];

// 百工名窑：筛选、步进、卷轴与屏风详情
const selectedKiln = ref('全部');
const kilnList = ['全部', '汝窑', '官窑', '定窑', '钧窑'];
const imperialOnly = ref(false);
const reserveQty = ref(12);
const showArtifactScroll = ref(false);
const showCraftDrawer = ref(false);
const activeArtifact = ref({
  name: '汝窑天青釉弦纹三足樽',
  kiln: '汝窑',
  era: '北宋徽宗朝',
  imperial: true,
  inscription: '宝丰清凉寺御窑烧造，通体满施天青玛瑙釉，釉面开细碎蝉翼纹，底留三枚芝麻支钉痕，声如清磬。'
});

const craftArtifacts = [
  {
    name: '汝窑天青釉弦纹三足樽',
    kiln: '汝窑',
    era: '北宋徽宗朝',
    imperial: true,
    inscription: '宝丰清凉寺御窑烧造，通体满施天青玛瑙釉，釉面开细碎蝉翼纹，底留三枚芝麻支钉痕，声如清磬。'
  },
  {
    name: '汴京官窑粉青贯耳瓶',
    kiln: '官窑',
    era: '北宋政和年间',
    imperial: true,
    inscription: '紫口铁足，釉厚如堆脂，呈粉青温润之色，开片呈冰裂金丝，乃大内祭祀陈设重器。'
  },
  {
    name: '定窑白釉刻花莲瓣碗',
    kiln: '定窑',
    era: '北宋熙宁年间',
    imperial: false,
    inscription: '胎薄质坚，釉色象牙白润，内壁以竹刀双勾莲瓣纹，覆烧芒口镶铜，行销四方州郡。'
  },
  {
    name: '钧窑玫瑰紫釉鼓钉洗',
    kiln: '钧窑',
    era: '北宋宣和年间',
    imperial: true,
    inscription: '禹州神垕窑烧造，窑变呈玫瑰紫与海棠红交融之象，所谓「入窑一色，出窑万彩」。'
  }
];

const filteredArtifacts = computed(() =>
  craftArtifacts.filter((item) => {
    const matchKiln = selectedKiln.value === '全部' || item.kiln === selectedKiln.value;
    const matchImperial = !imperialOnly.value || item.imperial;
    return matchKiln && matchImperial;
  })
);

function inspectArtifact(item: typeof craftArtifacts[0]) {
  activeArtifact.value = item;
  sound.playChime(659.25);
  showArtifactScroll.value = true;
}

function goPage(id: PageId) {
  activePage.value = id;
  sound.playChime(587.33);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function replayLoading() {
  loadPct.value = 8;
  siteLoading.value = true;
}
</script>

<template>
  <div class="song-site-shell">
    <div class="ses-paper-grain" aria-hidden="true" />

    <!-- 开屏 / 刷新 建盏点茶加载过渡 -->
    <div v-if="siteLoading" class="song-site-loader-screen">
      <SesCard corners class="ses-pa-8 ses-flex-col ses-items-center ses-gap-4" style="max-width: 380px; width: 100%">
        <SesSeal>大宋<br />国朝</SesSeal>
        <div class="ses-text-h3" style="margin: 0">正在调阅汴京门户典籍…</div>
        <SesDianchaLoader
          v-model="loadPct"
          auto-start
          :interval-ms="28"
          :show-action="false"
          @complete="siteLoading = false"
        />
        <SesButton size="sm" variant="outline" @click="siteLoading = false">立即进入</SesButton>
      </SesCard>
    </div>

    <!-- 大宋官网顶部导航栏 -->
    <header class="song-site-header">
      <div class="song-site-header-inner">
        <div class="song-site-top-row">
          <div class="ses-flex ses-items-center ses-gap-3">
            <SesSeal interactive @click="goPage('home')">大宋<br />国朝</SesSeal>
            <div>
              <div class="ses-flex ses-items-center ses-gap-2">
                <span class="ses-text-h2" style="margin: 0; font-size: 1.15rem; color: var(--ses-ink-heavy); letter-spacing: var(--ses-tracking-wide)">
                  大宋国朝官网
                </span>
                <span style="color: var(--ses-gold); opacity: 0.7">·</span>
                <span class="ses-text-body" style="color: var(--ses-ink-medium); letter-spacing: var(--ses-tracking-normal)">
                  汴京门户
                </span>
              </div>
              <div class="ses-text-caption" style="margin-top: 2px">建隆至宣和 · 兴文教、通百货、重格物</div>
            </div>
          </div>

          <div class="ses-flex ses-items-center ses-gap-2 ses-flex-wrap">
            <SesButton size="sm" variant="outline" :sound-freq="659.25" @click="replayLoading">
              ↻ 刷新加载
            </SesButton>
            <SesTooltip text="切换声音反馈">
              <SesButton size="sm" variant="outline" :sound-freq="0" @click="sound.toggle()">
                {{ sound.enabled.value ? '🎵 雅音' : '🔇 静音' }}
              </SesButton>
            </SesTooltip>
            <SesButton size="sm" variant="gold" :sound-freq="0" @click="theme.toggle()">
              {{ theme.isDark.value ? '🌙 暗夜洒金' : '☀️ 澄心昼景' }}
            </SesButton>
            <span class="song-site-sep" aria-hidden="true" />
            <a href="?" class="song-site-back-link">
              ← 返回文档
            </a>
          </div>
        </div>

        <nav class="song-site-nav-row" aria-label="官网主导航">
          <SesTabs v-model="activePage" :items="pageTabs" />
          <span class="ses-text-caption song-site-motto">东京汴梁 · 政事堂礼宾司监制</span>
        </nav>
      </div>
    </header>

    <main class="song-site-main">
      <!-- ==================== 第一页：国朝首页 ==================== -->
      <div v-if="activePage === 'home'" class="ses-flex-col ses-gap-6">
        <SesCard corners class="ses-pa-8">
          <div class="ses-flex ses-justify-between ses-items-center ses-flex-wrap ses-gap-4 ses-mb-4">
            <span class="ses-brocade-tag">东京梦华 · 汴京政事堂发布</span>
            <SesSeal>御览之宝</SesSeal>
          </div>
          <h1 class="ses-text-display ses-mb-3" style="margin-top: 0">
            文以载道，格物致知；<br />百工兴盛于汴水之滨。
          </h1>
          <p class="ses-text-body ses-mb-6" style="max-width: 720px; color: var(--ses-ink-medium)">
            欢迎来到大宋国朝政务与文化门户。在此可实时观览汴京时辰昼晷夜漏、查阅三司户部各路漕运岁入、在线披阅秘阁乌丝栏善本，并向政事堂呈递奏疏。
          </p>
          <div class="ses-flex ses-flex-wrap ses-gap-3">
            <SesButton variant="gold" @click="goPage('governance')">查阅《汴京岁入录》与呈递奏疏</SesButton>
            <SesButton variant="jade" @click="goPage('culture')">进入秘阁善本与四艺馆</SesButton>
            <SesButton variant="outline" @click="goPage('crafts')">赏鉴五大名窑百工图谱</SesButton>
          </div>
        </SesCard>

        <SesAlert type="celadon" title="朝堂急脚递公告">
          元祐三年秋：汴河广济渠疏浚已竣，江南东路、两浙路今岁漕粮已悉数入太仓；崇文院新校《梦溪笔谈》《营造法式》善本即日起开放士子调阅。
        </SesAlert>

        <div class="song-site-grid-2">
          <SesCard class="ses-pa-6">
            <div class="ses-flex ses-justify-between ses-items-center ses-flex-wrap ses-gap-2 ses-mb-4">
              <h2 class="ses-text-h2" style="margin: 0">汴京观象台 · 实时司辰</h2>
              <SesTag variant="celadon" size="sm">
                {{ getShichenName(timepieceMins) }} · {{ getNightWatchLabel(timepieceMins).text }}
              </SesTag>
            </div>
            <SesTimepiece v-model:minutes="timepieceMins" />
          </SesCard>

          <SesCard class="ses-pa-6 ses-flex-col ses-justify-between ses-gap-4">
            <div>
              <div class="ses-flex ses-justify-between ses-items-center ses-mb-3">
                <h2 class="ses-text-h2" style="margin: 0">四方路分政通仪盘</h2>
                <SesTag variant="gold" size="sm">巡察四方</SesTag>
              </div>
              <SesAstrolabeGauge
                :terms="courtTerms"
                metric-label="政通度"
                action-label="巡察下一路"
              />
            </div>

            <div class="ses-flex-col ses-gap-3">
              <SesProgress :value="taixueProgress" label="太学三舍法兴学进度" variant="celadon" />
              <SesProgress :value="canalProgress" label="汴河四渠冬修疏浚进度" variant="gold" />
            </div>
          </SesCard>
        </div>

        <SesCard class="ses-pa-6">
          <div class="ses-flex ses-justify-between ses-items-center ses-flex-wrap ses-gap-2 ses-mb-3">
            <h2 class="ses-text-h2" style="margin: 0">大晟府 · 宫廷雅乐定音台</h2>
            <span class="ses-text-caption">拖动琴轸试听五声音阶正音</span>
          </div>
          <SesGuqinSlider v-model="courtMusicTension" label="大晟钟磬定弦张力" />
        </SesCard>
      </div>

      <!-- ==================== 第二页：政务民生 ==================== -->
      <div v-else-if="activePage === 'governance'" class="ses-flex-col ses-gap-6">
        <SesBreadcrumbs
          :items="[
            { label: '国朝首页', value: 'home' },
            { label: '政务与民生' }
          ]"
          @navigate="() => goPage('home')"
        />

        <SesCard class="ses-pa-6 ses-flex-col ses-gap-4">
          <div class="ses-flex ses-justify-between ses-items-center ses-flex-wrap ses-gap-3">
            <div>
              <h2 class="ses-text-h2" style="margin: 0">三司户部 · 历月粮帛岁入与漕运实收</h2>
              <p class="ses-text-caption" style="margin: 4px 0 0">
                石青主峰为国朝总岁入，石绿前坡为汴河水运实收；鼠标悬停山脊可详阅各月实数（单位：万石）
              </p>
            </div>
            <div class="ses-flex ses-items-center ses-gap-2">
              <SesButton
                size="sm"
                :variant="revenueYear === 'yuanyou' ? 'gold' : 'outline'"
                @click="revenueYear = 'yuanyou'"
              >
                元祐三年录
              </SesButton>
              <SesButton
                size="sm"
                :variant="revenueYear === 'xining' ? 'gold' : 'outline'"
                @click="revenueYear = 'xining'"
              >
                熙宁九年录
              </SesButton>
            </div>
          </div>

          <div class="ses-flex ses-items-center ses-justify-between ses-flex-wrap ses-gap-3">
            <div class="ses-flex ses-items-center ses-gap-4 ses-flex-wrap">
              <span class="song-site-legend-item">
                <span class="song-site-legend-swatch" style="background: #2e5a78" />
                石青主峰 · 国朝总岁入
              </span>
              <span class="song-site-legend-item">
                <span class="song-site-legend-swatch" style="background: #4e7d5b" />
                石绿前坡 · 汴河漕运实收
              </span>
            </div>
            <SesTag variant="celadon" size="sm">
              {{ revenueYear === 'yuanyou' ? '元祐三年（1088）' : '熙宁九年（1076）' }} · 十二月全录
            </SesTag>
          </div>

          <SesMountainChart
            :data="revenueData"
            series-back-name="国朝总岁入"
            series-front-name="汴河漕运实收"
            peak-label="岁入极峰"
          />

          <div class="song-site-metrics-4">
            <div class="song-site-metric-box">
              <span class="ses-text-caption">全年总岁入</span>
              <strong class="song-site-metric-val">{{ totalBackRevenue.toLocaleString() }} <small>万石</small></strong>
            </div>
            <div class="song-site-metric-box">
              <span class="ses-text-caption">汴河漕运实收</span>
              <strong class="song-site-metric-val">{{ totalFrontRevenue.toLocaleString() }} <small>万石</small></strong>
            </div>
            <div class="song-site-metric-box">
              <span class="ses-text-caption">岁入极峰（{{ peakRevenueMonth.label }}）</span>
              <strong class="song-site-metric-val" style="color: var(--ses-cinnabar)">
                {{ peakRevenueMonth.backValue }} <small>万石</small>
              </strong>
            </div>
            <div class="song-site-metric-box">
              <span class="ses-text-caption">漕运实收占比</span>
              <strong class="song-site-metric-val">{{ canalSharePct }}%</strong>
            </div>
          </div>
        </SesCard>

        <SesCard class="ses-pa-6 ses-flex-col ses-gap-4">
          <div class="ses-flex ses-justify-between ses-items-center ses-flex-wrap ses-gap-2">
            <h2 class="ses-text-h2" style="margin: 0">各路州府岁运鱼鳞图册</h2>
            <span class="ses-text-caption">点击表头「州府名号 / 土贡 / 岁运粮米」可升序、降序排列</span>
          </div>
          <SesTable :columns="ledgerColumns" :rows="pagedLedgerRows">
            <template #cell-prefecture="{ value }">
              <strong style="color: var(--ses-ink-heavy)">{{ value }}</strong>
            </template>
            <template #cell-tier="{ value }">
              <span class="ses-brocade-tag" style="padding: 0.12rem 0.55rem; font-size: 0.72rem">{{ value }}</span>
            </template>
            <template #cell-grain="{ value }">
              <span style="font-family: monospace">{{ Number(value).toLocaleString() }}</span>
            </template>
            <template #cell-status="{ row, value }">
              <SesSeal :color="row.verified ? 'malachite' : 'cinnabar'" style="font-size: 0.68rem">
                {{ value }}
              </SesSeal>
            </template>
          </SesTable>
          <div style="margin-top: 0.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem">
            <span style="font-size: 0.78rem; color: var(--ses-ink-light)">毕昇胶泥活字印版 · 共贰版</span>
            <SesPagination v-model="ledgerPage" :total-pages="2" />
          </div>
        </SesCard>

        <SesCard corners class="ses-pa-6">
          <h2 class="ses-text-h2 ses-mb-4" style="margin-top: 0">政事堂 · 乌丝栏奏疏在线呈递</h2>
          <SesForm v-model="memorialValid" class="ses-flex-col ses-gap-4" @submit="submitMemorial">
            <div class="song-site-grid-2">
              <SesSelect
                v-model="targetMinistry"
                label="受文衙署"
                meta-label="职司"
                :options="ministryOptions"
              />
              <SesRadioGroup
                v-model="memorialUrgency"
                label="邮驿缓急等级"
                :options="urgencyOptions"
              />
            </div>
            <SesInput
              v-model="memorialTitle"
              label="奏疏题名"
              placeholder="请以楷书拟定奏疏题名"
              :rules="memorialTitleRules"
            />
            <div class="ses-flex ses-justify-between ses-items-center ses-flex-wrap ses-gap-3 ses-mt-2">
              <SesCheckbox v-model="memorialChecked" label="已核对本路州府官印并附黄册副本" />
              <SesButton type="submit" variant="gold">钤印发递政事堂</SesButton>
            </div>
          </SesForm>

          <hr class="ses-divider" />
          <div class="ses-flex ses-justify-between ses-items-center ses-mb-3">
            <h3 class="ses-text-h3" style="margin: 0">已呈递奏疏归档（{{ submittedMemorials.length }} 折）</h3>
            <span class="ses-text-caption">提交上方表单后实时入档</span>
          </div>
          <div class="ses-flex-col ses-gap-2">
            <div
              v-for="(m, idx) in submittedMemorials"
              :key="idx"
              class="ses-pa-3 ses-rounded-sm ses-flex ses-justify-between ses-items-center ses-flex-wrap ses-gap-2"
              style="border: 0.5px solid var(--ses-border-hairline); background: var(--ses-bg-subtle)"
            >
              <div>
                <div class="ses-text-body" style="color: var(--ses-ink-heavy); font-weight: 600">{{ m.title }}</div>
                <div class="ses-text-caption">{{ m.ministry }} · {{ m.time }}</div>
              </div>
              <SesTag :variant="m.urgency === '金字牌递' ? 'cinnabar' : 'celadon'" size="sm">{{ m.urgency }}</SesTag>
            </div>
          </div>
        </SesCard>
      </div>

      <!-- ==================== 第三页：文教典籍 ==================== -->
      <div v-else-if="activePage === 'culture'" class="ses-flex-col ses-gap-6">
        <SesBreadcrumbs
          :items="[
            { label: '国朝首页', value: 'home' },
            { label: '文教与典籍' }
          ]"
          @navigate="() => goPage('home')"
        />

        <SesCard class="ses-pa-6 ses-flex-col ses-gap-4">
          <div class="ses-flex ses-justify-between ses-items-center ses-flex-wrap ses-gap-2">
            <h2 class="ses-text-h2" style="margin: 0">崇文院秘阁 · 乌丝栏善本阅览</h2>
            <div class="ses-flex ses-items-center ses-gap-2 ses-flex-wrap">
              <SesButton
                v-for="c in classics"
                :key="c.id"
                size="sm"
                :variant="activeClassicId === c.id ? 'gold' : 'outline'"
                @click="activeClassicId = c.id"
              >
                {{ c.title }}
              </SesButton>
              <span class="song-site-sep" aria-hidden="true"></span>
              <SesButton
                size="sm"
                variant="jade"
                @click="verticalReading = !verticalReading"
              >
                {{ verticalReading ? '📜 切换为现代横排' : '🏮 切换为宋刻竖排' }}
              </SesButton>
            </div>
          </div>
          <SesWoodblockReader v-model:vertical="verticalReading" :title="activeClassic.title" :toggleable="false">
            <p v-for="(para, idx) in activeClassic.paragraphs" :key="idx" style="margin: 0 0 0.9em">
              {{ para }}
            </p>
          </SesWoodblockReader>
        </SesCard>

        <div class="song-site-grid-2">
          <SesCard class="ses-pa-6 ses-flex-col ses-gap-5">
            <h2 class="ses-text-h2" style="margin: 0">书斋雅事 · 焚香静修</h2>
            <SesIncenseTimer />
          </SesCard>

          <SesCard class="ses-pa-6 ses-flex-col ses-gap-4">
            <h2 class="ses-text-h2" style="margin: 0">经折装 · 国朝典章制度</h2>
            <SesAccordion :items="cultureAccordions" />
          </SesCard>
        </div>

        <SesCard class="ses-pa-6 ses-flex-col ses-gap-4">
          <div class="ses-flex ses-justify-between ses-items-center ses-flex-wrap ses-gap-2">
            <div>
              <h2 class="ses-text-h2" style="margin: 0">秘书省 · 秘阁善本抄本呈缴</h2>
              <p class="ses-text-caption" style="margin: 4px 0 0">各地州学、书院新刊善本或金石碑拓，可经此呈缴崇文院秘阁勘验入藏</p>
            </div>
            <SesTag :variant="submittedScrolls.length > 0 ? 'celadon' : 'gold'" size="sm">
              已呈缴 {{ submittedScrolls.length }} 卷
            </SesTag>
          </div>
          <SesUpload
            v-model="submittedScrolls"
            accept=".pdf,.txt,.md,.png,.jpg,.jpeg,.webp"
            :max-size-mb="10"
            title="呈缴新校善本、碑拓或画卷"
            hint="点击择取或拖拽文书拓片至此，由崇文院秘阁勘验入藏"
            @change="(files) => toast.show(`秘书省已收讫 ${files.length} 卷呈缴文书`)"
            @reject="(reason) => toast.show(reason)"
          />
        </SesCard>
      </div>

      <!-- ==================== 第四页：百工名窑 ==================== -->
      <div v-else class="ses-flex-col ses-gap-6">
        <SesBreadcrumbs
          :items="[
            { label: '国朝首页', value: 'home' },
            { label: '百工与名窑' }
          ]"
          @navigate="() => goPage('home')"
        />

        <SesCard class="ses-pa-6">
          <div class="ses-flex ses-justify-between ses-items-center ses-flex-wrap ses-gap-4 ses-mb-4">
            <div>
              <h2 class="ses-text-h2" style="margin: 0">将作监 · 五大名窑御器图谱</h2>
              <p class="ses-text-caption" style="margin: 4px 0 0">按窑口筛选秘阁所藏器物，点击「展开卷轴」可详阅铭文考证</p>
            </div>
            <SesButton size="sm" variant="outline" @click="showCraftDrawer = true">打开百宝嵌名录</SesButton>
          </div>

          <div class="song-site-toolbar ses-mb-6">
            <div class="ses-flex ses-items-center ses-gap-3 ses-flex-wrap">
              <div class="ses-flex ses-gap-2 ses-flex-wrap">
                <SesButton
                  v-for="k in kilnList"
                  :key="k"
                  size="sm"
                  :variant="selectedKiln === k ? 'gold' : 'outline'"
                  @click="selectedKiln = k"
                >
                  {{ k }}
                </SesButton>
              </div>
              <span class="song-site-sep" aria-hidden="true"></span>
              <SesSwitch v-model="imperialOnly" label="仅观御窑重器" />
            </div>
            <div class="ses-flex ses-items-center ses-gap-3">
              <span class="ses-text-caption" style="white-space: nowrap">筹算拟调拨</span>
              <SesStepper v-model="reserveQty" :min="1" :max="99" />
            </div>
          </div>

          <div class="song-site-grid-2">
            <SesCard
              v-for="item in filteredArtifacts"
              :key="item.name"
              corners
              hoverable
              class="ses-pa-5 ses-flex-col ses-justify-between ses-gap-3"
            >
              <div>
                <div class="ses-flex ses-justify-between ses-items-center ses-mb-2">
                  <SesTag :variant="item.imperial ? 'cinnabar' : 'celadon'" size="sm">
                    {{ item.kiln }} · {{ item.era }}
                  </SesTag>
                  <SesTag v-if="item.imperial" variant="gold" size="sm">御窑</SesTag>
                </div>
                <h3 class="ses-text-h3 ses-mb-2" style="margin-top: 0">{{ item.name }}</h3>
                <p class="ses-text-caption" style="margin: 0; line-height: var(--ses-leading-relaxed)">
                  {{ item.inscription }}
                </p>
              </div>
              <div class="ses-flex ses-justify-between ses-items-center ses-mt-2">
                <span class="ses-text-mono">拟拨 {{ reserveQty }} 件</span>
                <SesButton size="sm" variant="jade" @click="inspectArtifact(item)">展开卷轴考证</SesButton>
              </div>
            </SesCard>
          </div>
        </SesCard>
      </div>
    </main>

    <!-- 古卷徐开：器物考证详情 -->
    <SesScrollModal
      v-model="showArtifactScroll"
      :title="activeArtifact.name"
      :subtitle="`${activeArtifact.kiln} · ${activeArtifact.era}`"
    >
      <p class="ses-text-body" style="margin: 0; line-height: var(--ses-leading-relaxed)">
        {{ activeArtifact.inscription }}
      </p>
      <template #footer="{ close }">
        <SesButton size="sm" variant="outline" @click="close">缓缓收卷</SesButton>
        <SesButton size="sm" variant="gold" @click="toast.show(`已批复调拨《${activeArtifact.name}》`); close()">
          钤印入册
        </SesButton>
      </template>
    </SesScrollModal>

    <!-- 折枝屏风：百宝嵌营造参数 -->
    <SesScreenDrawer v-model="showCraftDrawer" title="将作监 · 营造法式器物录" badge="御览">
      <p class="ses-text-body" style="margin-top: 0">
        宋代李诫《营造法式》定「材分制」为百工营造准绳，本官网全站亦遵循 4px 基准间距栅格与矿物色谱规范。
      </p>
      <div class="ses-pa-4 ses-rounded-sm ses-mt-4" style="border: 0.5px solid var(--ses-border-hairline); background: var(--ses-bg-subtle)">
        <div class="ses-text-caption">当前拟调拨总数：<strong>{{ reserveQty }} 策/件</strong></div>
      </div>
    </SesScreenDrawer>

    <SesToast />
  </div>
</template>

<style scoped>
.song-site-shell {
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  background-color: var(--ses-bg-canvas);
  color: var(--ses-ink-medium);
}

.song-site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(12px);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--ses-bg-sidebar) 96%, transparent) 0%,
    color-mix(in srgb, var(--ses-bg-canvas) 92%, transparent) 100%
  );
  border-top: 2px solid var(--ses-gold);
  border-bottom: 1px solid var(--ses-border-gold);
  box-shadow: 0 4px 18px -8px rgba(0, 0, 0, 0.14);
}

.song-site-header-inner {
  max-width: var(--ses-bp-xl);
  margin: 0 auto;
  padding: var(--ses-space-3) var(--ses-space-6) 0;
  display: flex;
  flex-direction: column;
  gap: var(--ses-space-2);
}

.song-site-top-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--ses-space-4);
}

.song-site-sep {
  width: 1px;
  height: 16px;
  background: var(--ses-border-hairline);
  margin: 0 var(--ses-space-1);
}

.song-site-back-link {
  font-size: var(--ses-text-caption);
  color: var(--ses-ink-medium);
  text-decoration: none;
  padding: var(--ses-space-1) var(--ses-space-2);
  border-radius: var(--ses-radius-xs);
  transition: color 0.25s ease;
}

.song-site-back-link:hover {
  color: var(--ses-gold);
}

.song-site-nav-row {
  border-top: 0.5px solid var(--ses-border-hairline);
  padding-top: 2px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--ses-space-3);
}

.song-site-nav-row :deep(.ses-tabs) {
  border-bottom: none;
}

.song-site-motto {
  letter-spacing: var(--ses-tracking-wide);
  opacity: 0.78;
}

.song-site-main {
  max-width: var(--ses-bp-xl);
  margin: 0 auto;
  padding: var(--ses-space-8) var(--ses-space-6) var(--ses-space-12);
}

.song-site-grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--ses-space-6);
}

.song-site-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--ses-space-4);
  padding: var(--ses-space-3) var(--ses-space-4);
  background: var(--ses-bg-canvas);
  border: 0.5px solid var(--ses-border-hairline);
  border-radius: var(--ses-radius-md);
}

.song-site-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--ses-text-caption);
  color: var(--ses-ink-medium);
}

.song-site-legend-swatch {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 0.5px solid var(--ses-border-gold);
}

.song-site-metrics-4 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--ses-space-3);
}

.song-site-metric-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--ses-space-3) var(--ses-space-4);
  background: var(--ses-bg-canvas);
  border: 0.5px solid var(--ses-border-hairline);
  border-radius: var(--ses-radius-sm);
}

.song-site-metric-val {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--ses-ink-heavy);
  font-variant-numeric: tabular-nums;
}

.song-site-metric-val small {
  font-size: 0.72rem;
  font-weight: 400;
  color: var(--ses-ink-light);
}

.song-site-loader-screen {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ses-space-6);
  background: var(--ses-bg-canvas);
}
</style>
