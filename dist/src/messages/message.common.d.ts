export declare const MENU_ARRAY: string[];
export declare const STATUS_ARRAY: string[];
export declare const MENU: {
    inbox: number;
    starred: number;
    important: number;
    sent: number;
    drafts: number;
};
export declare const STATE: {
    important: number;
    starred: number;
    read: number;
    draft: number;
    deleted: number;
};
export declare const isValidMenuTables: (chosen_menu: string) => boolean;
export declare const isValidMenu: (menu: string) => boolean;
export declare const isValidStatus: (status: string) => boolean;
