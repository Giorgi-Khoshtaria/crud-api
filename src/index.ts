import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes"; // Ensure the path is correct
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/api", userRoutes);
app.use(cors());
// Handle unknown endpoints
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Global error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
