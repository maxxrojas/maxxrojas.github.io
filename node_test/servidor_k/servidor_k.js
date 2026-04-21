//Escribe un comentario explicando para qué sirve http
// http es una biblioteca que permite crear servidores web para manejar solicitudes HTTP y enviar respuestas a clientes.
import http from "http";
//Escribe un comentario explicando para qué sirve fs
// filestream permite leer y escribir archivos en el servidor directamente desde el codigo.
import fs from "fs";

//Esta función deberá mostrar deberá mostrar una página HTML
//con la bienvenida a tu proyecto
function darBienvenida(req, res) {
    //Agrega lo mínimo necesario en bienvenida.html

    fs.readFile("bienvenida.html", "utf8", (error, data) => {
        if (error) {
            //Escribe qué significa el 500
            // el 500 significa un error interno en el servidor, osea que algo salio mal al procesar la solicitud del cliente
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Oh no!!!!");
            return;
        }
        //Escribe qué significa el 200
        // el 200 significa que la solicitud se ha procesado correctamente y se ha enviado una respuesta exitosa al cliente
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}

//Esta función deberá enviar un json con los datos de los usuarios
function getUsuarios(req, res) {
    //Esto representa un objeto JSON de un usuario
    //Agrega otro usuario
    const usuarios = [
        {
            nombre: "Punk",
            saldo: "0",
        },
        {
            nombre: "Chop",
            saldo: "100",
        },
    ];
    res.writeHead(200, { "Content-Type": "application/json" });

    //Escribe qué hace la función stringify y por qué la tenemos que usar
    // stringify convierte un objeto de JavaScript en una cadena JSON, lo cual es necesario para enviar datos estructurados a través de HTTP, ya que las respuestas HTTP deben ser texto plano.
    // res.end(JSON.stringify(mascotas));
    res.end(JSON.stringify(usuarios));
}

function mostrarPerfil(req, res) {
    fs.readFile("perfil.html", "utf8", (error, data) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Oh no!!!!");
            return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}

function mostrarMovimientos(req, res) {
    //Construye una página básica movimientos.html
    fs.readFile("movimientos.html", "utf8", (error, data) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Oh no!!!!");
            return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}

//Esta función deberá enviar un json con los datos de las movimientos
function getMovimientos(req, res) {
    //Tienes que corregir varias cosas en esta sección
    const movimientos = [
        {
            id: 1,
            tipo: "ingreso",
            monto: 150,
        },
        {
            id: 2,
            tipo: "egreso",
            monto: 100,
        },
    ];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(movimientos));
}

function manejarRuta404(req, res) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    //Cambia el mensaje por algo más divertido
    // res.end("Página no encontrada.");
    res.end("Oops! Estás perdido? Recuerda buscar páginas que si existan.");
}

function mostrarEquipo(req, res) {
    fs.readFile("equipo.html", "utf8", (error, data) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Oh no!!!!");
            return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}

function mostrarOpinion(req, res) {
    fs.readFile("opinion.html", "utf8", (error, data) => {
        if (error) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Oh no!!!!");
            return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}

//incluye el enlace a la documentación de createServer
// https://nodejs.org/api/http.html
const servidor = http.createServer((req, res) => {
    const url = req.url;

    if (url === "/") {
        darBienvenida(req, res);
    } else if (url === "/api/usuarios") {
        getUsuarios(req, res);
    } else if (url === "/api/movimientos") {
        getMovimientos(req, res);
    } else if (url === "/usuarios") {
        mostrarUsuarios(req, res);
    } else if (url === "/movimientos") {
        mostrarMovimientos(req, res);
    }
    //Agrega una ruta /equipo y su función correspondiente para que muestre el equipo del proyecto
    else if (url === "/equipo") {
        mostrarEquipo(req, res);
    }
    //Haz una página equipo.html correspondiente
    //Escribe el nombre completo y una cualidad que valores en esa persona de tu equipo
    //Trata de agregar una imagen a equipo.html
    //Explica si la puedes ver, en caso negativo ¿qué crees que pase?

    //Agrega una ruta /opinion
    else if (url === "/opinion") {
        mostrarOpinion(req, res);
    }
    //Haz una página opinion.html
    // Lee el siguiente artículo y responde ¿Crees que el colonialismo digital es un riesgo para tu carrera profesionl? ¿Para tu vida persona?
    //¿Qué es el freedombox?
    //https://www.aljazeera.com/opinions/2019/3/13/digital-colonialism-is-threatening-the-global-south
    else {
        manejarRuta404(req, res);
    }
});

const puerto = 1984;
servidor.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
});

//Importante
//En esta actividad deberás agregar en miarchivo.html un enlace a servidor.js y al resto de los html
