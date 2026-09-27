import type { ReactNode } from "react";

export function Banner({
  children,
  tone = "warn",
}: {
  children: ReactNode;
  tone?: "warn" | "info" | "danger";
}) {
  return (
    <p className={`banner banner-${tone}`} role="note">
      {children}
    </p>
  );
}
