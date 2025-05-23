import BlurFade from "../magicui/blur-fade";
import Section from "../section";
import { ArrowUpDown, Coins, Wallet } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const problems = [
  {
    title: "Carry Strategies",
    description:
      "Earn yield by utilizing the combination of funding rates and lending rates in the Mars Red Bank. Take advantage of positive funding rates in perp markets by shorting while earning deposit interest.",
    icon: Coins,
  },
  {
    title: "Reverse Carry",
    description:
      "Capitalize on negative funding rates by going long on perpetual markets. Perfect for situations where shorting the spot market through borrowing isn't optimal due to high borrow rates.",
    icon: ArrowUpDown,
  },
  {
    title: "Money Markets",
    description:
      "Access Mars Protocol's Red Bank for lending and borrowing with competitive interest rates. Utilize these facilities to power our delta-neutral strategies or for your own custom trading approaches.",
    icon: Wallet,
  },
];

export default function Component() {
  return (
    <Section
      title="Delta Neutral Strategies"
      subtitle="Maximize returns while minimizing directional market exposure."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {problems.map((problem, index) => (
          <BlurFade key={index} delay={0.2 + index * 0.2} inView>
            <Card className="bg-background border-none shadow-none">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <problem.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </Section>
  );
}
