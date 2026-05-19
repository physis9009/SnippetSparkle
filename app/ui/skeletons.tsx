function CardSkeleton() {
  return (
    <div
      className="
        rounded-sm p-3 box-border bg-blk
        animate-pulse flex flex-col justify-between
        h-full pt-6
      "
    >
      <div className="flex flex-col gap-3 items-center">
        <div className="h-4 bg-blk-gr rounded w-full"></div>
        <div className="h-4 bg-blk-gr rounded w-[95%]"></div>
        <div className="h-4 bg-blk-gr rounded w-[88%]"></div>
        <div className="h-4 bg-blk-gr rounded w-[92%]"></div>
        <div className="h-4 bg-blk-gr rounded w-[70%]"></div>
        <div className="h-4 bg-blk-gr rounded w-[88%]"></div>
        <div className="h-4 bg-blk-gr rounded w-[70%]"></div>
        <div className="h-4 bg-blk-gr rounded w-[95%]"></div>
      </div>

      <div className="flex justify-around gap-2 mt-3">
        <span className="bg-blk-gr h-3 w-10 rounded"></span>
        <span className="bg-blk-gr h-3 w-10 rounded"></span>
        <span className="bg-blk-gr h-3 w-10 rounded"></span>
        <span className="bg-blk-gr h-3 w-10 rounded"></span>
      </div>
    </div>
  );
}

export function CardFlowSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full bg-blk-md min-h-screen p-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}