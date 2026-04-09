# CLAUDE.md — NQuoc IT Operations Dashboard
# NQ-CLAUDE-IT-001 v1.0 · Tháng 4/2026
# Module: IT Ops Dashboard · team.nquoc.vn/it-ops
# Source docs: NQUOC-ARCH-003 · NQ-US-IT-NQUOC-001 · NQ-APICONTRACT-IT-001 · NhiLe_IT_BigPicture_Brief

---

## 1. Mục đích

IT Operations Dashboard là bàn kiểm soát cho IT Leader tại NhiLe Holdings — nhìn vào là thấy ngay ai đang làm gì, ai quá tải, task nào trễ; ra quyết định phân công, điều phối workload mà không cần họp. Deploy tại `team.nquoc.vn/it-ops`. Đây là Phase 1 của portal `team.nquoc.vn` — client-side only, không cần backend production để deliver P0+P1+P2.

---

## 2. Tech Stack

```
Frontend:   React + TypeScript + TailwindCSS
Mock layer: MSW (Mock Service Worker) — Phase 1
Deploy:     Vercel (SPA, không phải Next.js — không cần SEO, portal behind login)
Font:       Playfair Display (headings) + Inter (body)
Auth:       Supabase Auth SDK (Google OAuth) — dùng cho login/logout/refresh chỉ
API:        api.nquoc.vn — toàn bộ data đi qua đây, không gọi Supabase trực tiếp
```

**Không dùng:**
- Next.js (portal behind login, không cần SSR/SEO)
- Supabase client wrapper để query data
- Chart library nặng (sparkline dùng SVG inline 60×20px)

---

## 3. File Structure

```
nquoc-it-ops/
├── public/
│   └── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx                        # Router + auth guard
│   ├── types/
│   │   └── it.types.ts                # Tất cả TypeScript interfaces (xem Section 5)
│   ├── constants/
│   │   └── it.constants.ts            # STAGE_MAP, PRIORITY_MAP, REQUESTING_TEAMS, MAX_TASKS
│   ├── api/
│   │   └── it.api.ts                  # Fetch wrappers cho api.nquoc.vn/api/v1/it/*
│   ├── mocks/
│   │   ├── handlers/
│   │   │   ├── dashboard.handlers.ts
│   │   │   ├── tasks.handlers.ts
│   │   │   ├── members.handlers.ts
│   │   │   └── health.handlers.ts
│   │   ├── data/
│   │   │   ├── mock.tasks.ts
│   │   │   ├── mock.members.ts
│   │   │   └── mock.dashboard.ts
│   │   └── browser.ts                 # MSW setup
│   ├── hooks/
│   │   ├── useDashboard.ts
│   │   ├── useTasks.ts
│   │   ├── useMembers.ts
│   │   └── useTeamHealth.ts
│   ├── components/
│   │   ├── shared/
│   │   │   ├── Avatar.tsx             # Avatar 22px + initials + status dot
│   │   │   ├── LoadBar.tsx            # Load bar xanh/vàng/đỏ
│   │   │   ├── PriorityBadge.tsx      # P0/P1/P2/P3 badge
│   │   │   ├── StageBadge.tsx         # Stage pill
│   │   │   ├── Toast.tsx              # Undo snackbar 5 giây
│   │   │   ├── SkeletonLoader.tsx     # 3-line pulse skeleton
│   │   │   └── EmptyState.tsx         # Empty state với text
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx            # Nav: Dashboard / Tasks / Members / Health
│   │   │   └── PageHeader.tsx         # Page title + action buttons
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx           # Stat card với delta + sparkline tooltip
│   │   │   ├── PipelineStrip.tsx      # 5-stage clickable strip (US-ITDASH-001)
│   │   │   ├── QuickFilterBar.tsx     # 3 pills: Trễ / P0 / Burnout (US-ITDASH-002)
│   │   │   └── ActionItemList.tsx     # Grouped action items (US-ITDASH-004)
│   │   ├── tasks/
│   │   │   ├── KanbanBoard.tsx        # 4-column kanban (incoming/in_progress/in_review/needs_fix)
│   │   │   ├── KanbanColumn.tsx       # Column với drag-drop zone
│   │   │   ├── TaskCard.tsx           # Card với drag, assign button, review history
│   │   │   ├── AssignDropdown.tsx     # Dropdown chọn member + workload (US-ITTASK-002)
│   │   │   ├── MemberFilterChip.tsx   # Filter chip "👤 Tên [×]" (US-ITTASK-003)
│   │   │   └── ReviewHistory.tsx      # Expand timeline (US-ITTASK-004)
│   │   ├── members/
│   │   │   ├── MemberGrid.tsx         # 20-card grid
│   │   │   ├── MemberCard.tsx         # Card với hover quick action (US-ITMEM-004)
│   │   │   ├── MemberModal.tsx        # Detail modal + transfer task (US-ITMEM-003)
│   │   │   ├── MemberSearch.tsx       # Search input + highlight (US-ITMEM-001)
│   │   │   └── MemberSortDropdown.tsx # Sort by workload (US-ITMEM-002)
│   │   └── health/
│   │       ├── HealthCards.tsx        # 4 status cards: burnout/warn/idle/ok
│   │       ├── HealthTable.tsx        # Sortable/filterable table (US-ITHLT-003)
│   │       ├── AIPanel.tsx            # AI response HTML render (US-ITHLT-001)
│   │       ├── ExportButton.tsx       # PDF/Slack/Markdown export (US-ITHLT-002)
│   │       └── DispatchPanel.tsx      # AI auto-assign (US-ITHLT-004) — Phase 2
│   └── pages/
│       ├── DashboardPage.tsx
│       ├── TasksPage.tsx
│       ├── MembersPage.tsx
│       └── HealthPage.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vite.config.ts
```

