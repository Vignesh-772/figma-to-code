import { Props, RescriptBuildTree } from "../BuildDom/Types";



export function buildReactFromVuildTree(buildTree: RescriptBuildTree) {
    const prefix = "let make= () => {";
    const content = buildViewTagsFromTree(buildTree,0);
}

function buildViewTagsFromTree(buildTree: RescriptBuildTree,level:number){ 
    const prefix = OPEN_TAG + buildTree.type + getPropsCode(buildTree.props, level + 1) + CLOSE_TAG;
}

function getTabSpaces(level:number) :string {
    if (level == 0) return ""
    return "    " + getTabSpaces(level--); 
}
function getPropsCode(props:DomProps, level: number) {
    const layoutProps = propsToString(props.props, level);
    

}

function propsToString (props:[Props], level: number) {
    let result = "";
     for (let i = 0; i< props.length; i++) {
        if (i != 0) result = result + ","
        result = result + getTabSpaces (level) +  + props[i].key + ":" + props[i].value + " \n"
    }
    return result;
}

const OPEN_TAG = "<"
const CLOSE_TAG = ">"
const COLON = ":"
const OPEN_CLOSE_TAG = "</"