import React, { useState } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  getDefaultKeyBinding,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {
  Bold, Italic, Underline, Code, Quote, List, ListOrdered,
  Heading1, Heading2, Trash, Save
} from 'lucide-react';

const INLINE_STYLES = [
  { icon: <Bold size={16} />, style: 'BOLD', label: 'Bold' },
  { icon: <Italic size={16} />, style: 'ITALIC', label: 'Italic' },
  { icon: <Underline size={16} />, style: 'UNDERLINE', label: 'Underline' },
  { icon: <Code size={16} />, style: 'CODE', label: 'Monospace' },
];

const BLOCK_TYPES = [
  { icon: <Heading1 size={16} />, style: 'header-one', label: 'H1' },
  { icon: <Heading2 size={16} />, style: 'header-two', label: 'H2' },
  { icon: <Quote size={16} />, style: 'blockquote', label: 'Quote' },
  { icon: <List size={16} />, style: 'unordered-list-item', label: 'UL' },
  { icon: <ListOrdered size={16} />, style: 'ordered-list-item', label: 'OL' },
  { icon: <Code size={16} />, style: 'code-block', label: 'Code Block' },
];

const StyleButton = ({ active, icon, onToggle, style, label }) => (
  <button
    className={`flex items-center justify-center w-9 h-9 rounded-lg border ${
      active
        ? 'bg-blue-600 text-white'
        : 'bg-white text-gray-600 hover:bg-gray-100'
    }`}
    onMouseDown={(e) => {
      e.preventDefault();
      onToggle(style);
    }}
    title={label}
  >
    {icon}
  </button>
);

const Toolbar = ({ editorState, onToggleInline, onToggleBlock }) => {
  const currentStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.style}
          active={currentStyle.has(type.style)}
          icon={type.icon}
          style={type.style}
          label={type.label}
          onToggle={onToggleInline}
        />
      ))}
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.style}
          active={type.style === blockType}
          icon={type.icon}
          style={type.style}
          label={type.label}
          onToggle={onToggleBlock}
        />
      ))}
    </div>
  );
};

const Blog = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const mapKeyToEditorCommand = (e) => getDefaultKeyBinding(e);

  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (style) => {
    setEditorState(RichUtils.toggleBlockType(editorState, style));
  };

  const saveContent = async () => {
    const raw = convertToRaw(editorState.getCurrentContent());
    const data = {
      heading,
      subheading,
      image,
      link,
      description: raw,
    };

    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert(' Blog content posted to fake API!');
      } else {
        alert('Failed to post blog content.');
      }
    } catch (error) {
      console.error('API Error:', error);
      alert(' An error occurred while posting blog.');
    }
  };

  const clearEditor = () => {
    setEditorState(EditorState.createEmpty());
    setHeading('');
    setSubheading('');
    setImage('');
    setLink('');
  };

  return (
    <div className="max-w-6xl mt-3 mx-auto bg-white shadow-xl border rounded-xl p-3">
      <h2 className="text-xl font-bold mb-2 text-gray-800">✍️ Create a Blog Post</h2>

      <div className="space-y-4 mb-6">
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="Enter heading..."
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={subheading}
          onChange={(e) => setSubheading(e.target.value)}
          placeholder="Enter subheading..."
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Enter image URL..."
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Enter related link..."
          className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Toolbar
        editorState={editorState}
        onToggleInline={toggleInlineStyle}
        onToggleBlock={toggleBlockType}
      />

      <div
        className="min-h-[200px] border p-4 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 bg-gray-50"
        onClick={() => document.getElementById('editor-focus').focus()}
      >
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          placeholder="Write your blog description..."
          spellCheck={true}
          id="editor-focus"
        />
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={saveContent}
          className="flex items-center cursor-pointer gap-1 px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg"
        >
          <Save size={16} /> Save
        </button>
        <button
          onClick={clearEditor}
          className="flex items-center gap-1 px-4 py-2 bg-red-600 cursor-pointer text-white rounded-lg hover:bg-red-700"
        >
          <Trash size={16} /> Clear
        </button>
      </div>
    </div>
  );
};

export default Blog;
