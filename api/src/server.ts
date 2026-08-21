import dotenv from "dotenv"

dotenv.config()

import app from "./app"

const PORT: number = parseInt(`${process.env.PORT}`)

app.listen(PORT, () => {
    const now = new Date().toLocaleString("pt-BR");

    console.log(`[${now}] Server started on http://localhost:${PORT}`);
});