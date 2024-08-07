import React, { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";

import { debounce } from "./utils/debounce";

import "./styles.scss";
import { findPropertyPath } from "./utils/findPropertyPath";
import Blockquote from "@tiptap/extension-blockquote";
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

const MenuBar = ({ editor }) => {
  const [color, setColor] = useState('#ffffff');
  const colorPickerRef = useRef(null);

  const handleCloseColorPicker = useCallback(
    debounce((color) => {
      if (colorPickerRef.current) {
        colorPickerRef.current.setAttribute('type', 'text');
        colorPickerRef.current.setAttribute('type', 'color');
        // setColorPickerVisible(false);
      }
    }, 2000),
    []
  );

  // Function to handle color change
  const handleColorChange = (event) => {
    const color = event.target.value;
    handleCloseColorPicker(color);
    editor.chain().focus().setColor(color).run()
    setColor(color);
  };
  console.log("editor", editor);

  const addImage = useCallback(() => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  // Function to handle button click
  if (!editor) {
    return null;
  }

  return (
    <>
      <div>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          italic
        </button>
        <button
          onClick={() => editor.chain().focus().setUnderline().run()}
          className={editor.isActive('underline') ? "is-active" : ""}
        >
          underline
        </button>
        <button
          className={editor.isActive('textStyle', { color: color }) ? 'is-active' : ''}
        >
          <input value={editor.isActive('textStyle', { color: color }) ? color : '#000'} ref={colorPickerRef} type="color" onChange={handleColorChange}/>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
        >
          h1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
        >
          h2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
        >
          h3
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          paragraph
        </button>
        {/* <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
            highlight
          </button> */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        >
          left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
        >
          center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        >
          right
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={editor.isActive({ textAlign: "justify" }) ? "is-active" : ""}
        >
          justify
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          Toggle blockquote
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          Toggle bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          Toggle ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          Toggle code block
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>Set hard break</button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Set horizontal rule
        </button>
        <button onClick={addImage}>Set image</button>
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          Insert table
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={editor.isActive('taskList') ? 'is-active' : ''}
        >
          Toggle task list
        </button>
      </div>
      <div>
        {(editor.isActive('bulletList') || editor.isActive('orderedList')) && (
          <>
          <button
            onClick={() => editor.chain().focus().splitListItem('listItem').run()}
            disabled={!editor.can().splitListItem('listItem')}
          >
            Split list item
          </button>
          <button
            onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
            disabled={!editor.can().sinkListItem('listItem')}
          >
            Sink list item
          </button>
          <button
            onClick={() => editor.chain().focus().liftListItem('listItem').run()}
            disabled={!editor.can().liftListItem('listItem')}
          >
            Lift list item
          </button>
          </>
        )}
        <div>
        <button onClick={() => editor.chain().focus().addColumnBefore().run()}>
            Add column before
          </button>
          <button onClick={() => editor.chain().focus().addColumnAfter().run()}>Add column after</button>
          <button onClick={() => editor.chain().focus().deleteColumn().run()}>Delete column</button>
          <button onClick={() => editor.chain().focus().addRowBefore().run()}>Add row before</button>
          <button onClick={() => editor.chain().focus().addRowAfter().run()}>Add row after</button>
          <button onClick={() => editor.chain().focus().deleteRow().run()}>Delete row</button>
          <button onClick={() => editor.chain().focus().deleteTable().run()}>Delete table</button>
          <button onClick={() => editor.chain().focus().mergeCells().run()}>Merge cells</button>
          <button onClick={() => editor.chain().focus().splitCell().run()}>Split cell</button>
          <button onClick={() => editor.chain().focus().toggleHeaderColumn().run()}>
            Toggle header column
          </button>
          <button onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
            Toggle header row
          </button>
          <button onClick={() => editor.chain().focus().toggleHeaderCell().run()}>
            Toggle header cell
          </button>
          <button onClick={() => editor.chain().focus().mergeOrSplit().run()}>Merge or split</button>
          <button onClick={() => editor.chain().focus().setCellAttribute('colspan', 2).run()}>
            Set cell attribute
          </button>
          <button onClick={() => editor.chain().focus().fixTables().run()}>Fix tables</button>
          <button onClick={() => editor.chain().focus().goToNextCell().run()}>Go to next cell</button>
          <button onClick={() => editor.chain().focus().goToPreviousCell().run()}>
            Go to previous cell
          </button>
        </div>
        <div>
        <button
            onClick={() => editor.chain().focus().splitListItem('taskItem').run()}
            disabled={!editor.can().splitListItem('taskItem')}
          >
            Split list item
          </button>
          <button
            onClick={() => editor.chain().focus().sinkListItem('taskItem').run()}
            disabled={!editor.can().sinkListItem('taskItem')}
          >
            Sink list item
          </button>
          <button
            onClick={() => editor.chain().focus().liftListItem('taskItem').run()}
            disabled={!editor.can().liftListItem('taskItem')}
          >
            Lift list item
          </button>
        </div>
      </div>
    </>
  );
};

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      Highlight,
      Underline,
      Text,
      TextStyle,
      Color,
      Blockquote,
      HardBreak,
      HorizontalRule,
      Image,
      Dropcursor,
      Gapcursor,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: `
        <h3 style="text-align:center">
          Devs Just Want to Have Fun by Cyndi Lauper
        </h3>
        <p style="text-align:center">
          I come home in the morning light<br>
          My mother says, <mark>“When you gonna live your life right?”</mark><br>
          Oh mother dear we’re not the fortunate ones<br>
          And devs, they wanna have fun<br>
          Oh devs just want to have fun</p>
        <span>Text Color</span>
      `
  });

  return (
    <div className="main-container">
      <div style={{ marginBottom: '15px'}}>
        <MenuBar editor={editor} />
      </div>
      <hr style={{ width: '100%' }}/>
      <EditorContent editor={editor} />
    </div>
  );
}
