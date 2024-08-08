import { RescriptBuildTree } from "./Types";

function createSVGWithString(svg: string, self: SceneNode, parent: RescriptBuildTree) {
    const rescriptNode: RescriptBuildTree = {
        type: "Svg.SvgXml",
        props: {
            props: [{
                key: "xml"
                , value: JSON.stringify(svg)
            }, {
                key: "height"
                , value: JSON.stringify(self.height + "px")
            }, {
                key: "width"
                , value: JSON.stringify(self.width +  "px")
            }],
            textStyle: [],
            styles: []
        },
        childrens: [],
        parent: parent
    }
    return rescriptNode;
}

export default createSVGWithString;