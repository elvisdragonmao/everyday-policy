import { SystemStatus } from "../features/system-status/SystemStatus";

export function App() {
	return (
		<main className="mx-auto grid min-h-dvh max-w-3xl content-center gap-8 px-6 py-12 sm:px-12">
			<header className="grid gap-3">
				<h1 className="text-4xl font-bold sm:text-6xl">日常政策所</h1>
				<p className="text-2xl">Hello World</p>
			</header>
			<SystemStatus />
		</main>
	);
}
