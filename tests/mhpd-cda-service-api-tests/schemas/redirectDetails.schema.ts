import z from 'zod';

export const RedirectDetailsSchema = z.object({
  redirectTargetUrl: z.url(),
  rqp: z.string().min(1),
  scope: z.string().min(1),
  responseType: z.string().min(1),
  prompt: z.string().min(1),
  service: z.string().min(1),
  codeChallengeMethod: z.enum(['S256', 'plain']),
  codeChallenge: z.string().min(1),
  codeVerifier: z.string().min(1),
});

export type RedirectDetails = z.infer<typeof RedirectDetailsSchema>;
