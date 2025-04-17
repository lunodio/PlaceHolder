/**
 * @description attachment element
 * @author wangfupeng
 */



// export type AttachmentElement = {
//     type: 'attachment'
//     fileName: string
//     link: string
//     children: [{ text: string }]
// }


export type PlaceholderElement = {
    type: 'placeholder'
    id: number
    name: string
    value: string
    children: [{ text: string }]
}