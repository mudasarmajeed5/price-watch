import { Skeleton } from "@/components/ui/skeleton";

export default function WatchlistSkeleton() {
  return (
    <main className="flex-1 overflow-y-auto pb-20">
      <div className="px-3 py-4">
        <div className="mb-4">
          <Skeleton className="h-6 w-40" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden flex flex-col h-full"
            >
              <Skeleton className="h-32 w-full rounded-t-xl" />
              <div className="p-2 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
