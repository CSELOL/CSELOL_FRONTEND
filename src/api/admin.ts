import { getAuthHeaders } from "@/lib/auth";

const API_URL = "http://localhost:3333/api";

// --- Types ---
export interface ActivityLog {
    id: number;
    action: string;
    actor_id: string | null;
    actor_nickname: string | null;
    actor_email: string | null;
    target_type: string | null;
    target_id: number | null;
    target_name: string | null;
    metadata: Record<string, any> | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
}

export interface ActivityLogsResponse {
    logs: ActivityLog[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
}

export interface ActivityLogsParams {
    action?: string;
    actorId?: string;
    targetType?: string;
    targetId?: number;
    startDate?: string;
    endDate?: string;
    search?: string;
    limit?: number;
    offset?: number;
}

// --- API Functions ---

export async function getActivityLogsAPI(params: ActivityLogsParams = {}): Promise<ActivityLogsResponse> {
    const headers = await getAuthHeaders();

    const queryParams = new URLSearchParams();
    if (params.action) queryParams.append("action", params.action);
    if (params.actorId) queryParams.append("actorId", params.actorId);
    if (params.targetType) queryParams.append("targetType", params.targetType);
    if (params.targetId) queryParams.append("targetId", String(params.targetId));
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.search) queryParams.append("search", params.search);
    if (params.limit) queryParams.append("limit", String(params.limit));
    if (params.offset) queryParams.append("offset", String(params.offset));

    const res = await fetch(`${API_URL}/admin/activity-logs?${queryParams.toString()}`, {
        headers,
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (res.status === 403) throw new Error("Forbidden - Admin access required");
    if (!res.ok) throw new Error("Failed to fetch activity logs");

    return res.json();
}

export async function getActivityLogActionsAPI(): Promise<string[]> {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_URL}/admin/activity-logs/actions`, {
        headers,
    });

    if (res.status === 401) throw new Error("Unauthorized");
    if (res.status === 403) throw new Error("Forbidden - Admin access required");
    if (!res.ok) throw new Error("Failed to fetch action types");

    return res.json();
}
