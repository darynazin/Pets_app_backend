import "./db/index.js";
import express from "express";
import usersRouter from "./routers/usersRouter.js";
import errorHandler from "./middleware/errorHandler.js";
import appointmentsRouter from "./routers/appointmentsRouter.js";
import doctorsRouter from "./routers/doctorsRouter.js";
import petsRouter from "./routers/petsRouter.js";
import cors from "cors";

const port = process.env.PORT || 3000;

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", usersRouter);
app.use("/doctors", doctorsRouter);
app.use("/pets", petsRouter);
app.use("/appointments", appointmentsRouter);
app.use("*", (req, res) => res.status(404).json({ error: "Not Found" }));
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
