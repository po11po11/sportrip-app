# CHANGELOG

## Phase 1

### 完成
- 初始化 Expo SDK 52 + TypeScript + Expo Router v4 + NativeWind 架構
- 建立 design tokens、theme hook、字型載入
- 建立核心元件：Button / Input / Card / Header / TabBar / Avatar / Badge / Divider / Skeleton / SearchBar / EmptyState
- 建立 Supabase client、service layer、React Query hooks、Auth store
- 完成 Email + 密碼登入註冊流程
- 完成 5 個 Tab 主頁骨架
- 完成公會列表 / 公會詳情 / 加入公會
- 完成活動列表 / 活動詳情 / 報名流程 mock
- 完成錢包首頁 stub + 最近交易
- 補 `supabase/schema.sql` 與 `supabase/seed.sql`
- 補 README、`.env.example`、ESLint 設定

### 延後到 Phase 2
- Stripe / 真實金流
- 推播通知
- 公會主後台完整功能
- 平台管理後台
- 實名認證
- 徽章 / 成就系統完整 UI
- 搜尋 / onboarding 完整流程

### 需要宥騫決策
- 正式 Supabase project 的 URL / anon key
- Auth seed 要不要固定指定 UUID，或改成先手動註冊再同步 profile
- 金流最終走 Stripe、LINE Pay，還是內建錢包優先
- 公會加入要不要做審核制，這版先直接 join

### TODO 註記
- demo mode 為了讓 app 在未配置 Supabase 時也能跑，正式上線前要改以真實環境為主
- Activity register 目前只有 mock CTA，尚未真的寫入 `event_registrations`
- Wallet topup/history/withdraw 仍是 stub
