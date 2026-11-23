import { z } from "zod";

const environmentSchema = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
	PGHOST: z.string().min(1).default("127.0.0.1"),
	PGPORT: z.coerce.number().int().min(1).max(65535).default(5432),
	POSTGRES_PASSWORD: z.string().min(1),
	WEB_ROOT: z.string().min(1).optional()
});

export function readConfig() {
	return environmentSchema.parse(process.env);
}
