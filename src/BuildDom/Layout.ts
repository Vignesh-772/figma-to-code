import { RescriptBuildTree } from "./Types";

export const handleLayout = function(node: SceneNode, rescriptDom: RescriptBuildTree) {
    if (node as MinimalStrokesMixin) {
        const strokeNode = node as IndividualStrokesMixin;
        if (strokeNode.strokeBottomWeight) {
            rescriptDom.props.styles.push({
                key: "borderBottomWidth",
                value: strokeNode.strokeBottomWeight
            });
        }
        if (strokeNode.strokeLeftWeight) {
            rescriptDom.props.styles.push({
                key: "borderLeftWidth",
                value: strokeNode.strokeLeftWeight
            });
        }
        if (strokeNode.strokeRightWeight) {
            rescriptDom.props.styles.push({
                key: "borderRightWidth",
                value: strokeNode.strokeRightWeight
            });
        }
        if (strokeNode.strokeTopWeight) {
            rescriptDom.props.styles.push({
                key: "borderTopWidth",
                value: strokeNode.strokeTopWeight
            });
        }
    }
}