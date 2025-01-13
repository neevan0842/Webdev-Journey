import "dotenv/config";
import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

const morganFormat = ":method :url :status :response-time ms";
const app = express();
const port = process.env.PORT || 3000;
const teaData = [];
let id = 1;

app.use(express.json());

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/tea", (req, res) => {
  const { name, price } = req.body;
  const newData = {
    id: id++,
    name,
    price,
  };
  teaData.push(newData);
  res.status(201).send(newData);
});

app.get("/teas", (req, res) => {
  res.status(200).send(teaData);
});

app.get("/tea/:id", (req, res) => {
  const { id } = req.params;
  const tea = teaData.find((tea) => tea.id == id);
  if (tea) {
    res.status(200).send(tea);
  } else {
    res.status(404).send("Not Found");
  }
});

app.put("/tea/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const index = teaData.findIndex((tea) => tea.id == id);
  if (index !== -1) {
    teaData[index] = { id, name, price };
    res.status(200).send(teaData[index]);
  } else {
    res.status(404).send("Not Found");
  }
});

app.delete("/tea/:id", (req, res) => {
  const { id } = req.params;
  const idx = teaData.findIndex((tea) => tea.id == id);
  if (idx !== -1) {
    teaData.splice(idx, 1);
    res.status(204).send();
  } else {
    res.status(404).send("Not Found");
  }
});

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
