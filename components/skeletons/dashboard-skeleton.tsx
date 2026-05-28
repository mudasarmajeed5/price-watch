import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <main className="flex-1 overflow-y-auto pb-20 w-full">
      <section className="pt-3">
        <div className="flex items-center justify-between px-3 mb-2">
          <div className="w-32 h-5">
            <Skeleton className="w-full h-full rounded-md" />
          </div>
          <div className="w-16 h-4">
            <Skeleton className="w-full h-full rounded-md" />
          </div>
        </div>

        <div className="px-3">
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-56 shrink-0 rounded-xl">
                <Skeleton className="h-44 w-full rounded-xl" />
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="mx-5 my-6 border-dashed" />

      <section className="px-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3 items-center mb-4">
            <Skeleton className="w-20 h-28 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
