import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";

export const app = express();

//configure cors
app.use(cors());

//configure body parser
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
