import http from "http";

// Uso de fetch para API de artistas
const apiUrl = "https://www.theaudiodb.com/api/v1/json/123/search.php?";

const getArtistData = async (artistName) => {
    const response = await fetch(`${apiUrl}s=${artistName}`);
    const data = await response.json();
    return data;
};

const artistName = "Adele";
const responseText = async () => {
    const data = await getArtistData(artistName);
    if (data.artists) {
        return `Artista: ${data.artists[0].strArtist}\nPagina web: ${data.artists[0].strWebsite}\nOrigen: ${data.artists[0].strCountry}\nBiografía: ${data.artists[0].strBiography}`;
    } else {
        return `El artista ${artistName} no fue encontrado.`;
    }
};

const servidor = http.createServer(async (req, res) => {
    console.log("Alguien me mandó una solicitud");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(await responseText());
});

const puerto = 1999;

servidor.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
    console.log(`Servidor en http://localhost:${puerto}`);
});
