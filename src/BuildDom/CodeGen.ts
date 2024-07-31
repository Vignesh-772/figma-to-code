import { getImageNode, isImageNode } from "./Image"
import getTextProps from "./Text"
import { RescriptBuildTree } from "./Types"
import getViewProps from "./View"

function buildRescript(figmaNode: ReadonlyArray<SceneNode>, rescriptBuildTree: RescriptBuildTree) {
    console.log("inside buildRescript")
    for (let i = 0; i< figmaNode.length; i++) {
        generateCode(figmaNode.at(i)!, rescriptBuildTree,i)
    }
    console.log("after buildRescript",rescriptBuildTree)
    // switch (figmaNode) {
    //     case SliceNode: {
    //     break;}
    //     case FrameNode: {
    //     break;}
    //     case GroupNode: {
    //     break;}
    //     case ComponentSetNode: {
    //     break;}
    //     case ComponentNode: {
    //     break;}
    //     case InstanceNode: {
    //     break;}
    //     case BooleanOperationNode: {
    //     break;}
    //     case VectorNode: {
    //     break;}
    //     case StarNode: {
    //     break;}
    //     case LineNode: {
    //     break;}
    //     case EllipseNode: {
    //     break;}
    //     case PolygonNode: {
    //     break;}
    //     case RectangleNode: {
    //     break;}
    //     case TextNode: {
    //     break;}
    //     case StickyNode: {
    //     break;}
    //     case ConnectorNode: {
    //     break;}
    //     case ShapeWithTextNode: {
    //     break;}
    //     case CodeBlockNode: {
    //     break;}
    //     case StampNode: {
    //     break;}
    //     case WidgetNode: {
    //     break;}
    //     case EmbedNode: {
    //     break;}
    //     case LinkUnfurlNode: {
    //     break;}
    //     case MediaNode: {
    //     break;}
    //     case SectionNode: {
    //     break;}
    //     case HighlightNode: {
    //     break;}
    //     case WashiTapeNode: {
    //     break;}
    //     case TableNode: {
    //     break;}
    //     case value:

    //         break;

    //     default:
    //         break;
    // }
}


function generateCode(dom: SceneNode, rescriptDom: RescriptBuildTree, index:number) {
    buildNodeOrLeaf(dom, rescriptDom).then((currentDom) => {
        if ((dom as ChildrenMixin).children) {
            const children = (dom as ChildrenMixin).children;
            for (let i = 0 ; i < children.length; i++){
                generateCode(children.at(i)!, currentDom,i);
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
            styles: []
        },
        childrens: [],
        parent: rescriptDom
    }
    if (currentDom.type == "Text") {
        currentDom.props = getTextProps(dom)
        currentDom.childrens.push("{" + (dom as TextNode).characters + "}")
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