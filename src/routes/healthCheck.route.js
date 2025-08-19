import {Router} from "express";
import {healthCheck} from "../controllers/healthcheck.controller.js";

const healthCheckRoute = Router()
healthCheckRoute.route("/healthCheck").get(healthCheck)
export default healthCheckRoute