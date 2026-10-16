import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../interfaces/api-error-response-interface';

export interface ApiErrorFallbacks {
    forbidden: string;
    notFound?: string;
    fallback: string;
}

/**
 * Builds a user-facing message from a failed API call. Prefers the backend's message and violations;
 * the fallbacks cover responses without an {@link ApiErrorResponse} body (e.g. from a proxy or gateway).
 */
export function apiErrorMessage(error: HttpErrorResponse, fallbacks: ApiErrorFallbacks): string {
    if (error.status === 0) {
        return 'De server is niet bereikbaar. Probeer het later opnieuw.';
    }

    const response = error.error as Partial<ApiErrorResponse> | null;
    const message = response?.message?.trim()
        || (error.status === 403 && fallbacks.forbidden)
        || (error.status === 404 && fallbacks.notFound)
        || fallbacks.fallback;
    const violations = (response?.violations ?? []).map(violation => `${violation.field}: ${violation.message}`);

    return [message, ...violations].join(' ');
}
