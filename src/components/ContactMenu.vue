<script setup lang="ts">
// 顶栏右侧 CTA + 联系渠道下拉，组件来自 Memoh 的 @felinic/ui（reka-ui 底座）。
// 与 index.astro footer 的联系栏是同一份渠道清单，两处保持同步。
import { Button } from '@felinic/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@felinic/ui'

// WeChat 没有可用的直链（u.wechat.com 短链实测在手机/桌面浏览器都只是
// 301 到 wechat.com），不进 socials：点击经自定义事件打开全局名片弹窗
// （WeChatDialog.vue）。select 不加 prevent，菜单正常关闭、弹窗随后打开。
function openWeChatDialog() {
  window.dispatchEvent(new CustomEvent('open-wechat-dialog'))
}

const socials = [
  { name: 'Email', href: 'mailto:qff45688@gmail.com', handle: 'qff45688@gmail.com' },
  { name: 'GitHub', href: 'https://github.com/qqqqqf-q', handle: '@qqqqqf-q' },
  { name: 'X', href: 'https://x.com/qqqqqf_', handle: '@qqqqqf_' },
  { name: 'Telegram', href: 'https://t.me/chiffoncha', handle: '@chiffoncha' },
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
      <DropdownMenuItem
        class="justify-between gap-4 cursor-pointer"
        @select="openWeChatDialog"
      >
        <span>WeChat</span>
        <span class="text-xs opacity-50">chiffonwind</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
