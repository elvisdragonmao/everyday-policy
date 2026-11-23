import { crawlerDryRunSchema, healthSchema } from "@everyday-policy/contracts";

export async function getHealth(signal: AbortSignal) {
	const response = await fetch("/api/health", { signal });
	const health = healthSchema.parse(await response.json());

	if (!response.ok && response.status !== 503) {
		throw new Error("Health check failed");
	}

	return health;
}

export async function runCrawlerDryRun() {
	const response = await fetch("/api/crawler/dry-run", { method: "POST" });
	if (!response.ok) {
		throw new Error("Crawler dry run failed");
	}

	return crawlerDryRunSchema.parse(await response.json());
}
