export const categories = ["Telewizory", "Lodowki", "Ekspresy", "Krzesla", "NM", "LADY", "Historia"];

export const defaultModalData = {
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
};

export const getCategoriesForRole = (role) => {
    if (role === 'moder') {
        return categories;
    }
    return categories.filter(cat => cat !== 'Historia');
};
