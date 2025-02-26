import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./config/db.js";
import userRoute from "./Routes/userRoute.js";
import taskRoute from "./Routes/taskRoute.js";
import { logger } from "./Middleware/logger.js";

dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

//Routes
app.use("/users", userRoute);
app.use("/tasks", taskRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));

export default app;
