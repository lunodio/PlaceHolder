// src/container/plugin.ts
import {DomEditor} from '@wangeditor/editor'
import type {IDomEditor} from '@wangeditor/editor'
import InsertPlaceholderMenu from "./menu/place-holder-menu.ts";

// import menuPlaceholder from './menu-placeholder'

function withPlaceholder<T extends IDomEditor>(editor: T): T {
    const {isInline, isVoid} = editor


    editor.isInline = elem => {
        const type = DomEditor.getNodeType(elem)
        if (type === 'placeholder') return true
        return isInline(elem)
    }

    editor.isVoid = elem => {
        const type = DomEditor.getNodeType(elem)
        if (type === 'placeholder') return true
        return isVoid(elem)
    }

    return editor
}

const plugin = {
    editorPlugin: withPlaceholder,
    menus: [{
        key: 'menu1', // 定义 menu key ：要保证唯一、不重复（重要）
        factory() {
            return new InsertPlaceholderMenu() // 把 `YourMenuClass` 替换为你菜单的 class
        },
    },],
}

export default plugin
