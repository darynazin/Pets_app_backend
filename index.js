import "./db/index.js";
import express, { json }  from "express";
import usersRouter from "./routers/usersRouter.js";
import errorHandler from "./middleware/errorHandler.js";
import appointmentsRouter from "./routers/appointmentsRouter.js";
import doctorsRouter from "./routers/doctorsRouter.js";
import petsRouter from "./routers/petsRouter.js";
import uploadRouter from "./routers/uploadRouter.js";
import cookieParser from "cookie-parser";
import { authSession } from './utils/session.js';
import chatRouter from './routers/chatRouter.js';
import cors from "cors";
import { PORT, CLIENT_URL } from "./config/config.js";

const app = express();

if (!PORT || !CLIENT_URL) {
  console.error("Please provide PORT and CLIENT_URL");
  process.exit(1);
}

app.use(
  json({ limit: "50mb" }),
  cors({ origin: CLIENT_URL, credentials: true }),
  cookieParser()
);

app.use(authSession);
app.use(express.urlencoded({ extended: true }));
app.use("/users", usersRouter);
app.use("/doctors", doctorsRouter);
app.use("/pets", petsRouter);
app.use("/appointments", appointmentsRouter);
app.use("/upload", uploadRouter);
app.use('/api/v1/chat/completions', chatRouter);
app.use("*", (req, res) => res.status(404).json({ error: "Not Found" }));
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));