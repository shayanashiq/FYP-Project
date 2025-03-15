class ApiError extends Error {
    public status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }

    static unauthorized(message: string) {
        return new ApiError(message, 404);
    }

    static notFound(message: string) {
        return new ApiError(message, 404);
    }

    static internal(message: string) {
        return new ApiError(message, 500);
    }
}


export default ApiError;