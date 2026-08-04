import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/planner/people")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/planner/people" || location.pathname === "/planner/people/") {
      throw redirect({ to: "/planner/gifts" });
    }
  },
  component: PeopleRoute,
});

function PeopleRoute() {
  return <Outlet />;
}
