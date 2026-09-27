import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  to?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  full?: boolean;
};

export function Button({
  children,
  variant = "primary",
  to,
  onClick,
  type = "button",
  disabled,
  full = true,
}: Props) {
  const className = `btn btn-${variant}${full ? "" : " btn-inline"}`;
  if (to) {
    return (
      <Link className={className} to={to} onClick={onClick} aria-disabled={disabled || undefined}>
        {children}
      </Link>
    );
  }
  return (
    <button className={className} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
