# sportrip-app

Sportrip 的 Expo App MVP。這版先完成 Phase 1 骨幹，包含：

- Expo SDK 52 + TypeScript + NativeWind + Expo Router v4
- Design system 基底與核心 UI 元件
- Supabase client / schema / seed
- Email + 密碼登入註冊（Supabase Auth，未設 env 時採 strict demo mode）
- 5 個 Tab 主架構
- 公會列表 / 詳情 / 加入
- 活動列表 / 詳情 / 報名流程 mock
- 錢包首頁 stub + 最近交易

## 專案路徑

```bash
/Users/po22po22/.openclaw/workspace/projects/sportrip-app
```

## 安裝與啟動

```bash
npm install
npx expo start
```

Web export / serve:

```bash
npx expo export --platform web
npm run web:serve
```

其他驗證：

```bash
npx tsc --noEmit
npm run lint
```

## 環境變數

複製 `.env.example` 為 `.env`：

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### demo mode

如果沒設 Supabase env，app 仍可跑起來，會使用內建 demo data 與 strict demo auth。demo mode 只接受 README / login 頁列出的測試帳號，密碼固定為 `password123`。

## Supabase 設定步驟

1. 在 Supabase 建立新 project
2. 打開 SQL Editor，執行 `supabase/schema.sql`
3. 到 Authentication > Users 手動建立 3 個測試帳號，並把 UUID 改成 `supabase/seed.sql` 註解中那 3 組，或自行替換 seed 內的 UUID
4. 執行 `supabase/seed.sql`
5. 到 Project Settings > API 複製 URL 與 anon key，填進 `.env`
6. 重新跑 `npx expo start`

## 路由概覽

- `/(tabs)`：探索 / 公會 / 活動 / 錢包 / 我的
- `/auth/login`、`/auth/register`
- `/guild/[id]`
- `/activity/[id]`
- 其餘 `guild-admin`、`wallet/*`、`profile/*` 先保留 stub
- `platform-admin` 暫時只開放 Web，iOS / Android 不顯示入口且直接導向個人頁

## 專案結構

```bash
app/                 # Expo Router routes
components/          # UI components / shared blocks
lib/                 # hooks / supabase / state / types / theme
supabase/            # schema.sql / seed.sql
```

## 已知限制 / TODO

- 活動報名付款目前為 mock
- 錢包儲值與交易紀錄完整頁尚未完成
- 公會主後台目前為 stub
- 平台後台目前為 Web-only stub，原生 iOS / Android 不提供入口
- onboarding / 通知 / 搜尋保留路由但未完成
- 真正 production auth 建議補 email verification 與 password reset

## 設計對照

主要依據：

- `SUMMARY.md`
- `design-system/HANDOFF.md`
- `design-system/MASTER.md`
- `design-system/IA.md`
- wireframes 01~06

## 建議 QA 範圍

先測：

- Tab 導航是否正常
- login / register flow
- Guild list / detail / join button
- Activity list / detail / register mock
- 無 env 時 demo mode 是否可跑
- 有 env 時 Supabase list query 是否成功

先不要測：

- 金流
- 推播
- 公會主後台完整流程
- 平台管理後台原生流程（Web-only stub 先保留）
- 實名認證

## Zeabur / Web 部署

Web 版不能用純靜態 server 直接丟 `dist/`，因為 direct route 會 404。

必須使用 SPA fallback server，例如：

```bash
npx expo export --platform web
npx serve -s dist -l ${PORT:-3000}
```

如果用 Zeabur，請讓 build 階段跑 `npx expo export --platform web`，start 階段跑 `npm run web:serve`，或使用等效的 SPA rewrite / fallback 設定。
