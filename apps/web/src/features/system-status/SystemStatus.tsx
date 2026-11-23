import { PlayIcon } from "@phosphor-icons/react/dist/icons/Play";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getHealth, runCrawlerDryRun } from "./api";

export function SystemStatus() {
	const health = useQuery({
		queryKey: ["health"],
		queryFn: ({ signal }) => getHealth(signal),
		retry: false
	});
	const crawler = useMutation({ mutationFn: runCrawlerDryRun });

	let healthMessage = "正在檢查連線…";
	if (health.isError) {
		healthMessage = "無法連上 API";
	} else if (health.data) {
		healthMessage = health.data.status === "ok" ? "API 與資料庫已連線" : "資料庫連線異常";
	}

	return (
		<section aria-label="系統狀態" className="grid justify-items-start gap-4 border-t border-base-300 pt-6 text-lg">
			<p role="status">{healthMessage}</p>
			<button type="button" className="btn btn-neutral h-auto min-h-12 px-5 py-2 text-lg" disabled={crawler.isPending} onClick={() => crawler.mutate()}>
				<PlayIcon aria-hidden="true" size={20} />
				{crawler.isPending ? "正在試跑…" : "試跑爬蟲"}
			</button>
			<div role="status">
				{crawler.isSuccess && <p>試跑完成，擷取 {crawler.data.fetched} 筆資料。</p>}
				{crawler.isError && <p>試跑失敗，請再試一次。</p>}
			</div>
		</section>
	);
}
