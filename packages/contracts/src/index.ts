import { z } from "zod";

export const healthSchema = z.object({
	status: z.enum(["ok", "unavailable"])
});

export const crawlerDryRunSchema = z.object({
	mode: z.literal("dry-run"),
	fetched: z.literal(0)
});

export type Health = z.infer<typeof healthSchema>;
export type CrawlerDryRun = z.infer<typeof crawlerDryRunSchema>;
