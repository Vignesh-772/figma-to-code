import { handleFills, handleStroke, handleStrokeWeight } from "./Background";
import { handleLayout } from "./Layout";
import { DomTree } from "../Types";
import { Builder } from "../Builder";


function getViewProps(builder:Builder,figmaDom: SceneNode,resultDom: DomTree) {
    if (figmaDom as FrameNode) {
        const frameNode = figmaDom as FrameNode;
        if (frameNode.clipsContent) {
            resultDom.props.styles.push(builder.buildProp({
                key: "overflow",
                value: "#hidden"
            }))
        }
        if (frameNode.paddingBottom || frameNode.paddingLeft || frameNode.paddingRight || frameNode.paddingTop || frameNode.verticalPadding || frameNode.horizontalPadding){
            if (frameNode.paddingBottom ) {
                resultDom.props.styles.push(builder.buildProp({
                    key: "paddingBottom",
                    value: Math.floor(frameNode.paddingBottom),
                    unit: ".->dp"
                }))
            }
            if (frameNode.paddingLeft ) {
                resultDom.props.styles.push(builder.buildProp({
                    key: "paddingLeft",
                    value: Math.floor(frameNode.paddingLeft),
                    unit: ".->dp"
                }))
            }
            if (frameNode.paddingRight ) {
                resultDom.props.styles.push(builder.buildProp({
                    key: "paddingRight",
                    value: Math.floor(frameNode.paddingRight), 
                    unit: ".->dp"
                }))
            }
            if (frameNode.paddingTop ) {
                resultDom.props.styles.push(builder.buildProp({
                    key: "paddingTop",
                    value: Math.floor(frameNode.paddingTop),
                    unit: ".->dp",
                }))
            }
            if (frameNode.verticalPadding ) {
                resultDom.props.styles.push(builder.buildProp({
                    key: "paddingVertical",
                    value: Math.floor(frameNode.verticalPadding),
                    unit: ".->dp"
                }))
            }
            if (frameNode.horizontalPadding ) {
                resultDom.props.styles.push(builder.buildProp({
                    key: "paddingHorizontal",
                    value: Math.floor(frameNode.horizontalPadding),
                    unit: ".->dp"
                }))
            }
        }
        if (frameNode.fills) {
            (frameNode.fills as ReadonlyArray<Paint>).forEach(element => {
                handleFills(builder,element,figmaDom,resultDom) 
            });
        }
        if (frameNode.strokes) {
            (frameNode.strokes as ReadonlyArray<Paint>).forEach(element => {
                handleStroke(builder,element,resultDom) 
            });
        }
        handleStrokeWeight(builder,frameNode,resultDom);
        if (typeof frameNode.cornerRadius === "number") {
            resultDom.props.styles.push(builder.buildProp({
                key: "borderRadius",
                value: (frameNode.cornerRadius as number).toFixed(1)
            }))
        }
        if(frameNode.layoutMode && frameNode.layoutMode != "NONE"){
            // shouldSetFlex = true;
            resultDom.props.styles.push(builder.buildProp({
                key: "flexDirection",
                value: getFlexDirection[frameNode.layoutMode]
            }))
        } else {
            resultDom.props.styles.push(builder.buildProp({
                key: "flexDirection",
                value: "#row"
            }))
        }
    }
    handleLayout(builder,figmaDom,resultDom)
    const obj = resultDom.props.styles.filter(o => o.key == "borderColor");
    if (obj.length == 0) {
        resultDom.props.styles.push(builder.buildProp({
            key: "borderColor",
            value: JSON.stringify("#ffffff00")
        }))
    }

}

const getFlexDirection = {
    'NONE' : "",
    'HORIZONTAL' : "#row",
    'VERTICAL': "#column"
}


export default getViewProps;