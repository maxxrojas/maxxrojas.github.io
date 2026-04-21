import http from "http";
import url from "url";

const phrases = {
    1: "The only way to do great work is to love what you do.",
    2: "Gradually, then suddenly.",
    3: "Innovation distinguishes between a leader and a follower.",
    4: "Life is what happens when you're busy making other plans.",
    5: "The future belongs to those who believe in the beauty of their dreams.",
};

const servidor = http.createServer((req, res) => {
    //console.log(req);
    const urlProcesada = url.parse(req.url, true);
    //console.log(urlProcesada);
    const queryParams = urlProcesada.query;
    console.log(queryParams.x);
    // console.log(queryParams.y);
    console.log("Alguien me mandó una solicitud");

    if (queryParams.json ?? 1) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                valorDeX: queryParams.x,
                phrase:
                    phrases[queryParams.x] ||
                    "No se encontró la frase para el valor de x proporcionado.",
            }),
        );
        return;
    }

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(
        `Valor de x: ${queryParams.x}\nPhrase: ${phrases[queryParams.x] || "No se encontró la frase para el valor de x proporcionado."}`,
    );
});

const puerto = 1984;

servidor.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
});
