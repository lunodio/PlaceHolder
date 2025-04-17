// src/container/elem-to-html.ts
// import type { PlaceholderElement } from './custom-types'
import {SlateElement} from '@wangeditor/editor'
import type {PlaceholderElement} from "./custom-types.ts";

function placeholderToHtml(elem: SlateElement): string {
    const {id, name, value} = elem as PlaceholderElement
    // const text = children?.[0]?.text || ''
    // return `<!--<span data-w-e-type="placeholder" data-id="${id}" data-name="${text}" data-w-e-is-inline>${text}(${id})</span>-->`
    // const text = children?.[0]?.text || ''
    return `<span data-type="placeholder" data-id="${id}" data-name="${name}" data-w-e-is-void data-w-e-is-inline>${value}</span>`
}

const elemToHtmlConf = {
    type: 'placeholder',
    elemToHtml: placeholderToHtml,
}

export default elemToHtmlConf
