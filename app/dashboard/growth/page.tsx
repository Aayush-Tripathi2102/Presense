import { ModuleShell } from "@/components/ModuleShell";

export default function GrowthPage() {
  return <ModuleShell title="Growth" desc="Paid, backlinks, reputation, influencers, PR — optional onboarding data activates these."
    cards={[["Paid Ads","Budget + CPA/ROAS placeholders"],["Backlinks","Monitor placeholder"],["Reputation","Review sources placeholder"]]}
    emptyTitle="Set a growth lever" body={["Connect ad accounts via OAuth", "Add target publications", "Claim review profiles"]} />;
}