---

## 4. Database Schema

> Phase 1 dùng MSW mock data. Schema bên dưới là source of truth để IT team build backend (api.nquoc.vn). Frontend không kết nối DB trực tiếp.

```sql
-- ============================================================
-- IT TASKS
-- ============================================================

CREATE TABLE it_tasks (
  id            TEXT PRIMARY KEY,                  -- format: 'IT-NNN', managed by sequence
  title         TEXT NOT NULL CHECK (length(title) >= 5 AND length(title) <= 200),
  description   TEXT NOT NULL DEFAULT '',
  priority_id   TEXT NOT NULL CHECK (priority_id IN ('p0','p1','p2','p3')),
  stage         TEXT NOT NULL DEFAULT 'incoming'
                  CHECK (stage IN ('incoming','in_progress','in_review','needs_fix','done')),
  due_date      DATE NOT NULL,
  requesting_team TEXT NOT NULL
                  CHECK (requesting_team IN ('Admin','Finance','HR','MKT','Security','WH','CRM','Infra','All')),
  revision_count  INTEGER NOT NULL DEFAULT 0,      -- tăng khi in_review → needs_fix (DB trigger)
  review_count    INTEGER NOT NULL DEFAULT 0,      -- tăng khi → in_review
  completed_at    TIMESTAMPTZ,                     -- set khi → done
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sequence cho task ID
CREATE SEQUENCE it_task_id_seq START 1;
-- Trigger: auto-generate IT-NNN
CREATE OR REPLACE FUNCTION generate_it_task_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.id := 'IT-' || LPAD(nextval('it_task_id_seq')::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER before_insert_it_tasks
  BEFORE INSERT ON it_tasks
  FOR EACH ROW EXECUTE FUNCTION generate_it_task_id();

-- Trigger: increment revision_count khi in_review → needs_fix
CREATE OR REPLACE FUNCTION increment_revision_count()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.stage = 'in_review' AND NEW.stage = 'needs_fix' THEN
    NEW.revision_count := OLD.revision_count + 1;
  END IF;
  IF NEW.stage = 'in_review' THEN
    NEW.review_count := OLD.review_count + 1;
  END IF;
  IF NEW.stage = 'done' AND OLD.stage != 'done' THEN
    NEW.completed_at := NOW();
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER before_update_it_tasks
  BEFORE UPDATE ON it_tasks
  FOR EACH ROW EXECUTE FUNCTION increment_revision_count();

-- ============================================================
-- IT TASK ASSIGNMENTS (append-only — không UPDATE/DELETE)
-- ============================================================

CREATE TABLE it_task_assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     TEXT NOT NULL REFERENCES it_tasks(id),
  member_id   UUID NOT NULL REFERENCES members(id),
  assigned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unassigned_at TIMESTAMPTZ              -- NULL = đang active
);

-- Index để tìm active assignment
CREATE INDEX idx_it_task_assignments_active
  ON it_task_assignments (task_id, member_id)
  WHERE unassigned_at IS NULL;

-- ============================================================
-- IT TASK STAGE EVENTS (append-only — immutable audit trail)
-- ============================================================

CREATE TABLE it_task_stage_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id         TEXT NOT NULL REFERENCES it_tasks(id),
  from_stage      TEXT CHECK (from_stage IN ('incoming','in_progress','in_review','needs_fix','done')),
  to_stage        TEXT NOT NULL CHECK (to_stage IN ('incoming','in_progress','in_review','needs_fix','done')),
  transitioned_by UUID NOT NULL REFERENCES members(id),
  note            TEXT,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: insert-only (không ai UPDATE/DELETE)
ALTER TABLE it_task_stage_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY it_task_stage_events_insert ON it_task_stage_events
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY it_task_stage_events_select ON it_task_stage_events
  FOR SELECT TO authenticated USING (true);

-- ============================================================
-- IT ACTIVITY LOG (append-only)
-- ============================================================

CREATE TABLE it_activity_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     TEXT REFERENCES it_tasks(id),
  member_id   UUID REFERENCES members(id),
  action      TEXT NOT NULL,              -- 'task_assigned', 'task_transferred', 'stage_changed'
  actor_id    UUID NOT NULL REFERENCES members(id),
  metadata    JSONB NOT NULL DEFAULT '{}',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- IT MEMBER WORKLOAD (computed / cached — refresh by cron)
-- ============================================================
-- NOTE: workload_status được tính từ it_tasks + it_task_assignments,
-- không lưu trực tiếp. Backend tính và trả về trong API response.

-- Thresholds (constants trong backend):
-- burnout = active_tasks >= 6 OR overdue >= 2 OR feedback_issues >= 3
-- warn    = active_tasks >= 4 (exp: 5, vibe: 3 → warn khi >= 80%)
-- idle    = active_tasks = 0 nhiều ngày liên tiếp
-- ok      = còn lại

-- ============================================================
-- IT NOTIFICATION PREFERENCES (Phase 2)
-- ============================================================

CREATE TABLE it_notification_preferences (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id             UUID NOT NULL UNIQUE REFERENCES members(id),
  telegram_enabled      BOOLEAN NOT NULL DEFAULT false,
  alert_scope           TEXT NOT NULL DEFAULT 'p0_only'
                          CHECK (alert_scope IN ('p0_only','p0_p1','all')),
  p0_threshold_minutes  INTEGER NOT NULL DEFAULT 30
                          CHECK (p0_threshold_minutes IN (15, 30, 60)),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- IT DISPATCH SESSIONS (Phase 2 — AI auto-assign)
-- ============================================================

CREATE TABLE it_dispatch_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by  UUID NOT NULL REFERENCES members(id),
  status      TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active','completed','expired')),
  summary_message TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE TABLE it_dispatch_suggestions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES it_dispatch_sessions(id),
  task_id         TEXT NOT NULL REFERENCES it_tasks(id),
  from_member_id  UUID NOT NULL REFERENCES members(id),
  to_member_id    UUID NOT NULL REFERENCES members(id),
  workload_impact JSONB NOT NULL,          -- {from_before, from_after, to_before, to_after}
  rationale       TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','applied','skipped')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### RLS Policies tóm tắt

```sql
-- it_tasks: it_leader, admin, owner có full CRUD
-- it_task_stage_events: INSERT-only cho authenticated
-- it_activity_log: INSERT-only cho authenticated, SELECT cho it_leader+
-- it_dispatch_sessions: it_leader tự tạo, admin/owner xem all
```

---

## 5. Types (TypeScript)

```typescript
// src/types/it.types.ts

