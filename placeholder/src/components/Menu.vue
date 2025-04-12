<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  editor: any
}>()

const menuItems = ref<any[]>([])

function syncMenu() {
  const editor = props.editor
  if (!editor) return
  const content = editor.getHtml()
  const parser = new DOMParser()
  const doc = parser.parseFromString(content || '<div></div>', 'text/html')
  const placeholders = Array.from(doc.querySelectorAll('[data-id]'))
  const phMap = new Map()
  placeholders.forEach((el) => {
    const id = el.getAttribute('data-id')
    phMap.set(id, {
      id,
      name: el.getAttribute('data-name'),
      content: el.textContent?.trim() || ''
    })
  })
  menuItems.value = Array.from(phMap.values())
}

function updatePlaceholderContent(id: string, content: string) {
  const editor = props.editor
  if (!editor) return
  const html = editor.getHtml()
  const parser = new DOMParser()
  const doc = parser.parseFromString(html || '<div></div>', 'text/html')
  const elements = doc.querySelectorAll(`[data-id="${id}"]`)
  elements.forEach((el) => {
    el.textContent = content || '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' // 8个空格
  })
  editor.setHtml(doc.body.innerHTML)
  syncMenu()
}

watch(() => props.editor, syncMenu, { immediate: true })
</script>

<template>
  <div>
    <h2>菜单</h2>
    <div v-if="menuItems.length === 0">暂无占位符</div>
    <div v-for="item in menuItems" :key="item.id" class="menu-item">
      <label>{{ item.name }} (ID: {{ item.id }}):</label>
      <input v-model="item.content" @input="updatePlaceholderContent(item.id, item.content)" />
    </div>
  </div>
</template>

<style scoped>
.menu-item {
  margin-bottom: 10px;
}
</style>