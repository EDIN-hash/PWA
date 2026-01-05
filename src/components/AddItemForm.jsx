import { useState } from "react";
import { TextField, Button } from "@mui/material";

export default function AddItemForm({ addItem }) {
    const [value, setValue] = useState("");

    function submit(e) {
        e.preventDefault();
        if (!value.trim()) return;
        addItem(value.trim());
        setValue("");
    }

    return (
        <form onSubmit={submit} style={{ display: "flex", gap: "10px" }}>
            <TextField
                label="Название"
                value={value}
                onChange={e => setValue(e.target.value)}
            />
            <Button type="submit" variant="contained">
                Добавить
            </Button>
        </form>
    );
}