// --- ENUMS ---

export type Stage = 'incoming' | 'in_progress' | 'in_review' | 'needs_fix' | 'done';
export type Priority = 'p0' | 'p1' | 'p2' | 'p3';
export type WorkloadStatus = 'idle' | 'ok' | 'warn' | 'burnout';
export type MemberType = 'exp' | 'vibe';
export type RequestingTeam = 'Admin' | 'Finance' | 'HR' | 'MKT' | 'Security' | 'WH' | 'CRM' | 'Infra' | 'All';
export type ActionItemType = 'overdue' | 'p0_unassigned' | 'burnout_risk';
export type Severity = 'critical' | 'high' | 'medium';
export type AlertScope = 'p0_only' | 'p0_p1' | 'all';
export type SuggestionStatus = 'pending' | 'applied' | 'skipped';
export type DispatchSessionStatus = 'active' | 'completed' | 'expired';

// --- MEMBER ---

export interface MemberBrief {
  id: string;                         // UUID
  full_name: string;
  avatar_url: string | null;
  member_type: MemberType;
  workload_status: WorkloadStatus;
  active_tasks_count: number;
}

export interface MemberWorkloadMetrics {
  active_tasks_count: number;
  overdue_count: number;
  revision_count: number;
  feedback_issues: number;
  idle_days: number;
  max_tasks_capacity: number;         // exp=5, vibe=3
}

export interface MemberDetail extends MemberBrief {
  metrics: MemberWorkloadMetrics;
  active_tasks: TaskBrief[];
}

// --- TASK ---

export interface TaskBrief {
  id: string;                         // format: 'IT-NNN'
  title: string;
  priority_id: Priority;
  stage: Stage;
  due_date: string;                   // 'YYYY-MM-DD'
  is_overdue: boolean;
  requesting_team: RequestingTeam;
  assignee: MemberBrief | null;
  revision_count: number;
  completed_at: string | null;        // ISO datetime
}

export interface TaskDetail extends TaskBrief {
  description: string;
  review_count: number;
  created_at: string;
  updated_at: string;
}

// --- STAGE EVENT ---

export interface StageEvent {
  id: string;                         // UUID
  from_stage: Stage | null;           // null khi task mới tạo
  to_stage: Stage;
  transitioned_by: MemberBrief;
  note: string | null;
  occurred_at: string;                // ISO datetime
}

// --- DASHBOARD ---

export interface StatCardDelta {
  value: number;
  is_positive_trend: boolean;
}

export interface WeeklyDataPoint {
  date: string;
  value: number;
}

export interface StatCard {
  metric_key: 'total_active' | 'overdue' | 'done_this_week' | 'burnout_members';
  label: string;
  value: number;
  unit: string | null;
  delta: StatCardDelta | null;
  weekly_history: WeeklyDataPoint[] | null;
}

export interface PipelineStageCount {
  stage_id: Stage;
  label: string;
  count: number;
  avg_days: number | null;
  is_terminal: boolean;
}

