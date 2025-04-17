import {IDomEditor, IModalMenu, SlateNode} from '@wangeditor/editor'

// 假设你使用 mitt 创建的 emitter 实例
import emitter from '@/but' // 你根据实际路径引入

class PlhMenu implements IModalMenu {
    readonly title = '添加占位符'
    readonly tag = 'button'
    readonly showModal = false
    readonly modalWidth = 0

    isActive(editor: IDomEditor): boolean {
        return false
    }

    getValue(editor: IDomEditor): string | boolean {
        return ''
    }

    isDisabled(editor: IDomEditor): boolean {
        return false
    }

    exec(editor: IDomEditor, value: string | boolean): void {
        // ✅ 用事件通知外部弹出 modal（比如 Vue 组件中）
        emitter.emit('open-placeholder-modal', editor)
    }

    getModalPositionNode(editor: IDomEditor): SlateNode | null {
        return null
    }

    // 不再需要 modal 内容 DOM（但必须保留函数）
    getModalContentElem(editor: IDomEditor): HTMLElement {
        return document.createElement('div')
    }
}

export default PlhMenu
