// Versión Express de servidor_k.
// express simplifica la creación de servidores web: rutas, middlewares y respuestas más limpias.
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// ES Modules no tiene __dirname por defecto, lo reconstruimos.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// express.static sirve archivos estáticos (imágenes, css, js, html) directamente
// desde la carpeta indicada. Así, cualquier archivo en esta carpeta se sirve
// automáticamente bajo su nombre (ej: /equipo.html, /imagen.png, etc.)
app.use(express.static(__dirname));

// ---------- Rutas HTML ----------
// GET / -> página de bienvenida
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "bienvenida.html"));
});

// GET /movimientos -> página de movimientos
app.get("/movimientos", (req, res) => {
    res.sendFile(path.join(__dirname, "movimientos.html"));
});

// GET /equipo -> página del equipo
app.get("/equipo", (req, res) => {
    res.sendFile(path.join(__dirname, "equipo.html"));
});

// GET /opinion -> página de opinión
app.get("/opinion", (req, res) => {
    res.sendFile(path.join(__dirname, "opinion.html"));
});

// ---------- Rutas JSON ----------
// GET /api/usuarios -> regresa lista de usuarios
app.get("/api/usuarios", (req, res) => {
    const usuarios = [
        { nombre: "Punk", saldo: "0" },
        { nombre: "Chop", saldo: "100" },
    ];
    // res.json() ya hace JSON.stringify y pone el Content-Type correcto.
    res.json(usuarios);
});

// GET /api/movimientos -> regresa lista de movimientos
app.get("/api/movimientos", (req, res) => {
    const movimientos = [
        { id: 1, tipo: "ingreso", monto: 150 },
        { id: 2, tipo: "egreso", monto: 100 },
    ];
    res.json(movimientos);
});

// ---------- 404 ----------
// Middleware final: si nada respondió antes, mandamos un 404 divertido.
app.use((req, res) => {
    res.status(404).send("Oops! Estás perdido? Recuerda buscar páginas que si existan.");
});

const puerto = 1984;
app.listen(puerto, () => {
    console.log(`Servidor Express escuchando en el puerto ${puerto}`);
});