export interface ActionCounts {
  overdue: number;
  p0_unassigned: number;
  burnout_risk: number;
  total: number;
}

export interface DashboardSummary {
  stat_cards: StatCard[];             // luôn 4 items
  pipeline: PipelineStageCount[];     // luôn 5 items
  action_counts: ActionCounts;
  generated_at: string;
}

export interface ActionItem {
  type: ActionItemType;
  severity: Severity;
  description: string;
  task: TaskBrief | null;
  member: MemberBrief | null;
  created_at: string;
}

// --- HEALTH ---

export interface TeamHealthSummary {
  members: MemberDetail[];
  burnout_count: number;
  warn_count: number;
  idle_count: number;
  ok_count: number;
  generated_at: string;
}

// --- DISPATCH (Phase 2) ---

export interface WorkloadImpact {
  from_before: number;
  from_after: number;
  to_before: number;
  to_after: number;
}

export interface DispatchSuggestion {
  id: string;
  task: TaskBrief;
  from_member: MemberBrief;
  to_member: MemberBrief;
  workload_impact: WorkloadImpact;
  rationale: string;
  status: SuggestionStatus;
}

export interface DispatchSession {
  id: string;
  created_at: string;
  status: DispatchSessionStatus;
  suggestions: DispatchSuggestion[];
  summary_message: string | null;
}

// --- NOTIFICATION PREFERENCES (Phase 2) ---

export interface NotificationPreferences {
  telegram_enabled: boolean;
  alert_scope: AlertScope;
  p0_threshold_minutes: 15 | 30 | 60;
}

// --- API RESPONSE WRAPPERS ---

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown> | null;
  request_id: string;
  violations?: Array<{
    field: string;
    code: string;
    message: string;
  }>;
}

// --- UI STATE ---

export type QuickFilter = 'all' | 'overdue' | 'p0_unassigned' | 'burnout';
export type SortMode = 'urgency' | 'workload_desc' | 'workload_asc' | 'idle_first' | 'az';
export type HealthFilter = 'all' | 'burnout' | 'warn' | 'idle' | 'ok';
export interface HealthSort { col: string; dir: 'asc' | 'desc'; }
```

---

## 6. API Contracts

> Source of truth: `NQ-APICONTRACT-IT-001`. Tất cả endpoints prefix `https://api.nquoc.vn`. Auth: `Authorization: Bearer <supabase_jwt>`.

### State Machine — Stage Transitions

```
incoming → in_progress → in_review → done
                              ↓
                         needs_fix → in_progress
```

**Valid chỉ:** incoming→in_progress, in_progress→in_review, in_review→needs_fix, in_review→done, needs_fix→in_progress. Không có transition nào về `incoming`. `done` là terminal.

### Endpoint List

| Method | Path | Consumer | SLA p99 | Phase |
|--------|------|----------|---------|-------|
| GET | `/api/v1/it/dashboard/summary` | team IT Leader | 300ms | 1 |
| GET | `/api/v1/it/dashboard/actions?type=` | team IT Leader | 300ms | 1 |
| GET | `/api/v1/it/tasks?priority_id=&assignee_id=&unassigned_only=&requesting_team=` | team IT Leader | 300ms | 1 |
| POST | `/api/v1/it/tasks` | team IT Leader | 500ms | 1 |
| GET | `/api/v1/it/tasks/{id}` | team IT Leader | 300ms | 1 |
| PATCH | `/api/v1/it/tasks/{id}` | team IT Leader | 500ms | 1 |
| POST | `/api/v1/it/tasks/{id}/stage` | team IT Leader | 500ms | 1 |
| POST | `/api/v1/it/tasks/{id}/assign` | team IT Leader | 500ms | 1 |
| POST | `/api/v1/it/tasks/{id}/transfer` | team IT Leader | 500ms | 1 |
| GET | `/api/v1/it/tasks/{id}/history` | team IT Leader | 300ms | 1 |
| GET | `/api/v1/it/members?workload_status=` | team IT Leader | 300ms | 1 |
| GET | `/api/v1/it/members/{id}` | team IT Leader | 300ms | 1 |
| GET | `/api/v1/it/health/team` | team IT Leader | 500ms | 1 |
| POST | `/api/v1/it/dispatch/sessions` | team IT Leader | 2000ms | 2 |
| POST | `/api/v1/it/dispatch/sessions/{sid}/suggestions/{id}/apply` | team IT Leader | 500ms | 2 |
| GET | `/api/v1/it/notification-preferences` | team IT Leader | 300ms | 2 |
| PUT | `/api/v1/it/notification-preferences` | team IT Leader | 300ms | 2 |
| GET | `/api/v1/it/analytics/kpis?period=` | data Admin/Owner | 2000ms | 2 |
| POST | `/api/v1/internal/it/notify` | tbot (InternalApiKey) | 1000ms | 2 |

### Request/Response Shape Tóm tắt

**GET /dashboard/summary** → `{ data: DashboardSummary }` — cache 60s

**GET /dashboard/actions** → `{ data: ActionItem[] }` — cache 30s. Empty array = không có vấn đề (không 404).

