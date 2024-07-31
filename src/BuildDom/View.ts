import { handleFills, handleStroke, handleStrokeWeight } from "./Background";
import { RescriptBuildTree } from "./Types";


function getViewProps(figmaDom: SceneNode,resultDom: RescriptBuildTree) {
    let shouldSetFlex = false;
    if (figmaDom as FrameNode) {
        const frameNode = figmaDom as FrameNode;
        if (frameNode.clipsContent) {
            resultDom.props.styles.push({
                key: "overflow",
                value: "hidden"
            })
        }
        if (frameNode.paddingBottom || frameNode.paddingLeft || frameNode.paddingRight || frameNode.paddingTop || frameNode.verticalPadding || frameNode.horizontalPadding){
            if (frameNode.paddingBottom ) {
                resultDom.props.styles.push({
                    key: "paddingBottom",
                    value: frameNode.paddingBottom + ""
                })
            }
            if (frameNode.paddingLeft ) {
                resultDom.props.styles.push({
                    key: "paddingLeft",
                    value: frameNode.paddingLeft + ""
                })
            }
            if (frameNode.paddingRight ) {
                resultDom.props.styles.push({
                    key: "paddingRight",
                    value: frameNode.paddingRight + ""
                })
            }
            if (frameNode.paddingTop ) {
                resultDom.props.styles.push({
                    key: "paddingTop",
                    value: frameNode.paddingTop + ""
                })
            }
            if (frameNode.verticalPadding ) {
                resultDom.props.styles.push({
                    key: "paddingVertical",
                    value: frameNode.verticalPadding + ""
                })
            }
            if (frameNode.horizontalPadding ) {
                resultDom.props.styles.push({
                    key: "paddingHorizontal",
                    value: frameNode.horizontalPadding + ""
                })
            }
        }
        if (frameNode.fills) {
            (frameNode.fills as ReadonlyArray<Paint>).forEach(element => {
                handleFills(element,figmaDom,resultDom) 
            });
        }
        if (frameNode.strokes) {
            (frameNode.strokes as ReadonlyArray<Paint>).forEach(element => {
                handleStroke(element,resultDom) 
            });
        }
        if (frameNode.strokeWeight as number) {
            handleStrokeWeight(frameNode,resultDom)
        }
        if (frameNode.cornerRadius as number) {
            resultDom.props.styles.push({
                key: "borderRadius",
                value: frameNode.cornerRadius as number
            })
        }
        if(frameNode.layoutMode && frameNode.layoutMode != "NONE"){
            shouldSetFlex = true;
            resultDom.props.props.push({
                key: "flexDirection",
                value: getFlexDirection[frameNode.layoutMode]
            })
        }
    }

    if (shouldSetFlex && resultDom.parent) {
        resultDom.parent.props.styles.push({
            key: "flex",
            value: "1"
        })
    }
}

const getFlexDirection = {
    'NONE' : "",
    'HORIZONTAL' : "row",
    'VERTICAL': "column"
}


export default getViewProps;