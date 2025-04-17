<template>
  <div style="display: flex">
    <div style="flex: 1">
      <div style="border: 1px solid #ccc; margin-top: 10px">
        <Toolbar
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
            style="border-bottom: 1px solid #ccc"
        />
        <Editor
            :defaultConfig="editorConfig"
            :mode="mode"
            v-model="valueHtml"
            style="height: 400px; overflow-y: hidden"
            @onCreated="handleCreated"
            @onChange="handleChange"
        />
      </div>
      <div style="margin-top: 10px">
        <textarea
            v-model="valueHtml"
            readonly
            style="width: 100%; height: 200px; outline: none"
        ></textarea>
      </div>
    </div>
    <div style="width: 250px; border-left: 1px solid #ccc; padding: 10px">
      <h3>占位符列表</h3>
      <div v-if="placeholders.length === 0">暂无占位符</div>
      <div v-for="ph in placeholders" :key="ph.id" style="margin-bottom: 10px">
        <label>{{ ph.name }} ({{ ph.id }})</label>
        <input
            v-model="placeholderValues[ph.name]"
            @change="updatePlaceholder(ph.id, $event.target.value)"
            placeholder="输入内容"
            style="width: 100%; margin-top: 5px"
        />
      </div>
    </div>
  </div>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h3>插入占位符</h3>
      <input v-model="modalId" placeholder="请输入 ID"/>
      <input v-model="modalName" placeholder="请输入 Name"/>
      <button @click="submitModal">插入</button>
      <button @click="showModal = false">取消</button>
    </div>
  </div>
</template>

<script lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import {onBeforeUnmount, onMounted, ref, shallowRef, withKeys} from 'vue'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import type {PlaceholderElement} from '../editor/custom-types'
import {SlateEditor, SlateTransforms} from "@wangeditor/editor";
import emitter from "@/but.js";

