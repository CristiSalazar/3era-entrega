import {Router} from "express"
import CartManager from "../controllers/CartManager.js" 

const cartRouter = Router()
const carts = new CartManager

cartRouter.post("/", async(req, res) => {
    let newCart= req.body
    res.send(await carts.addCart(newCart))
})

cartRouter.get("/", async(req, res) => {
    res.send(await carts.getCarts())
})

cartRouter.get("/:id", async(req, res) => {
    res.send(await carts.getCartsById(req.params.id))
})

cartRouter.post("/:cid/products/:pid", async (req, res) =>{
    let cartId = req.params.cid
    let prodId = req.params.pid
    res.send(await carts.addProductInCart(cartId, prodId))
})

cartRouter.delete("/:cid/products/:pid", async (req, res) =>{
    let cartId = req.params.cid
    let prodId = req.params.pid
    res.send(await carts.removeProduct(cartId, prodId))
})

cartRouter.put("/:cid", async (req, res) =>{
    let cartId = req.params.cid
    let newProducts = req.body
    res.send(await carts.updateProductsInCart(cartId, newProducts))
})

cartRouter.put("/:cid/products/:pid", async (req, res) =>{
    let cartId = req.params.cid
    let prodId = req.params.pid
    let newProduct = req.body
    res.send(await carts.updateProduct(cartId, prodId, newProduct))
})

cartRouter.delete("/:cid", async(req,res) => {
    let cartId = req.params.cid
    res.send(await carts.removeAllProducts(cartId))
}) 

cartRouter.get("/population/:cid", async(req,res) =>{
    let cartId = req.params.cid
    res.send(await carts.getCartWithProducts(cartId))
})

export default cartRouter 