<template>
  <div style="display: flex">
    <div style="flex: 1">
      <div>
        <button @click="openModal">插入占位符</button>
        <button @click="printHtml">print html</button>
        <button @click="disable">disable</button>
      </div>
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
import {onBeforeUnmount, ref, shallowRef} from 'vue'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import type {PlaceholderElement} from '../container/custom-types'
import {Transforms, Node} from 'slate'
import {SlateEditor, SlateTransforms} from "@wangeditor/editor";

export default {
  components: {Editor, Toolbar},
  setup() {
    const editorRef = shallowRef()
    const valueHtml = ref('<p>hello</p>')
    const mode = 'default'
    const toolbarConfig = {}
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
        SlateTransforms.setNodes(editor, {name: value}, {at: path})
        console.log("name " + path + "\n" + node)
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

    const openModal = () => {

      const editor = editorRef.value;
      const node: PlaceholderElement = {
        type: 'placeholder',
        id: 122,
        name: "名字",
        children: [{text: ''}]
      }
      editorRef.value.insertNode(node)
      updatePlaceholderList()
      // const nodes = editor.children.filter(
      //     (node) => node.type === 'placeholder'
      // ) as PlaceholderElement[]
      // placeholders.value = nodes.map((node) => ({
      //   id: node.id,
      //   name: node.name,
      //   value: placeholderValues.value[node.id] || ''
      // }))
    }

    const submitModal = () => {
      if (modalId.value && modalName.value && editorRef.value) {
        const node: PlaceholderElement = {
          type: 'placeholder',
          id: modalId.value,
          name: modalName.value,
          children: [{text: ''}]
        }
        editorRef.value.insertNode(node)
        showModal.value = false
      } else {
        alert('请填写 ID 和 Name')
      }
    }


    onBeforeUnmount(() => {
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
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.modal-content input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 5px;
}

.modal-content button {
  margin: 5px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.modal-content button:hover {
  background: #0056b3;
}
</style>