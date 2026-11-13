export interface ApiPropRow {
  name: string;
  type: string;
  defaultVal: string;
  desc: string;
}

export interface ApiEventRow {
  name: string;
  payload: string;
  desc: string;
}

export interface ApiSlotRow {
  name: string;
  props: string;
  desc: string;
}

export interface ComponentApiDoc {
  name: string;
  importCode: string;
  usageCode: string;
  props?: ApiPropRow[];
  events?: ApiEventRow[];
  slots?: ApiSlotRow[];
  expose?: string[];
}

export const componentApiMap: Record<string, ComponentApiDoc[]> = {
  button: [
    {
      name: 'SesButton',
      importCode: `import { SesButton } from '@song-ui/vue';`,
      usageCode: `<SesButton variant="jade" @click="onSubmit">天青主钮</SesButton>
<SesButton variant="gold" :sound-freq="784">描金御赐</SesButton>
<SesButton variant="outline">素宣线框</SesButton>`,
      props: [
        { name: 'variant', type: `'jade' | 'gold' | 'outline'`, defaultVal: `'jade'`, desc: '按钮釉色风格变体' },
        { name: 'size', type: `'sm' | 'md' | 'lg'`, defaultVal: `'md'`, desc: '按钮尺寸' },
        { name: 'type', type: `'button' | 'submit' | 'reset'`, defaultVal: `'button'`, desc: '原生 button type' },
        { name: 'disabled', type: `boolean`, defaultVal: `false`, desc: '禁用态与不可点击' },
        { name: 'ripple', type: `boolean`, defaultVal: `true`, desc: '点击茶盏水波涟漪动效' },
        { name: 'soundFreq', type: `number`, defaultVal: `659.25`, desc: '点击叩瓷声律频率（Hz）' }
      ],
      events: [{ name: 'click', payload: `MouseEvent`, desc: '点击按钮时触发（禁用态不触发）' }],
      slots: [{ name: 'default', props: `—`, desc: '按钮文字或图标内容' }]
    },
    {
      name: 'SesSeal',
      importCode: `import { SesSeal } from '@song-ui/vue';`,
      usageCode: `<SesSeal interactive @click="onSeal">钤印确认</SesSeal>
<SesSeal color="malachite">已验入库</SesSeal>`,
      props: [
        { name: 'color', type: `'cinnabar' | 'malachite'`, defaultVal: `'cinnabar'`, desc: '印泥色系（朱砂 / 石绿）' },
        { name: 'interactive', type: `boolean`, defaultVal: `false`, desc: '是否可点击并触发落印声效' }
      ],
      events: [{ name: 'click', payload: `MouseEvent`, desc: 'interactive 为 true 时点击触发' }],
      slots: [{ name: 'default', props: `—`, desc: '印文内容' }]
    },
    {
      name: 'SesCard',
      importCode: `import { SesCard } from '@song-ui/vue';`,
      usageCode: `<SesCard :hoverable="true" :corners="true">
  卡片正文内容……
</SesCard>`,
      props: [
        { name: 'hoverable', type: `boolean`, defaultVal: `true`, desc: '悬停时是否点亮泥金边框' },
        { name: 'corners', type: `boolean`, defaultVal: `true`, desc: '是否显示四角描金界格角标' }
      ],
      slots: [{ name: 'default', props: `—`, desc: '卡片内容区' }]
    }
  ],

  switch: [
    {
      name: 'SesSwitch',
      importCode: `import { SesSwitch } from '@song-ui/vue';`,
      usageCode: `<SesSwitch v-model="enabled" label="澄心静谧模式" />`,
      props: [
        { name: 'modelValue', type: `boolean`, defaultVal: `必填`, desc: '绑定开关状态（支持 v-model）' },
        { name: 'label', type: `string`, defaultVal: `—`, desc: '开关标题与无障碍标签' },
        { name: 'onText', type: `string`, defaultVal: `'启'`, desc: '开启态榫卯槽内文字' },
        { name: 'offText', type: `string`, defaultVal: `'闭'`, desc: '关闭态榫卯槽内文字' },
        { name: 'disabled', type: `boolean`, defaultVal: `false`, desc: '禁用切换' }
      ],
      events: [{ name: 'update:modelValue', payload: `boolean`, desc: '状态切换时同步更新' }],
      slots: [{ name: 'default', props: `—`, desc: '自定义右侧标签文本' }]
    }
  ],

  input: [
    {
      name: 'SesInput',
      importCode: `import { SesInput } from '@song-ui/vue';`,
      usageCode: `<SesInput
  v-model="title"
  label="题跋卷名"
  :rules="[songRules.required(), songRules.minLength(4)]"
/>`,
      props: [
        { name: 'modelValue', type: `string`, defaultVal: `必填`, desc: '输入文本（支持 v-model）' },
        { name: 'label', type: `string`, defaultVal: `—`, desc: '上方字段标签' },
        { name: 'placeholder', type: `string`, defaultVal: `'请于素笺之上落墨……'`, desc: '占位提示文字' },
        { name: 'multiline', type: `boolean`, defaultVal: `false`, desc: '是否启用多行手札文本框' },
        { name: 'rows', type: `number`, defaultVal: `4`, desc: 'multiline 为 true 时的默认行数' },
        { name: 'rules', type: `ValidationRule<string>[]`, defaultVal: `[]`, desc: '校验规则数组（可配合 songRules）' },
        { name: 'errorMessages', type: `string[]`, defaultVal: `[]`, desc: '外部受控错误信息' },
        { name: 'validateOn', type: `'input' | 'blur' | 'submit'`, defaultVal: `'blur'`, desc: '触发规则校验时机' }
      ],
      events: [{ name: 'update:modelValue', payload: `string`, desc: '输入时触发' }],
      expose: ['validate(): boolean', 'resetValidation(): void']
    },
    {
      name: 'SesForm',
      importCode: `import { SesForm } from '@song-ui/vue';
import { songRules } from '@song-ui/core';`,
      usageCode: `<SesForm ref="formRef" v-model="valid" @submit="onSubmit">
  <SesInput v-model="title" label="题跋" :rules="[songRules.required()]" />
  <SesButton type="submit" variant="gold">钤印呈递</SesButton>
</SesForm>`,
      props: [{ name: 'modelValue', type: `boolean`, defaultVal: `true`, desc: '表单整体校验通过状态' }],
      events: [
        { name: 'update:modelValue', payload: `boolean`, desc: '校验状态变化时更新' },
        { name: 'submit', payload: `{ valid: boolean; event: Event }`, desc: '表单提交时自动校验并触发' }
      ],
      slots: [{ name: 'default', props: `{ validate, resetValidation }`, desc: '表单内容区' }],
      expose: ['validate(): boolean', 'resetValidation(): void']
    }
  ],

  select: [
    {
      name: 'SesSelect',
      importCode: `import { SesSelect, type SesSelectOption } from '@song-ui/vue';`,
      usageCode: `<SesSelect
  v-model="bookId"
  :options="bookOptions"
  placeholder="请选择书帙……"
  @change="(opt) => console.log(opt)"
/>`,
      props: [
        { name: 'modelValue', type: `string`, defaultVal: `必填`, desc: '当前选中项 value' },
        { name: 'options', type: `SesSelectOption[]`, defaultVal: `必填`, desc: '选项列表（{ label, value, meta? }）' },
        { name: 'placeholder', type: `string`, defaultVal: `'请选择书帙……'`, desc: '未选中时的占位文辞' },
        { name: 'metaLabel', type: `string`, defaultVal: `'书衣材质：八答晕宋锦'`, desc: '底部元信息左侧自定义标签' }
      ],
      events: [
        { name: 'update:modelValue', payload: `string`, desc: '选中项变更时触发' },
        { name: 'change', payload: `SesSelectOption`, desc: '返回完整选中项对象' }
      ]
    }
  ],

  stepper: [
    {
      name: 'SesStepper',
      importCode: `import { SesStepper } from '@song-ui/vue';`,
      usageCode: `<SesStepper v-model="count" :min="1" :max="99" label="大衍筹策" unit="策" />`,
      props: [
        { name: 'modelValue', type: `number`, defaultVal: `必填`, desc: '当前数值（支持 v-model）' },
        { name: 'min', type: `number`, defaultVal: `1`, desc: '最小值' },
        { name: 'max', type: `number`, defaultVal: `99`, desc: '最大值' },
        { name: 'step', type: `number`, defaultVal: `1`, desc: '步进幅度' },
        { name: 'label', type: `string`, defaultVal: `'大衍筹策'`, desc: '左侧标签名称' },
        { name: 'unit', type: `string`, defaultVal: `'策'`, desc: '数值单位' }
      ],
      events: [{ name: 'update:modelValue', payload: `number`, desc: '加减后更新数值' }]
    }
  ],

  slider: [
    {
      name: 'SesGuqinSlider',
      importCode: `import { SesGuqinSlider, type SesGuqinMark } from '@song-ui/vue';`,
      usageCode: `// 1. 默认宋代年号五音刻度
<SesGuqinSlider v-model="tension" label="琴弦张力" />

// 2. 自定义刻度文字与徽章（marks）
<SesGuqinSlider
  v-model="volume"
  label="雅音音量"
  :marks="[
    { label: '静默', badge: '无声' },
    { label: '微吟', badge: '轻音' },
    { label: '清越', badge: '中音' },
    { label: '洪亮', badge: '高音' }
  ]"
/>`,
      props: [
        { name: 'modelValue', type: `number`, defaultVal: `必填`, desc: '滑块当前数值（支持 v-model）' },
        { name: 'min', type: `number`, defaultVal: `0`, desc: '最小值' },
        { name: 'max', type: `number`, defaultVal: `100`, desc: '最大值' },
        { name: 'label', type: `string`, defaultVal: `—`, desc: '左侧标题' },
        { name: 'showScaleLabels', type: `boolean`, defaultVal: `true`, desc: '是否显示底部刻度文字' },
        { name: 'marks', type: `SesGuqinMark[]`, defaultVal: `建隆/景德/熙宁/元祐/宣和`, desc: '自定义刻度文字、右上角徽章与拨弦频率（{ label, badge?, freq? }）' }
      ],
      events: [{ name: 'update:modelValue', payload: `number`, desc: '拖动或键盘微调时更新数值' }]
    }
  ],

  table: [
    {
      name: 'SesTable',
      importCode: `import { SesTable, type SesTableColumn } from '@song-ui/vue';`,
      usageCode: `<SesTable :columns="columns" :rows="rows" row-key="id">
  <template #cell-seal="{ value, row }">
    <SesSeal :color="row.green ? 'malachite' : 'cinnabar'">{{ value }}</SesSeal>
  </template>
</SesTable>`,
      props: [
        { name: 'columns', type: `SesTableColumn[]`, defaultVal: `必填`, desc: '列定义（key, title, sortable?, align?）' },
        { name: 'rows', type: `Record<string, unknown>[]`, defaultVal: `必填`, desc: '行数据数组' },
        { name: 'rowKey', type: `string`, defaultVal: `'id'`, desc: '行唯一主键字段名' }
      ],
      slots: [{ name: 'cell-<key>', props: `{ row, value }`, desc: '自定义某列单元格渲染' }]
    },
    {
      name: 'SesPagination',
      importCode: `import { SesPagination } from '@song-ui/vue';`,
      usageCode: `<SesPagination v-model="page" :total-pages="4" :use-chinese-numerals="true" />`,
      props: [
        { name: 'modelValue', type: `number`, defaultVal: `必填`, desc: '当前页码（从 1 开始）' },
        { name: 'totalPages', type: `number`, defaultVal: `必填`, desc: '总页数' },
        { name: 'useChineseNumerals', type: `boolean`, defaultVal: `true`, desc: '使用壹贰叁等中文大写页码' }
      ],
      events: [{ name: 'update:modelValue', payload: `number`, desc: '切换页码时触发' }]
    }
  ],

  accordion: [
    {
      name: 'SesAccordion',
      importCode: `import { SesAccordion, type SesAccordionItem } from '@song-ui/vue';`,
      usageCode: `<SesAccordion :items="folds" />`,
      props: [
        { name: 'items', type: `SesAccordionItem[]`, defaultVal: `必填`, desc: '折页列表（{ id, title, content? }）' },
        { name: 'modelValue', type: `string | null`, defaultVal: `首项 id`, desc: '受控当前展开折页 id' }
      ],
      events: [{ name: 'update:modelValue', payload: `string | null`, desc: '展开或收起时触发' }],
      slots: [{ name: 'item-<id>', props: `{ item }`, desc: '自定义对应折页展开正文' }]
    }
  ],

  woodblock: [
    {
      name: 'SesWoodblockReader',
      importCode: `import { SesWoodblockReader } from '@song-ui/vue';`,
      usageCode: `<SesWoodblockReader title="宣和博古图录" :vertical="true">
  <p>汝州新窑器，天青为上……</p>
</SesWoodblockReader>`,
      props: [
        { name: 'title', type: `string`, defaultVal: `—`, desc: '善本卷首题名' },
        { name: 'vertical', type: `boolean`, defaultVal: `true`, desc: '默认直排乌丝栏阅读' },
        { name: 'toggleable', type: `boolean`, defaultVal: `true`, desc: '是否显示直排/横排切换按钮' }
      ],
      events: [{ name: 'update:vertical', payload: `boolean`, desc: '切换排版方向时触发' }],
      slots: [{ name: 'default', props: `—`, desc: '古籍正文内容' }]
    }
  ],

  timepiece: [
    {
      name: 'SesTimepiece',
      importCode: `import { SesTimepiece } from '@song-ui/vue';`,
      usageCode: `<SesTimepiece v-model:minutes="mins" />`,
      props: [{ name: 'minutes', type: `number`, defaultVal: `当前系统时辰`, desc: '自子正 00:00 起的分钟数 [0, 1439]' }],
      events: [{ name: 'update:minutes', payload: `number`, desc: '拨动日晷指针或滑块时更新' }]
    }
  ],

  incense: [
    {
      name: 'SesIncenseTimer',
      importCode: `import { SesIncenseTimer } from '@song-ui/vue';`,
      usageCode: `<SesIncenseTimer :initial-seconds="15" @finish="onBurnComplete" />`,
      props: [{ name: 'initialSeconds', type: `number`, defaultVal: `15`, desc: '一柱香初始计时秒数' }],
      events: [{ name: 'finish', payload: `—`, desc: '香尽鸣磬时触发' }]
    }
  ],

  mountain: [
    {
      name: 'SesMountainChart',
      importCode: `import { SesMountainChart, type SesMountainPoint } from '@song-ui/vue';`,
      usageCode: `<SesMountainChart
  :data="series"
  series-back-name="主峰"
  series-front-name="前坡"
  peak-label="极峰"
/>`,
      props: [
        { name: 'data', type: `SesMountainPoint[]`, defaultVal: `必填`, desc: '数据序列（{ label, backValue, frontValue, unit? }）' },
        { name: 'seriesBackName', type: `string`, defaultVal: `'石青主峰'`, desc: '后层山峦图例名称' },
        { name: 'seriesFrontName', type: `string`, defaultVal: `'石绿前坡'`, desc: '前层山峦图例名称' },
        { name: 'peakLabel', type: `string`, defaultVal: `'极峰'`, desc: '最高峰标记文本' }
      ]
    }
  ],

  astrolabe: [
    {
      name: 'SesAstrolabeGauge',
      importCode: `import { SesAstrolabeGauge, type SesAstrolabeTerm } from '@song-ui/vue';`,
      usageCode: `<SesAstrolabeGauge
  :terms="solarTerms"
  metric-label="雅韵度"
  action-label="拨动司南"
  @change="(term) => console.log(term)"
/>`,
      props: [
        { name: 'terms', type: `SesAstrolabeTerm[]`, defaultVal: `谷雨/夏至/秋分/冬至`, desc: '节气与方位角配置（{ label, value, deg }）' },
        { name: 'metricLabel', type: `string`, defaultVal: `'雅韵度'`, desc: '指标名称文辞' },
        { name: 'actionLabel', type: `string`, defaultVal: `'拨动司南'`, desc: '交互按钮文辞' }
      ],
      events: [{ name: 'change', payload: `SesAstrolabeTerm`, desc: '拨动司南切换节气时触发' }]
    }
  ],

  overlays: [
    {
      name: 'SesScrollModal',
      importCode: `import { SesScrollModal } from '@song-ui/vue';`,
      usageCode: `<SesScrollModal v-model="open" title="《千里江山图》卷跋" subtitle="宣和御览">
  卷跋正文……
  <template #footer="{ close }">
    <SesButton size="sm" @click="close">收卷</SesButton>
  </template>
</SesScrollModal>`,
      props: [
        { name: 'modelValue', type: `boolean`, defaultVal: `必填`, desc: '控制古卷展/收（支持 v-model）' },
        { name: 'title', type: `string`, defaultVal: `必填`, desc: '卷首标题' },
        { name: 'subtitle', type: `string`, defaultVal: `—`, desc: '副标题或典藏说明' }
      ],
      events: [{ name: 'update:modelValue', payload: `boolean`, desc: '收卷关闭时更新为 false' }],
      slots: [
        { name: 'default', props: `—`, desc: '卷内正文' },
        { name: 'footer', props: `{ close }`, desc: '底部操作区' }
      ]
    },
    {
      name: 'SesScreenDrawer',
      importCode: `import { SesScreenDrawer } from '@song-ui/vue';`,
      usageCode: `<SesScreenDrawer v-model="drawerOpen" title="藏经百宝嵌" badge="屏风">
  屏风抽屉内容……
</SesScreenDrawer>`,
      props: [
        { name: 'modelValue', type: `boolean`, defaultVal: `必填`, desc: '控制屏风开合（支持 v-model）' },
        { name: 'title', type: `string`, defaultVal: `必填`, desc: '屏风标题' },
        { name: 'badge', type: `string`, defaultVal: `'屏风'`, desc: '右上角徽章文字' }
      ],
      events: [{ name: 'update:modelValue', payload: `boolean`, desc: '合拢屏风时更新为 false' }],
      slots: [
        { name: 'default', props: `—`, desc: '抽屉正文' },
        { name: 'footer', props: `{ close }`, desc: '底部操作区' }
      ]
    }
  ],

  alert: [
    {
      name: 'SesAlert',
      importCode: `import { SesAlert } from '@song-ui/vue';`,
      usageCode: `<SesAlert variant="jinzipai" title="御前急脚递" badge="日行五百里">
  汴河水位已逾岸标三尺……
</SesAlert>`,
      props: [
        { name: 'variant', type: `'jinzipai' | 'celadon'`, defaultVal: `'jinzipai'`, desc: '急脚递金字牌或青瓷静雅提示' },
        { name: 'title', type: `string`, defaultVal: `必填`, desc: '告警标题' },
        { name: 'badge', type: `string`, defaultVal: `—`, desc: '右侧徽章文字' }
      ],
      slots: [{ name: 'default', props: `—`, desc: '告警正文' }]
    },
    {
      name: 'SesToast & useToast',
      importCode: `import { SesToast, useToast } from '@song-ui/vue';`,
      usageCode: `const toast = useToast();
toast.show('已钤盖「双龙小玺」御印');
// 需在根组件挂载 <SesToast />`,
      expose: ['toast.show(message: string, durationMs?: number)']
    }
  ],

  tabs: [
    {
      name: 'SesTabs',
      importCode: `import { SesTabs, type SesTabItem } from '@song-ui/vue';`,
      usageCode: `<SesTabs v-model="activeTab" :items="tabItems" />`,
      props: [
        { name: 'modelValue', type: `string`, defaultVal: `必填`, desc: '当前激活页签 value（支持 v-model）' },
        { name: 'items', type: `SesTabItem[]`, defaultVal: `必填`, desc: '页签配置（{ value, label, badge?, disabled? }）' }
      ],
      events: [{ name: 'update:modelValue', payload: `string`, desc: '点击或方向键切换时触发' }]
    }
  ],

  tags: [
    {
      name: 'SesTag',
      importCode: `import { SesTag } from '@song-ui/vue';`,
      usageCode: `<SesTag variant="cinnabar" closable @close="onRemove">宣和御览</SesTag>`,
      props: [
        { name: 'variant', type: `'celadon' | 'cinnabar' | 'gold' | 'ink'`, defaultVal: `'celadon'`, desc: '牙牌釉色' },
        { name: 'size', type: `'sm' | 'md'`, defaultVal: `'md'`, desc: '标签尺寸' },
        { name: 'closable', type: `boolean`, defaultVal: `false`, desc: '是否显示移除按钮' }
      ],
      events: [{ name: 'close', payload: `—`, desc: '点击关闭按钮时触发' }],
      slots: [{ name: 'default', props: `—`, desc: '标签文字' }]
    }
  ],

  checkbox: [
    {
      name: 'SesCheckbox',
      importCode: `import { SesCheckbox } from '@song-ui/vue';`,
      usageCode: `<SesCheckbox v-model="agreed" label="汤花拂面(水丹青)" />
<SesCheckbox :model-value="false" indeterminate label="部分入库" />`,
      props: [
        { name: 'modelValue', type: `boolean`, defaultVal: `必填`, desc: '勾选状态（支持 v-model）' },
        { name: 'label', type: `string`, defaultVal: `—`, desc: '右侧说明文字' },
        { name: 'indeterminate', type: `boolean`, defaultVal: `false`, desc: '半选状态' },
        { name: 'disabled', type: `boolean`, defaultVal: `false`, desc: '禁用交互' },
        { name: 'rules', type: `ValidationRule<boolean>[]`, defaultVal: `[]`, desc: '可接入 SesForm 校验规则' }
      ],
      events: [{ name: 'update:modelValue', payload: `boolean`, desc: '状态变化时触发' }],
      slots: [{ name: 'default', props: `—`, desc: '自定义标签内容' }]
    }
  ],

  radio: [
    {
      name: 'SesRadioGroup',
      importCode: `import { SesRadioGroup, type SesRadioOption } from '@song-ui/vue';`,
      usageCode: `<SesRadioGroup v-model="kiln" label="螺钿印章单选" direction="vertical" :options="kilnOptions" />`,
      props: [
        { name: 'modelValue', type: `string | number`, defaultVal: `必填`, desc: '当前选中项 value' },
        { name: 'options', type: `SesRadioOption[]`, defaultVal: `必填`, desc: '选项列表（{ label, value, disabled? }）' },
        { name: 'label', type: `string`, defaultVal: `—`, desc: '单选组标题' },
        { name: 'direction', type: `'horizontal' | 'vertical'`, defaultVal: `'horizontal'`, desc: '排列方向' },
        { name: 'rules', type: `ValidationRule<string | number>[]`, defaultVal: `[]`, desc: '校验规则数组' }
      ],
      events: [{ name: 'update:modelValue', payload: `string | number`, desc: '切换选中项时触发' }]
    }
  ],

  widgets: [
    {
      name: 'SesDianchaLoader',
      importCode: `import { SesDianchaLoader } from '@song-ui/vue';`,
      usageCode: `<SesDianchaLoader v-model="teaPct" @complete="onTeaReady" />`,
      props: [
        { name: 'modelValue', type: `number`, defaultVal: `68`, desc: '点茶进度百分比 [0, 100]' },
        { name: 'size', type: `number`, defaultVal: `176`, desc: '建盏直径（px）' },
        { name: 'showAction', type: `boolean`, defaultVal: `true`, desc: '是否显示「重注沸水击拂」按钮' },
        { name: 'actionLabel', type: `string`, defaultVal: `'重注沸水击拂'`, desc: '交互按钮文辞' }
      ],
      events: [
        { name: 'update:modelValue', payload: `number`, desc: '击拂过程中实时回传进度' },
        { name: 'complete', payload: `—`, desc: '七汤雪涛完成时触发' }
      ],
      expose: ['start()', 'stop()']
    },
    {
      name: 'SesProgress',
      importCode: `import { SesProgress } from '@song-ui/vue';`,
      usageCode: `<SesProgress :value="72" label="秘阁校勘进度" variant="celadon" />
<SesProgress indeterminate label="漕运调拨中" variant="gold" />`,
      props: [
        { name: 'value', type: `number`, defaultVal: `0`, desc: '当前进度值' },
        { name: 'max', type: `number`, defaultVal: `100`, desc: '最大值' },
        { name: 'label', type: `string`, defaultVal: `—`, desc: '左侧标题' },
        { name: 'showValue', type: `boolean`, defaultVal: `true`, desc: '是否显示百分比' },
        { name: 'variant', type: `'celadon' | 'gold' | 'cinnabar'`, defaultVal: `'celadon'`, desc: '进度条釉色' },
        { name: 'indeterminate', type: `boolean`, defaultVal: `false`, desc: '不定长流动动画' }
      ]
    },
    {
      name: 'SesTooltip',
      importCode: `import { SesTooltip } from '@song-ui/vue';`,
      usageCode: `<SesTooltip text="天青为上，粉青次之" placement="top">
  <SesButton size="sm">悬停观注</SesButton>
</SesTooltip>`,
      props: [
        { name: 'text', type: `string`, defaultVal: `必填`, desc: '浮笺提示文字' },
        { name: 'placement', type: `'top' | 'bottom'`, defaultVal: `'top'`, desc: '弹出方向' },
        { name: 'disabled', type: `boolean`, defaultVal: `false`, desc: '禁用提示' }
      ],
      slots: [{ name: 'default', props: `—`, desc: '触发浮笺的宿主元素' }]
    },
    {
      name: 'SesBreadcrumbs',
      importCode: `import { SesBreadcrumbs, type SesBreadcrumbItem } from '@song-ui/vue';`,
      usageCode: `<SesBreadcrumbs :items="crumbs" @navigate="(item) => console.log(item)" />`,
      props: [
        { name: 'items', type: `SesBreadcrumbItem[]`, defaultVal: `必填`, desc: '路径节点（{ label, href?, value? }）' },
        { name: 'separator', type: `string`, defaultVal: `'·'`, desc: '分隔符' }
      ],
      events: [{ name: 'navigate', payload: `(item: SesBreadcrumbItem, index: number)`, desc: '点击非末尾节点时触发' }]
    }
  ],
  upload: [
    {
      name: 'SesUpload',
      importCode: `import { SesUpload } from '@song-ui/vue';`,
      usageCode: `<SesUpload v-model="files" accept=".png,.jpg,.pdf" :max-size-mb="10" @reject="(msg) => toast.show(msg)" />`,
      props: [
        { name: 'modelValue', type: `File[]`, defaultVal: `[]`, desc: '已选文件列表（v-model）' },
        { name: 'accept', type: `string`, defaultVal: `undefined`, desc: '允许的文件扩展名或 MIME 类型' },
        { name: 'multiple', type: `boolean`, defaultVal: `true`, desc: '是否支持多文件择取' },
        { name: 'maxSizeMb', type: `number`, defaultVal: `10`, desc: '单文件大小上限（MB）' },
        { name: 'disabled', type: `boolean`, defaultVal: `false`, desc: '禁用上传区域' },
        { name: 'title', type: `string`, defaultVal: `'素笺入画 · 呈卷上传'`, desc: '主提示标题' },
        { name: 'hint', type: `string`, defaultVal: `'点击择取或拖拽文书、画卷至此'`, desc: '副提示语' }
      ],
      events: [
        { name: 'update:modelValue', payload: `(files: File[])`, desc: '文件增删时同步列表' },
        { name: 'change', payload: `(files: File[])`, desc: '文件列表变化时触发' },
        { name: 'reject', payload: `(reason: string)`, desc: '超出大小限制被拒时触发' }
      ]
    }
  ],
  avatarGroup: [
    {
      name: 'SesAvatarGroup',
      importCode: `import { SesAvatarGroup, type SesAvatarItem } from '@song-ui/vue';`,
      usageCode: `<SesAvatarGroup :items="scholars" :max="4" @select="(item) => toast.show(item.name)" />`,
      props: [
        { name: 'items', type: `SesAvatarItem[]`, defaultVal: `必填`, desc: '名士列表（{ name, title?, src?, tone? }）' },
        { name: 'max', type: `number`, defaultVal: `5`, desc: '最多显露枚数，超出自动折叠为 +N' },
        { name: 'size', type: `'sm' | 'md' | 'lg'`, defaultVal: `'md'`, desc: '头像尺寸' },
        { name: 'interactive', type: `boolean`, defaultVal: `true`, desc: '是否启用悬停抬起与点击事件' }
      ],
      events: [{ name: 'select', payload: `(item: SesAvatarItem, index: number)`, desc: '点击某位名士头像时触发' }]
    }
  ],
  rating: [
    {
      name: 'SesRating',
      importCode: `import { SesRating } from '@song-ui/vue';`,
      usageCode: `<SesRating v-model="score" :max="5" />`,
      props: [
        { name: 'modelValue', type: `number`, defaultVal: `必填`, desc: '当前品鉴星等（v-model）' },
        { name: 'max', type: `number`, defaultVal: `5`, desc: '最大星数' },
        { name: 'readonly', type: `boolean`, defaultVal: `false`, desc: '只读展示态' },
        { name: 'showLabel', type: `boolean`, defaultVal: `true`, desc: '是否显示右侧品级锦缎签' },
        { name: 'labels', type: `string[]`, defaultVal: `['凡品','中品','佳品','妙品','神品']`, desc: '各星级对应的品鉴评语' },
        { name: 'size', type: `'sm' | 'md' | 'lg'`, defaultVal: `'md'`, desc: '星标尺寸' }
      ],
      events: [
        { name: 'update:modelValue', payload: `(value: number)`, desc: '星等变化时更新' },
        { name: 'change', payload: `(value: number)`, desc: '点击或键盘选中星等时触发' }
      ]
    }
  ]
};
