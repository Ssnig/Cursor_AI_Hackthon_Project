import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground", className)} {...props} />;
}
