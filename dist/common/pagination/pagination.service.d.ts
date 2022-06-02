export declare class PaginationService {
    constructor();
    pagination(data: any, page: number): Promise<{
        page_lists: any;
        total_pages: number;
        current_page: number;
        previous_page: number;
        next_page: number;
        per_page: number;
        total_results: number;
    }>;
}
