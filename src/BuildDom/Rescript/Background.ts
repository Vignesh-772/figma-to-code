import createSVGWithString from "./Svg";
import { Props, DomTree } from "../Types";
import { mapNumRange } from "../Utils";
import { Builder } from "../Builder";



export const handleFills = function(builder:Builder ,fills: Paint, self: SceneNode, rescriptDom: DomTree) {
    const backgroundProps: Props[] = [];
    switch (fills.type) {
        case "SOLID": {
            const prop = builder.buildProp({
                key: rescriptDom.type == "Text" ? "color" : "backgroundColor",
                value: JSON.stringify(RGBtoHexString(fills.color,fills.opacity))
            }); 
            if(rescriptDom.type == "Text") {
                rescriptDom.props.textStyle.push(prop)
            } else {
                rescriptDom.props.styles.push(prop)
            }
            break;
        }
        case "GRADIENT_LINEAR": {
            handleSvg(builder,self, rescriptDom)
            break;
        }
        case "GRADIENT_RADIAL": { handleSvg(builder,self, rescriptDom);  break; }
        case "GRADIENT_ANGULAR": { handleSvg(builder,self, rescriptDom); break; }
        case "GRADIENT_DIAMOND": { handleSvg(builder,self, rescriptDom); break; }
        case "IMAGE":{ handleSvg(builder,self, rescriptDom); break; }
        case "VIDEO": break;
    }
    // if (fills.opacity) {
    //     backgroundProps.push({
    //         key: "opacity",
    //         value: fills.opacity.toFixed(1)
    //     })
    // }
    backgroundProps.forEach((element) => {rescriptDom.props.styles.push(element)});
}

function RGBtoHexString(color: RGB, alpha:number | undefined) {
    return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b) + (alpha ? componentToHex(alpha!) : "");
}

function componentToHex(c: number) {
    const hex = (Math.ceil(mapNumRange(c,0,1,0,255))).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
  
/**
 * THis will work only with react-svgs
 * 
 */

async function handleSvg(builder:Builder, self: SceneNode, rescriptDom: DomTree) {
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
            const mainNode: DomTree = {
                type: "View",
                props: {
                    props: [],
                    textStyle: [],
                    styles: []
                },
                childrens: [],
                parent: rescriptDom,
                id: self.id + "_gradient_parent",
                kind: "Node"
            }
            const imageNode: DomTree = {
                type: "Svg.SvgXml",
                props: {
                    props: [],
                    textStyle: [],
                    styles: []
                },
                childrens: [],
                parent: mainNode,
                id: self.id + "_gradient",
                kind: "Child"
            }
            mainNode.props.styles.push(builder.buildProp({
                key:"position",
                value:"#absolute"
            }))
            mainNode.childrens.push(imageNode)
            rescriptDom.childrens.unshift(mainNode)
            createSVGWithString(builder,onfulfilled, self, imageNode)
            clonedSelf.remove()
        } else {
            figma.notify("SVG Creation Failed")
        }
    }).catch((err) => console.log("handleSvg ->", clonedSelf, err))
}


export const handleStroke = function(builder: Builder,fills: Paint, rescriptDom: DomTree) {
    const backgroundProps: Props[] = [];
    switch (fills.type) {
        case "SOLID": {
            backgroundProps.push(builder.buildProp({
                key: "borderColor",
                value: JSON.stringify(RGBtoHexString(fills.color,fills.opacity))
            })); break;
        }
        default: figma.notify(fills.type + " not Supported for Stroke"); break;
    }
    if (fills.opacity) {
        backgroundProps.push(builder.buildProp({
            key: "opacity",
            value: fills.opacity.toFixed(1)
        }))
    }
    rescriptDom.props.styles = rescriptDom.props.styles.concat(backgroundProps);
}

export const handleStrokeWeight = function(builder:Builder, node: SceneNode, rescriptDom: DomTree) {
    if (node as MinimalStrokesMixin) {
        const strokeNode = node as IndividualStrokesMixin;
        if (strokeNode.strokeBottomWeight) {
            rescriptDom.props.styles.push(builder.buildProp({
                key: "borderBottomWidth",
                value: strokeNode.strokeBottomWeight.toFixed(1)
            }));
        }
        if (strokeNode.strokeLeftWeight) {
            rescriptDom.props.styles.push(builder.buildProp({
                key: "borderLeftWidth",
                value: strokeNode.strokeLeftWeight.toFixed(1)
            }));
        }
        if (strokeNode.strokeRightWeight) {
            rescriptDom.props.styles.push(builder.buildProp({
                key: "borderRightWidth",
                value: strokeNode.strokeRightWeight.toFixed(1)
            }));
        }
        if (strokeNode.strokeTopWeight) {
            rescriptDom.props.styles.push(builder.buildProp({
                key: "borderTopWidth",
                value: strokeNode.strokeTopWeight.toFixed(1)
            }));
        }
    }
}




// backgroundColor