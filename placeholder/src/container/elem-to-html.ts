// src/container/elem-to-html.ts
// import type { PlaceholderElement } from './custom-types'
import {SlateElement} from '@wangeditor/editor'
import type {PlaceholderElement} from "./custom-types.ts";

function placeholderToHtml(elem: SlateElement): string {
    const {id, name} = elem as PlaceholderElement
    return `<span data-w-e-type="placeholder" data-id="${id}" data-name="${name}" data-w-e-is-void data-w-e-is-inline>${name}(${id})</span>`
}

const elemToHtmlConf = {
    type: 'placeholder',
    elemToHtml: placeholderToHtml,
}

export default elemToHtmlConf
