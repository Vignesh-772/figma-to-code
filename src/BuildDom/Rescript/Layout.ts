import { globalCache } from "../../code";
import { Builder } from "../Builder";
// import { buildProp } from "../Builder";
import { DomTree } from "../Types";

export const handleLayout = function (builder:Builder, node: SceneNode, rescriptDom: DomTree) {
    const autoLayout = node as AutoLayoutMixin;
    if (node as LayoutMixin) {
        const layout = node as LayoutMixin;
        if (rescriptDom.kind != "Child") {
            if (layout.height) {
                const isHeightMatch = isHeightMatchParent(node)
                rescriptDom.props.styles.push(builder.buildProp({
                    key: "height",
                    value: isHeightMatch ? "100.0" : layout.width.toFixed(1), 
                    unit: isHeightMatch ? "->pct" : "->dp"
                }));
            }
            if (layout.width) {
                const isWidthMatch= isWidthMatchParent(node)
                rescriptDom.props.styles.push(builder.buildProp({
                    key: "width",
                    value: isWidthMatch ? "100.0" : layout.width.toFixed(1), 
                    unit: isWidthMatch ? "->pct" : "->dp"
                }));
            }
        }
        if (isWidthWrapParent(node, rescriptDom.type)) {
            if (rescriptDom.parent) {
                let width;
                if (rescriptDom.type == "Text") {
                    if (rescriptDom.parent.parent) {
                        rescriptDom.parent.parent.props.styles = rescriptDom.parent.parent.props.styles.filter(ele => {
                            if (ele.key == "width") {
                                width = ele
                            }
                            return ele.key != "width" || ele.value == "100.0->pct"
                        })
                    }
                } else {
                    rescriptDom.parent.props.styles = rescriptDom.parent.props.styles.filter(ele => {
                        if (ele.key == "width") {
                            width = ele
                        }
                        return ele.key != "width" || ele.value == "100.0->pct"
                    })
                }
                if ((!width || width != "100.0->pct") && autoLayout && (autoLayout as AutoLayoutMixin).layoutMode == "HORIZONTAL") {
                    if (rescriptDom.type == "Text" && rescriptDom.parent.parent) {
                        rescriptDom.parent.parent.props.styles.push(builder.buildProp({
                            key: "flexWrap",
                            value: "#wrap"
                        }));
                    } else {
                        rescriptDom.parent.props.styles.push(builder.buildProp({
                            key: "flexWrap",
                            value: "#wrap"
                        }));
                    }
                }
            }
        }
        if (layout.minHeight) {
            rescriptDom.props.styles.push(builder.buildProp({
                key: "minHeight",
                value: layout.minHeight,
                unit: "px"
            }));
        }
        if (layout.maxHeight) {
            rescriptDom.props.styles.push(builder.buildProp({
                key: "maxHeight",
                value: layout.maxHeight,
                unit: "px"
            }));
        }
        if (layout.minWidth) {
            rescriptDom.props.styles.push(builder.buildProp({
                key: "minWidth",
                value: layout.minWidth,
                unit: "px"
            }));
        }
        if (layout.maxWidth) {
            rescriptDom.props.styles.push(builder.buildProp({
                key: "maxWidth",
                value: layout.maxWidth,
                unit: "px"
            }));
        }
        if (layout.rotation) {
            rescriptDom.props.styles.push(builder.buildProp({
                key: "transform",
                value: "{rotate: '" + layout.rotation + "deg'}"
            }));
        }
        if (autoLayout.layoutMode == "HORIZONTAL" && rescriptDom.kind != "Child" && (layout.layoutSizingHorizontal || layout.layoutSizingVertical)) {
            const resultDom = rescriptDom;

            // if (rescriptDom.type == "Text" && rescriptDom.parent) {
            //     resultDom = rescriptDom.parent
            // }
            if (layout.layoutSizingHorizontal == "HUG") {
                resultDom.props.styles.push(builder.buildProp({
                    key: "flexWrap",
                    value: "#wrap"
                }));
            } else if (layout.layoutSizingHorizontal == "FILL") {
                    rescriptDom.props.styles.push(builder.buildProp({
                        key: "flex",
                        value: "1.0"
                    }));
            }
        }
    }

    if (rescriptDom.type == "Text" && node.parent && rescriptDom.parent) {
        const parent = node.parent as LayoutMixin;
        if (parent.layoutSizingHorizontal == "FILL") {
            rescriptDom.parent.props.styles.push(builder.buildProp({
                key: "flex",
                value: "1.0"
            }));
        }
    }

    if (node as AutoLayoutMixin) {
        if (autoLayout.primaryAxisAlignItems) {
            if (autoLayout.primaryAxisAlignItems) {
                rescriptDom.props.styles.push(builder.buildProp({
                    key: "alignItems",
                    value: alignItemsCounter[autoLayout.counterAxisAlignItems]
                }));
            }
        } 
        if (autoLayout.counterAxisAlignContent) {
                rescriptDom.props.styles.push(builder.buildProp({
                    key: "justifyContent",
                    value: alignItemsPrimary[autoLayout.primaryAxisAlignItems]
                }));
            }
            // if (autoLayout.primaryAxisAlignItems) {
            //     rescriptDom.props.styles.push({
            //         key: "alignItems",
            //         value: alignItemsPrimary[autoLayout.primaryAxisAlignItems]
            //     });
            // }
            // if (autoLayout.counterAxisAlignContent) {
            //     rescriptDom.props.styles.push({
            //         key: "alignContent",
            //         value: alignContentPrimary[autoLayout.counterAxisAlignContent]
            //     });
            // }
            // if (autoLayout.primaryAxisAlignItems) {
            //     rescriptDom.props.styles.push({
            //         key: "alignItems",
            //         value: "#center"
            //     });
            // }
            // if (autoLayout.counterAxisAlignContent) {
            //     rescriptDom.props.styles.push({
            //         key: "alignContent",
            //         value: "#center"
            //     });
            // }
                // rescriptDom.props.styles.push({
                //     key: "justifyContent",
                //     value: "#center"
                // });
        // if (layout.counterAxisAlignItems) {
        //     rescriptDom.props.styles.push({
        //         key: "justifyContent",
        //         value: justifyContent[layout.counterAxisAlignItems]
        //     });   
        // }

        if (autoLayout.itemSpacing) {
            rescriptDom.props.styles.push(builder.buildProp({
                key: "gap",
                value: autoLayout.itemSpacing.toFixed(1)
            }));
        }
    }

    // if (node.parent) {
    //     const parentMixin = node.parent as DimensionAndPositionMixin
    //     if (parentMixin.x == node.x && parentMixin.y == node.y) {
    //         rescriptDom.props.styles.push({
    //             key:"position",
    //             value:"#absolute"
    //         })
    //     }
    // }
}

