export type CommonResponse<T> = {
    status: string;
    message: string;
    data: T;
    code: number;
};