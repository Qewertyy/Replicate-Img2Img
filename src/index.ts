import axios, { AxiosError } from 'axios';

const baseUrl = "https://paintbytext.chat";

async function generateImage(prompt: string, image: string) {
    const headers = {
        "Referer": baseUrl + "/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    };
    const session = axios.create({ headers: headers })
    const response = await session.post(
        baseUrl + "/api/predictions",
        { prompt: prompt, image: image }
    ).catch((err) => err);
    if (response instanceof AxiosError) {
        throw new Error(response.response?.data);
    };
    const data = response.data;
    const generationId = data.id
    let generationResponse = await axios.get(
        baseUrl + "/api/predictions/" + generationId
    ).catch((err) => err);
    if (response instanceof AxiosError) {
        throw new Error(generationResponse.response?.data);
    };
    let output;
    let tries = 0;
    while (generationResponse.data['status'] === "processing" && tries < 30) {
        generationResponse = await axios.get(
            baseUrl + "/api/predictions/" + generationId
        ).catch((err) => err);
        if (response instanceof AxiosError) {
            throw new Error(generationResponse.response?.data);
        };
        if ('completed_at' in generationResponse.data) {
            output = generationResponse.data;
            break;
        } else {
            tries++
            await new Promise(resolve => setTimeout(resolve, 10000)); // Sleep for 10 seconds
        };
    };
    return output;
};

generateImage("make his body black","https://graph.org/file/03b7199a3ee2b4058366b.jpg").then(console.log).catch(console.error)
// output: https://replicate.delivery/pbxt/JgEbKAAxhHKNExB7LX1ee2E3yewmnG3CS1MefC30ytF2aKVWC/out-0.png