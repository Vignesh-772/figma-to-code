import { DomProps, Props, RescriptOutputTree } from "../BuildDom/Types";



export function buildReactFromOutputTree(buildTree: RescriptOutputTree, level: number): string {
    // const prefix = "let make = () => {\n" + getTabSpaces(level + 1);
    const content = buildViewTagsFromTree(buildTree, (level + 2));
    // const suffix = "\n}"
    // return prefix + content + suffix;
    return content;
}

function buildViewTagsFromTree(buildTree: RescriptOutputTree, level: number): string {
    const prefix = OPEN_TAG + buildTree.type + " " + NEW_LINE + getPropsCode(buildTree.props, buildTree.type, level + 1) + CLOSE_TAG;
    if (buildTree.childrens.length == 0) {
        return prefix + OPEN_CLOSE_TAG + buildTree.type + getTabSpaces(level) + CLOSE_TAG;
    }
    let children = "";
    for (let i = 0; i < buildTree.childrens.length; i++) {
        if (typeof buildTree.childrens[i] === "string") {
            children = children + NEW_LINE + getTabSpaces(level + 1) + buildTree.childrens[i] + NEW_LINE
        } else {
            children = children + buildViewTagsFromTree(buildTree.childrens[i] as RescriptOutputTree, level++)
        }
    }
    return prefix + children + NEW_LINE + getTabSpaces(level) + OPEN_CLOSE_TAG + buildTree.type + CLOSE_TAG;
}

function getTabSpaces(level: number): string {
    if (level <= 0) return DEFAULT_SPACES + " "
    return DEFAULT_SPACES + " " + getTabSpaces(--level);
}
function getPropsCode(props: DomProps, type: string, level: number): string {
    const layoutProps = propsToString(uniqByKeepLast(props.props, it => it.key), level);
    if (type == "Svg.SvgXml") {
        return layoutProps;
    } else {
        const styleProps = styleToCode(uniqByKeepLast(props.styles, it => it.key), level);
        const textStyle = textStyleToString(uniqByKeepLast(props.textStyle, it => it.key), level);
        const finalStyleProps = getTabSpaces(level) + "style={array([" + NEW_LINE + getTabSpaces(level + 1) + styleProps + (textStyle == "" ? "" : ",") + textStyle + getTabSpaces(level + 1) + "\n ])}"
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function uniqByKeepFirst(a: Props[], key: (arg: Props) => string) {
    const seen = new Set();
    return a.filter((item:Props) => {
        const k = key(item);
        return seen.has(k) ? false : seen.add(k);
    });
}

function uniqByKeepLast(a: Props[], key: (arg: Props) => string) {
    return [
        ...new Map(
            a.map(x => [key(x), x])
        ).values()
    ]
}

const OPEN_TAG = "<"
const TIDLE = "~"
const CLOSE_TAG = ">"
const EQUALS = "="
const OPEN_CLOSE_TAG = "</"
const NEW_LINE = "\n"
const DEFAULT_SPACES = ""