<script setup lang="ts">
import {ref, onMounted} from 'vue'
import WangEditor from 'wangeditor'
import {v4 as uuidv4} from 'uuid'

const editorRef = ref(null)
const editorInstance = ref<any>(null)
const menuItems = ref<any[]>([])
const showPopup = ref(false)
const ph_name = ref('')
const ph_id = ref('')

onMounted(() => {
  const editor = new WangEditor(editorRef.value)
  editor.config.onchange = () => {
    sync_menu()
  }
  editor.create()
  editorInstance.value = editor
})

function sync_menu() {
  const content = editorInstance.value.txt.html()
  const parser = new DOMParser()
  const doc = parser.parseFromString(content || '<div></div>', 'text/html')
  const placeholders = Array.from(doc.querySelectorAll('[data-id]'))
  const ph_map = new Map()
  placeholders.forEach((el) => {
    const id = el.getAttribute('data-id')
    ph_map.set(id, {
      id,
      name: el.getAttribute('data-name'),
      content: el.textContent ? el.textContent.trim() : ''
    })
  })
  menuItems.value = Array.from(ph_map.values())
}

function add_ph() {
  if (!ph_name.value || !editorInstance.value) return
  const id = ph_id.value || uuidv4()
  const placeholderHtml = `<span data-name="${ph_name.value}" data-id="${id}" contenteditable="false" style="border-bottom: 1px solid black; padding: 0 2px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`
  editorInstance.value.cmd.do('insertHTML', placeholderHtml)

  const selection = window.getSelection()
  const range = document.createRange()
  const editorDiv = editorRef.value.querySelector('.w-e-text')
  range.selectNodeContents(editorDiv)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)

  ph_name.value = ''
  ph_id.value = ''
  showPopup.value = false
  sync_menu()
}

function sync_content(id: string, content: string) {
  const editor = editorInstance.value
  if (editor) {
    // 保存当前焦点元素
    const activeElement = document.activeElement
    const html = editor.txt.html()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html || '<div></div>', 'text/html')
    const elements = doc.querySelectorAll(`[data-id="${id}"]`)
    elements.forEach((el) => {
      el.textContent = content || "        "
    })
    // 更新编辑器内容但不触发焦点跳转
    editor.txt.html(doc.body.innerHTML)

    // 恢复焦点到原来的输入框
    if (activeElement && activeElement.tagName === 'INPUT') {
      (activeElement as HTMLInputElement).focus()
    }
    sync_menu()
  }
}
</script>

<template>
  <div class="container">
    <div class="editor-pane">
      <h2>aaa</h2>
      <div ref="editorRef"></div>
      <button @click="showPopup = true">插入占位符</button>
    </div>

    <div class="menu-pane">
      <h2>菜单</h2>
      <div v-if="menuItems.length === 0">暂无占位符</div>
      <div v-for="item in menuItems" :key="item.id" class="menu-item">
        <label>{{ item.name }} (ID: {{ item.id }}):</label>
        <input v-model="item.content" @change="sync_content(item.id, item.content)"/>
        <!--        <input v-model="item.content" @input="updatePlaceholderContent(item.id, item.content)" />-->
      </div>
    </div>
  </div>

  <div v-if="showPopup" class="popup">
    <input v-model="ph_name" placeholder="nmea"/>
    <input v-model="ph_id" placeholder="id"/>
    <button @click="add_ph">确定</button>
    <button @click="showPopup = false">取消</button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  gap: 20px;
  padding: 20px;
}

.editor-pane, .menu-pane {
  flex: 1;
  overflow-y: auto;
}

.editor-pane {
  border-right: 1px solid #ccc;
  position: relative;
  z-index: 1;
}

.menu-item {
  margin-bottom: 10px;
}

.popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.popup input {
  display: block;
  margin-bottom: 10px;
  width: 100%;
}
</style>