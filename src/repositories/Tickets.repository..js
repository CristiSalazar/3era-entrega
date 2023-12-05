import TicketDTO from "../dao/DTOs/ticket.dto.js";

export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    getTickets = async () => {
        let result = await this.dao.get()
        return result
    }

    createTicket = async (ticket) => {
        let ticketToInsert = new TicketDTO(ticket)
        let result = await this.dao.addTicket(ticketToInsert)
        return result
    }
}

//lis