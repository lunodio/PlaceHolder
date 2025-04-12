<script setup lang="ts">
import { ref, shallowRef, onBeforeUnmount, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'onChange', editor: any): void
}>()

const editorRef = shallowRef<any>(null)
const valueHtml = ref(props.modelValue)
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

onMounted(() => {
  setTimeout(() => {
    if (!valueHtml.value) {
      valueHtml.value = '<p>请输入内容</p>'
    }
  }, 1500)
})

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor
}

const handleChange = (editor: any) => {
  const html = editor.getHtml()
  emit('update:modelValue', html)
  emit('onChange', editor)
}

function insertPlaceholder(name: string, id: string = uuidv4()) {
  const editor = editorRef.value
  if (!editor) return
  const placeholderHtml = `<span data-name="${name}" data-id="${id}" contenteditable="false" style="border-bottom: 1px solid black; padding: 0 2px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`
  editor.insertHTML(placeholderHtml)
}

defineExpose({ insertPlaceholder, editorRef })
</script>

<template>
  <div style="border: 1px solid #ccc">
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" style="border-bottom: 1px solid #ccc" />
    <Editor
        :defaultConfig="editorConfig"
        v-model="valueHtml"
        style="height: 400px; overflow-y: hidden"
        @onCreated="handleCreated"
        @onChange="handleChange"
    />
  </div>
</template>