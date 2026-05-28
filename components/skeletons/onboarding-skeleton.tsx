import { Skeleton } from "@/components/ui/skeleton";

export default function OnboardingSkeleton() {
  return (
    <main className="h-dvh overflow-hidden bg-[#f8f9ff] px-6 py-8">
      <div className="mx-auto flex h-full w-full max-w-sm flex-col">
        <div className="flex-1">
          <Skeleton className="w-full aspect-square rounded-xl" />
          <div className="mt-6 text-center">
            <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-3 w-5/6 mx-auto" />
          </div>
        </div>
        <div className="mt-auto pt-6">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}
