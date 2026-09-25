/** Service-level feature flags live on the registry definition (`features`). */
export function isOnboardingEnabled(features?: { onboarding?: boolean }): boolean {
  return features?.onboarding === true;
}
export function isProductionEnabled(features?: { production?: boolean }): boolean {
  return features?.production === true;
}
