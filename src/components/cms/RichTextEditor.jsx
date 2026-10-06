import { useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Undo2, Redo2, Code2 } from 'lucide-react';

const TOOLBAR = [
  ['bold', Bold, 'Bold'],
  ['italic', Italic, 'Italic'],
  ['underline', Underline, 'Underline'],
  ['insertUnorderedList', List, 'Bullet list'],
  ['insertOrderedList', ListOrdered, 'Numbered list'],
  ['createLink', LinkIcon, 'Insert link'],
  ['insertImage', ImageIcon, 'Insert image'],
  ['undo', Undo2, 'Undo'],
  ['redo', Redo2, 'Redo'],
];

export const RichTextEditor = ({ value = '', onChange }) => {
  const ref = useRef(null);
  const [sourceMode, setSourceMode] = useState(false);
  const [htmlSource, setHtmlSource] = useState(value);

  useEffect(() => {
    if (!ref.current) return;
    if (!sourceMode && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
    if (!sourceMode) setHtmlSource(value || '');
  }, [value, sourceMode]);

  const exec = (command) => {
    if (command === 'createLink') {
      const url = window.prompt('Enter URL');
      if (!url) return;
      document.execCommand('createLink', false, url);
    } else if (command === 'insertImage') {
      const url = window.prompt('Enter image URL');
      if (!url) return;
      document.execCommand('insertImage', false, url);
    } else {
      document.execCommand(command, false);
    }
    const html = ref.current?.innerHTML || '';
    onChange?.(html);
  };

  const handleInput = () => {
    const html = ref.current?.innerHTML || '';
    onChange?.(html);
    setHtmlSource(html);
  };

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
        {TOOLBAR.map(([command, Icon, label]) => (
          <button key={command} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec(command)} title={label}
            className="p-2 rounded-lg text-slate-600 hover:bg-white hover:text-[#12544F] transition-colors">
            <Icon className="w-4 h-4" />
          </button>
        ))}
        <button type="button" onClick={() => setSourceMode((v) => !v)} title="HTML source" className={`p-2 rounded-lg transition-colors ${sourceMode ? 'bg-[#12544F] text-white' : 'text-slate-600 hover:bg-white hover:text-[#12544F]'}`}>
          <Code2 className="w-4 h-4" />
        </button>
        <select onChange={(e) => document.execCommand('formatBlock', false, e.target.value)} defaultValue="p" className="ml-1 text-sm rounded-lg border border-slate-200 bg-white px-2 py-2 text-slate-600">
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="blockquote">Quote</option>
        </select>
      </div>
      {sourceMode ? (
        <textarea value={htmlSource} onChange={(e) => { setHtmlSource(e.target.value); onChange?.(e.target.value); }} rows={10} className="w-full p-4 font-mono text-sm text-slate-700 outline-none" placeholder="HTML content" />
      ) : (
        <div ref={ref} contentEditable suppressContentEditableWarning onInput={handleInput} className="min-h-[220px] p-4 prose prose-sm max-w-none outline-none text-slate-700" />
      )}
    </div>
  );
};
