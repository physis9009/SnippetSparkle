import { Suspense } from 'react';
import SearchBar from '@/app/ui/search-bar';
import { SearchBarSkeleton } from '../ui/skeletons';
import Footer from '@/app/ui/footer';
import { fetchLanguages, fetchTags } from '@/app/lib/data';

export default async function CardFlowLayout({ children }: { children: React.ReactNode }) {
  const languages = await fetchLanguages();
  const tags = await fetchTags();

  return (
    <main className="bg-blk-md w-full overflow-y-scroll custom-scrollbar">
      <Suspense fallback={<SearchBarSkeleton />}>
        <SearchBar languages={languages} tags={tags} />
      </Suspense>
      {children}
      <Footer />
    </main>
  );
}