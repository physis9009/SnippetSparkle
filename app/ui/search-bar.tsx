'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useCallback } from 'react';
import MultiSelect from './multi-select';
import clsx from 'clsx';

type Props = {
  languages: string[];
  tags: string[];
};

export default function SearchBar({ languages, tags }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedLangs, setSelectedLangs] = useState<string[]>(searchParams.getAll('lang'));
  const [selectedTags, setSelectedTags] = useState<string[]>(searchParams.getAll('tag'));
  const [startDate, setStartDate] = useState(searchParams.get('start') || '');
  const [endDate, setEndDate] = useState(searchParams.get('end') || '');

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    selectedLangs.forEach(l => params.append('lang', l));
    selectedTags.forEach(t => params.append('tag', t));
    if (startDate) params.set('start', startDate);
    if (endDate) params.set('end', endDate);
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, selectedLangs, selectedTags, startDate, endDate]);

  const resetFilters = () => {
    setSelectedLangs([]);
    setSelectedTags([]);
    setStartDate('');
    setEndDate('');
    router.push(pathname);
  };

  return (
    <div className="flex flex-wrap gap-4 px-4 bg-blk-md rounded-sm mb-2 items-end">
      <MultiSelect
        options={languages}
        selected={selectedLangs}
        onChange={setSelectedLangs}
        placeholder="Filter by language"
      />
    
      <MultiSelect
        options={tags}
        selected={selectedTags}
        onChange={setSelectedTags}
        placeholder="Filter by tag"
      />

      <div className="flex flex-row gap-2">
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className={clsx(
            "bg-blk rounded-sm p-1 text-xs w-[130px] hover:shadow hover:shadow-[#5a5a5a] accent-grn",
            [startDate && 'text-wht-gr', !startDate && 'text-[#5a5a5a]']
          )}
        />
        <span className='text-[#5a5a5a]'>-</span>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className={clsx(
            "bg-blk rounded-sm p-1 text-xs w-[130px] hover:shadow hover:shadow-[#5a5a5a] accent-grn",
            [endDate && 'text-wht-gr', !endDate && 'text-[#5a5a5a]']
          )}
        />
      </div>

      <button onClick={applyFilters} className="text-xs bg-grn-gr hover:bg-grn text-wht px-3 py-1 rounded-sm self-end hover:cursor-pointer">
        Apply
      </button>
      <button onClick={resetFilters} className="text-xs bg-blk-gr hover:bg-[#5a5a5a] text-wht-gr px-2 py-1 rounded-sm self-end hover:cursor-pointer">
        Reset
      </button>
    </div>
  );
}