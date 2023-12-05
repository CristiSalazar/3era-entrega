import { Router } from "express";
import UserDTO from "../dao/DTOs/user.dto.js";
import { userService } from "../repositories/index.js";
import Users from "../dao/mongo/users.mongo.js"

const router = Router()

const usersMongo = new Users()

router.get("/", async (req, res) => {
    let result = await usersMongo.get()
    res.send({ status: "success", payload: result })
})

router.post("/", async (req, res) => {
    let { first_name, last_name, email, age, password, rol } = req.body

    let user = new UserDTO({ first_name, last_name, email, age, password, rol })
    console.log(user)
    let result = await userService.createUser(user)
    console.log(result)
})

export default router
//lis