import { createApp } from "./app.js";
import { readConfig } from "./config.js";

const config = readConfig();
const app = createApp(config);
const host = config.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";

async function shutdown() {
	try {
		await app.close();
	} catch (error) {
		app.log.error(error);
		process.exitCode = 1;
	}
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

try {
	await app.listen({ host, port: 3000 });
} catch (error) {
	app.log.error(error);
	process.exitCode = 1;
	await shutdown();
}
