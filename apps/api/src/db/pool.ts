import { Pool } from "pg";
import type { readConfig } from "../config.js";

export function createPool(config: ReturnType<typeof readConfig>) {
	return new Pool({
		host: config.PGHOST,
		port: config.PGPORT,
		database: "everyday_policy",
		user: "everyday_policy",
		password: config.POSTGRES_PASSWORD,
		connectionTimeoutMillis: 2_000,
		query_timeout: 2_000
	});
}
