import { CorsOptions } from "cors";
import { env } from "./env.config";

export const corsOptions: CorsOptions = {
  origin: env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
