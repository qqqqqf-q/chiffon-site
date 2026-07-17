<script setup lang="ts">
// 顶栏右侧 CTA + 联系渠道下拉，组件来自 Memoh 的 @felinic/ui（reka-ui 底座）。
import { Button } from '@felinic/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@felinic/ui'

const socials = [
  { name: 'Email', href: 'mailto:qingf622@outlook.com', handle: 'qingf622@outlook.com' },
  { name: 'GitHub', href: 'https://github.com/qqqqqf-q', handle: '@qqqqqf-q' },
  { name: 'X', href: 'https://x.com/qqqqqf_', handle: '@qqqqqf_' },
  { name: 'Telegram', href: 'https://t.me/NS_qingf_bot', handle: '@NS_qingf_bot' },
]
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button class="text-base rounded-full squircle">Get in touch</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-60">
      <DropdownMenuItem
        v-for="s in socials"
        :key="s.name"
        as-child
        class="flex items-center justify-between gap-4"
      >
        <a :href="s.href" target="_blank" rel="noopener noreferrer">
          <span>{{ s.name }}</span>
          <span class="text-xs opacity-50">{{ s.handle }}</span>
        </a>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
