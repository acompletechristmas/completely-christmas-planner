import { createFileRoute } from "@tanstack/react-router";
import { PageShell, FeatureCard, GoldCTA, ComingSoonBadge } from "@/components/PageShell";
import { Film, Music, Gamepad2, BookOpen, Tv, Sparkles, Star, PartyPopper } from "lucide-react";

export const Route = createFileRoute("/entertainment")({
  head: () => ({
    meta: [
      { title: "Christmas Entertainment — A Complete Christmas" },
      { name: "description", content: "Films, TV, playlists, family games and quiz packs to make festive evenings sparkle." },
      { property: "og:title", content: "Christmas Entertainment — A Complete Christmas" },
      { property: "og:description", content: "Curated evenings for cosy nights, big family gatherings and everything between." },
    ],
  }),
  component: EntertainmentPage,
});

const bits = [
  { icon: Film, title: "Christmas films", body: "The classics, the modern comforts, the tear-jerkers and the family favourites — with streaming links." },
  { icon: Tv, title: "Festive TV guide", body: "Christmas specials worth staying up for — plus the Boxing Day box-sets to binge." },
  { icon: Music, title: "Playlists", body: "Warm-fire jazz, big-choir carols, kitchen-disco pop and cinematic scores — for every festive mood." },
  { icon: Gamepad2, title: "Family games", body: "Living-room games and party ideas by group size — from toddlers to grandparents." },
  { icon: BookOpen, title: "Christmas reads", body: "Books to gift, books to read on Christmas Eve, and audiobooks for wrapping evenings." },
  { icon: PartyPopper, title: "Quiz builder", body: "Auto-generate a Christmas quiz pack for the family — themed rounds, printable answer sheets." },
];

function EntertainmentPage() {
  return (
    <PageShell
      eyebrow="Christmas Entertainment"
      title={<><span className="block">Evenings that</span><span className="block gold-text">sparkle</span></>}
      intro="Films, playlists, games and quiz packs — curated for cosy nights and full-house gatherings."
    >
      <div className="mb-10 flex justify-center"><ComingSoonBadge /></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {bits.map((b) => <FeatureCard key={b.title} {...b} />)}
      </div>
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-[color:var(--gold-soft)]"><Star className="h-4 w-4" /><span className="text-xs uppercase tracking-[0.24em]">Save favourites to your planner</span></div>
        <GoldCTA to="/planner"><Sparkles className="h-4 w-4" /> Open my planner</GoldCTA>
      </div>
    </PageShell>
  );
}
