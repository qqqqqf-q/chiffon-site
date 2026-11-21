<script setup lang="ts">
// 语言切换：felinic Select 下拉。选中即跳到另一种语言下的同一页面（altHref，由页面给出），缺省回对方语言首页。
import { ref, watch } from 'vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@felinic/ui'

const props = withDefaults(defineProps<{ lang?: 'en' | 'zh'; altHref?: string }>(), { lang: 'en' })

const value = ref(props.lang)
watch(value, (v) => {
  if (v !== props.lang) {
    window.location.href = props.altHref ?? (v === 'zh' ? '/zh/' : '/')
  }
})
</script>

<template>
  <Select v-model="value">
    <SelectTrigger size="sm" class="border-none shadow-none bg-transparent text-dim hover:text-head transition-colors">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="en">English</SelectItem>
      <SelectItem value="zh">中文</SelectItem>
    </SelectContent>
  </Select>
</template>
