<script setup lang="ts">
import {ref} from 'vue'
import Editor from './Editro.vue'
import Menu from './Menu.vue'
import {v4 as uuidv4} from 'uuid'

const showPopup = ref(false)
const phName = ref('')
const phId = ref('')
const editorRef = ref<any>(null)
const valueHtml = ref('')

function addPlaceholder() {
  if (!phName.value || !editorRef.value) return
  const id = phId.value || uuidv4()
  editorRef.value.insertPlaceholder(phName.value, id)
  phName.value = ''
  phId.value = ''
  showPopup.value = false
}

function handleChange() {
  // 可选：处理编辑器内容变化
}
</script>

<template>
  <div class="container">
    <div class="editor-pane">
      <h2>文档编辑器</h2>
      <Editor v-model="valueHtml" @onChange="handleChange" ref="editorRef"/>
      <button @click="showPopup = true">插入占位符</button>
    </div>

    <div class="menu-pane">
      <Menu :editor="editorRef?.editorRef"/>
    </div>
  </div>

  <div v-if="showPopup" class="popup">
    <input v-model="phName" placeholder="输入公司名"/>
    <input v-model="phId" placeholder="输入ID（可选）"/>
    <button @click="addPlaceholder">确定</button>
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

.editor-pane,
.menu-pane {
  flex: 1;
  overflow-y: auto;
}

.editor-pane {
  border-right: 1px solid #ccc;
  position: relative;
  z-index: 1;
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