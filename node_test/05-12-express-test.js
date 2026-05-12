// 12 de mayo 2026
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get("/bienvenida", (req, res) => {
    res.send("Esto no es una página html");
});

app.get("/otraBienvenida", (req, res) => {
    res.sendFile(path.join(__dirname, "bienvenida.html"));
});

app.listen(1984, () => {
    console.log("Up and up");
});