export default {
  components: {Editor, Toolbar},
  setup() {
    const editorRef = shallowRef()
    const valueHtml = ref('<p>hello</p>')
    const mode = 'default'
    const toolbarConfig = {}
    toolbarConfig.insertKeys = {
      index: 2, // 插入的位置，基于当前的 toolbarKeys
      keys: ['menu1'],
    }
    const editorConfig = {placeholder: '请输入内容...'}

    // 占位符列表和值
    const placeholders = ref<{ id: string; name: string; value: string }[]>([])
    const placeholderValues = ref<Record<string, string>>({})

    // 弹窗状态
    const showModal = ref(false)
    const modalId = ref('')
    const modalName = ref('')

    const handleCreated = (editor) => {
      editorRef.value = editor
      // updatePlaceholderList() // 初始化占位符列表
      // // 监听节点变化以更新占位符列表
      // editor.on('change', () => {
      //   updatePlaceholderList()
      // })
    }

    const handleChange = (editor) => {
      valueHtml.value = editor.getHtml()
    }

    const printHtml = () => {
      if (editorRef.value) {
        console.log(editorRef.value.children)
      }
    }

    const disable = () => {
      // if (editorRef.value) {
      //   editorRef.value.disable()
      // }
      updatePlaceholderContent(editorRef.value, 122, "asdoifjs")
    }
    const updatePlaceholder = (targetId: number, value: string) => {
      console.log("更新 " + targetId + " " + value)
      const editor = editorRef.value
      // 遍历所有节点
      for (const [node, path] of SlateEditor.nodes(editor, {
        at: [], // 从根节点开始遍历
        match: (n) =>
            typeof n === 'object' && 'type' in n &&
            n.type === 'placeholder' &&
            'id' in n &&
            n.id === targetId,
      })) {
        // 更新匹配节点的 name 属性
        // Transforms.setNodes(
        //     editor,
        //     {name: '22222222'}, // 新的属性值
        //     {at: path} // 节点路径
        // );
        SlateTransforms.setNodes(editor, {value: value}, {at: path})
        // console.log("name " + path + "\n" + node)
        // const childPath = path.concat(0) // children[0]
        // Transforms.insertText(editor, value, {at: childPath})
      }
    }
// 更新占位符列表（去重）
    const updatePlaceholderList = () => {
      const editor = editorRef.value
      if (!editor) return

      // 遍历所有节点，获取 type 为 placeholder 的节点
      const nodes = Array.from(
          SlateEditor.nodes(editor, {
            at: [],
            match: (n) =>
                typeof n === 'object' && 'type' in n && n.type === 'placeholder'
          })
      ).map(([node]) => node as PlaceholderElement)

      // 调试：打印所有匹配的节点
      console.log('匹配的占位符节点:', nodes)

      // 按 id 去重，取第一个匹配的 name
      const uniquePlaceholders = Object.values(
          nodes.reduce((acc, node) => {
            if (node.id && !acc[node.id]) {
              acc[node.id] = {id: node.id, name: node.name || '未命名'}
            }
            return acc
          }, {} as Record<string, { id: string; name: string }>)
      )

      // 调试：打印去重后的数据
      console.log('去重后的占位符:', uniquePlaceholders)

      placeholders.value = uniquePlaceholders
    }

    function updatePlaceholderContent(editor, targetId, newText) {
      // 遍历所有节点
      for (const [node, path] of SlateEditor.nodes(editor, {
        at: [], // 从根节点开始遍历
        match: (n) =>
            typeof n === 'object' && n !== null && 'type' in n &&
            n.type === 'placeholder' &&
            'id' in n &&
            n.id === targetId,
      })) {
        // 更新匹配节点的 name 属性
        // Transforms.setNodes(
        //     editor,
        //     {name: '22222222'}, // 新的属性值
        //     {at: path} // 节点路径
        // );
        SlateTransforms.setNodes(editor, {name: "123456"}, {at: path})
        console.log("name " + path + "\n" + node)
      }
    }

    const savedSelection = ref(null)
    const openModal = () => {
      const editor = editorRef.value
      if (editor) {
        savedSelection.value = editor.selection // 保存当前选区
      }
      showModal.value = true
    }

    const submitModal = () => {
      const editor = editorRef.value;
      if (!modalId.value || !modalName.value || !editor) {
        alert('请填写 ID 和 Name')
        return
      }

      console.log("sav " + savedSelection.value)
      // 恢复保存的选区
      if (savedSelection.value) {
        try {
          editor.selection = savedSelection.value
        } catch (e) {
          console.warn('无法恢复选区，可能已失效', e)
        }
      }

      const node: PlaceholderElement = {
        type: 'placeholder',
        id: Number(modalId.value),
        name: modalName.value,
        value: "    ",
        children: [{text: ''}]
      }

      try {
        editor.insertNode(node)
        updatePlaceholderList()

        // 插入后再次聚焦到编辑器
        editor.focus()

        // 清理弹窗状态
        showModal.value = false
        modalId.value = ''
        modalName.value = ''
      } catch (e) {
        console.error('插入占位符失败', e)
      }
    }


    onMounted(() => {
      emitter.on('open-placeholder-modal', openModal)
    })
    onBeforeUnmount(() => {
      emitter.off('open-placeholder-modal', openModal)

      if (editorRef.value) {
        editorRef.value.destroy()
        editorRef.value = null
      }
    })

    return {
      editorRef,
      mode,
      valueHtml,
      toolbarConfig,
      editorConfig,
      handleCreated,
      handleChange,
      printHtml,
      disable,
      placeholders,
      placeholderValues,
      showModal,
      modalId,
      modalName,
      openModal,
      submitModal,
      updatePlaceholder
    }
  }
}
</script>

<style scoped>
/* Modal overlay */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal content */
.modal-content {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

/* Modal heading */
.modal-content h3 {
  font-size: 1.25rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

/* Input fields */
.modal-content input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  color: #333;
  background: #fff;
}

/* Buttons */
.modal-content button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-content button:first-of-type {
  background: #007bff;
  color: #fff;
  margin-right: 0.5rem;
}

.modal-content button:first-of-type:hover {
  background: #0069d9;
}

.modal-content button:last-of-type {
  background: #f5f5f5;
  color: #333;
}

.modal-content button:last-of-type:hover {
  background: #e0e0e0;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .modal-content {
    margin: 1rem;
    padding: 1rem;
  }
}
</style>