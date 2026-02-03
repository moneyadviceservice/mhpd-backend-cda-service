import { z } from 'zod';

export const rqpSchema = z.object({
  rqp: z.string().min(1),
});

export type rqp = z.infer<typeof rqpSchema>;
