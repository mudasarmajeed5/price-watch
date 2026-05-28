import { Skeleton } from "@/components/ui/skeleton";

export default function ViewAllSkeleton() {
  return (
    <main className="flex-1 overflow-y-auto pb-20">
      <section className="px-3 py-4">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
