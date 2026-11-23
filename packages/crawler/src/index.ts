import type { CrawlerDryRun } from "@everyday-policy/contracts";

export function runCrawlerDryRun(): CrawlerDryRun {
	return { mode: "dry-run", fetched: 0 };
}
