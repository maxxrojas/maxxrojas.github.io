import http from "http";

// Uso de fetch para API de artistas
const geminiApiKey = process.env.GEMINI_API_KEY;
const modelId = "gemma-4-31b-it";
const generateContentApi = "generateContent";
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:${generateContentApi}?key=${geminiApiKey}`;

const jsonRequest = (param) => ({
    contents: [
        {
            role: "user",
            parts: [
                {
                    text: "Give me 3 small funny funny phrases about " + param,
                },
            ],
        },
    ],
    generationConfig: {
        thinkingConfig: {
            thinkingLevel: "MINIMAL",
        },
        responseMimeType: "application/json",
        responseSchema: {
            type: "object",
            properties: {
                response: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
            required: ["response"],
            propertyOrdering: ["response"],
        },
    },
});

const getFunnyPhrases = async (topic) => {
    const response = await fetch(geminiApiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonRequest(topic)),
    });

    const data = await response.json();
    if (data.candidates) {
        return data.candidates[0].content.parts[0];
    }
    return data;
};

const getFunnyPhrasesList = async (topic) => {
    const data = await getFunnyPhrases(topic);
    let phrases = "";
    for (const phrase of data.response) {
        phrases += `${phrase}\n`;
    }
    return phrases;
};

const servidor = http.createServer(async (req, res) => {
    const parts = req.url.split("/");

    let topic;
    if (parts[1] && !parts[1].includes(".")) {
        topic = parts[1];
    } else {
        topic = "world";
    }

    console.log(`Topic is: ${topic}`);
    console.log("Alguien me mandó una solicitud");

    const data = await getFunnyPhrases(topic);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ topic, ...data }));
});

const puerto = 1999;

servidor.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
    console.log(`Servidor en http://localhost:${puerto}`);
});
