import express from "express"
import { SearchwithAi } from "../controllers/search.Controller.js";

const searchRoutes = express.Router();
searchRoutes.get("/search-ai" ,SearchwithAi)

export default searchRoutes;