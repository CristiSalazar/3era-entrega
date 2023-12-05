import CartDTO from "../dao/DTOs/cart.dto.js";
export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    getCarts = async () => {
        let result = await this.dao.get()
        return result
    }
    getAmount = async ({productos}) => {
        let result = await this.dao.getAmount({productos})
        return result
    }
    validateCart = async (id_cart) => {
        let result = await this.dao.getCart(id_cart)
        return result
    }
    validateStock = async ({productos}) => {
        let result = await this.dao.getStock({productos})
        return result
    }

    createCart = async (cart) => {
        let cartToInsert = new CartDTO(cart)
        let result = await this.dao.addCart(cartToInsert)
        return result
    }
}
//lis