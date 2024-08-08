import { handleFills, handleStroke, handleStrokeWeight } from "./Background";
import { RescriptBuildTree } from "./Types";


function getViewProps(figmaDom: SceneNode,resultDom: RescriptBuildTree) {
    let shouldSetFlex = false;
    if (figmaDom as FrameNode) {
        const frameNode = figmaDom as FrameNode;
        if (frameNode.clipsContent) {
            resultDom.props.styles.push({
                key: "overflow",
                value: "#hidden"
            })
        }
        if (frameNode.paddingBottom || frameNode.paddingLeft || frameNode.paddingRight || frameNode.paddingTop || frameNode.verticalPadding || frameNode.horizontalPadding){
            if (frameNode.paddingBottom ) {
                resultDom.props.styles.push({
                    key: "paddingBottom",
                    value: Math.floor(frameNode.paddingBottom) + ".->dp"
                })
            }
            if (frameNode.paddingLeft ) {
                resultDom.props.styles.push({
                    key: "paddingLeft",
                    value: Math.floor(frameNode.paddingLeft) + ".->dp"
                })
            }
            if (frameNode.paddingRight ) {
                resultDom.props.styles.push({
                    key: "paddingRight",
                    value: Math.floor(frameNode.paddingRight) + ".->dp"
                })
            }
            if (frameNode.paddingTop ) {
                resultDom.props.styles.push({
                    key: "paddingTop",
                    value: Math.floor(frameNode.paddingTop) + ".->dp"
                })
            }
            if (frameNode.verticalPadding ) {
                resultDom.props.styles.push({
                    key: "paddingVertical",
                    value: Math.floor(frameNode.verticalPadding) + ".->dp"
                })
            }
            if (frameNode.horizontalPadding ) {
                resultDom.props.styles.push({
                    key: "paddingHorizontal",
                    value: Math.floor(frameNode.horizontalPadding) + ".->dp"
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
        if (typeof frameNode.strokeWeight === "number") {
            handleStrokeWeight(frameNode,resultDom)
        }
        if (typeof frameNode.cornerRadius === "number") {
            resultDom.props.styles.push({
                key: "borderRadius",
                value: (frameNode.cornerRadius as number).toFixed(1)
            })
        }
        if(frameNode.layoutMode && frameNode.layoutMode != "NONE"){
            shouldSetFlex = true;
            resultDom.props.styles.push({
                key: "flexDirection",
                value: getFlexDirection[frameNode.layoutMode]
            })
        }
    }

    if (shouldSetFlex && resultDom.parent) {
        resultDom.parent.props.styles.push({
            key: "flex",
            value: "1.0"
        })
    }
}

const getFlexDirection = {
    'NONE' : "",
    'HORIZONTAL' : "#row",
    'VERTICAL': "#column"
}


export default getViewProps;