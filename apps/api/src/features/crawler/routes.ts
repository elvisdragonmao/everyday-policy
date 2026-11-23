import { runCrawlerDryRun } from "@everyday-policy/crawler";
import type { FastifyInstance } from "fastify";

export function registerCrawlerRoutes(app: FastifyInstance) {
	app.post("/api/crawler/dry-run", async () => runCrawlerDryRun());
}
