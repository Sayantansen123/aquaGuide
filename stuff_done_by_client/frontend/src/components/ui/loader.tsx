import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string; // Tailwind border color
}

const Loader = ({
  className,
  size = "md",
  color = "border-blue-500",
}: LoaderProps) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div
        className={cn(
          "rounded-full border-solid border-t-transparent border-r-transparent border-b-transparent animate-spin",
          color, // Only left side will be colored
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};

export { Loader };
