import express from "express";
import dotenv from "dotenv";
import videoRoutes from "./routes/videoRoutes.js";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware

app.use(express.json());
app.use(cors());

// Routes

app.use("/videos", videoRoutes);

app.listen(PORT, () => {
  console.log(`Server connected on PORT ${PORT}`);
});
