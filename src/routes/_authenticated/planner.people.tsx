import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { BuyingForPage } from "./planner.gifts";

export const Route = createFileRoute("/_authenticated/planner/people")({
  head: () => ({
    meta: [
      { title: "People & Presents — A Complete Christmas" },
      {
        name: "description",
        content: "Your luxury People & Presents board with budgets, progress, ribbons and Christmas completion states.",
      },
      { property: "og:title", content: "People & Presents — A Complete Christmas" },
      {
        property: "og:description",
        content: "Your luxury People & Presents board with budgets, progress, ribbons and Christmas completion states.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PeopleRoute,
});

function PeopleRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return pathname === "/planner/people" ? <BuyingForPage /> : <Outlet />;
}
