// src/main.ts
import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import '@wangeditor/editor/dist/css/style.css'

import {Boot} from '@wangeditor/editor'
import type {IModuleConf} from '@wangeditor/editor'
import plugin from './container/plugin'
import renderElemConf from './container/render-elem'
import elemToHtml from './container/elem-to-html'
import parseHtmlConf from './container/parse-elem-html'

const module: Partial<IModuleConf> = {
    editorPlugin: plugin.editorPlugin,
    // menus: plugin.,
    renderElems: [renderElemConf],
    elemsToHtml: [elemToHtml],
    parseElemsHtml: [parseHtmlConf],
}
Boot.registerModule(module)

createApp(App).mount('#app')
