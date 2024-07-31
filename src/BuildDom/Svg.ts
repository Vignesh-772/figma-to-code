import { RescriptBuildTree } from "./Types";

function createSVGWithString(svg: string, self: SceneNode, parent: RescriptBuildTree) {
    const rescriptNode: RescriptBuildTree = {
        type: "Svg.SvgXml",
        props: {
            props: [{
                key: "xml"
                , value: svg
            }, {
                key: "height"
                , value: self.height
            }, {
                key: "width"
                , value: self.width
            }],
            styles: []
        },
        childrens: [],
        parent: parent
    }
    return rescriptNode;
}

export default createSVGWithString;