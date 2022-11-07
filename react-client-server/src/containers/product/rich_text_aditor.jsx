import React, { Component } from 'react';
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichTextAditor extends Component {
  state = {
    editorState: EditorState.createEmpty(),  //构建一个初始化状态的编辑器+内容
  }

  getRichTextAditor=()=>{
    const {editorState}=this.state
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }

  setRichTextAditor=(html)=>{
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState(
        {
        editorState,
      }
      ) 
    }
  }


  onEditorStateChange= (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{ border: '1px solid black', paddingLeft: '10px',lineHeight: '30px', minHeight: '200px'}}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
        
      </div>
    );
  }
}