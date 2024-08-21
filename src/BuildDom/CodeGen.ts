import { getImageNode, isImageNode } from "./Image"
import getTextProps from "./Text"
import { RescriptBuildTree, RescriptOutputTree } from "./Types"
import getViewProps from "./View"

async function buildRescript(figmaNode: ReadonlyArray<SceneNode>, rescriptBuildTree: RescriptBuildTree) {
    for (let i = 0; i < figmaNode.length; i++) {
        const currentTree = Object.assign({}, rescriptBuildTree);
        await generateCode(figmaNode.at(i)!, currentTree, 0).then(() => {
            figma.ui.postMessage({ status: "success", data: JSON.stringify(convertToOutputTree(currentTree)) })
        })
    }
}

function convertToOutputTree(rescriptBuildTree: RescriptBuildTree): RescriptOutputTree {
    return {
        type: rescriptBuildTree.type,
        id: rescriptBuildTree.id,
        props: rescriptBuildTree.props,
        childrens: rescriptBuildTree.childrens.map((child) => {
            if (typeof child !== "string") {
                return convertToOutputTree(child)
            } else {
                return child
            }
        }
        )
    }
}


async function generateCode(dom: SceneNode, rescriptDom: RescriptBuildTree, index: number) {
    await buildNodeOrLeaf(dom, rescriptDom).then(async (currentDom) => {
        if (currentDom.type != "Svg.SvgXml" && (dom as ChildrenMixin).children) {
            const children = (dom as ChildrenMixin).children;
            for (let i = 0; i < children.length; i++) {
                await generateCode(children.at(i)!, currentDom, i);
            }
        }
        handleFlex(dom, currentDom)
        const wrapEle = currentDom.props.styles.filter(a => a.key == "flexDirection")
        if (wrapEle.length > 0 && wrapEle[0].value == "#column") {
            currentDom.props.styles = currentDom.props.styles.filter(a => a.key != "flexWrap")
        }
        if (rescriptDom.type != "Svg.SvgXml") {
            rescriptDom.childrens.splice(index, 0, currentDom);
        }
    })
}

function handleFlex(dom: SceneNode, currentDom: RescriptBuildTree) {
    const gapEle = currentDom.props.styles.filter(a => a.key == "gap")
    if (gapEle.length > 0) {
        // let gap = 0.0
        // if (typeof gapEle[0].value === "string") {
        //     gap = parseFloat(gapEle[0].value)
        // }
        // const ratios: number[] = [];
        // const parentNode = fetchParentNode(dom);
        // const childrenMixin = dom as ChildrenMixin
        // childrenMixin.children.forEach((ele) => {
        //     if (typeof ele !== "string") {
        //         const node = ele
        //         if (node && parentNode) {
        //             const dimensionAndPositionMixin = node as DimensionAndPositionMixin
        //             ratios.push((dimensionAndPositionMixin.width / parentNode.width) * 100)
        //         }
        //     }
        // })
        // const maxFlex = ratios.length
        // const maxRatio = ratios.reduce((partialSum, a) => partialSum + a, 0);
        // currentDom.childrens.forEach((ele, index) => {
        //     if (typeof ele !== "string") {
        //         ele.props.styles.push({
        //             key: "flex",
        //             value: mapNumRange(ratios[index], 0.0, maxRatio, 0.0, maxFlex).toFixed(1)
        //         })
        //     }
        // })
        const gapEle = currentDom.props.styles.filter(a => a.key == "gap")
        if (gapEle.length > 0) {
            let gap = 0.0
            if (typeof gapEle[0].value === "string") {
                gap = parseFloat(gapEle[0].value)
            }
            const a = gap * currentDom.childrens.length
            if (a > dom.width / 2) {
                currentDom.childrens.forEach((ele, index) => {
                    if (typeof ele !== "string" && index < currentDom.childrens.length - 1) {
                        ele.props.styles.push({
                            key: "flex",
                            value: "1.0"
                        })
                    }
                })
                // const newChild: Array<RescriptBuildTree | string> = []
                // currentDom.childrens = currentDom.childrens.reduce((acc, curr, index) => {
                //     acc.push(curr);
                //     if (index < currentDom.childrens.length - 1) {
                //         acc.push(flexElem(currentDom));
                //     }
                //     return acc;
                // }, newChild);
            }
        }
    }
}

const flexElem = (rescriptDom: RescriptBuildTree): RescriptBuildTree => {
    return {
        type: "View",
        props: {
            props: [],
            textStyle: [],
            styles: [{
                key: "flex",
                value: "1.0"
            }]
        },
        childrens: [],
        parent: rescriptDom,
        id: rescriptDom.id + "_flexElem",
        kind: 'Node'
    };
}


async function buildNodeOrLeaf(dom: SceneNode, rescriptDom: RescriptBuildTree) {
    const type = getRescriptType(dom.type, dom);
    let currentDom: RescriptBuildTree = {
        type: type,
        props: {
            props: [],
            textStyle: [],
            styles: []
        },
        childrens: [],
        parent: rescriptDom,
        id: dom.id,
        kind: type == "View" ? "Node" : "Child"
    }
    if (type == "Text") {
        const parentDom: RescriptBuildTree = {
            type: "View",
            props: {
                props: [],
                textStyle: [],
                styles: []
            },
            childrens: [currentDom],
            parent: rescriptDom,
            id: dom.id + "_parent",
            kind: "Node"
        }
        currentDom.parent = parentDom
    }
    if (currentDom.type == "Text") {
        currentDom.props = getTextProps(dom)
        currentDom.childrens.push((dom as TextNode).characters)
    } else if (currentDom.type == "Svg.SvgXml") {
        await getImageNode(dom, currentDom)
    }
    getViewProps(dom, currentDom)
    if (type == "Text" && currentDom.parent) {
        currentDom = currentDom.parent;
    }
    return currentDom;
}

function getRescriptType(type: string, dom: SceneNode) {
    switch (type) {
        case "TEXT": return "Text"
        default: return isImageNode(dom) ? "Svg.SvgXml" : "View"
    }
}


export default buildRescript;