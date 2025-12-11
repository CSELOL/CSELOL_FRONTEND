import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Format a date string or Date object to a localized date/time string.
 * Example output: "10/12/2024 às 23:45"
 */
export function formatDateTime(dateInput: string | Date): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) {
        return "-";
    }

    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

/**
 * Format a date string or Date object to a localized date string.
 * Example output: "10/12/2024"
 */
export function formatDate(dateInput: string | Date): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) {
        return "-";
    }

    return format(date, "dd/MM/yyyy", { locale: ptBR });
}

/**
 * Format a date string or Date object to a localized time string.
 * Example output: "23:45"
 */
export function formatTime(dateInput: string | Date): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) {
        return "-";
    }

    return format(date, "HH:mm", { locale: ptBR });
}

/**
 * Format a date in a relative way (e.g., "2 hours ago", "yesterday").
 * For PT-BR locale.
 */
export function formatRelative(dateInput: string | Date): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) {
        return "-";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "agora";
    if (diffMins < 60) return `há ${diffMins} min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays === 1) return "ontem";
    if (diffDays < 7) return `há ${diffDays} dias`;

    return formatDate(date);
}
