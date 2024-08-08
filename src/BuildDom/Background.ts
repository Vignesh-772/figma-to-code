import createSVGWithString from "./Svg";
import { Props, RescriptBuildTree } from "./Types";



export const handleFills = function(fills: Paint, self: SceneNode, rescriptDom: RescriptBuildTree) {
    const backgroundProps: Props[] = [];
    switch (fills.type) {
        case "SOLID": {
            backgroundProps.push({
                key: "backgroundColor",
                value: JSON.stringify(RGBtoHexString(fills.color))
            }); break;
        }
        case "GRADIENT_LINEAR": {
            handleSvg(self, rescriptDom)
            break;
        }
        case "GRADIENT_RADIAL": { handleSvg(self, rescriptDom) } break;
        case "GRADIENT_ANGULAR": { handleSvg(self, rescriptDom); break; }
        case "GRADIENT_DIAMOND": { handleSvg(self, rescriptDom); break; }
        case "IMAGE":{ handleSvg(self, rescriptDom); break; }
        case "VIDEO": break;
    }
    if (fills.opacity) {
        backgroundProps.push({
            key: "opacity",
            value: fills.opacity.toFixed(1)
        })
    }
    backgroundProps.forEach((element) => {rescriptDom.props.styles.push(element)});
}

function RGBtoHexString(color: RGB) {
    return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}

function componentToHex(c: number) {
    const hex = (Math.ceil(mapNumRange(c,0,1,0,255))).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}


const mapNumRange = (num: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
    ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  
  
/**
 * THis will work only with react-svgs
 * 
 */

async function handleSvg(self: SceneNode, rescriptDom: RescriptBuildTree) {
    const clonedSelf = self.clone();
    if ((clonedSelf as ChildrenMixin).children) {
        (clonedSelf as ChildrenMixin).children.forEach(ele => {
            ele.remove();
        })
    }
    const settings = { format: 'SVG_STRING' } as ExportSettingsSVGString;
    const callback = clonedSelf.exportAsync(settings);
    await callback.then((onfulfilled) => {
        if (onfulfilled) {
            rescriptDom.childrens.unshift(createSVGWithString(onfulfilled, self, rescriptDom))
            clonedSelf.remove()
        } else {
            figma.notify("SVG Creation Failed")
        }
    })
}


export const handleStroke = function(fills: Paint, rescriptDom: RescriptBuildTree) {
    const backgroundProps: Props[] = [];
    switch (fills.type) {
        case "SOLID": {
            backgroundProps.push({
                key: "borderColor",
                value: RGBtoHexString(fills.color)
            }); break;
        }
        default: figma.notify(fills.type + " not Supported for Stroke"); break;
    }
    if (fills.opacity) {
        backgroundProps.push({
            key: "opacity",
            value: fills.opacity.toFixed(1)
        })
    }
    rescriptDom.props.styles.concat(backgroundProps);
}

export const handleStrokeWeight = function(node: SceneNode, rescriptDom: RescriptBuildTree) {
    if (node as MinimalStrokesMixin) {
        const strokeNode = node as IndividualStrokesMixin;
        if (strokeNode.strokeBottomWeight) {
            rescriptDom.props.styles.push({
                key: "borderBottomWidth",
                value: strokeNode.strokeBottomWeight.toFixed(1)
            });
        }
        if (strokeNode.strokeLeftWeight) {
            rescriptDom.props.styles.push({
                key: "borderLeftWidth",
                value: strokeNode.strokeLeftWeight.toFixed(1)
            });
        }
        if (strokeNode.strokeRightWeight) {
            rescriptDom.props.styles.push({
                key: "borderRightWidth",
                value: strokeNode.strokeRightWeight.toFixed(1)
            });
        }
        if (strokeNode.strokeTopWeight) {
            rescriptDom.props.styles.push({
                key: "borderTopWidth",
                value: strokeNode.strokeTopWeight.toFixed(1)
            });
        }
    }
}




// backgroundColor