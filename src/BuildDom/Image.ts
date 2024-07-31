import createSVGWithString from "./Svg"
import { RescriptBuildTree } from "./Types"

export function isImageNode(node: SceneNode): boolean {
    if ('children' in node && node.children.length > 0) {
      let hasOnlyVector = true
      node.children.forEach((child) => {
        if (child.type !== 'VECTOR') {
          hasOnlyVector = false
        }
      })
      if (hasOnlyVector) {
        return true
      }
    } else if (node.type === 'VECTOR') {
      return true
    }
    if (node.type === 'FRAME' || node.type === 'RECTANGLE') {
      if ((node.fills as Paint[]).find((paint) => paint.type === 'IMAGE') !== undefined) {
        return true
      }
    }
  
    return false
  }


export async function getImageNode (dom: SceneNode, rescriptBuildTree: RescriptBuildTree) {
    const settings = { format: 'SVG_STRING' } as ExportSettingsSVGString;
    const callback = dom.exportAsync(settings);
    await callback.then((onfulfilled) => {
        if (onfulfilled) {
            rescriptBuildTree.childrens.unshift(createSVGWithString(onfulfilled, dom, rescriptBuildTree))
        } else {
            figma.notify("SVG Creation Failed")
        }
    })
}