import { Router } from "express";
import TicketDTO from "../dao/DTOs/ticket.dto.js";
import { ticketService } from "../repositories/index.js";
import Tickets from "../dao/mongo/tickets.mongo.js"

const router = Router()

const ticketMongo = new Tickets()

router.get("/", async (req, res) => {
    let result = await ticketMongo.get()
    res.send({ status: "success", payload: result })
})

router.post("/", async (req, res) => {
    let { amount, purchaser } = req.body
    let tick = new TicketDTO({ amount, purchaser })
    let result = await ticketService.createTicket(tick)
})

export default router

//lis