<script setup lang="ts">
import { useToast, useLocale } from '@wolfeng/song-ui-vue';
import type { ComponentApiDoc } from '../data/componentApi';

defineProps<{
  entries: ComponentApiDoc[];
}>();

const toast = useToast();
const locale = useLocale();

function copySnippet(text: string, label: string) {
  if (navigator.clipboard) {
    void navigator.clipboard.writeText(text);
  }
  toast.show(locale.isEn.value ? `Copied "${label}" snippet` : `已复制「${label}」示例代码`);
}
</script>

<template>
  <div v-if="entries?.length" class="api-ref-wrap">
    <div v-for="doc in entries" :key="doc.name" class="api-ref-block">
      <div class="api-ref-header">
        <h3 class="api-ref-title">
          {{ doc.name }} · {{ locale.isEn.value ? 'Import & API Reference' : '引用与参数配置' }}
        </h3>
        <button
          type="button"
          class="api-copy-btn"
          @click="copySnippet(`${doc.importCode}\n\n${doc.usageCode}`, doc.name)"
        >
          {{ locale.isEn.value ? 'Copy Code' : '复制代码' }}
        </button>
      </div>

      <pre class="api-code"><code>{{ doc.importCode }}

{{ doc.usageCode }}</code></pre>

      <div v-if="doc.props?.length" class="api-table-block">
        <div class="api-sub-label">Props</div>
        <div class="api-table-scroll">
          <table class="docs-api-table">
            <thead>
              <tr>
                <th>{{ locale.isEn.value ? 'Name' : '属性名' }}</th>
                <th>{{ locale.isEn.value ? 'Type' : '类型' }}</th>
                <th>{{ locale.isEn.value ? 'Default' : '默认值' }}</th>
                <th>{{ locale.isEn.value ? 'Description' : '说明' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in doc.props" :key="p.name">
                <td><code>{{ p.name }}</code></td>
                <td><code>{{ p.type }}</code></td>
                <td><code>{{ locale.isEn.value ? (p.defaultVal === '必填' ? 'Required' : (p.defaultValEn || p.defaultVal)) : p.defaultVal }}</code></td>
                <td>{{ locale.isEn.value && p.descEn ? p.descEn : p.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="doc.events?.length" class="api-table-block">
        <div class="api-sub-label">Events</div>
        <div class="api-table-scroll">
          <table class="docs-api-table">
            <thead>
              <tr>
                <th>{{ locale.isEn.value ? 'Event' : '事件名' }}</th>
                <th>{{ locale.isEn.value ? 'Payload' : '回调参数' }}</th>
                <th>{{ locale.isEn.value ? 'Description' : '说明' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in doc.events" :key="e.name">
                <td><code>{{ e.name }}</code></td>
                <td><code>{{ e.payload }}</code></td>
                <td>{{ locale.isEn.value && e.descEn ? e.descEn : e.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="doc.slots?.length" class="api-table-block">
        <div class="api-sub-label">Slots</div>
        <div class="api-table-scroll">
          <table class="docs-api-table">
            <thead>
              <tr>
                <th>{{ locale.isEn.value ? 'Slot' : '插槽名' }}</th>
                <th>{{ locale.isEn.value ? 'Scoped Props' : '作用域参数' }}</th>
                <th>{{ locale.isEn.value ? 'Description' : '说明' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in doc.slots" :key="s.name">
                <td><code>{{ s.name }}</code></td>
                <td><code>{{ s.props }}</code></td>
                <td>{{ locale.isEn.value && s.descEn ? s.descEn : s.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="doc.expose?.length" class="api-table-block">
        <div class="api-sub-label">{{ locale.isEn.value ? 'Expose / Composables' : 'Expose / 组合式 API' }}</div>
        <div class="api-expose-list">
          <code v-for="fn in doc.expose" :key="fn" class="api-expose-chip">{{ fn }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.api-ref-wrap {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.api-ref-block {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.api-ref-block + .api-ref-block {
  padding-top: 1.75rem;
  border-top: 1px dashed var(--ses-border-hairline);
}

.api-ref-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.api-ref-title {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--ses-ink-heavy);
  letter-spacing: 0.08em;
}

.api-copy-btn {
  padding: 0.3rem 0.75rem;
  font-size: 0.74rem;
  font-family: var(--ses-font-serif);
  letter-spacing: 0.1em;
  color: var(--ses-celadon-deep);
  background: var(--ses-bg-subtle);
  border: 1px solid var(--ses-border-hairline);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.api-copy-btn:hover {
  border-color: var(--ses-border-gold);
  color: var(--ses-ink-heavy);
}

.api-code {
  margin: 0;
  padding: 0.95rem 1.1rem;
  border-radius: 4px;
  border: 0.5px solid var(--ses-border-hairline);
  background: var(--ses-bg-subtle);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.78rem;
  line-height: 1.65;
  color: var(--ses-ink-heavy);
  overflow-x: auto;
}

.api-table-block {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.api-sub-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ses-ink-heavy);
  letter-spacing: 0.12em;
}

.api-table-scroll {
  overflow-x: auto;
  border: 0.5px solid var(--ses-border-hairline);
  border-radius: 4px;
}

.docs-api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  text-align: left;
}

.docs-api-table th {
  text-align: left;
  padding: 0.65rem 0.9rem;
  background: var(--ses-bg-subtle);
  border-bottom: 1px solid var(--ses-border-hairline);
  color: var(--ses-ink-heavy);
  font-weight: 600;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.docs-api-table td {
  padding: 0.65rem 0.9rem;
  border-bottom: 0.5px solid var(--ses-border-hairline);
  color: var(--ses-ink-medium);
  vertical-align: top;
  line-height: 1.6;
}

.docs-api-table tbody tr:last-child td {
  border-bottom: none;
}

.docs-api-table td code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.76rem;
  padding: 0.12rem 0.4rem;
  border-radius: 3px;
  background: var(--ses-bg-subtle);
  color: var(--ses-ink-heavy);
  white-space: nowrap;
}

.api-expose-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.api-expose-chip {
  padding: 0.3rem 0.65rem;
  border-radius: 3px;
  border: 0.5px solid var(--ses-border-hairline);
  background: var(--ses-bg-subtle);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.76rem;
  color: var(--ses-ink-heavy);
}
</style>
