/* eslint-disable no-undef */
import * as React from 'react'
import ReactDOMClient from 'react-dom/client';
import { OutputTree, TextNodeProps } from './BuildDom/Types';
import { buildReactFromOutputTree } from './BuildReact/BuildCode';
import styles from './ui.css'

console.log("Hello World")

function App() {
  const [text, setText] = React.useState<Array<TextNodeProps>>([])
  const finalOut = React.useRef(null)
  const textRef = React.useRef<HTMLTextAreaElement>(null)
  const [code, setCode] = React.useState("");

  onmessage = ((event) => {
    if (typeof event.data === "object" && event.data.pluginMessage) {
      finalOut.current = JSON.parse(event.data.pluginMessage.data)
      if (finalOut && finalOut.current) {
        const textNodes: Array<TextNodeProps> = [];
        getTextNodes(finalOut.current!, textNodes)
        setText(textNodes)
        setTimeout(() => triggerCopy(textNodes),100)
      }
    }
  })



  const texts = text.map((ele: TextNodeProps, index: number) => {
    if (typeof ele.childrens === "string") {
      return (<div key={ele.id}>
        <p>{ele.childrens}</p>
        <input type='checkbox' checked={ele.isConstant} onClick={() => setSelected(index)} />
        <label onClick={() => setSelected(index)}> Is it a constant? </label>
        <input type='text ' hidden={ele.isConstant} className={styles.input} onChange={(e) => setVariableName(e.target.value, index)} />
      </div>)
    }
  })

  function setSelected(index: number) {
    text[index].isConstant = !text[index].isConstant;
    const newNodes = [...text];
    setText(newNodes)
  }


  function setVariableName(val: string, index: number) {
    text[index].childrens = val;
  }

  function triggerCopy(textNodes:Array<TextNodeProps> | undefined) {
    if (finalOut.current) {
      // text.forEach(ele => )

      updateTextNodes(finalOut.current, textNodes ? textNodes : text);
      setCode(buildReactFromOutputTree(finalOut.current, 0))
      setTimeout(() => {
        if (textRef && textRef.current) {
          textRef.current?.focus();
          textRef.current?.select()
          document.execCommand('copy')
          if (window != null && window.getSelection() != null) {
            window.getSelection()!.removeAllRanges();
          }
        }
        parent.postMessage({ pluginMessage: { type: 'notify-copy' } }, '*')
      }, 100)
    }
  }

  return (
    <div>
      <p className={styles.title}>Rescript Code Generator</p>
      <br></br>
      <button className={styles.button} onClick={() => {
        setCode("")
        setText([])
        parent.postMessage({ pluginMessage: { type: 'generate-code' } }, '*')
      }}>Generate</button>
      <button className={styles.button} onClick={() => parent.postMessage({ pluginMessage: { type: 'close' } }, '*')}>Close</button>

      <h4 hidden={text.length <= 0}>
        How to use varibles in text field?
        <br></br>
        text :- Driver rating is 4.0
        <br></br>
        In this case you want to replace rating with a state variable we can update the text in the textField as 
        <br></br>
        Driver rating is &lt;v&gt;state.driverRating&lt;/v&gt;
      </h4>
      {texts}
      <button className={styles.button} hidden={text.length <= 0} onClick={() => triggerCopy(undefined)}>Copy</button>
      <div><textarea className={styles.codeArea} ref={textRef} value={code} readOnly={true}></textarea></div>
    </div>
  );
}


function getTextNodes(out: OutputTree, textNodes: Array<TextNodeProps>) {
  if (out.type == "Text") {
    textNodes.push(getTextNodeProps(out))
  }
  out.childrens.forEach((ele) => {
    if (typeof ele != "string") {
      getTextNodes(ele, textNodes)
    }
  })
}

function updateTextNodes(nodes: OutputTree, textNode: Array<TextNodeProps>) {
  if (textNode.length == 0) return;
  if (textNode.length > 1) {
    textNode.forEach(ele => updateTextNodes(nodes, [ele]))
  }
  const node = findNodeById(textNode[0].id, nodes)
  if (node) {
    // const variables = textNode[0].childrens.substring(textNode[0].childrens.indexOf("<v>") + 3,textNode[0].childrens.indexOf("</v>"))
    node.childrens = ["{ React.string(" + JSON.stringify(textNode[0].childrens).replace(RegExp("<v>", "g"), "\" + ").replace(RegExp("</v>", "g"), "+ \"") + ")}"]
  }
}

function findNodeById(id: string, outTree: OutputTree): OutputTree | undefined {
  if (outTree.id == id) {
    return outTree;
  } else {
    let out = undefined;
    for (let i = 0; i < outTree.childrens.length; i++) {
      const currentElem = outTree.childrens[i];
      if (typeof currentElem !== "string") {
        out = findNodeById(id, currentElem);
      }
      if (out) break;
    }
    return out;
  }
}

function getTextNodeProps(out: OutputTree): TextNodeProps {
  return {
    type: out.type,
    id: out.id,
    props: out.props,
    childrens: typeof out.childrens[0] === "string" ? out.childrens[0] : "",
    isConstant: true
  }
}

const app = document.getElementById("app");

if (app) {
  const root = ReactDOMClient.createRoot(app);
  root.render(<App />)
}
