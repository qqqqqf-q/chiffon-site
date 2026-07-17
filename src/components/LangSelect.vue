<script setup lang="ts">
// 语言切换：felinic Select 下拉。选中即跳转对应语言路径（/zh/ 尚未建，链接先接好）。
import { ref, watch } from 'vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@felinic/ui'

const props = withDefaults(defineProps<{ lang?: 'en' | 'zh' }>(), { lang: 'en' })

const value = ref(props.lang)
watch(value, (v) => {
  if (v !== props.lang) {
    window.location.href = v === 'zh' ? '/zh/' : '/'
  }
})
</script>

<template>
  <Select v-model="value">
    <SelectTrigger size="sm" class="border-none shadow-none bg-transparent">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="en">English</SelectItem>
      <SelectItem value="zh">中文</SelectItem>
    </SelectContent>
  </Select>
</template>
