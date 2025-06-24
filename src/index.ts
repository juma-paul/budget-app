import "dotenv/config";
import { configs } from "./config/index.js";
import app from "./server.js";

app.listen(configs.port, () => {
  console.log(`App running on http://localhost:${configs.port}`);
});
