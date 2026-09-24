import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  orgName: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const businessSchema = z.object({
  businessName: z.string().min(1),
  legalName: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  subIndustry: z.string().optional(),
  businessType: z.string().optional(),
  businessModel: z.string().optional(),
  companySize: z.string().optional(),
  yearFounded: z.string().optional(),
  headquarters: z.string().optional(),
  countriesServed: z.array(z.string()).optional(),
  citiesServed: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  businessDescription: z.string().optional(),
  oneLineDescription: z.string().optional()
}).partial({ businessName: true });

export const onboardingSaveSchema = z.object({
  step: z.number().int().min(1).max(12),
  data: z.record(z.unknown()),
  completed: z.boolean().optional()
});

export const websiteAnalyzeSchema = z.object({
  url: z.string().min(3)
});

export const genericStepSchema = z.object({
  step: z.number().int().min(1).max(12),
  data: z.record(z.unknown()),
  completed: z.boolean().optional()
});
