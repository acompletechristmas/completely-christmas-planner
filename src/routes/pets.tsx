import { createFileRoute } from "@tanstack/react-router";
import { PageShell, FeatureCard, GoldCTA, ComingSoonBadge } from "@/components/PageShell";
import { PawPrint, Shirt, Camera, MapPin, Gift, Cookie, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/pets")({
  head: () => ({
    meta: [
      { title: "Christmas for Pets — A Complete Christmas" },
      { name: "description", content: "Pet outfits, festive photo ideas, dog-friendly Christmas days out, safe treats and stocking gifts for your furry family." },
      { property: "og:title", content: "Christmas for Pets — A Complete Christmas" },
      { property: "og:description", content: "Outfits, photo ideas and dog-friendly festive days out for the whole furry family." },
      { property: "og:url", content: "https://acompletechristmas.co.uk/pets" },
    ],
    links: [{ rel: "canonical", href: "https://acompletechristmas.co.uk/pets" }],
  }),
  component: PetsPage,
});

const bits = [
  { icon: Shirt, title: "Pet outfits", body: "Knitted jumpers, reindeer antlers, bow-tie collars and elf costumes — sized for dogs, cats and small pets." },
  { icon: Camera, title: "Festive photo ideas", body: "Poses, props and lighting tips for the family Christmas card photo — plus pet-safe backdrops that actually work." },
  { icon: MapPin, title: "Pet-friendly days out", body: "Dog-welcome Christmas markets, light trails, pubs and Santa experiences — filtered by postcode." },
  { icon: Cookie, title: "Safe festive treats", body: "Homemade recipes and shop-bought picks that are safe for pets — plus a clear 'never feed' list for the big day." },
  { icon: Gift, title: "Stocking for the pet", body: "Curated toys, chews and cosy beds — from budget stocking-fillers to spoilt-rotten showstoppers." },
  { icon: PawPrint, title: "Calm & cosy Christmas", body: "How to keep pets settled around visitors, crackers and fireworks — vet-approved tips for a stress-free day." },
];

function PetsPage() {
  return (
    <PageShell
      eyebrow="Christmas for Pets"
      title={<><span className="block">A festive Christmas</span><span className="block gold-text">for furry family</span></>}
      intro="Outfits, photo ideas, dog-friendly days out and safe treats — because the pets deserve Christmas too."
    >
      <div className="mb-10 flex justify-center"><ComingSoonBadge /></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {bits.map((b) => <FeatureCard key={b.title} {...b} />)}
      </div>
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-[color:var(--gold-soft)]"><Star className="h-4 w-4" /><span className="text-xs uppercase tracking-[0.24em]">Save pet ideas to your planner</span></div>
        <GoldCTA to="/planner"><Sparkles className="h-4 w-4" /> Open my planner</GoldCTA>
      </div>
    </PageShell>
  );
}
