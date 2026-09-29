export interface PaginationMeta {
    page: number;
    limit: number;
    perPage?: number;
    total: number;
    totalPages: number;
}

export interface ResponseMeta {
    timestamp: string;
    pagination?: PaginationMeta;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T | null;
    meta?: ResponseMeta;
}