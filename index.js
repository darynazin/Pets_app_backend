import "./db/index.js";
import express from "express";
import errorHandler from "./middlewares/errorHandler.js";
import userRouter from "./routers/userRouter.js";
import cors from "cors";

const port = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("*", (req, res) => res.status(404).json({ error: "Not Found" }));
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
