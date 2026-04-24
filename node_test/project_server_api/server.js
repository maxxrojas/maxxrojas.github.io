// Servidor HTTP de prueba para una extensión de Chrome (Kueski)
// Expone 6 endpoints con mock data para simular la API que consumiría la extensión.
import http from "http";

// ---------- Mock data ----------
const merchants = [
    { id: 1, name: "Amazon", url: "amazon.com.mx", domSelector: "#buy-now-button" },
    { id: 2, name: "Mercado Libre", url: "mercadolibre.com.mx", domSelector: ".andes-button--loud" },
    { id: 3, name: "Liverpool", url: "liverpool.com.mx", domSelector: "#btnAgregarBolsa" },
    { id: 4, name: "Walmart", url: "walmart.com.mx", domSelector: "button[data-automation-id='add-to-cart']" },
];

const users = [
    { id: 1, nombre: "Max Rojas", email: "max@example.com", telefono: "5555555555" },
    { id: 2, nombre: "Ana López", email: "ana@example.com", telefono: "5544443333" },
];

const balances = {
    1: { userId: 1, creditoTotal: 10000, creditoUtilizadoPrestamo: 2000, creditoUtilizadoBNPL: 2000, creditoDisponible: 6000 },
    2: { userId: 2, creditoTotal: 5000, creditoUtilizadoPrestamo: 1000, creditoUtilizadoBNPL: 0, creditoDisponible: 4000 },
};

const offers = [
    { id: 1, titulo: "0% comisión en tu primera compra BNPL", vigencia: "2026-05-31" },
    { id: 2, titulo: "Hasta 12 MSI en Amazon", vigencia: "2026-06-30" },
];

const credits = {
    1: [
        { id: 101, tipo: "prestamo", monto: 2000, fechaPago: "2026-05-15", pagado: false },
        { id: 102, tipo: "bnpl", monto: 2000, fechaPago: "2026-05-01", pagado: false },
    ],
    2: [
        { id: 201, tipo: "prestamo", monto: 1000, fechaPago: "2026-05-20", pagado: false },
    ],
};

// ---------- Helpers ----------
function sendJSON(res, status, data) {
    res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.end(JSON.stringify(data));
}

// ---------- Endpoints ----------
// GET /merchants?url=amazon.com.mx  -> filtra si hay url, sino regresa todos
function getMerchants(req, res, params) {
    const url = params.get("url");
    if (url) {
        const filtrados = merchants.filter((m) => m.url === url);
        return sendJSON(res, 200, filtrados);
    }
    sendJSON(res, 200, merchants);
}

// GET /balance?userId=1
function getBalance(req, res, params) {
    const userId = Number(params.get("userId"));
    const balance = balances[userId];
    if (!balance) return sendJSON(res, 404, { error: "Usuario no encontrado" });
    sendJSON(res, 200, balance);
}

// GET /user?id=1
function getUser(req, res, params) {
    const id = Number(params.get("id"));
    const user = users.find((u) => u.id === id);
    if (!user) return sendJSON(res, 404, { error: "Usuario no encontrado" });
    sendJSON(res, 200, user);
}

// GET /offers
function getOffers(req, res) {
    sendJSON(res, 200, offers);
}

// GET /credits?userId=1
function getCredits(req, res, params) {
    const userId = Number(params.get("userId"));
    const lista = credits[userId] || [];
    sendJSON(res, 200, { userId, prestamos: lista });
}

// GET /checkbnpl?precio=1500
// Regresa las opciones de pago con comisión aplicada
function checkBNPL(req, res, params) {
    const precio = Number(params.get("precio"));
    if (!precio || precio <= 0) return sendJSON(res, 400, { error: "Precio inválido" });

    const planes = [
        { quincenas: 2, comision: 0.00 },
        { quincenas: 4, comision: 0.05 },
        { quincenas: 6, comision: 0.08 },
    ];

    const opciones = planes.map((p) => {
        const total = precio * (1 + p.comision);
        return {
            quincenas: p.quincenas,
            comision: p.comision,
            totalAPagar: Number(total.toFixed(2)),
            pagoPorQuincena: Number((total / p.quincenas).toFixed(2)),
        };
    });

    sendJSON(res, 200, { precio, opciones });
}

function manejarRuta404(req, res) {
    sendJSON(res, 404, { error: "Ruta no encontrada" });
}

// ---------- Server ----------
const servidor = http.createServer((req, res) => {
    const fullUrl = new URL(req.url, `http://${req.headers.host}`);
    const path = fullUrl.pathname;
    const params = fullUrl.searchParams;

    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
        });
        return res.end();
    }

    if (path === "/merchants") return getMerchants(req, res, params);
    if (path === "/balance") return getBalance(req, res, params);
    if (path === "/user") return getUser(req, res, params);
    if (path === "/offers") return getOffers(req, res);
    if (path === "/credits") return getCredits(req, res, params);
    if (path === "/checkbnpl") return checkBNPL(req, res, params);

    manejarRuta404(req, res);
});

const puerto = 1985;
servidor.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
});
