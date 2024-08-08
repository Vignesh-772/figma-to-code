import { RescriptBuildTree } from "./Types";

export const handleLayout = function(node: SceneNode, rescriptDom: RescriptBuildTree) {
    if (node as LayoutMixin) {
        const layout = node as LayoutMixin;
        let shouldSetFlex = false;
        if (layout.height) {
            rescriptDom.props.styles.push({
                key: "height",
                value: !(layout.layoutSizingVertical == "FIXED") && isHeightMatchParent(node) ? "100%" : JSON.stringify(layout.height + "px")
            });
        }
        if (layout.width) {
            rescriptDom.props.styles.push({
                key: "width",
                value: !(layout.layoutSizingHorizontal == "FIXED") && isWidthMatchParent(node) ? "100%" : JSON.stringify(layout.width + "px")
            });
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
                value: "{rotate: '"+ layout.rotation + "deg'}"
            });
        }
        if (layout.layoutSizingHorizontal || layout.layoutSizingVertical) {
            shouldSetFlex = true;
            if (layout.layoutSizingHorizontal == "HUG") {
                rescriptDom.props.styles.push({
                    key: "flexDirection",
                    value: "row"
                });
                rescriptDom.props.styles.push({
                    key: "flexWrap",
                    value: "wrap"
                });
            }
            if (layout.layoutSizingVertical == "HUG") {
                rescriptDom.props.styles.push({
                    key: "flexDirection",
                    value: "column"
                });
                rescriptDom.props.styles.push({
                    key: "flexWrap",
                    value: "wrap"
                });
            }
        }
        if (shouldSetFlex) {
            rescriptDom.props.styles.push({
                key: "flex",
                value: "1.0"
            });
        }
    }
}

declare global {
    // eslint-disable-next-line no-var
    var parentNode: (BaseNode & ChildrenMixin) | null;
}

function isHeightMatchParent (node: SceneNode) {
    const parentHeight = fetchParentNode(node)?.height;
    if (parentHeight) {return node.height == parentHeight}
    return false;
}

function isWidthMatchParent (node: SceneNode) {
    const parentWidth = fetchParentNode(node)?.width;
    if (parentWidth) {return node.width == parentWidth}
    return false;
}

function fetchParentNode(node: SceneNode) {
    if (global.parentNode) {
        return (global.parentNode as LayoutMixin);
    } else {
        const localNode = node.clone();
        let parentNode = localNode.parent;
        while(parentNode && !(parentNode as SectionNode)) {
            parentNode = parentNode.parent
        }
        global.parentNode = parentNode;
        fetchParentNode(node);
    }
}