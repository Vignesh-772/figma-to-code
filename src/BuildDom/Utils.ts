export const mapNumRange = (num: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
    ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;


export function isImageNode(node: SceneNode): boolean {
    if ('children' in node && node.children.length > 0) {
      let hasOnlyVector = true
      node.children.forEach((child) => {
        if (child.type !== 'VECTOR'  && child.type !== 'RECTANGLE' && child.type !== 'LINE'  && child.type !== 'ELLIPSE'  && child.type !== 'POLYGON' && child.type !== 'STAR' && child.type !== 'BOOLEAN_OPERATION') {
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
