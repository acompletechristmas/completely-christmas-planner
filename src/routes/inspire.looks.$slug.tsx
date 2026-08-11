import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/inspire/looks/$slug")({
  component: () => <Outlet />,
});
