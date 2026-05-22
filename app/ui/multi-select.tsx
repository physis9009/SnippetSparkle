'use client';
import { useState, useRef, useEffect } from 'react';

type MultiSelectProps = {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
};

export default function MultiSelect({ options, selected, onChange, placeholder }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value: string) => {
    onChange(selected.filter(v => v !== value));
  };

  return (
    <div ref={containerRef} className="relative w-[180px] text-xs">
      <div
        onClick={() => setOpen(!open)}
        className="h-[30px] bg-blk rounded-sm p-1 flex flex-wrap overflow-y-auto gap-1 cursor-pointer items-center custom-scrollbar"
      >
        {selected.length === 0 ? (
          <span className="text-[#5a5a5a] p-0.5">{placeholder}</span>
        ) : (
          selected.map(item => (
            <span key={item} className="bg-blk text-wht-gr px-1.5 py-0.5 rounded-sm flex items-center gap-1">
              {item}
              <button
                onClick={(e) => { e.stopPropagation(); removeOption(item); }}
                className="text-pnk-gr hover:text-pnk ml-0.5"
              >×</button>
            </span>
          ))
        )}
      </div>

      {open && (
        <div className="absolute z-10 mt-1 border-2 border-[#5a5a5a] bg-blk rounded-sm w-full max-h-[220px] overflow-y-auto custom-scrollbar">
          {options.map(option => (
            <label key={option} className="flex items-center px-2 py-1.5 hover:bg-blk-gr cursor-pointer text-wht-gr">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
                className="mr-2 accent-grn"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}