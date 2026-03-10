export const PROJECT_STRUCTURE = {
    constants: {
        CATEGORIES: {
            ALL: ["Telewizory", "Lodowki", "Ekspresy", "Krzesla", "NM", "LADY", "Historia"],
            DEFAULT: "NM",
        },
        DEFAULT_MODAL_DATA: {
            name: "",
            quantity: "",
            ilosc: 1,
            description: "",
            photo_url: "",
            photo_url2: "",
            category: "NM",
            wysokosc: 0,
            szerokosc: 0,
            glebokosc: 0,
            dataWyjazdu: "",
            stoisko: "",
            stan: false,
            linknadysk: "",
        },
    },

    hooks: {
        USE_AUTH: "useAuth",
        USE_ITEMS: "useItems",
        USE_FILTERS: "useFilters",
    },

    components: {
        modals: {
            LOGIN: "LoginModal",
            REGISTER: "RegisterModal",
            ITEM: "ItemModal",
            GET_ID: "GetIdModal",
        },
        ui: {
            CATEGORY_TABS: "CategoryTabs",
            CONTROLS: "Controls",
            ITEMS_GRID: "ItemsGrid",
        },
    },

    roles: {
        ADMIN: "admin",
        MODER: "moder",
        SPECTATOR: "spectator",
    },

    filters: {
        STATUS_ALL: "all",
        STATUS_NA_STANIE: "na-stanie",
        STATUS_WYJECHALO: "wyjechalo",
    },

    sort: {
        DEFAULT_KEY: null,
        DEFAULT_DIRECTION: "asc",
    },

    storage: {
        USER_KEY: "inventoryUser",
        DARK_MODE_KEY: "darkMode",
    },
};

export const PATHS = {
    src: "/src",
    constants: "/src/constants",
    hooks: "/src/hooks",
    components: "/src/components",
    modals: "/src/components/modals",
    ui: "/src/components/ui",
};

export const FILE_NAMES = {
    constants: {
        CATEGORIES: "categories.js",
    },
    hooks: {
        USE_AUTH: "useAuth.js",
        USE_ITEMS: "useItems.js",
        USE_FILTERS: "useFilters.js",
    },
    components: {
        APP: "App.jsx",
        CARD: "Card.jsx",
        HISTORY_CARD: "HistoryCard.jsx",
        NEON_CLIENT: "neon-client.js",
        DEVICE_UTILS: "device-utils.js",
    },
    modals: {
        LOGIN: "LoginModal.jsx",
        REGISTER: "RegisterModal.jsx",
        ITEM: "ItemModal.jsx",
        GET_ID: "GetIdModal.jsx",
    },
    ui: {
        CATEGORY_TABS: "CategoryTabs.jsx",
        CONTROLS: "Controls.jsx",
        ITEMS_GRID: "ItemsGrid.jsx",
    },
};

export const SORT_KEYS = {
    WYSOKOSC: "wysokosc",
    SZEROKOSC: "szerokosc",
    GLEBOKOSC: "glebokosc",
    ILOSC: "ilosc",
};

export const CATEGORY_SPECIAL_FIELDS = {
    KRZESLA: {
        replaceField: { from: "wysokosc", to: "Ilosc wyjechala" },
        excludeFields: ["stan"],
    },
    LADY: {
        excludeFields: ["wysokosc", "szerokosc", "glebokosc", "ilosc"],
    },
};

export const TV_SIZE_DEFAULT = "55";

export const ID_FORMAT = {
    TEWIZORY: (size, number) => `TV${size}${String(number).padStart(3, "0")}`,
    LODOWKI: (number) => `L${String(number).padStart(3, "0")}`,
    EKSPESY: (number) => `E${String(number).padStart(3, "0")}`,
    KRZESLA: (number) => `K${String(number).padStart(3, "0")}`,
    NM: (number) => `NM${String(number).padStart(3, "0")}`,
    LADY: (number) => `A${String(number).padStart(3, "0")}`,
};

export default PROJECT_STRUCTURE;
