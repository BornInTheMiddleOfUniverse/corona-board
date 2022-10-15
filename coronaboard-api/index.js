import express from "express";
import db from "./database";
import globalStatController from "./controller/global-stat.controller";
import keyValueController from "./controller/key-value.controller";

const launchServer = async () => {

  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Hello CoronaBoard!" });
  });
  console.log('gsc', globalStatController);
  app.get("/global-stats", globalStatController.getAll);
  app.post("/global-stats", globalStatController.insertOrUpdate);
  app.delete("/global-stats", globalStatController.remove);

  app.get("/key-value/:key", keyValueController.get);
  app.post("/key-value", keyValueController.insertOrUpdate);
  app.delete("/key-value/:key", keyValueController.remove);

  try {
    await db.sequelize.sync();
    console.log("Database is ready!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error);
    process.exit(1);
  }

  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
};

launchServer();
