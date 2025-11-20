import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import MainRouter from "./src/routes/index.js";
import  {errorHandler}  from "./src/middlewares/errorHandler.js"

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev")); 

app.use("/api",MainRouter);



app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

