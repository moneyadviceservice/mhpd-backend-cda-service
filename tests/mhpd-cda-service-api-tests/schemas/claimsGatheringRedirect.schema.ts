import { z } from 'zod';

export const ClaimsGatheringRedirectSchema = z.object({
  claimsRedirectUrl: z.url(),
  rqp: z.string().min(1),
  ticket: z.string().min(1),
  requestId: z.string().min(1),
});

export type ClaimsGatheringRedirect = z.infer<typeof ClaimsGatheringRedirectSchema>;
