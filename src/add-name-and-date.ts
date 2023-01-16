import { formatSuccessMessage, formatWarningMessage } from "@create-figma-plugin/utilities"

export default async function main() {

    // Extract first part of first name
    let name = figma.currentUser?.name
    if (name) {
        name = name.split(' ')[0].trim()
        name = name.split('-')[0].trim()
    } else {
        name = ''
    }
    
    // Format date in ISO
    // Thanks to https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
    let date = new Date()
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset*60*1000))
    let dateStr = date.toISOString().split('T')[0]
    
    const signature = `- ${name} ${dateStr}`
    let num = 0
    
    async function addSignature(node:SceneNode) {
        if (node.type === 'TEXT') {
            if (typeof (node.fontName) != 'symbol') {
                await figma.loadFontAsync({ family: node.fontName.family, style: node.fontName.style })
                node.insertCharacters(node.characters.length, `\n${signature}`)
                num ++
            } else if (typeof (node.fontName) === 'symbol') {
                // Need to load every fonts
                let segments = node.getStyledTextSegments(['fontName'])
                for (let segment of segments) {
                    await figma.loadFontAsync({ family: segment.fontName.family, style: segment.fontName.style })
                }
                node.insertCharacters(node.characters.length, `\n${signature}`, "BEFORE")
                num ++
            }
        } else if (['FRAME', 'GROUP', 'SECTION'].includes(node.type)) {
            node.name = `${node.name.trim()} ${signature}`
            num ++
        }
    }

    let nodes = figma.currentPage.selection
    if (nodes.length > 0) {
        for (let node of nodes) {
            await addSignature(node)
        }
        figma.closePlugin(formatSuccessMessage(`${num} items have your signature.`))
    } else {
        figma.closePlugin(formatWarningMessage(`Select at least one text or region layer to add your name.`))
    }
}

/* Learning:
 * Async/await function doesn't work with forEach. Use for loop method instead.
 */
