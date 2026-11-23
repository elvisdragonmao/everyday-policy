import fastifyStatic from "@fastify/static";
import fastify from "fastify";
import type { readConfig } from "./config.js";
import { createPool } from "./db/pool.js";
import { registerCrawlerRoutes } from "./features/crawler/routes.js";
import { registerHealthRoutes } from "./features/health/routes.js";

export function createApp(config: ReturnType<typeof readConfig>) {
	const app = fastify({ logger: true });
	const database = createPool(config);

	database.on("error", error => app.log.error({ err: error }, "Idle database connection failed"));
	app.addHook("onClose", async () => database.end());

	registerHealthRoutes(app, database);
	registerCrawlerRoutes(app);

	if (config.WEB_ROOT) {
		app.register(fastifyStatic, { root: config.WEB_ROOT, index: false });
		app.get("/", async (_request, reply) => reply.sendFile("index.html", { cacheControl: false }));
	}

	return app;
}
