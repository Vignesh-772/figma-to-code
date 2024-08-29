
import { Builder } from "../Builder";
import { DomTree } from "../Types";

function createSVGWithString(builder: Builder,svg: string, self: SceneNode, dom: DomTree) {
    dom.props.props.push(builder.buildProp({
        key: "xml"
        , value: JSON.stringify(svg)
    }))
    dom.props.props.push(builder.buildProp({
        key: "height"
        , value: JSON.stringify(self.height + "px"),
    }))
    dom.props.props.push(builder.buildProp({
        key: "width"
        , value: JSON.stringify(self.width + "px"),
    }))
}

export default createSVGWithString;