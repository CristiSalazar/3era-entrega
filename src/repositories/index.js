import { Carts, Products, Tickets, Users } from "../dao/factory.js";

import CartRepository from "./Carts.repository.js";
import ProductRepository from "./Products.repository.js";
import UserRepository from "./Users.repository.js";
import TicketRepository from "./Tickets.repository.js";

export const cartService = new CartRepository(new Carts())
export const productService = new ProductRepository(new Products())
export const userService = new UserRepository(new Users())
export const ticketService = new TicketRepository(new Tickets())

//lis