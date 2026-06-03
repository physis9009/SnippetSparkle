'use client';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-pnk-gr px-4 py-2 text-sm text-wht-gr transition-colors hover:bg-pnk"
        onClick={
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}