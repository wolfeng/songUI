import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { songRules } from '@wolfeng/song-ui-core';
import {
  createSongUI,
  useTheme,
  useLocale,
  SesButton,
  SesSeal,
  SesSwitch,
  SesAlert,
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
  SesInput,
  SesCheckbox,
  SesRadioGroup,
  SesTooltip,
  SesProgress,
  SesDianchaLoader,
  SesBreadcrumbs,
  SesGuqinSlider,
  SesUpload,
  SesAvatarGroup,
  SesRating,
  SesDatePicker,
  SesTimePicker
} from '../src/index.js';

describe('@wolfeng/song-ui-vue', () => {
  it('installs createSongUI, injects SVG filters, and toggles theme', () => {
    const TestHost = defineComponent({
      setup() {
        const theme = useTheme();
        return { theme };
      },
      template: '<button @click="theme.toggle()">{{ theme.current.value }}</button>'
    });

    const wrapper = mount(TestHost, {
      global: {
        plugins: [createSongUI({ theme: 'dark', persistTheme: false, sound: false })]
      }
    });

    expect(document.getElementById('ses-svg-filters-host')).not.toBeNull();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(wrapper.text()).toBe('dark');

    return wrapper.trigger('click').then(() => {
      expect(wrapper.text()).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  it('renders SesButton variants and emits click', async () => {
    const wrapper = mount(SesButton, {
      props: { variant: 'gold' },
      slots: { default: '描金御赐' },
      global: { plugins: [createSongUI({ sound: false, persistTheme: false })] }
    });

    expect(wrapper.classes()).toContain('ses-btn-jade--gold');
    expect(wrapper.text()).toContain('描金御赐');
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('supports v-model and aria-checked on SesSwitch', async () => {
    const wrapper = mount(SesSwitch, {
      props: { modelValue: false, label: '夜观星象' },
      global: { plugins: [createSongUI({ sound: false, persistTheme: false })] }
    });

    const btn = wrapper.get('button[role="switch"]');
    expect(btn.attributes('aria-checked')).toBe('false');
    await btn.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
  });

  it('renders SesSeal and SesAlert properly', () => {
    const seal = mount(SesSeal, {
      props: { color: 'malachite', interactive: true },
      slots: { default: '已验入库' }
    });
    expect(seal.element.tagName.toLowerCase()).toBe('button');
    expect(seal.classes()).toContain('ses-seal-stamp--malachite');

    const alert = mount(SesAlert, {
      props: { title: '御前急脚递 · 金字牌', badge: '日行五百里' },
      slots: { default: '汴河桃花汛水位已逾岸标三尺。' }
    });
    expect(alert.attributes('role')).toBe('alert');
    expect(alert.text()).toContain('御前急脚递');
  });

  it('supports SesSelect dropdown and option selection', async () => {
    const wrapper = mount(SesSelect, {
      props: {
        modelValue: 'chongwen',
        options: [
          { value: 'chongwen', label: '崇文总目 · 经部易类', meta: '卷一' },
          { value: 'yingzao', label: '营造法式 · 大木作制度', meta: '卷四' }
        ]
      }
    });

    await wrapper.get('.ses-yaqian-trigger').trigger('click');
    const opts = wrapper.findAll('[role="option"]');
    expect(opts).toHaveLength(2);
    await opts[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['yingzao']);
  });

  it('steps counting rods in SesStepper', async () => {
    const wrapper = mount(SesStepper, {
      props: { modelValue: 27 }
    });
    expect(wrapper.text()).toContain('二 〧');
    await wrapper.get('button[aria-label="增加"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([28]);
  });

  it('toggles SesAccordion folds and SesWoodblockReader orientation', async () => {
    const acc = mount(SesAccordion, {
      props: {
        items: [
          { id: 'f1', title: '第一折', content: '正文一' },
          { id: 'f2', title: '第二折', content: '正文二' }
        ]
      }
    });
    expect(acc.text()).toContain('正文一');
    const buttons = acc.findAll('button');
    await buttons[1].trigger('click');
    expect(acc.text()).toContain('正文二');

    const reader = mount(SesWoodblockReader, {
      props: { title: '宣和博古图录' },
      slots: { default: '<p>汝州新窑器</p>' }
    });
    expect(reader.get('article').classes()).toContain('vertical-mode');
    await reader.get('button').trigger('click');
    expect(reader.get('article').classes()).not.toContain('vertical-mode');
  });

  it('sorts SesTable and switches SesPagination pages', async () => {
    const table = mount(SesTable, {
      props: {
        columns: [
          { key: 'name', title: '州府' },
          { key: 'val', title: '岁入', sortable: true }
        ],
        rows: [
          { id: 1, name: '汝州', val: 92000 },
          { id: 2, name: '苏州', val: 114000 }
        ]
      }
    });
    await table.findAll('th')[1].trigger('click');
    const firstRowText = table.findAll('tbody tr')[0].text();
    expect(firstRowText).toContain('苏州');

    const pager = mount(SesPagination, {
      props: { modelValue: 1, totalPages: 4 }
    });
    const pageBtns = pager.findAll('.ses-clay-type');
    await pageBtns[2].trigger('click'); // "贰"
    expect(pager.emitted('update:modelValue')?.[0]).toEqual([2]);
  });

  it('renders SesScrollModal and SesScreenDrawer and closes on button click', async () => {
    const modal = mount(SesScrollModal, {
      props: { modelValue: true, title: '《千里江山图》卷跋', subtitle: '宣和御览' },
      slots: { default: '卷跋正文' }
    });
    expect(modal.get('.ses-scroll-backdrop').classes()).toContain('open');
    await modal.get('button[aria-label="收卷"]').trigger('click');
    expect(modal.emitted('update:modelValue')?.[0]).toEqual([false]);

    const drawer = mount(SesScreenDrawer, {
      props: { modelValue: true, title: '藏经百宝嵌' },
      slots: { default: '屏风内容' }
    });
    expect(drawer.get('.ses-screen-drawer').classes()).toContain('open');
    await drawer.get('button[aria-label="合拢屏风"]').trigger('click');
    expect(drawer.emitted('update:modelValue')?.[0]).toEqual([false]);
  });

  it('renders SesTimepiece, SesIncenseTimer, SesAstrolabeGauge, and SesMountainChart', async () => {
    const timepiece = mount(SesTimepiece, {
      props: { minutes: 0 },
      global: { plugins: [createSongUI({ theme: 'dark', persistTheme: false, sound: false })] }
    });
    expect(timepiece.text()).toContain('三更三点');

    const incense = mount(SesIncenseTimer, {
      props: { initialSeconds: 15 }
    });
    expect(incense.text()).toContain('00:15');

    const gauge = mount(SesAstrolabeGauge);
    expect(gauge.text()).toContain('谷雨');
    await gauge.get('button').trigger('click');
    expect(gauge.text()).toContain('夏至');

    const chart = mount(SesMountainChart, {
      props: {
        data: [
          { label: '正月', backValue: 320, frontValue: 215, unit: '万石' },
          { label: '六月', backValue: 612, frontValue: 485, unit: '万石' }
        ]
      }
    });
    expect(chart.text()).toContain('612万石');
  });

  it('renders SesTag and SesTabs with keyboard/click switching', async () => {
    const tag = mount(SesTag, {
      props: { variant: 'cinnabar', closable: true },
      slots: { default: '秘藏善本' }
    });
    expect(tag.text()).toContain('秘藏善本');
    await tag.get('.ses-tag__close').trigger('click');
    expect(tag.emitted('close')).toHaveLength(1);

    const tabs = mount(SesTabs, {
      props: {
        modelValue: 'a',
        items: [
          { value: 'a', label: '卷上', badge: 3 },
          { value: 'b', label: '卷中' },
          { value: 'c', label: '卷下', disabled: true }
        ]
      }
    });
    const tabBtns = tabs.findAll('[role="tab"]');
    expect(tabBtns[0].attributes('aria-selected')).toBe('true');
    await tabBtns[1].trigger('click');
    expect(tabs.emitted('update:modelValue')?.[0]).toEqual(['b']);
    await tabBtns[2].trigger('click');
    expect(tabs.emitted('update:modelValue')).toHaveLength(1);
  });

  it('validates SesInput fields inside SesForm on submit', async () => {
    const Host = defineComponent({
      components: { SesForm, SesInput },
      setup() {
        const valid = ref(true);
        const title = ref('');
        const rules = [songRules.required('题跋不可留白'), songRules.minLength(4)];
        const onSubmitted = ref<boolean | null>(null);
        return { valid, title, rules, onSubmitted };
      },
      template: `
        <SesForm v-model="valid" @submit="({ valid: v }) => onSubmitted = v">
          <SesInput v-model="title" label="题跋" :rules="rules" />
          <button type="submit">呈递</button>
        </SesForm>
      `
    });

    const wrapper = mount(Host);
    await wrapper.get('form').trigger('submit');
    expect(wrapper.vm.valid).toBe(false);
    expect(wrapper.vm.onSubmitted).toBe(false);
    expect(wrapper.text()).toContain('题跋不可留白');

    await wrapper.get('input').setValue('清明上河图跋');
    await wrapper.get('form').trigger('submit');
    expect(wrapper.vm.valid).toBe(true);
    expect(wrapper.vm.onSubmitted).toBe(true);
  });

  it('supports SesCheckbox, SesRadioGroup, SesTooltip, SesProgress, and SesBreadcrumbs', async () => {
    const cb = mount(SesCheckbox, { props: { modelValue: false, label: '已阅览' } });
    await cb.get('[role="checkbox"]').trigger('click');
    expect(cb.emitted('update:modelValue')?.[0]).toEqual([true]);

    const radio = mount(SesRadioGroup, {
      props: {
        modelValue: 'a',
        options: [
          { label: '汝窑', value: 'a' },
          { label: '官窑', value: 'b' }
        ]
      }
    });
    await radio.findAll('[role="radio"]')[1].trigger('click');
    expect(radio.emitted('update:modelValue')?.[0]).toEqual(['b']);

    const tip = mount(SesTooltip, {
      props: { text: '天青为上' },
      slots: { default: '<button>悬停</button>' }
    });
    await tip.trigger('mouseenter');
    expect(tip.get('[role="tooltip"]').text()).toBe('天青为上');

    const prog = mount(SesProgress, { props: { value: 60, max: 100, label: '校勘进度' } });
    expect(prog.text()).toContain('60%');

    const crumbs = mount(SesBreadcrumbs, {
      props: { items: [{ label: '秘书省', value: 'ms' }, { label: '崇文总目' }] }
    });
    await crumbs.get('button.ses-breadcrumbs__link').trigger('click');
    expect(crumbs.emitted('navigate')?.[0]?.[1]).toBe(0);

    const diancha = mount(SesDianchaLoader, { props: { modelValue: 68 } });
    expect(diancha.text()).toContain('68%');
    expect(diancha.text()).toContain('五汤·云脚');

    const guqin = mount(SesGuqinSlider, { props: { modelValue: 64, label: '琴弦张力' } });
    expect(guqin.text()).toContain('徵音 · 元祐元年 (64%)');
    await guqin.get('[role="slider"]').trigger('keydown', { key: 'ArrowRight' });
    expect(guqin.emitted('update:modelValue')?.[0]).toEqual([69]);
  });

  it('supports custom marks on SesGuqinSlider, explicit mode on SesTimepiece, and full-incense preset on SesIncenseTimer', async () => {
    const customGuqin = mount(SesGuqinSlider, {
      props: {
        modelValue: 30,
        marks: [
          { value: 0, label: '散音' },
          { value: 50, label: '按音' },
          { value: 100, label: '泛音' }
        ]
      }
    });
    expect(customGuqin.text()).toContain('散音');
    expect(customGuqin.text()).toContain('泛音');

    const TimeHost = defineComponent({
      components: { SesTimepiece },
      setup() {
        const theme = useTheme();
        return { theme };
      },
      template: `<SesTimepiece :minutes="720" />`
    });
    const timepiece = mount(TimeHost, {
      global: { plugins: [createSongUI({ theme: 'light' })] }
    });
    expect(timepiece.text()).toContain('澄心昼景自动切换为赤道石晷投射晷影');

    timepiece.vm.theme.setTheme('dark');
    await timepiece.vm.$nextTick();
    expect(timepiece.text()).toContain('暗夜洒金自动切换为北宋水运刻漏');

    const incense = mount(SesIncenseTimer);
    expect(incense.text()).toContain('一炷香');
    const buttons = incense.findAll('button');
    const fullIncenseBtn = buttons.find((b) => b.text().includes('一炷香'));
    expect(fullIncenseBtn).toBeDefined();
    await fullIncenseBtn!.trigger('click');
    expect(incense.text()).toContain('30:00');
  });

  it('supports file list rendering, removal, and size limit rejection on SesUpload', async () => {
    const smallFile = new File(['hello'], '清明上河图.png', { type: 'image/png' });
    const upload = mount(SesUpload, {
      props: {
        modelValue: [smallFile],
        maxSizeMb: 1
      }
    });
    expect(upload.text()).toContain('清明上河图.png');
    expect(upload.text()).toContain('PNG');

    const removeBtn = upload.find('button');
    await removeBtn.trigger('click');
    expect(upload.emitted('update:modelValue')?.[0]).toEqual([[]]);
  });

  it('collapses overflow and emits select on SesAvatarGroup, and updates SesRating', async () => {
    const group = mount(SesAvatarGroup, {
      props: {
        items: [
          { name: '苏轼', tone: 'celadon' },
          { name: '欧阳修', tone: 'gold' },
          { name: '沈括', tone: 'ink' },
          { name: '司马光', tone: 'cinnabar' }
        ],
        max: 2
      }
    });
    expect(group.text()).toContain('苏');
    expect(group.text()).toContain('欧');
    expect(group.text()).toContain('+2');
    await group.findAll('button')[1].trigger('click');
    expect(group.emitted('select')?.[0]?.[1]).toBe(1);

    const rating = mount(SesRating, {
      props: { modelValue: 2 }
    });
    expect(rating.text()).toContain('中品');
    expect(rating.find('svg').attributes('data-symbol')).toBe('plum');
    const stars = rating.findAll('button[role="radio"]');
    await stars[4].trigger('click');
    expect(rating.emitted('update:modelValue')?.[0]).toEqual([5]);

    const lotusRating = mount(SesRating, {
      props: { modelValue: 4, symbol: 'lotus' }
    });
    expect(lotusRating.find('svg').attributes('data-symbol')).toBe('lotus');
  });

  it('supports bilingual locale switching via createSongUI and useLocale', async () => {
    const Host = defineComponent({
      components: { SesSwitch, SesRating },
      setup() {
        const { locale, toggle } = useLocale();
        return { locale, toggle };
      },
      template: `
        <div>
          <SesSwitch :model-value="true" label="Mode" />
          <SesRating :model-value="5" />
          <button class="toggle-locale" @click="toggle">toggle</button>
        </div>
      `
    });

    const wrapper = mount(Host, {
      global: {
        plugins: [createSongUI({ locale: 'en', sound: false, persistLocale: false })]
      }
    });

    expect(wrapper.text()).toContain('On');
    expect(wrapper.text()).toContain('Masterpiece');

    await wrapper.get('.toggle-locale').trigger('click');
    expect(wrapper.text()).toContain('已启');
    expect(wrapper.text()).toContain('神品');
  });

  it('selects and clears dates in SesDatePicker and respects min/max bounds', async () => {
    const dp = mount(SesDatePicker, {
      props: {
        modelValue: '2026-11-13',
        min: '2026-11-10',
        max: '2026-11-20'
      }
    });

    expect(dp.text()).toContain('2026-11-13');
    expect(dp.text()).toContain('丙午年');

    await dp.get('.ses-picker-trigger').trigger('click');
    expect(dp.find('[role="dialog"]').exists()).toBe(true);

    const cells = dp.findAll('.ses-datepicker-cell');
    const day5 = cells.find((c) => c.text() === '5' && !c.classes().includes('is-outside'));
    expect(day5?.attributes('disabled')).toBeDefined();

    const day15 = cells.find((c) => c.text() === '15' && !c.classes().includes('is-outside'));
    await day15?.trigger('click');
    expect(dp.emitted('update:modelValue')?.[0]).toEqual(['2026-11-15']);

    await dp.get('.ses-picker-clear').trigger('click');
    expect(dp.emitted('update:modelValue')?.[1]).toEqual(['']);
  });

  it('selects time and displays Song Shichen metadata in SesTimePicker', async () => {
    const tp = mount(SesTimePicker, {
      props: {
        modelValue: '12:00',
        minuteStep: 15
      }
    });

    expect(tp.text()).toContain('12:00');
    expect(tp.text()).toContain('午正');

    await tp.get('.ses-picker-trigger').trigger('click');
    expect(tp.find('[role="dialog"]').exists()).toBe(true);

    const hourBtns = tp.findAll('.ses-timepicker-col')[0].findAll('.ses-timepicker-item');
    await hourBtns[18].trigger('click');
    expect(tp.emitted('update:modelValue')?.[0]).toEqual(['18:00']);

    const minBtns = tp.findAll('.ses-timepicker-col')[1].findAll('.ses-timepicker-item');
    expect(minBtns.length).toBe(4);
    await minBtns[2].trigger('click');
    expect(tp.emitted('update:modelValue')?.[1]).toEqual(['18:30']);

    await tp.get('.ses-picker-clear').trigger('click');
    expect(tp.emitted('update:modelValue')?.[2]).toEqual(['']);
  });
});