**GET /tasks** → `{ data: { incoming: TaskBrief[], in_progress: TaskBrief[], in_review: TaskBrief[], needs_fix: TaskBrief[] }, total_active: number }` — không include `done` stage.

**POST /tasks** → body: `{ title, description?, priority_id, due_date, requesting_team }` → 201: `{ data: TaskDetail }` | 422: `DATE_IN_PAST`

**POST /tasks/{id}/stage** → body: `{ to_stage, note? }` → 200: `{ data: TaskDetail, event: StageEvent }` | 422: `INVALID_STAGE_TRANSITION` hoặc `TASK_ALREADY_DONE`

**POST /tasks/{id}/assign** → body: `{ member_id }` → 200: `{ data: TaskDetail, workload_warning? }` — không block khi burnout, chỉ cảnh báo | 409: `TASK_ALREADY_ASSIGNED`

**POST /tasks/{id}/transfer** → body: `{ to_member_id, reason? }` → 200: `{ data: TaskDetail, workload_impact }` | 409: `TASK_NOT_ASSIGNED` | 422: `TRANSFER_TO_SAME_MEMBER`

**GET /members** → `{ data: MemberDetail[], summary: { total, exp_count, vibe_count } }` — no pagination

**GET /health/team** → `{ data: TeamHealthSummary }` — cache 120s

### Error Format (tất cả errors)

```json
{
  "code": "INVALID_STAGE_TRANSITION",
  "message": "Không thể chuyển từ incoming sang done.",
  "request_id": "req_01HZ9ABCDEF",
  "violations": [{ "field": "to_stage", "code": "INVALID_TRANSITION", "message": "..." }]
}
```

Consumer dùng `code` để handle logic, không parse `message`.

---

## 7. Pages / Components Chi Tiết

### 7.1 DashboardPage (`/it-ops`)

**Layout:** Sidebar trái + main content. Main: 4 StatCards (top row) → PipelineStrip → QuickFilterBar → ActionItemList.

**StatCard component:**
- Props: `card: StatCard`
- Hiển thị: `label` (nhỏ, gray) + `value` (to, bold) + `unit` + `delta` (dòng nhỏ phía dưới)
- Delta: "+2 so với tuần trước" — đỏ nếu `is_positive_trend=false`, xanh nếu true
- Nếu `delta=null` → hiển thị "---" màu xám
- Hover → tooltip chứa SVG sparkline 60×20px từ `weekly_history` (inline SVG, không chart lib)
- `weekly_history=null` → không show sparkline tooltip

**PipelineStrip — US-ITDASH-001 (P0):**
- 5 stage buttons ngang: Chờ nhận → Đang làm → Chờ review → Cần sửa → Done
- Mỗi button: label + count badge
- Click → navigate đến TasksPage với filter active cho stage đó (URL param `?stage=in_progress`)
- Active stage: border sáng hơn + background đậm hơn
- Click lần 2 vào active → bỏ filter
- Hover → tooltip: số task + avg_days (từ `pipeline[i].avg_days`)
- Stage `done` style khác (terminal) — `is_terminal=true`

**QuickFilterBar — US-ITDASH-002 (P1):**
- 3 pills: "🔴 Trễ hôm nay (N)", "⚡ P0 chưa nhận (N)", "🔥 Burnout (N)"
- Count từ `action_counts` trong DashboardSummary
- Click pill → scroll xuống ActionItemList + filter chỉ hiện type tương ứng
- Pill active: highlight (đỏ/amber/blue)
- Click lần 2 → reset "Tất cả"
- Count=0 → pill vẫn hiện, disabled + tooltip "Không có vấn đề"
- State: `activeQuickFilter: 'all' | 'overdue' | 'p0_unassigned' | 'burnout'`

**ActionItemList — US-ITDASH-004 (P2):**
- 3 sections: "🔴 Trễ Deadline", "⚡ P0 Chưa Nhận", "🔥 Burnout Risk"
- Header: icon + label + count badge
- Section có items → mở sẵn; section rỗng → collapse sẵn
- Click header → toggle collapse/expand với CSS max-height transition
- Empty state per section: "✅ Không có vấn đề" — text xám italic
- collapsed state persist trong localStorage

---

### 7.2 TasksPage (`/it-ops/tasks`)

**Layout:** Filter bar (top) → KanbanBoard (4 columns).

**Filter bar:**
- Priority pills: Tất cả / P0 Khẩn / P1 Cao / P2 / P3
- Member avatar filter chip khi active (từ click avatar trên card)
- URL params: `?stage=` (từ Pipeline Strip click), `?priority_id=`

**KanbanBoard:**
- 4 columns: Chờ nhận / Đang làm / Chờ review / Cần sửa
- Mỗi column: header với stage label + count + column-level scroll
- `done` không hiển thị trong Kanban

**KanbanColumn:**
- HTML5 Drag & Drop: `ondragover`, `ondrop` per column container
- Drop zone highlight khi drag over (border dashed)

