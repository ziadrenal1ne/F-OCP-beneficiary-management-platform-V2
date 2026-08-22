import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "bg-card text-card-foreground border-border shadow-card",
        },
      }}
    />
  );
}
