interface ApiErrorResponse {
    additionalInfo: string;
    causedBy: string[];
    code: number
    error: boolean;
    internalError: boolean;
    message: string;
    timestamp: number
}

export { ApiErrorResponse };
