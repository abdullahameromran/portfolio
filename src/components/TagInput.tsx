import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  value?: string[];
  onChange?: (items: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ value = [], onChange, placeholder }: TagInputProps) {
  const [items, setItems] = useState<string[]>(value || []);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setItems(value || []), [value]);

  const notify = (next: string[]) => {
    setItems(next);
    onChange?.(next);
  };

  const addItem = (raw?: string) => {
    const v = (raw ?? input).trim();
    if (!v) return;
    if (items.includes(v)) {
      setInput("");
      return;
    }
    notify([...items, v]);
    setInput("");
    inputRef.current?.focus();
  };

  const removeItem = (idx: number) => {
    const next = items.slice(0, idx).concat(items.slice(idx + 1));
    notify(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    } else if (e.key === ",") {
      e.preventDefault();
      addItem();
    } else if (e.key === "Backspace" && input === "" && items.length > 0) {
      // remove last
      removeItem(items.length - 1);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-2">
        {items.map((it, i) => (
          <span key={i} className="inline-flex items-center gap-2 rounded-md bg-slate-900 border border-slate-800 px-2 py-1 text-xs text-slate-300">
            <span className="truncate max-w-[10rem]">{it}</span>
            <button type="button" onClick={() => removeItem(i)} className="p-0.5 text-slate-400 hover:text-white">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs text-white focus:border-blue-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => addItem()}
          className="rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-2 text-xs font-semibold text-white"
          title="Add"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
