import type { ComponentType, SVGProps } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

/**
 * The one premium gold action button used for every primary action
 * across the planner. Renders as a router Link when `to` is given.
 */
export function PlannerButton({
  to,
  icon: Icon,
  children,
  onClick,
  type = "button",
  className = "",
}: {
  to?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  const inner = (
    <>
      {Icon ? <Icon aria-hidden="true" strokeWidth={1.5} className="h-5 w-5 shrink-0" /> : null}
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 opacity-70" />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`btn-planner ${className}`}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={`btn-planner ${className}`}>
      {inner}
    </button>
  );
}