function isHeightMatchParent(node: SceneNode) {
    const parentHeight = fetchParentNode(node)?.height;
    if (parentHeight) { return node.height == parentHeight }
    return false;
}

export function isWidthMatchParent(node: SceneNode) {
    const parentWidth = fetchParentNode(node)?.width;
    let offset = node.x;
    if (node.parent) {
        const parent = node.parent as SceneNode;
        if (parent.width) {
            offset += Math.abs(offset + node.width - parent.width)
        }
    }

    if (parentWidth) { return node.width + offset == parentWidth }
    return false;
}

function isWidthWrapParent(node: SceneNode, type: string) {
    const parent = (type == "Text" ? (node.parent?.parent as DimensionAndPositionMixin) : (node.parent as DimensionAndPositionMixin));
    let offset = node.x;
    if (node.parent) {
        if (parent.width) {
            offset += Math.abs(offset + node.width - parent.width)
        }
    }

    if (parent.width) { return node.width + offset == parent.width }
    return false;
}

export function fetchParentNode(node: SceneNode) {
    if (!globalCache.parentNode) {
        let parentNode = node.parent;
        while (parentNode && parentNode.parent && !(parentNode.parent.type == "SECTION")) {
            parentNode = parentNode.parent
        }
        if (parentNode && parentNode as SceneNode) {
            const scene = parentNode as DimensionAndPositionMixin
            if (scene.width && scene.height) {
                globalCache.parentNode = {
                    width: scene.width,
                    height: scene.height
                }
            }
        }

    }
    return (globalCache.parentNode as LayoutMixin);
}

const alignItemsCounter = {
    // eslint-disable-next-line no-useless-escape
    'MIN': '#\"flex-start\"',
    // eslint-disable-next-line no-useless-escape
    'MAX': '#\"flex-end\"',
    'CENTER': '#center',
    'BASELINE': '#baseline'
}


// const alignContentCounter = {
//     'AUTO': '#center',
//     'SPACE_BETWEEN': '#space-between'
// }

const alignItemsPrimary = {
    // eslint-disable-next-line no-useless-escape
    'MIN': '#\"flex-start\"',
    // eslint-disable-next-line no-useless-escape
    'MAX': '#\"flex-end\"',
    'CENTER': '#center',
    'SPACE_BETWEEN': "#\"space-between\""
}
// const justifyContent = {
//     // eslint-disable-next-line no-useless-escape
//     'MIN': '#\"flex-start\"',
//     // eslint-disable-next-line no-useless-escape
//     'MAX': '#\"flex-end\"',
//     'CENTER': '#center',
//     // eslint-disable-next-line no-useless-escape
//     'BASELINE': '#\"flex-start\"'
// }


// const alignContentPrimary = {
//     'AUTO': '#center',
//     'SPACE_BETWEEN': '#space-between'
// }