import Features from "@/components/features-vertical";
import Section from "@/components/section";
import { Wallet, Sparkles, Check } from "lucide-react";

const data = [
  {
    id: 1,
    title: "1. Connect Your Wallet",
    content:
      "Connect your wallet to access the Mars Protocol platform. Support for multiple wallet providers ensures secure and easy access to your funds.",
    image: "/ConnectWallet.png",
    icon: <Wallet className="w-6 h-6 text-primary" />,
  },
  {
    id: 2,
    title: "2. Deploy Strategy",
    content:
      "Select from available delta-neutral strategies with high yields. Deposit an asset as collateral and short a similar asset in the perps market to create market-neutral positions.",
    image: "/DeployStrategy.png",
    icon: <Sparkles className="w-6 h-6 text-primary" />,
  },
  {
    id: 3,
    title: "3. Approve Transaction",
    content:
      "Review and confirm your transaction details. Your position is protected from price movements since you're long on one asset and short on a related asset while earning from both lending rates and funding rates.",
    image: "/ApproveTransaction.png",
    icon: <Check className="w-6 h-6 text-primary" />,
  },
];

export default function Component() {
  return (
    <Section
      title="How it works"
      subtitle="Deploy delta-neutral strategies in 3 simple steps"
    >
      <Features data={data} />
    </Section>
  );
}
