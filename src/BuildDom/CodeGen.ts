import { buildReactFromBuildTree } from "../BuildReact/BuildCode"
import { getImageNode, isImageNode } from "./Image"
import getTextProps from "./Text"
import { RescriptBuildTree } from "./Types"
import getViewProps from "./View"

async function buildRescript(figmaNode: ReadonlyArray<SceneNode>, rescriptBuildTree: RescriptBuildTree) {
    for (let i = 0; i < figmaNode.length; i++) {
        const currentTree = Object.assign({}, rescriptBuildTree);
        await generateCode(figmaNode.at(i)!, currentTree, 0).then(() => {
            figma.ui.postMessage({ status: "success", data: buildReactFromBuildTree(currentTree, 0) })
            figma.notify("Copied")
        })
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
        const gapEle = currentDom.props.styles.filter(a => a.key == "gap")
        if (gapEle.length > 0) {
            let gap = 0.0
            if (typeof gapEle[0].value === "string") {
                gap = parseFloat(gapEle[0].value)
            }
            if (gap > 16) {
                const newChild: Array<RescriptBuildTree | string> = []
                currentDom.childrens = currentDom.childrens.reduce((acc, curr, index) => {
                    acc.push(curr);
                    if (index < currentDom.childrens.length - 1) {
                        acc.push(flexElem(currentDom));
                    }
                    return acc;
                }, newChild);
            }
        }
        if (rescriptDom.type != "Svg.SvgXml") {
            rescriptDom.childrens.splice(index, 0, currentDom);
        }
    })
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
            kind: "Node"
        }
        currentDom.parent = parentDom
    }
    if (currentDom.type == "Text") {
        currentDom.props = getTextProps(dom)
        currentDom.childrens.push("{ React.string(" + JSON.stringify((dom as TextNode).characters) + ")}")
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