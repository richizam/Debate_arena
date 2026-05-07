export type PlanCode = "pack_25_monthly" | "pack_50_monthly" | "pack_100_monthly";

export interface BillingStatus {
  creditsRemaining: number;
  premiumCreditsRemaining: number;
  expiresAt: string | null;
  currentPlanCode: string | null;
  subscriptionStatus: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface BillingStatusResponse extends BillingStatus {
  email: string | null;
}

export const BILLING_PLANS: Array<{
  code: PlanCode;
  label: string;
  price: string;
  proLine: string;
}> = [
  { code: "pack_25_monthly", label: "Starter", price: "$3.99 · 25 debates", proLine: "+ 5 Pro Live" },
  { code: "pack_50_monthly", label: "Plus", price: "$6.99 · 50 debates", proLine: "+ 12 Pro Live" },
  { code: "pack_100_monthly", label: "Pro", price: "$9.99 · 100 debates", proLine: "+ 25 Pro Live" },
];
