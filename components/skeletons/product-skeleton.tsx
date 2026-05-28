import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <main className="flex-1 min-h-svh overflow-y-auto pb-24">
      <section className="relative">
        <Skeleton className="w-full aspect-4/5 bg-muted" />
      </section>

      <section className="px-4 pt-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-1/3 mt-2" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <Skeleton className="h-6 w-32 mt-4" />
      </section>
    </main>
  );
}
