import { DomProps } from "./Types";


function getTextProps(dom: SceneNode) {
    const props :DomProps= {
        props: [],
        styles: []
    };
    if ((dom as TextNode)) {
        const textNode = dom as TextNode;
        Object.getOwnPropertyNames(textNode).forEach(e => {
            switch (e) {
                case "textAlignHorizontal": {
                    props.styles.push({
                        key : 'textAlign',
                        value : textAlignHorizontal[textNode.textAlignHorizontal]
                    })
                    break;
                }
                case "textAlignVertical": {
                    props.styles.push({
                        key : 'textAlignVertical',
                        value : textAlignVertical[textNode.textAlignVertical]
                    })
                    break;
                }
                case "textAutoResize": {
                    props.styles.push({
                        key : 'vertical-align',
                        value : textAlignVertical[textNode.textAlignVertical]
                    })
                    break;
                }
                case "textTruncation": {
                    if (textNode.textTruncation == "ENDING") {
                        props.props.push({
                            key : 'ellipsizeMode',
                            value : 'tail'
                        })
                    }
                    break;
                }
                case "fontSize": {
                    if (textNode.fontSize as number) {
                        props.styles.push({
                            key : 'fontSize',
                            value : textNode.fontSize as number + ""
                        })
                    }
                    break;
                }
                case "fontName": {
                    if (textNode.fontName as FontName) {
                        props.styles.push({
                            key : 'fontFamily',
                            value : (textNode.fontName as FontName).family
                        })
                        props.styles.push({
                            key : 'fontStyle',
                            value : (textNode.fontName as FontName).style
                        })
                    }
                    break;
                }
                case "fontWeight": {
                    if (textNode.fontWeight as number) {
                        props.styles.push({
                            key : 'fontWeight',
                            value : (textNode.fontWeight as number) + ""
                        })
                    }
                    break;
                }
                case "textCase": {
                    if (textNode.textCase as TextCase) {
                        props.styles.push({
                            key : 'textTransform',
                            value : textCase[(textNode.textCase as TextCase)]
                        })
                    }
                    break;
                }
                case "textDecoration": {
                    if (textNode.textDecoration as TextCase) {
                        props.styles.push({
                            key : 'textDecorationLine',
                            value : textDecoration[(textNode.textDecoration as TextDecoration)]
                        })
                    }
                    break;
                }
                case "letterSpacing": {
                    if (textNode.letterSpacing as LetterSpacing) {
                        props.styles.push({
                            key : 'letterSpacing',
                            value : (textNode.letterSpacing as LetterSpacing).value + ""
                        })
                    }
                    break;
                }
                case "lineHeight": {
                    if (textNode.lineHeight as LetterSpacing) {
                        props.styles.push({
                            key : 'lineHeight',
                            value : (textNode.lineHeight as LetterSpacing).value + ""
                        })
                    }
                    break;
                }
                case "maxLines": {
                    props.props.push({
                        key : 'numberOfLines',
                        value : textNode.maxLines + ""
                    })
                    break;
                }
                default:
                    break;
            }
        })
        if (!textNode.textAlignVertical) {
            props.props.push({
                key : 'textAlignVertical',
                value : "center"
            })
        }
        props.props.push({
            key : 'includeFontPadding',
            value : "true"
        })
        return props;
    } else {
        return props;
    }

}

const textAlignHorizontal = {
    LEFT: 'left',
    RIGHT: 'right',
    CENTER: 'center',
    JUSTIFIED: 'justify'
  }

const textAlignVertical = {
    TOP: 'top',
    CENTER: 'center',
    BOTTOM: 'bottom'
  }
const textCase = {
    'ORIGINAL' : "none",
    'UPPER' : "uppercase",
    'LOWER' : "lowercase",
    'TITLE' : "none",
    'SMALL_CAPS' : "capitalize",
    'SMALL_CAPS_FORCED' : "capitalize"
  }
  
const textDecoration = {
    'NONE' : "none", 
    'UNDERLINE' : "underline",
    'STRIKETHROUGH': "line-through",
  }
  
export default getTextProps;


