import { app } from "./app.ts";
import { env } from "./config/env.ts";

app.listen(env.PORT, () => {
  console.log(`Konsulify API berjalan di http://localhost:${env.PORT}`);
});
