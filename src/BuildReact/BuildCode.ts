import { DomProps, Props, RescriptBuildTree } from "../BuildDom/Types";



export function buildReactFromBuildTree(buildTree: RescriptBuildTree, level: number): string {
    const prefix = "let make= () => {\n" + getTabSpaces(level + 1);
    const content = buildViewTagsFromTree(buildTree, (level + 2));
    const suffix = "\n}"
    return prefix + content + suffix;
}

function buildViewTagsFromTree(buildTree: RescriptBuildTree, level: number): string {
    console.log("buildTree", Object.assign({}, buildTree))
    const prefix = OPEN_TAG + buildTree.type + " " + getPropsCode(buildTree.props, buildTree.type, level + 1) + CLOSE_TAG;
    if (buildTree.childrens.length == 0) {
        return prefix + OPEN_CLOSE_TAG + buildTree.type + CLOSE_TAG;
    }
    let children = "";
    for (let i = 0; i < buildTree.childrens.length; i++) {
        console.log("buildTree.childrens i", i, buildTree.childrens[i])
        if (typeof buildTree.childrens[i] === "string") {
            children = children + NEW_LINE + buildTree.childrens[i] + NEW_LINE
        } else {
            children = children + buildViewTagsFromTree(buildTree.childrens[i] as RescriptBuildTree, level++)
        }
    }
    return prefix + children + OPEN_CLOSE_TAG + buildTree.type + CLOSE_TAG;
}

function getTabSpaces(level: number): string {
    if (level <= 0) return ""
    return "    ".concat(getTabSpaces(--level));
}
function getPropsCode(props: DomProps, type: string, level: number): string {
    const layoutProps = propsToString(uniqByKeepFirst(props.props, it => it.key), level);
    if (type == "Svg.SvgXml") {
        return layoutProps;
    } else {
        const styleProps = styleToCode(uniqByKeepFirst(props.styles, it => it.key), level);
        const textStyle = textStyleToString(uniqByKeepFirst(props.textStyle, it => it.key), level);
        const finalStyleProps = "style={array([" + styleProps + (textStyle == "" ? "" : ",") + textStyle + "])}"
        return layoutProps.concat(layoutProps == "" ? finalStyleProps : " ".concat(finalStyleProps));
    }
}

function propsToString(props: Props[], level: number) {
    if (props.length == 0) return "";
    let result = "";
    for (let i = 0; i < props.length; i++) {
        result += getTabSpaces(level)
        result += props[i].key
        result += " "
        result += EQUALS
        result += " "
        result += props[i].value
        result += " "
        result += NEW_LINE
    }
    return result;
}

function textStyleToString(props: Props[], level: number) {
    if (props.length == 0) return "";
    let result: string = "textStyle(";
    for (let i = 0; i < props.length; i++) {
        result += getTabSpaces(level)
        result += TIDLE
        result += props[i].key
        result += " "
        result += EQUALS
        result += " "
        result += props[i].value
        result += ","
        result += " "
        result += NEW_LINE
    }
    result = result + getTabSpaces(level) + "(), " + NEW_LINE + ")"
    return result;
}

function styleToCode(props: Props[], level: number) {
    if (props.length == 0) return "";
    let result: string = "viewStyle(";
    for (let i = 0; i < props.length; i++) {
        result += getTabSpaces(level)
        result += TIDLE
        result += props[i].key
        result += " "
        result += EQUALS
        result += " "
        result += props[i].value
        result += ","
        result += " "
        result += NEW_LINE
    }
    result = result + getTabSpaces(level) + "(), " + NEW_LINE + ")"
    return result;
}

const OPEN_TAG = "<"
const TIDLE = "~"
const CLOSE_TAG = ">"
const EQUALS = "="
const OPEN_CLOSE_TAG = "</"
const NEW_LINE = "\n"


function uniqByKeepFirst(a: Props[], key: (arg: Props) => string) {
    const seen = new Set();
    return a.filter((item:Props) => {
        const k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}