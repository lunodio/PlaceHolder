// src/container/plugin.ts
import {DomEditor} from '@wangeditor/editor'
import type {IDomEditor} from '@wangeditor/editor'

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
    // menus: [menuPlaceholder],
}

export default plugin
