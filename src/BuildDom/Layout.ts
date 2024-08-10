import { globalCache } from "../code";
import { RescriptBuildTree } from "./Types";

export const handleLayout = function (node: SceneNode, rescriptDom: RescriptBuildTree) {
    const autoLayout = node as AutoLayoutMixin;
    if (node as LayoutMixin) {
        const layout = node as LayoutMixin;
        if (rescriptDom.kind != "Child") {
            if (layout.height) {
                rescriptDom.props.styles.push({
                    key: "height",
                    value: isHeightMatchParent(node) ? "100.0->pct" : layout.height.toFixed(1) + "->dp"
                });
            }
            if (layout.width) {
                rescriptDom.props.styles.push({
                    key: "width",
                    value: isWidthMatchParent(node) ? "100.0->pct" : layout.width.toFixed(1) + "->dp"
                });
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
                        rescriptDom.parent.parent.props.styles.push({
                            key: "flexWrap",
                            value: "#wrap"
                        });
                    } else {
                        rescriptDom.parent.props.styles.push({
                            key: "flexWrap",
                            value: "#wrap"
                        });
                    }
                }
            }
        }
        if (layout.minHeight) {
            rescriptDom.props.styles.push({
                key: "minHeight",
                value: layout.minHeight + "px"
            });
        }
        if (layout.maxHeight) {
            rescriptDom.props.styles.push({
                key: "maxHeight",
                value: layout.maxHeight + "px"
            });
        }
        if (layout.minWidth) {
            rescriptDom.props.styles.push({
                key: "minWidth",
                value: layout.minWidth + "px"
            });
        }
        if (layout.maxWidth) {
            rescriptDom.props.styles.push({
                key: "maxWidth",
                value: layout.maxWidth + "px"
            });
        }
        if (layout.rotation) {
            rescriptDom.props.styles.push({
                key: "transform",
                value: "{rotate: '" + layout.rotation + "deg'}"
            });
        }
        if (autoLayout.layoutMode == "HORIZONTAL" && rescriptDom.kind != "Child" && (layout.layoutSizingHorizontal || layout.layoutSizingVertical)) {
            const resultDom = rescriptDom;

            // if (rescriptDom.type == "Text" && rescriptDom.parent) {
            //     resultDom = rescriptDom.parent
            // }
            if (layout.layoutSizingHorizontal == "HUG") {
                resultDom.props.styles.push({
                    key: "flexWrap",
                    value: "#wrap"
                });
            }
            if (layout.layoutSizingVertical == "HUG") {
                resultDom.props.styles.push({
                    key: "flexWrap",
                    value: "#wrap"
                });
            }
        }
    }

    if (node as AutoLayoutMixin) {
        if (autoLayout.layoutMode == "HORIZONTAL") {
            if (autoLayout.counterAxisAlignItems) {
                rescriptDom.props.styles.push({
                    key: "alignItems",
                    value: alignItemsCounter[autoLayout.counterAxisAlignItems]
                });
            }
            if (autoLayout.counterAxisAlignContent) {
                rescriptDom.props.styles.push({
                    key: "alignContent",
                    value: alignContentCounter[autoLayout.counterAxisAlignContent]
                });
            }
        }
        if (autoLayout.layoutMode == "VERTICAL") {
            if (autoLayout.primaryAxisAlignItems) {
                rescriptDom.props.styles.push({
                    key: "alignItems",
                    value: alignItemsPrimary[autoLayout.primaryAxisAlignItems]
                });
            }
            if (autoLayout.counterAxisAlignContent) {
                rescriptDom.props.styles.push({
                    key: "alignContent",
                    value: alignContentPrimary[autoLayout.counterAxisAlignContent]
                });
            }
        }
        // if (layout.counterAxisAlignItems) {
        //     rescriptDom.props.styles.push({
        //         key: "justifyContent",
        //         value: justifyContent[layout.counterAxisAlignItems]
        //     });   
        // }

        if (autoLayout.itemSpacing) {
            rescriptDom.props.styles.push({
                key: "gap",
                value: autoLayout.itemSpacing.toFixed(1)
            });
        }
    }
}

function isHeightMatchParent(node: SceneNode) {
    const parentHeight = fetchParentNode(node)?.height;
    if (parentHeight) { return node.height == parentHeight }
    return false;
}

function isWidthMatchParent(node: SceneNode) {
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

function fetchParentNode(node: SceneNode) {
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


const alignContentCounter = {
    'AUTO': '#center',
    'SPACE_BETWEEN': '#space-between'
}

const alignItemsPrimary = {
    // eslint-disable-next-line no-useless-escape
    'MIN': '#\"flex-start\"',
    // eslint-disable-next-line no-useless-escape
    'MAX': '#\"flex-end\"',
    'CENTER': '#center',
    'SPACE_BETWEEN': '#strech'
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


const alignContentPrimary = {
    'AUTO': '#center',
    'SPACE_BETWEEN': '#space-between'
}