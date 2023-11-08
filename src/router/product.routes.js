import {Router} from "express"
import ProductManager from "../controllers/ProductManager.js" 

const prodRouter = Router()
const product = new ProductManager()

prodRouter.put("/:id", async (req, res) => {
    let id = req.params.id
    let updProd = req.body
    res.send(await product.updateProduct(id, updProd))
})

prodRouter.get("/:id", async (req, res) => {
    try{
        const prodId = req.params.id
        const productDetails = await product.getProductsById(prodId)
        res.render("viewDetails", {product: productDetails})
    } catch(error){
        console.error("error al obtener el producto", error)
        res.status(500).json({error: "error al obtener el producto"})
    }
})

prodRouter.post("/", async (req, res) => {
    let newProduct = req.body
    res.send(await product.addProduct(newProduct))
})



prodRouter.delete("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.deleteProducts(id))
}) 

export default prodRouter
