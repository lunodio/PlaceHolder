// src/main.ts
import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import '@wangeditor/editor/dist/css/style.css'

import {Boot} from '@wangeditor/editor'
import type {IModuleConf} from '@wangeditor/editor'
// import plugin from '@/'
// import * from "@/com"
import plugin from './editor/plugin'
import renderElemConf from './editor/render-elem'
import elemToHtml from './editor/elem-to-html'
import parseHtmlConf from './editor/parse-elem-html'

const module: Partial<IModuleConf> = {
    editorPlugin: plugin.editorPlugin,
    // menus: plugin.,
    renderElems: [renderElemConf],
    elemsToHtml: [elemToHtml],
    parseElemsHtml: [parseHtmlConf],
}
Boot.registerModule(module)

createApp(App).mount('#app')
