<template>
  <div class="container">
    <div class="editor-pane">
      <div>
        <button @click="showPopup = true">插入占位符</button>
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
            @onDestroyed="handleDestroyed"
        />
      </div>
    </div>

    <div class="menu-pane">
      <h2>占位符列表</h2>
      <div v-if="menuItems.length === 0">暂无占位符</div>
      <div v-for="item in menuItems" :key="item.id" class="menu-item">
        <label>{{ item.name }} (ID: {{ item.id }}):</label>
        <input v-model="item.content" @change="syncContent(item.id, item.content)" />
      </div>
    </div>

    <div v-if="showPopup" class="popup">
      <input v-model="ph_name" placeholder="输入占位符名称" />
      <input v-model="ph_id" placeholder="输入ID（可选）" />
      <button @click="addPlaceholder">确定</button>
      <button @click="showPopup = false">取消</button>
    </div>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { v4 as uuidv4 } from 'uuid';

export default {
  components: { Editor, Toolbar },
  setup() {
    const editorRef = shallowRef();
    const valueHtml = ref('<p>hello</p>');
    const menuItems = ref([]);
    const showPopup = ref(false);
    const ph_name = ref('');
    const ph_id = ref('');

    const toolbarConfig = {};
    const editorConfig = {
      placeholder: '请输入内容...',
      MENU_CONF: {}
    };

    onMounted(() => {
      setTimeout(() => {
        valueHtml.value = '<p>开始编辑</p>';
      }, 1500);
    });

    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor) editor.destroy();
    });

    const handleCreated = (editor) => {
      editorRef.value = editor;
    };

    const handleChange = (editor) => {
      syncMenu();
    };

    const handleDestroyed = (editor) => {
      console.log('destroyed', editor);
    };

    const syncMenu = () => {
      const editor = editorRef.value;
      if (!editor) return;

      const html = editor.getHtml();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html || '<div></div>', 'text/html');
      const placeholders = Array.from(doc.querySelectorAll('[data-id]'));
      const ph_map = new Map();

      placeholders.forEach((el) => {
        const id = el.getAttribute('data-id');
        ph_map.set(id, {
          id,
          name: el.getAttribute('data-name'),
          content: el.textContent ? el.textContent.trim() : ''
        });
      });
      menuItems.value = Array.from(ph_map.values());
    };

    const addPlaceholder = () => {
      if (!ph_name.value || !editorRef.value) return;

      const id = ph_id.value || uuidv4();
      const html = `<span data-id="${id}" data-name="${ph_name.value}" style="border-bottom: 1px solid black; padding: 0 2px;" contenteditable="false">6666666</span>`;

      editorRef.value.dangerouslyInsertHtml(html);

      ph_name.value = '';
      ph_id.value = '';
      showPopup.value = false;
      syncMenu();
    };

    const syncContent = (id, content) => {
      const editor = editorRef.value;
      if (!editor) return;

      const activeElement = document.activeElement;
      const html = editor.getHtml();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html || '<div></div>', 'text/html');
      const elements = doc.querySelectorAll(`[data-id="${id}"]`);

      elements.forEach((el) => {
        el.textContent = content || '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0';
      });

      editor.setHtml(doc.body.innerHTML);

      if (activeElement && activeElement.tagName === 'INPUT') {
        activeElement.focus();
      }
      syncMenu();
    };

    const printHtml = () => {
      const editor = editorRef.value;
      if (editor) console.log(editor.getHtml());
    };

    const disable = () => {
      const editor = editorRef.value;
      if (editor) console.log(editor.children);
    };

    return {
      editorRef,
      mode: 'default',
      valueHtml,
      toolbarConfig,
      editorConfig,
      menuItems,
      showPopup,
      ph_name,
      ph_id,
      handleCreated,
      handleChange,
      handleDestroyed,
      addPlaceholder,
      syncContent,
      printHtml,
      disable
    };
  },
};
</script>

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