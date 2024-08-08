import { buildReactFromBuildTree } from "../BuildReact/BuildCode"
import { getImageNode, isImageNode } from "./Image"
import getTextProps from "./Text"
import { RescriptBuildTree } from "./Types"
import getViewProps from "./View"

async function buildRescript(figmaNode: ReadonlyArray<SceneNode>, rescriptBuildTree: RescriptBuildTree) {
    for (let i = 0; i< figmaNode.length; i++) {
        const currentTree = Object.assign({},rescriptBuildTree);
        await generateCode(figmaNode.at(i)!,currentTree ,0).then(() => {
            console.log(buildReactFromBuildTree(currentTree,0))
        }) 
    }
}


async function generateCode(dom: SceneNode, rescriptDom: RescriptBuildTree, index:number) {
    await buildNodeOrLeaf(dom, rescriptDom).then(async (currentDom) => {
        if ((dom as ChildrenMixin).children) {
            const children = (dom as ChildrenMixin).children;
            for (let i = 0 ; i < children.length; i++){
                await generateCode(children.at(i)!, currentDom,i);
            }
        }
        rescriptDom.childrens.splice(index,0,currentDom);
    })
}

async function buildNodeOrLeaf(dom: SceneNode, rescriptDom: RescriptBuildTree) {
    const currentDom: RescriptBuildTree = {
        type: getRescriptType(dom.type),
        props: {
            props: [],
            textStyle: [],
            styles: []
        },
        childrens: [],
        parent: rescriptDom
    }
    if (currentDom.type == "Text") {
        currentDom.props = getTextProps(dom)
        currentDom.childrens.push("{ React.string(" + JSON.stringify((dom as TextNode).characters) + ")}")
    } else if (isImageNode(dom)) {
        await getImageNode(dom,currentDom)
    }
    getViewProps(dom, currentDom)
    return currentDom;
}

function getRescriptType(type: string) {
    switch (type) {
        case "TEXT": return "Text"
        default: return "View"
    }
}


export default buildRescript;