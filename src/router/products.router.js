import { Router } from "express";
import ProductDTO from "../dao/DTOs/product.dto.js";
import { productService } from "../repositories/index.js";
import Products from "../dao/mongo/products.mongo.js"

const router = Router()

const productMongo = new Products()

router.get("/", async (req, res) => {
    let result = await productMongo.get()
    res.send({ status: "success", payload: result })
})

router.post("/", async (req, res) => {
    let { description, price, stock} = req.body
    let prod = new ProductDTO({ description, price, stock})
    let result = await productService.createProduct(prod)
})

export default router
//lis