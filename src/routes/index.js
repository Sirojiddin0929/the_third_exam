import {Router} from "express"
import { authRouter } from "./auth.routes.js"
import { userRouter } from "./user.routes.js"
import { authorRouter } from "./author.routes.js"
import { bookRouter } from "./book.routes.js"

const MainRouter=Router()

MainRouter.use("/auth",authRouter)
MainRouter.use("/user",userRouter)
MainRouter.use("/author",authorRouter)
MainRouter.use("/book",bookRouter)

export default MainRouter