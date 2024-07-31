import getTextProps from "./Text"
import { RescriptBuildTree } from "./Types"
import getViewProps from "./View"

function buildRescript(figmaNode: ReadonlyArray<SceneNode>, rescriptBuildTree: RescriptBuildTree) {
    console.log("inside buildRescript")
    figmaNode.forEach(q => {
        generateCode(q, rescriptBuildTree)
    })
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


function generateCode(dom: SceneNode, rescriptDom: RescriptBuildTree) {
    const currentDom = buildNodeOrLeaf(dom, rescriptDom)
    console.log(dom)
    if ((dom as ChildrenMixin).children) {
        (dom as ChildrenMixin).children.forEach(ele => {
            generateCode(ele, currentDom)
        })
    }
    rescriptDom.childrens.push(currentDom);
}

function buildNodeOrLeaf(dom: SceneNode, rescriptDom: RescriptBuildTree) {
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