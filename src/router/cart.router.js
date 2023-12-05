import { Router } from "express";
import CartDTO from "../dao/DTOs/cart.dto.js";
import TicketDTO from "../dao/DTOs/ticket.dto.js";
import { ticketService, cartService } from "../repositories/index.js";
import Carts from "../dao/mongo/carts.mongo.js";

const router = Router()

const cartMongo = new Carts()

router.get("/", async (req, res) => {
    let result = await cartMongo.get()
    res.send({ status: "success", payload: result })
})

router.post("/", async (req, res) => {
    let { products } = req.body

    let cart = new CartDTO({ products })
    console.log(cart)
    let result = await cartService.createCart(cart)
    console.log(result)
})
router.post("/:cid/purchase", async (req, res) => {
    try {
        let id_cart = req.params.cid;
        const productos = req.body.productos;
        const correo = req.body.correo;
        console.log(correo)
        let cart = cartService.validateCart(id_cart)
        if (!cart) {
            return { error: "No se encontró el carrito" };
        }
        let validaStock = cartService.validateStock({productos})

        if (validaStock) {
            let totalAmount = await cartService.getAmount({productos})
            const ticketFormat = new TicketDTO({amount:totalAmount, purchaser:correo});
            const result = await ticketService.createTicket(ticketFormat);
        } else {
            console.log("No hay suficiente stock");
        }
    } catch (error) {
        console.error("Error al procesar la compra:", error);
    }
})

export default router

//lis