import type { Health } from "@everyday-policy/contracts";
import type { FastifyInstance } from "fastify";
import type { Pool } from "pg";

export function registerHealthRoutes(app: FastifyInstance, database: Pool) {
	app.get<{ Reply: Health }>("/api/health", async (request, reply) => {
		reply.header("cache-control", "no-store");

		try {
			await database.query("SELECT 1");
			return { status: "ok" };
		} catch (error) {
			request.log.warn({ err: error }, "Database health check failed");
			return reply.code(503).send({ status: "unavailable" });
		}
	});
}
