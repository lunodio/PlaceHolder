// src/container/parse-elem-html.ts
import {SlateElement} from '@wangeditor/editor'
import type {PlaceholderElement} from './custom-types'

function parseHtml(elem: Element): SlateElement {
    const id = elem.getAttribute('data-id') || -1
    const name = elem.getAttribute('data-name') || ''
    return {
        type: 'placeholder',
        id: id,
        name: name,
        children: [{text: ''}],
    } as PlaceholderElement
}

const parseHtmlConf = {
    selector: 'span[data-w-e-type="placeholder"]',
    parseElemHtml: parseHtml,
}

export default parseHtmlConf
