
import { RescriptBuildTree } from "./Types";

function createSVGWithString(svg: string, self: SceneNode, dom: RescriptBuildTree) {
    dom.props.props.push({
        key: "xml"
        , value: JSON.stringify(svg)
    })
    dom.props.props.push({
        key: "height"
        , value: JSON.stringify(self.height + "px")
    })
    dom.props.props.push({
        key: "width"
        , value: JSON.stringify(self.width +  "px")
    })
}

export default createSVGWithString;