**TaskCard — US-ITTASK-001/002/003/004:**
- Drag handle: `draggable=true`, `ondragstart` → `dataTransfer.setData('taskId,fromCol')`
- Ghost semi-transparent khi đang kéo
- Drop → optimistic UI: card di chuyển ngay → gọi `POST /tasks/{id}/stage`
- Nếu API 422 (invalid transition) → revert card về vị trí cũ
- Undo snackbar: "Đã chuyển task → [Stage] [Hoàn tác]" — 5 giây
- Mobile: không drag, long-press → bottom sheet chọn cột (US-ITTASK-001)
- Card không kéo vào "Done" nếu revision chưa = 0 (business rule: checklist 100%) → tooltip warning

**Card layout:**
```
[Priority badge] [Stage badge]                    [revision badge nếu rv≥1]
[Title — max 2 lines]
[Due date — đỏ nếu overdue]  [Requesting team]
[Avatar assignee hoặc "+ Assign" button]          [▾ nếu rv≥2]
```

**AssignDropdown — US-ITTASK-002 (P0):**
- Xuất hiện khi hover card "Chưa nhận" (show "+ Assign" button)
- Click → floating dropdown absolute positioned dưới card
- List members sorted by workload asc (idle first, burnout last)
- Mỗi member: `full_name + "— N task (status)"`
- Burnout member: icon ⚠️ + text đỏ — vẫn chọn được nhưng có warning
- Không có member available → "Tất cả đang overload — xem Health"
- Click outside → close (`document.addEventListener('click', handler)`)
- Chọn member → gọi `POST /tasks/{id}/assign` → card update

**Avatar Filter — US-ITTASK-003 (P1):**
- Avatar 22px với initials + màu riêng per member
- Status dot: xanh=ok, đỏ pulse=burnout, xanh nhạt=idle
- Hover → tooltip: "Tên — N task đang chạy — [status]"
- Click → `memberFilter = memberId` → Kanban chỉ hiện task của người đó
- Filter chip xuất hiện: "👤 Tên [×]" — click × xóa filter

**ReviewHistory — US-ITTASK-004 (P2):**
- Chỉ hiện nếu `revision_count >= 2`
- Arrow "▾" góc phải card
- Click → expand timeline: "Lần 1 · 05/04 · Reviewer → needs_fix"
- Max 3 dòng inline, "Xem thêm (N)" nếu nhiều hơn
- CSS max-height: 0 → max-height: 200px — transition 200ms
- `toggleExpand(taskId)` → classList.toggle('open') — không re-render toàn Kanban

---

### 7.3 MembersPage (`/it-ops/members`)

**Layout:** Header "20 thành viên · 5 Experienced · 15 Vibe Coding" + Search + Sort → 20-card grid.

**MemberSearch — US-ITMEM-001 (P0):**
- Input top: placeholder "Tìm tên thành viên..."
- Filter realtime khi gõ (debounce 150ms)
- Highlight text khớp: wrap trong `<mark>` — yellow background
- Kết quả 0 → "Không tìm thấy [query] — thử tên khác"
- Clear button (×) khi có text
- Kết hợp với sort và workload_status filter: pipeline filterMembers() → sortMembers() → render

**MemberSortDropdown — US-ITMEM-002 (P1):**
- Dropdown góc phải: Workload cao→thấp / Workload thấp→cao / Idle trước / A–Z
- Default: urgency first (Burnout → Warn → OK → Idle)
- "Idle trước": idle members lên top, sorted by idle_days desc
- Sort chip hiện dưới dropdown: "↓ Workload cao trước [×]"
- `sortMode` persist khi chuyển tab

**MemberCard:**
- Avatar 22px + status dot
- Tên + role tag
- Load bar (active_tasks / max_tasks_capacity)
- Completion rate + metrics
- Hover trên burnout card → "📤 Chuyển task" button đỏ (US-ITMEM-004 P2)
- Hover trên idle card → "🎯 Giao task" button xanh (US-ITMEM-004 P2)
- "Có thể nhận thêm N task" khi hover
- Click card → mở MemberModal

**MemberModal — US-ITMEM-003 (P1):**
- Overlay modal, không navigate
- Header: Avatar + Tên + workload status + metrics summary
- Danh sách active tasks (TaskBrief rows)
- Mỗi task row: title + priority + stage + "→ Chuyển" button bên phải
- Click "→ Chuyển" → micro-dropdown chọn member available + workload
- Chọn → gọi `POST /tasks/{id}/transfer` → task biến khỏi list, workload bar update
- Toast confirm: "Đã chuyển [task] sang [member]" + undo 5 giây
- Undo: gọi lại transfer với from/to đảo ngược

---

### 7.4 HealthPage (`/it-ops/health`)

**Layout:** Export button (top right) → 4 HealthCards → AIPanel → HealthTable.

**HealthCards:**
- 4 cards: 🔥 Burnout (N) / ⚠️ Warn (N) / 😴 Idle (N) / ✅ OK (N)
- Data từ `TeamHealthSummary`: burnout_count, warn_count, idle_count, ok_count

