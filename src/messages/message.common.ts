export const MENU_ARRAY= ["inbox","sent","draft","starred","important"];
export const STATUS_ARRAY = ["important","starred", "read", "draft", "deleted"];

export const MENU =  {
    "inbox": 1,
    "starred": 2,
    "important": 3,
    "sent": 4,
    "drafts": 5
}

export const STATE = {
    "important": 1,
    "starred": 2,
    "read": 3,
    "draft": 4,
    "deleted": 5 
}

export const isValidMenuTables = (chosen_menu: string): boolean => MENU_ARRAY.includes(chosen_menu)

export const isValidMenu = (menu: string) => {
    const menu_keys = Object.keys(MENU);
    return menu_keys.includes(menu);
}

export const isValidStatus = (status: string)
    : boolean => STATUS_ARRAY.includes(status)
