import express from "express";
import { greeting, create, fetch, update, deleteLog, getAverage} from "../controller/userController.js";

const route = express.Router();

route.get("/greeting", greeting);
route.get("/get-all-log", fetch);
route.get("/get-average", getAverage);
route.post("/create", create);
route.put("/update/:id", update);
route.delete("/delete/:id", deleteLog);

export default route;
