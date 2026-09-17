<<<<<<< HEAD
"use client";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
=======
import { Toaster as Sonner } from "sonner";

export function Toaster() {
>>>>>>> 2fdf0481223fe1cda076f730b7840cfac8ea38fc
  return (
    <Sonner
      theme="system"
      className="toaster group"
<<<<<<< HEAD
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
=======
      toastOptions={{
        classNames: {
          toast: "bg-card text-card-foreground border-border shadow-card",
        },
      }}
    />
  );
}
>>>>>>> 2fdf0481223fe1cda076f730b7840cfac8ea38fc
