import "./db/index.js";
import express from "express";
import usersRouter from "./routers/usersRouter.js";
import errorHandler from "./middleware/errorHandler.js";
import appointmentsRouter from "./routers/appointmentsRouter.js";
import doctorsRouter from "./routers/doctorsRouter.js";
import petsRouter from "./routers/petsRouter.js";
import uploadRouter from "./routers/uploadRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
}));
app.use(express.urlencoded({ extended: true }));
app.use("/users", usersRouter);
app.use("/doctors", doctorsRouter);
app.use("/pets", petsRouter);
app.use("/appointments", appointmentsRouter);
app.use("/upload", uploadRouter);
app.use("*", (req, res) => res.status(404).json({ error: "Not Found" }));
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
