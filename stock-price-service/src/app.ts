import express from "express";
import actuator from "express-actuator";

const port = process.env.PORT || 3001;

const app = express();

app.use(actuator());

app.use(express.urlencoded({ extended: true }));


app.get("/information", (req: Request, res: {json: (arg: {version: string}) => void}) => {
  const message = {'version': '0.0.1'};
  return res.json(message);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});