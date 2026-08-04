import type { SVGProps } from "react";

/**
 * Custom gold line icons for Christmas themes Lucide doesn't cover.
 * Same visual language as lucide-react: 24x24 grid, currentColor stroke,
 * round caps/joins, no fills.
 */
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function StockingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M8 3h8v3H8z" />
      <path d="M9 6v6.2c0 1-.4 1.9-1.1 2.6l-2.1 2.1a3.4 3.4 0 0 0 0 4.8 3.4 3.4 0 0 0 4.8 0L15 17c1.2-1.2 1.9-2.9 1.9-4.6V6" />
    </svg>
  );
}

export function RibbonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="9" r="2" />
      <path d="M10.4 7.6C9.2 6 7 4.5 5.4 5.4 3.9 6.3 4.6 8.6 7 9.2c1.2.3 3.4.3 5-.2" />
      <path d="M13.6 7.6C14.8 6 17 4.5 18.6 5.4c1.5.9.8 3.2-1.6 3.8-1.2.3-3.4.3-5-.2" />
      <path d="m10.6 10.7-3 9 4.4-2.6 4.4 2.6-3-9" />
    </svg>
  );
}

export function BaubleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M10 3.5h4" />
      <path d="M11 3.5v2M13 3.5v2" />
      <circle cx="12" cy="13.5" r="6.5" />
      <path d="M5.6 12h12.8" />
    </svg>
  );
}

export function HollyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 11c-1.6-3-4.2-4.4-6.6-3.6C6 9.9 8.3 11.4 12 11Z" />
      <path d="M12 11c1.6-3 4.2-4.4 6.6-3.6C18 9.9 15.7 11.4 12 11Z" />
      <path d="M12 11c-.9-2.6-.3-5.2 1.6-6.5 1.2 2.2 1 4.8-1.6 6.5Z" />
      <circle cx="10.4" cy="15.2" r="1.6" />
      <circle cx="13.9" cy="16.6" r="1.6" />
    </svg>
  );
}
