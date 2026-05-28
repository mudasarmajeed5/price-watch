import { Skeleton } from "@/components/ui/skeleton";

export default function AddProductSkeleton() {
  return (
    <div className="min-h-screen bg-background px-4 pt-6 pb-24">
      <div className="max-w-sm mx-auto">
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-3 w-full mb-6" />

        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
