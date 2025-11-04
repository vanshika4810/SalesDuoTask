import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import asinRoutes from "./routes/asin.js";

const app = express();

app.use(
  cors({
    origin: `http://localhost:${process.env.CLIENT_PORT}`,
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/asin", asinRoutes);
app.get("/", (req, res) => res.send("SalesDuo Simplified API Running!"));
app.listen(process.env.SERVER_PORT, () =>
  console.log(
    `Server running on port ${process.env.SERVER_PORT} and client running on port ${process.env.CLIENT_PORT}`
  )
);

export default app;
