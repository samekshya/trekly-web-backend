import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

const startServer = async () => {
  await connectDB();

  const port = Number(env.PORT);

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer();
// import app from "./app";
// import { connectDB } from "./config/db";
// import { env } from "./config/env";

// const startServer = async () => {
//   await connectDB();

//   app.listen(env.PORT, () => {
//     console.log(`Server running on http://localhost:${env.PORT}`);
//   });
// };

// startServer();
