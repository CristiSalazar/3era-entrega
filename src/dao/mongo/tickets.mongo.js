import ticketsModel from './models/tickets.model.js'

export default class Tickets {
    constructor() {

    }

    get = async () => {
        let tickets = await ticketsModel.find()
        return tickets
    }
    addTicket = async (ticket) => {
        try {
            let result = await ticketsModel.create(ticket);
            return result
        } catch (error) {
            console.error("Error en la creación del ticket:", error);
        }
    }
}

//l