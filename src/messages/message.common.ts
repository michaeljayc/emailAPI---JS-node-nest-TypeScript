export const menu_tables = ["inbox","sent","drafts"];

export const Menu =  {
    "inbox": 1,
    "sent": 2,
    "drafts": 3,
    "starred": 4,
    "important": 5
}

export const STATE = {
    "starred": 1,
    "important": 2,
    "deleted": 3
}

export const isValidMenuTables = (menu: string): boolean => menu_tables.includes(menu)

export const isValidMenu = (menu: string) => {
    const menu_keys = Object.keys(Menu);
    return menu_keys.includes(menu);
}