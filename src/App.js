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
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";

const limit = 2800;

const MenuBar = ({ editor }) => {
  const [color, setColor] = useState("#ffffff");
  const colorPickerRef = useRef(null);

  const handleCloseColorPicker = useCallback(
    debounce((color) => {
      if (colorPickerRef.current) {
        colorPickerRef.current.setAttribute("type", "text");
        colorPickerRef.current.setAttribute("type", "color");
        // setColorPickerVisible(false);
      }
    }, 2000),
    []
  );

  // Function to handle color change
  const handleColorChange = (event) => {
    const color = event.target.value;
    handleCloseColorPicker(color);
    editor.chain().focus().setColor(color).run();
    setColor(color);
  };
  console.log("editor", editor);

  console.log("Current color at cursor:", editor.getAttributes('textStyle'));

  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // Function to handle button click
  if (!editor) {
    return null;
  }

  console.log("colorQuery", editor.getAttributes('textStyle'), editor.getAttributes('textStyle')?.color || '#000');
  console.log("backgroundColorQuery", editor.getAttributes('highlight'), editor.getAttributes('highlight')?.color || "#fff");
  console.log("isTableActive", editor.isActive('table'), editor.getAttributes('table'));

  return (
    <div className="features-list">
      <div className="p-2">
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
          className={editor.isActive("underline") ? "is-active" : ""}
        >
          underline
        </button>
        <button
          className="color-picker-button"
          style={{ backgroundColor: editor.getAttributes('textStyle')?.color || "#3d251414" }}
        >
          Text Color
          <input
            value={
              editor.getAttributes('textStyle')?.color || "#000"
            }
            ref={colorPickerRef}
            type="color"
            onChange={handleColorChange}
          />
        </button>
        <button
          className="color-picker-button"
          style={{
            backgroundColor: editor.getAttributes('highlight')?.color || "#FFFFFF"
          }}
          title="Text Background"
        >
          Text Background
          <input
            value={
              editor.getAttributes('highlight')?.color || "#FFFFFF"
            }
            type="color"
            onChange={(e) => {
              console.log("highlight color", e.target.value);
              editor
                .chain()
                .focus()
                .toggleHighlight({ color: e.target.value })
                .run()
            }}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          strike
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          h1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          h2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
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
          className={
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          }
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
          className={
            editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
          }
        >
          justify
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          Toggle blockquote
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          Toggle bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          Toggle ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
        >
          Toggle code block
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          Set hard break
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          Set horizontal rule
        </button>
        <button onClick={addImage}>Set image</button>
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          Insert table
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={editor.isActive("taskList") ? "is-active" : ""}
        >
          Toggle task list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={editor.isActive("subscript") ? "is-active" : ""}
        >
          Toggle subscript
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={editor.isActive("superscript") ? "is-active" : ""}
        >
          Toggle superscript
        </button>
        <button
          onClick={setLink}
          className={editor.isActive("link") ? "is-active" : ""}
        >
          Set link
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
        >
          Unset link
        </button>
      </div>
      <hr/>
      <div>
        {(editor.isActive("bulletList") || editor.isActive("orderedList")) && (
          <div className="d-flex flex-column w-100">
            <div>
              <button
                onClick={() =>
                  editor.chain().focus().splitListItem("listItem").run()
                }
                disabled={!editor.can().splitListItem("listItem")}
              >
                Split list item
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().sinkListItem("listItem").run()
                }
                disabled={!editor.can().sinkListItem("listItem")}
              >
                Sink list item
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().liftListItem("listItem").run()
                }
                disabled={!editor.can().liftListItem("listItem")}
              >
                Lift list item
              </button>
            </div>
            <hr className="w-100"/>
          </div>
        )}
        {editor.isActive('table') && (
          <div className="table-features-container">
            <button
              onClick={() => editor.chain().focus().addColumnBefore().run()}
            >
              Add column before
            </button>
            <button onClick={() => editor.chain().focus().addColumnAfter().run()}>
              Add column after
            </button>
            <button onClick={() => editor.chain().focus().deleteColumn().run()}>
              Delete column
            </button>
            <button onClick={() => editor.chain().focus().addRowBefore().run()}>
              Add row before
            </button>
            <button onClick={() => editor.chain().focus().addRowAfter().run()}>
              Add row after
            </button>
            <button onClick={() => editor.chain().focus().deleteRow().run()}>
              Delete row
            </button>
            <button onClick={() => editor.chain().focus().deleteTable().run()}>
              Delete table
            </button>
            <button onClick={() => editor.chain().focus().mergeCells().run()}>
              Merge cells
            </button>
            <button onClick={() => editor.chain().focus().splitCell().run()}>
              Split cell
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
            >
              Toggle header column
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            >
              Toggle header row
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeaderCell().run()}
            >
              Toggle header cell
            </button>
            <button onClick={() => editor.chain().focus().mergeOrSplit().run()}>
              Merge or split
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setCellAttribute("colspan", 2).run()
              }
            >
              Set cell attribute
            </button>
            <button onClick={() => editor.chain().focus().fixTables().run()}>
              Fix tables
            </button>
            <button onClick={() => editor.chain().focus().goToNextCell().run()}>
              Go to next cell
            </button>
            <button
              onClick={() => editor.chain().focus().goToPreviousCell().run()}
            >
              Go to previous cell
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({ multicolor: true }),
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
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Subscript,
      Superscript,
      CharacterCount.configure({
        limit,
      }),
      Placeholder.configure({
        // Use a placeholder:
        placeholder: "Write something …",
        // Use different placeholders depending on the node type:
        // placeholder: ({ node }) => {
        //   if (node.type.name === 'heading') {
        //     return 'What’s the title?'
        //   }

        //   return 'Can you add some further context?'
        // },
      }),
    ],
    content: `
      <h1 style="text-align: center"><strong><u>Understanding Hypertension</u></strong></h1>
      <p><strong>Hypertension</strong>, or <em>high blood pressure</em>, is a condition where the force of the blood against the artery walls is consistently too high. This can lead to significant health issues such as <strong>heart disease</strong>, <strong>stroke</strong>, and <strong>kidney damage</strong>.</p>
      <hr contenteditable="false">
      <p><strong>Symptoms:</strong></p>
      <ol><li><p><strong>Lifestyle Changes:</strong></p><img src="https://t3.ftcdn.net/jpg/01/21/79/06/360_F_121790612_FN9IodcNfQfO6jcOP6YgKc1YbIOo7JXC.jpg" contenteditable="false" draggable="true" class="ProseMirror-selectednode"><ul><li><p>Adopting a healthy diet</p></li><li><p>Engaging in regular exercise</p></li></ul></li><li><p><strong>Medication:</strong></p><ul><li><p>Prescribed by a healthcare provider</p></li></ul></li></ol>
      <hr contenteditable="false">
      <blockquote><p><strong><em>"Managing hypertension is crucial for maintaining overall health and preventing serious complications."</em></strong></p></blockquote>
      <hr contenteditable="false">
      <p><strong>Important Notes:</strong></p>
      <ul><li><p><strong>Subscript Example:</strong> Glucose levels can be measured as <em>mg/dL</em>.</p></li><li><p><strong>Superscript Example:</strong> The standard reference is <em>120/80 mmHg</em>.</p></li></ul>
      <hr contenteditable="false">
      <p><strong>Comparison Table:</strong></p>
      <div class="tableWrapper"><table style="min-width: 75px;"><colgroup><col><col><col></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>Measurement</p></th><th colspan="1" rowspan="1"><p>Normal</p></th><th colspan="1" rowspan="1"><p>Hypertension</p></th></tr><tr><td colspan="1" rowspan="1"><p><strong>Systolic</strong></p></td><td colspan="1" rowspan="1"><p>&lt;120</p></td><td colspan="1" rowspan="1"><p>≥140</p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Diastolic</strong></p></td><td colspan="1" rowspan="1"><p>&lt;80</p></td><td colspan="1" rowspan="1"><p>≥90</p></td></tr></tbody></table></div>
      <hr contenteditable="false">
      <p><strong>Further Reading:</strong></p>
      <ul><li><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.heart.org/-/media/Files/Health-Topics/Answers-by-Heart/What-Is-High-Blood-Pressure.pdf">American Heart Association - Hypertension Overview</a></p></li><li><p class=""><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.mayoclinic.org/diseases-conditions/high-blood-pressure/symptoms-causes/syc-20373410">Mayo Clinic - Hypertension</a></p></li></ul>
      <hr contenteditable="false">
      <p><strong>Check Your Health:</strong></p>
      <ul data-type="taskList"><li data-checked="false"><label contenteditable="false"><input type="checkbox"><span></span></label><div><p>Regular Blood Pressure Checks</p></div></li><li data-checked="false"><label contenteditable="false"><input type="checkbox"><span></span></label><div><p>Healthy Eating</p></div></li><li data-checked="false"><label contenteditable="false"><input type="checkbox"><span></span></label><div><p>Regular Exercise</p></div></li></ul>
      <hr contenteditable="false">
      <p><strong>Contact Your Doctor:</strong></p>
      <p>For more information and personalized advice, consult with your healthcare provider.</p>
      <p>N(t)=N<sub>0</sub>​⋅e<sup>(r⋅t)</sup></p>
      `,
  });

  const percentage = editor
    ? Math.round((100 / limit) * editor.storage.characterCount.characters())
    : 0;

  return (
    <div className="main-container">
      <div style={{ marginBottom: "15px" }}>
        <MenuBar editor={editor} />
      </div>
      <div className="p-2 content-container">
        <EditorContent editor={editor} />
      </div>
      <div
        className={`character-count ${
          editor.storage.characterCount.characters() === limit
            ? "character-count--warning"
            : ""
        }`}
      >
        <svg height="20" width="20" viewBox="0 0 20 20">
          <circle r="10" cx="10" cy="10" fill="#e9ecef" />
          <circle
            r="5"
            cx="10"
            cy="10"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
            transform="rotate(-90) translate(-20)"
          />
          <circle r="6" cx="10" cy="10" fill="white" />
        </svg>
        {editor.storage.characterCount.characters()} / {limit} characters
        <br />
        {editor.storage.characterCount.words()} words
      </div>
    </div>
  );
}
