import { getImageNode, isImageNode } from "./Rescript/Image"
import getTextProps from "./Rescript/Text"
import { DomTree, Language, OutputTree } from "./Types"
import getViewProps from "./Rescript/View"
import { RescriptBuilder } from "./Rescript/RescriptBuilder";
import { Builder } from "./Builder";

export async function buildDomTree(figmaNode: ReadonlyArray<SceneNode>, lang: Language) {
    const builder = getBuilderInstanceByLanguage(lang) ;
    for (let i = 0; i < figmaNode.length; i++) {
        const currentTree = Object.assign({}, builder.getNode("View", undefined,"root"));
        generateCode(builder,figmaNode[i], currentTree, 0).then(() => {
            console.log("Rescript ->", figmaNode[i])
            figma.ui.postMessage({ status: "success", data: JSON.stringify(convertToOutputTree(currentTree)) })
        }).catch((err) => {console.error("err" , err)})
    }
}

function getBuilderInstanceByLanguage(lang: Language):Builder {
    switch (lang) {
        case Language.Rescript: return new RescriptBuilder(); 
        case Language.TypeScript: return new RescriptBuilder(); 
        case Language.Javascript: return new RescriptBuilder();
    }
  }

function convertToOutputTree(rescriptBuildTree: DomTree): OutputTree {
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


async function generateCode(builder:Builder,dom: SceneNode, rescriptDom: DomTree, index: number) {
    await buildNodeOrLeaf(builder,dom, rescriptDom).then(async (currentDom) => {
        if (currentDom.type != "Svg.SvgXml" && (dom as ChildrenMixin).children) {
            const children = (dom as ChildrenMixin).children;
            for (let i = 0; i < children.length; i++) {
                await generateCode(builder,children[i], currentDom, i).then(() => {
                }).catch((err) => {
                    console.log("error generateCode ->", err)
                })
            }
        }
        handleFlex(builder,dom, currentDom)
        const wrapEle = currentDom.props.styles.filter(a => a.key == "flexDirection")
        if (wrapEle.length > 0 && wrapEle[0].value == "#column") {
            currentDom.props.styles = currentDom.props.styles.filter(a => a.key != "flexWrap")
        }
        if (rescriptDom.type != "Svg.SvgXml") {
            rescriptDom.childrens.splice(index, 0, currentDom);
        }
    }).catch((err) => {
        console.error("Err in buildNodeOrLeaf", err)
    })
}

function handleFlex(builder:Builder, dom: SceneNode, currentDom: DomTree) {
    const gapEle = currentDom.props.styles.filter(a => a.key == "gap")
    if (gapEle.length > 0) {
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
                        ele.props.styles.push(builder.buildProp({key: "flex",value: "1.0"}))
                    }
                })
                
                // const newChild: Array<DomTree | string> = []
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


async function buildNodeOrLeaf(builder:Builder, dom: SceneNode, rescriptDom: DomTree) {
    const type = getRescriptType(dom.type, dom);
    let currentDom: DomTree = type == "View" ? builder.getNode(type,rescriptDom,dom.id) : builder.getChild(type,rescriptDom,dom.id)
    if (type == "Text") {
        const parentDom: DomTree = builder.getNode("View",rescriptDom,dom.id + "_parent")
        parentDom.childrens.push(currentDom)
        currentDom.parent = parentDom
    }
    if (currentDom.type == "Text") {
        currentDom.props = getTextProps(builder,dom)
        currentDom.childrens.push((dom as TextNode).characters)
    } else if (currentDom.type == "Svg.SvgXml") {
        await getImageNode(builder,dom, currentDom).then(() => {
        }).catch((err) => {
            console.log("getImageNode err", err)
        })
    }
    getViewProps(builder,dom, currentDom)
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