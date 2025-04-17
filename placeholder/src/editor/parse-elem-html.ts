// src/container/parse-elem-html.ts
import {SlateElement} from '@wangeditor/editor'
import type {PlaceholderElement} from './custom-types'

function parseHtml(elem: Element): SlateElement {
    const id = elem.getAttribute('data-id') || '-1'
    const name = elem.getAttribute('data-name') || ''
    const value = elem.getAttribute('data-value') || ''

    return {
        type: 'placeholder',
        id: Number(id),
        name: name,
        value: value,
        children: [{text: ''}], // 你可以用 value 填充
    } as PlaceholderElement
}

const parseHtmlConf = {
    selector: 'span[data-type="placeholder"]',
    parseElemHtml: parseHtml,
}

export default parseHtmlConf