**AIPanel — US-ITHLT-001 (P0):**
- AI response render HTML (`innerHTML`) — không dùng `textContent`
- Tên member wrap trong `<strong>` + màu (đỏ=burnout, xanh=ok, cam=warn)
- Số liệu highlight với background pill màu nhẹ
- Action items: numbered list với bullet ✅
- Loading: 3 `div.skeleton-line` với CSS animation pulse
- Data context: lấy từ `GET /health/team` → build prompt → gọi Claude API (Anthropic)
- `AI_ANSWERS` là object `{ html: string }` — render `answer.html` vào `#ai-bubble`

**ExportButton — US-ITHLT-002 (P1):**
- Button góc trên phải: "Export ▾"
- Dropdown: "📄 Export PDF" / "📋 Copy cho Slack" / "📊 Copy Markdown"
- PDF: `window.print()` — CSS `@media print` ẩn sidebar, nav, AI panel — chỉ hiện Health cards + table
- Slack: `buildSlackReport()` → `navigator.clipboard.writeText()` → toast confirm
- Markdown: `buildMarkdownReport()` → GFM table format → clipboard
- Footer mọi export: "Báo cáo tự động · NQuoc IT Dashboard · [timestamp]"

**HealthTable — US-ITHLT-003 (P2):**
- Columns: Tên / Task / Trễ / Review / Feedback / Status
- Click header → sort asc/desc với arrow indicator
- Filter chips phía trên: Tất cả / 🔥 Burnout / ⚠️ Warn / 😴 Idle / ✅ OK
- Burnout rows: left border đỏ 3px
- Row hover: background sáng hơn
- Click row → mở MemberModal (đồng bộ với Members page)
- State: `healthSort: { col, dir }` + `healthFilter: HealthFilter`

**DispatchPanel — US-ITHLT-004 (Phase 2):**
- Button "🔄 Điều phối ngay" dưới AI panel
- Click → `POST /dispatch/sessions` → AI generate plan
- Hiện suggestion cards: "Chuyển [task] từ [from] → [to] ([from]: N→M task, [to]: N→M task)"
- Mỗi suggestion: "✓ Áp dụng" + "✗ Bỏ qua"
- "Áp dụng tất cả" button cuối list
- Nếu `suggestions=[]` → "✅ Workload đang cân bằng — không cần điều phối"

---

## 8. Shared Components

| Component | Mô tả |
|-----------|-------|
| `Avatar` | 22px circle, initials từ tên, màu unique per member (hash), status dot (xanh/đỏ pulse/xanh nhạt) |
| `LoadBar` | Progress bar 0–100%, xanh ≤70%, vàng ≤90%, đỏ >90% |
| `PriorityBadge` | P0=đỏ, P1=cam, P2=vàng, P3=xám |
| `StageBadge` | Pill với label tiếng Việt per stage |
| `Toast` | Snackbar bottom center, auto-dismiss 5s, có slot "Hoàn tác" |
| `SkeletonLoader` | 3 dòng pulse animation, dùng khi AI loading |
| `EmptyState` | Icon + text, configurable message |

---

## 9. MSW Mock Strategy (Phase 1)

```typescript
// src/mocks/handlers/dashboard.handlers.ts
import { http, HttpResponse } from 'msw';
import { mockDashboardSummary, mockActionItems } from '../data/mock.dashboard';

export const dashboardHandlers = [
  http.get('https://api.nquoc.vn/api/v1/it/dashboard/summary', () =>
    HttpResponse.json({ data: mockDashboardSummary })
  ),
  http.get('https://api.nquoc.vn/api/v1/it/dashboard/actions', ({ request }) => {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const filtered = type
      ? mockActionItems.filter(a => a.type === type)
      : mockActionItems;
    return HttpResponse.json({ data: filtered });
  }),
];
```

**Mock data phải có:**
- 20 members với mix workload_status (2 burnout, 4 warn, 3 idle, 11 ok)
- 25+ tasks phân bổ qua 4 stages
- DashboardSummary với đủ 4 StatCards + 5 pipeline stages
- ActionItems: ít nhất 1 per type

**Enable real endpoint:** Xóa handler tương ứng trong MSW → code component không đổi.

---

## 10. Build Order (Sprints)

### Sprint 1 — Foundation + Data Layer
1. Vite + React + TypeScript + TailwindCSS setup
2. MSW install + browser.ts + handlers mock rỗng
3. `src/types/it.types.ts` — toàn bộ interfaces
4. `src/constants/it.constants.ts` — STAGE_MAP, PRIORITY_MAP labels tiếng Việt
5. `src/api/it.api.ts` — fetch wrappers với error handling
6. Mock data: members (20), tasks (25+), dashboard summary
7. Sidebar + Router (`/it-ops`, `/it-ops/tasks`, `/it-ops/members`, `/it-ops/health`)
8. Shared components: Avatar, LoadBar, PriorityBadge, StageBadge, Toast, EmptyState

### Sprint 2 — Dashboard (P0: ITDASH-001)
1. StatCard component (value + delta text, không cần sparkline yet)
2. PipelineStrip — clickable, navigate với URL param stage
3. ActionItemList — 3 sections, collapse/expand
4. DashboardPage layout hoàn chỉnh
5. QuickFilterBar pills với action_counts

