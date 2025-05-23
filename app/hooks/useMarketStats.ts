// src/hooks/useMarketStats.ts
"use client";

import { useState, useEffect } from "react";
import BigNumber from "bignumber.js";

// Define types
interface Asset {
  denom: string;
  decimals: number;
}

interface MarketMetrics {
  denom: string;
  collateral_total_amount: string;
  debt_total_amount: string;
}

interface MarketWithPrice {
  asset: Asset;
  metrics: MarketMetrics;
  price: {
    price: string;
  };
}

interface MarketStatsData {
  totalMarketSize: number;
  totalAvailable: number;
  totalBorrows: number;
  isLoading: boolean;
  error: Error | null;
}

export const useMarketStats = (): MarketStatsData => {
  const [stats, setStats] = useState<MarketStatsData>({
    totalMarketSize: 0,
    totalAvailable: 0,
    totalBorrows: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Hardcoded API URLs
        const chainRestEndpoint = "https://rest-lb.neutron.org";
        const redBankContract =
          "neutron1qz6cl0xen7prpnfft5cm3kl7xdkhxvtjp78zfgmmrlpkvyxu8leqzw26kx";
        const tokensUrl =
          "https://app.astroport.fi/api/trpc/tokens.byChain?input=%7B%22json%22%3A%7B%22chainId%22%3A%22neutron-1%22%7D%7D";

        // Market metrics data (collateral and debt amounts)
        const marketsUrl = `${chainRestEndpoint}/cosmwasm/wasm/v1/contract/${redBankContract}/smart/ewoibWFya2V0c192MiI6IHsKImxpbWl0IjogMTAwCn0KfQ==`;

        // Fetch market data
        const marketsResponse = await fetch(marketsUrl);
        if (!marketsResponse.ok) {
          throw new Error(
            `Error fetching markets data: ${marketsResponse.statusText}`
          );
        }
        const marketsData = await marketsResponse.json();

        // Fetch token data for prices and decimals
        const tokensResponse = await fetch(tokensUrl);
        if (!tokensResponse.ok) {
          throw new Error(
            `Error fetching token data: ${tokensResponse.statusText}`
          );
        }
        const tokensData = await tokensResponse.json();

        // Process token data to get prices and decimals
        let tokenInfo: Record<string, { price: string; decimals: number }> = {};
        if (tokensData?.result?.data?.json?.tokens) {
          const tokens = tokensData.result.data.json.tokens;
          Object.entries(tokens).forEach(([denom, data]: [string, any]) => {
            tokenInfo[denom] = {
              price: data.priceUsd?.toString() || "0",
              decimals: data.decimals || 6,
            };
          });
        }

        // Process market data
        const markets: MarketWithPrice[] = [];
        if (marketsData?.data?.data) {
          marketsData.data.data.forEach((metric: any) => {
            const denom = metric.denom;
            if (tokenInfo[denom]) {
              markets.push({
                asset: {
                  denom,
                  decimals: tokenInfo[denom].decimals,
                },
                metrics: {
                  denom,
                  collateral_total_amount:
                    metric.collateral_total_amount || "0",
                  debt_total_amount: metric.debt_total_amount || "0",
                },
                price: {
                  price: tokenInfo[denom].price,
                },
              });
            }
          });
        }

        // Calculate totals
        let marketSize = 0;
        let available = 0;
        let borrows = 0;

        markets.forEach((market) => {
          const price = market.price?.price || "0";
          const totalSupplied = market.metrics.collateral_total_amount || "0";
          const totalBorrowed = market.metrics.debt_total_amount || "0";
          const decimals = market.asset.decimals;

          // Calculate USD values
          const suppliedUsd = calculateUsdValue(totalSupplied, price, decimals);
          const borrowedUsd = calculateUsdValue(totalBorrowed, price, decimals);

          // Calculate available liquidity (supplied - borrowed)
          const liquidityUsd = Math.max(0, suppliedUsd - borrowedUsd);

          marketSize += suppliedUsd;
          available += liquidityUsd;
          borrows += borrowedUsd;
        });

        setStats({
          totalMarketSize: marketSize,
          totalAvailable: available,
          totalBorrows: borrows,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching market stats:", error);
        setStats((prevState) => ({
          ...prevState,
          isLoading: false,
          error: error instanceof Error ? error : new Error("Unknown error"),
        }));
      }
    };

    fetchMarketData();
  }, []);

  return stats;
};

// Utility function to calculate USD value
function calculateUsdValue(
  amount: string,
  price: string,
  decimals: number
): number {
  try {
    const amountBN = new BigNumber(amount);
    const priceBN = new BigNumber(price);

    // Convert from token amount to USD value
    const usdValue = amountBN
      .dividedBy(new BigNumber(10).pow(decimals))
      .multipliedBy(priceBN);

    return usdValue.isNaN() ? 0 : usdValue.toNumber();
  } catch (error) {
    console.error("Error calculating USD value:", error);
    return 0;
  }
}
