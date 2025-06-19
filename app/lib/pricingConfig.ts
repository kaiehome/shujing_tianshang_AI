type BillingCycle = 'monthly' | 'yearly';

const PRICING_CONFIG = {
  monthly: {
    pro: 12,
    ultimate: 24
  },
  yearly: {
    pro: 10, // 年付优惠价
    ultimate: 20 // 年付优惠价
  }
} as const;

export { PRICING_CONFIG };
export type { BillingCycle }; 