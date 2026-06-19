import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  className = "h-6 w-6",
}: {
  className?: string;
}) {
  return <Loader2 className={`animate-spin text-zinc-500 ${className}`} />;
}
