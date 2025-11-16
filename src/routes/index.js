import {Router} from "express"
import { authRouter } from "./auth.routes.js"
import { userRouter } from "./user.routes.js"

const MainRouter=Router()

MainRouter.use("/auth",authRouter)
MainRouter.use("/user",userRouter)

export default MainRouter