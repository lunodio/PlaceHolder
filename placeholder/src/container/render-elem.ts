// src/container/render-elem.ts
// import {h} from 'vue'
import type {IDomEditor, SlateElement} from '@wangeditor/editor'
import {h, type VNode} from 'snabbdom'
import {DomEditor} from '@wangeditor/editor'
import type {PlaceholderElement} from './custom-types'
function renderAttachment(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
    const isDisabled = editor.isDisabled()
    const selected = DomEditor.isNodeSelected(editor, elem)
    const { id = '1', name = '' } = elem as PlaceholderElement

    return h('span', {
        props: {
            contentEditable: !isDisabled,
            suppressContentEditableWarning: true,
        },
        attrs: {
            'data-placeholder-id': id,
        },
        style: {
            display: 'inline-block',
            marginLeft: '3px',
            marginRight: '3px',
            borderRadius: '3px',
            padding: '0 3px',
            backgroundColor: '#f9f9f9',
            color: '#0077cc',
            textDecoration: 'underline',
            cursor: 'text',
            minWidth: '30px',
        },
        on: {
            blur: (e: Event) => {
                const newText = (e.target as HTMLElement).innerText.trim()
                updateAllPlaceholders(editor, id, newText)
            }
        }
    }, name)
}


function updateAllPlaceholders(editor: IDomEditor, id: number, newValue: string) {
    console.log("更新 " + id + " 为 " + newValue)
}


const renderElemConf = {
    type: 'placeholder',
    renderElem: renderAttachment,
}

export default renderElemConf
