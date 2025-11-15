import {Router} from "express"
import { authRouter } from "./auth.routes.js"

const MainRouter=Router()

MainRouter.use("/auth",authRouter)

export default MainRouter