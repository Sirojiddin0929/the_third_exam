import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";


import authRoutes from "./routes/auth.routes.js";
import booksRoutes from "./routes/books.routes.js";
import authorsRoutes from "./routes/authors.routes.js";
import borrowsRoutes from "./routes/borrows.routes.js";
import usersRoutes from "./routes/users.routes.js";

import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev")); 

app.use("/auth", authRoutes);
app.use("/books", booksRoutes);
app.use("/authors", authorsRoutes);
app.use("/borrows", borrowsRoutes);
app.use("/users", usersRoutes);


app.get("/", (req, res) => {
  res.json({ message: "LibraryManagementAPI is running " });
});


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

