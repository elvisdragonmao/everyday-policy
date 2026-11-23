# 日常政策所

多媒體與人機互動總整與實作。這個版本提供 Hello World 首頁、資料庫連線檢查和爬蟲試跑。

## 本機開發

使用 Node.js 24.15.0、根目錄指定的 pnpm 版本，以及 Docker Compose。

```sh
cp .env.example .env
pnpm install --frozen-lockfile
docker compose -p everyday-policy-dev run --rm --publish 127.0.0.1:5432:5432 db
```

等 PostgreSQL 顯示可接受連線後，另開終端機執行以下指令。

```sh
pnpm dev
```

開啟 [localhost:5173](http://localhost:5173)。Vite 會將 `/api` 轉發到 Fastify（連接埠 3000）。若 PostgreSQL 的 5432 已被占用，修改 `--publish` 的主機連接埠及 `.env` 的 `PGPORT`。

```sh
pnpm format:check
pnpm build
pnpm crawl:dry-run
```

首頁的「試跑爬蟲」與 `pnpm crawl:dry-run` 共用同一個入口。試跑固定回傳空跑結果，不發送外部請求或寫入資料庫。`GET /api/health` 會透過 PostgreSQL 執行 `SELECT 1`，連線異常時回傳 HTTP 503。

若要在本機驗證正式映像，先停止 `pnpm dev`，再執行以下指令，開啟 [localhost:3000](http://localhost:3000)。

```sh
docker compose run --rm --build --publish 127.0.0.1:3000:3000 app
```

本機與 Dokploy 共用 `compose.yaml`。本機指令只將指定連接埠綁到 `127.0.0.1`，Dokploy 透過網域設定直接連到容器。

## Dokploy 部署

1. 建立 **Docker Compose** 服務，來源選 GitHub 儲存庫，分支選 `main`，Compose 檔案指定根目錄的 `compose.yaml`。
2. 開啟 **Isolated Deployments**，讓 `app` 與 `db` 使用此部署的網路。在 **Environment** 設定正式用的 `POSTGRES_PASSWORD`。
3. 在 **Domains** 將網域綁定服務 `app`，容器連接埠填 `3000`，路徑填 `/`，並設定 HTTPS。
4. 開啟 **Auto Deploy** 並執行首次部署。之後 GitHub 推送至 `main` 時，Dokploy 會從儲存庫重新建置。部署完成後，可開啟首頁並檢查 `/api/health`。

Fastify 在同一個網域提供 React 靜態檔案與 API。PostgreSQL 只透過容器網路供應用程式存取，資料存放在 Compose 的 `postgres_data` volume。

[Dokploy Compose](https://docs.dokploy.com/docs/core/docker-compose) · [網域設定](https://docs.dokploy.com/docs/core/docker-compose/domains) · [自動部署](https://docs.dokploy.com/docs/core/auto-deploy)

## 專案結構

```text
apps/
  web/src/
    app/                 React 入口與全域樣式
    features/            依功能放置畫面、請求與介面狀態
  api/src/
    db/                  PostgreSQL 連線池
    features/            依功能放置 Fastify 路由與服務
packages/
  contracts/             前後端共用的 Zod schema 與型別
  crawler/               獨立的爬蟲入口，供 CLI 與 API 呼叫
```

前端以 Vite 建置，使用 React、TanStack Query、Phosphor Icons、Tailwind CSS、daisyUI 和 TypeScript。已安裝 Zustand，後續有跨元件的介面狀態時可使用。API 採用 Fastify，透過 `pg` 連接 PostgreSQL。

### 產品功能的分工

- **困擾描述與澄清**收納語音、文字輸入和選擇題，產出可用於找政策的查詢條件。
- **政策分析**以具體公共政策為閱讀與連結單位。議題背景交代政策處理的問題。民意、各方主張、客觀統計與立法表決各自標明來源與統計範圍。
- **方案與文件**呈現現行方案、進度、立法程序、法規、新聞及會議紀錄。相關政策連到其他具體政策。
- **政策資料擷取**由 `packages/crawler` 維護來源與解析。實際收錄時保留來源網址、擷取時間和原始文件位置。若日後開放網頁觸發實際擷取，由有權限的 API 排入背景工作。