### Sprint 3 — Tasks / Kanban (P0: ITTASK-001, ITTASK-002)
1. KanbanBoard + KanbanColumn layout
2. TaskCard — render fields, drag=false đầu
3. AssignDropdown — chọn member, gọi mock assign API
4. HTML5 Drag & Drop: optimistic UI + undo snackbar
5. Validate: không kéo vào Done nếu checklist chưa xong (blocking rule)

### Sprint 4 — Members (P0: ITMEM-001)
1. MemberGrid layout (20 cards)
2. MemberCard component
3. MemberSearch — realtime filter + highlight
4. MemberModal — danh sách tasks

### Sprint 5 — Health + AI Panel (P0: ITHLT-001)
1. HealthCards (4 status cards)
2. HealthTable cơ bản (render 20 rows)
3. AIPanel — structured HTML response + skeleton loader
4. ExportButton — PDF print + clipboard

### Sprint 6 — P1 Features
1. Avatar filter chips trên Kanban (ITTASK-003)
2. Member sort dropdown (ITMEM-002)
3. Transfer task từ MemberModal (ITMEM-003)
4. Export Slack + Markdown format (ITHLT-002 đầy đủ)
5. QuickFilterBar hoàn chỉnh với badge counts (ITDASH-002)

### Sprint 7 — P2 Features
1. StatCard sparkline tooltip SVG (ITDASH-003)
2. ReviewHistory expand/collapse trên TaskCard (ITTASK-004)
3. Hover quick assign/transfer trên MemberCard (ITMEM-004)
4. HealthTable sort + filter chips (ITHLT-003)
5. ActionItemList collapsible sections hoàn chỉnh (ITDASH-004)

### Sprint 8 — Phase 2 (Backlog)
- Dispatch AI session (ITHLT-004)
- Telegram notification preferences (ITHLT-005)
- Connect real `api.nquoc.vn` backend (thay MSW handlers từng endpoint)

---

## 11. Environment Variables

```env
# .env.local (Phase 1 — MSW, không cần backend)
VITE_API_BASE_URL=https://api.nquoc.vn
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=[anon_key]
VITE_USE_MSW=true

# .env.production (Phase 2 — real backend)
VITE_API_BASE_URL=https://api.nquoc.vn
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=[anon_key]
VITE_USE_MSW=false
VITE_ANTHROPIC_API_KEY=[key]   # cho AI Panel gọi Claude
```

---

## 12. Câu Lệnh Mở Đầu Claude Code

```
Đọc CLAUDE.md.

Build IT Operations Dashboard cho NQuoc (team.nquoc.vn/it-ops) theo đúng spec trong file này.
Bắt đầu Sprint 1: Foundation + Data Layer.

Yêu cầu:
- Vite + React + TypeScript + TailwindCSS
- MSW mock từ đầu (VITE_USE_MSW=true)
- Tạo đúng file structure trong Section 3
- Tạo đầy đủ types trong Section 5
- Mock data 20 members + 25 tasks + dashboard summary đủ thực tế để test UI

Tạo xong thì list ra tất cả file đã tạo.
Tôi confirm rồi mới qua Sprint 2.
```

---

## 13. Notes Quan Trọng Cho Developer

**Phase 1 = client-side only.** Tất cả P0+P1+P2 stories không cần backend production. MSW intercept toàn bộ API calls. Component code không đổi khi switch sang real backend.

**HTML prototype (`nquoc_it_leader_v2.html`) là source of truth giao diện.** Sẽ cập nhật xíu sau khi vibe coding. Component phải match sát prototype nhưng có thể nhận thay đổi visual — logic và data shape KHÔNG thay đổi.

**API contract (`NQ-APICONTRACT-IT-001`) là immutable.** Không thay đổi response shape, error codes, endpoint paths. Breaking change policy: tạo /v2/ endpoint mới.

**Architecture là immutable.** Frontend KHÔNG gọi Supabase để lấy data. Toàn bộ qua `api.nquoc.vn`. Supabase Auth SDK chỉ dùng cho login/logout/refresh.

**Burnout thresholds:** vibe coder (exp_type=vibe): max 3 tasks, burnout ≥ 3. Experienced dev (exp_type=exp): max 5 tasks, burnout ≥ 6 OR overdue ≥ 2 OR feedback_issues ≥ 3.

**Pending confirmations từ NQUOC-ARCH-003** (chưa có answer từ business owner — không block Phase 1):
1. Member có thể thuộc nhiều team không?
2. IT Ops + Leader Portal cùng domain hay tách?
3. Manager có cần analytics không?
4. Behavioral scoring tự động hay thủ công?
5. In-app notification ở member portal không?
6. Cross-domain login cần implement không?

---

*NQ-CLAUDE-IT-001 v1.0 · NhiLe Holdings · Tháng 4/2026*
*Source: NQUOC-ARCH-003 + NQ-US-IT-NQUOC-001 + NQ-APICONTRACT-IT-001 + NhiLe_IT_BigPicture_Brief*
*Build target: team.nquoc.vn/it-ops · Phase 1 client-side · MSW mock*
