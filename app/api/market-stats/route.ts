import { NextResponse } from "next/server";
import BigNumber from "bignumber.js";

// GET /api/market-stats
export async function GET() {
  try {
    // Endpoints and contract address
    const chainRestEndpoint = "https://rest-lb.neutron.org";
    const redBankContract =
      "neutron1n97wnm7q6d2hrcna3rqlnyqw2we6k0l8uqvmyqq6gsml92epdu7quugyph";
    const marketsUrl = `${chainRestEndpoint}/cosmwasm/wasm/v1/contract/${redBankContract}/smart/ewoibWFya2V0c192MiI6IHsKImxpbWl0IjogMTAwCn0KfQ==`;
    const tokensUrl =
      "https://app.astroport.fi/api/trpc/tokens.byChain?input=%7B%22json%22%3A%7B%22chainId%22%3A%22neutron-1%22%7D%7D";

    // Parallel fetch on-chain metrics and token prices
    const [marketsRes, tokensRes] = await Promise.all([
      fetch(marketsUrl),
      fetch(tokensUrl),
    ]);
    if (!marketsRes.ok) {
      throw new Error(`Error fetching markets data: ${marketsRes.statusText}`);
    }
    if (!tokensRes.ok) {
      throw new Error(`Error fetching token data: ${tokensRes.statusText}`);
    }

    const marketsJson = await marketsRes.json();
    const tokensJson = await tokensRes.json();

    // Build token info map { denom: { price, decimals } }
    const tokenInfo: Record<string, { price: string; decimals: number }> = {};
    const tokensList = tokensJson?.result?.data?.json?.tokens || {};
    Object.entries(tokensList).forEach(([denom, data]: [string, any]) => {
      tokenInfo[denom] = {
        price: data.priceUsd?.toString() || "0",
        decimals: data.decimals || 6,
      };
    });

    // Extract market metrics array
    const metricsArray: Array<any> = marketsJson?.data?.data || [];

    // Initialize totals
    let totalMarketSize = 0;
    let totalAvailable = 0;
    let totalBorrows = 0;

    // Helper to convert to USD
    const toUsd = (amount: string, price: string, decimals: number): number => {
      try {
        const amt = new BigNumber(amount);
        const pr = new BigNumber(price);
        const usd = amt
          .dividedBy(new BigNumber(10).pow(decimals))
          .multipliedBy(pr);
        return usd.isNaN() ? 0 : usd.toNumber();
      } catch {
        return 0;
      }
    };

    // Compute totals
    metricsArray.forEach((m) => {
      const denom: string = m.denom;
      const info = tokenInfo[denom];
      if (!info) return;
      const supplied = m.collateral_total_amount || "0";
      const borrowed = m.debt_total_amount || "0";
      const suppliedUsd = toUsd(supplied, info.price, info.decimals);
      const borrowedUsd = toUsd(borrowed, info.price, info.decimals);
      const availableUsd = Math.max(0, suppliedUsd - borrowedUsd);

      totalMarketSize += suppliedUsd;
      totalAvailable += availableUsd;
      totalBorrows += borrowedUsd;
    });

    return NextResponse.json(
      { totalMarketSize, totalAvailable, totalBorrows },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("/api/market-stats error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
