<script setup lang="ts">
// 全局微信名片弹窗：监听 'open-wechat-dialog' 自定义事件打开。
// 触发方有两处——顶栏 ContactMenu.vue 的 WeChat 行、index.astro footer 的
// 微信图标——它们分属不同的 Astro island，事件总线是最薄的连接方式，
// 且全站只需一个 dialog 实例。
// 为什么不用链接：微信个人号没有可用直链，u.wechat.com 短链在桌面/手机
// 浏览器都只会 301 到 wechat.com（2026-08 实测），只能展示二维码。
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Dialog, DialogContent, DialogTitle } from '@felinic/ui'

const open = ref(false)
const onOpen = () => {
  open.value = true
}
onMounted(() => window.addEventListener('open-wechat-dialog', onOpen))
onBeforeUnmount(() => window.removeEventListener('open-wechat-dialog', onOpen))
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-xs p-3">
      <DialogTitle class="sr-only">WeChat</DialogTitle>
      <!-- 名片原图只有白底:深色模式下整块白卡在深色弹窗上太割裂,
           换成重生成的白码透明底 SVG(反色可扫已验证);浅色模式保持原图 -->
      <img src="/wechat-qr.png" alt="WeChat QR code (chiffonwind)" class="block w-full dark:hidden" />
      <!-- mt-8 把码顶过右上角 × 关闭按钮那一行;浅色名片图自带留白不需要 -->
      <img src="/wechat-qr.svg" alt="" aria-hidden="true" class="hidden dark:block w-full mt-8" />
      <!-- 名片图里没有 ID 文字;给扫不了码的场景(如在手机上浏览)留一手 -->
      <p class="text-center text-sm opacity-50">chiffonwind</p>
    </DialogContent>
  </Dialog>
</template>
