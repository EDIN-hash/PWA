export const SERVER_URL = "http://localhost:3001";

export const fetchServerItems = async () => {
    const res = await fetch(`${SERVER_URL}/items`);
    return res.json();
};

export const syncItemToServer = async (item) => {
    const url = item.id ? `${SERVER_URL}/items/${item.id}` : `${SERVER_URL}/items`;
    const method = item.id ? "PUT" : "POST";
    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item)
    });
    return res.json();
};
