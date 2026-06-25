import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { corsOptions } from "@/config/cors.config";
import webRouter from "@/routes";
import { env } from "@/config/env.config";
import { errorHandler, notFoundHandler } from "@/middlewares/error.middleware";
import { prisma } from "./config/db.config";
import main from "@/data/seed";

export const app = express();

// let x = 0;
// if (x === 0) {
//   main()
//     .catch(console.error)
//     .finally(async () => {
//       await prisma.$disconnect();
//     });
//   x++;
// }

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

webRouter(app);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
});
