import type { Env } from "./env";
import { requireEnv } from "./env";

export type PlanCode = "pack_25_monthly" | "pack_50_monthly" | "pack_100_monthly";

interface PlanConfig {
  code: PlanCode;
  displayName: string;
  credits: number;
  monthlyPriceUsd: string;
  envKey: keyof Env;
}

export const PLAN_CONFIGS: Record<PlanCode, PlanConfig> = {
  pack_25_monthly: {
    code: "pack_25_monthly",
    displayName: "25 debates / month",
    credits: 25,
    monthlyPriceUsd: "3.99",
    envKey: "DODO_PRICE_ID_PACK_25_MONTHLY",
  },
  pack_50_monthly: {
    code: "pack_50_monthly",
    displayName: "50 debates / month",
    credits: 50,
    monthlyPriceUsd: "6.99",
    envKey: "DODO_PRICE_ID_PACK_50_MONTHLY",
  },
  pack_100_monthly: {
    code: "pack_100_monthly",
    displayName: "100 debates / month",
    credits: 100,
    monthlyPriceUsd: "9.99",
    envKey: "DODO_PRICE_ID_PACK_100_MONTHLY",
  },
};

export function isPlanCode(value: string): value is PlanCode {
  return value in PLAN_CONFIGS;
}

export function getPlanConfig(planCode: string): PlanConfig | null {
  if (!isPlanCode(planCode)) {
    return null;
  }

  return PLAN_CONFIGS[planCode];
}

export function getPlanPriceId(env: Env, planCode: PlanCode): string {
  return requireEnv(env, PLAN_CONFIGS[planCode].envKey);
}
