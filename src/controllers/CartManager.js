import { cartsModel } from "../models/carts.models.js"
import ProductManager from "./ProductManager.js"

const allProducts = new ProductManager()

class CartManager extends cartsModel {
    constructor() {
        super() 
    }

    async getCarts(){
        try{
            const carts = await CartManager.find({})
            .populate({
                path: "products.productId",
                model: "products",
                select: "title description price stock",
            })
            return carts
        } catch(error){
            console.error("Error al obtener carros", error)
            return[]
        }
    }

    async addCart(){
        try{
            await cartsModel.create(cartData)
            return "Carrito agregado"
        } catch(error){
            console.error("Error al agregar el carrito", error)
            return "Error al agragar el carrito"
        }
    }

    async removeProduct(cartId, prodId){
        try{
            const cart = await cartsModel.findById(cartId)
                if(!cart){
                    return "Carrito no encontrado"
                }
                const prodIndex = cart.products.findIndex((product)=>product.productId === prodId)
                if(prodIndex !== -1){
                    cart.products.splice(prodIndex, 1)
                    await cart.save()
                    return "Producto eliminado del carrito"
                }else {
                    return "producto no encontrado en el carrito"
                }
            }catch(error){
                console.error("Error al eliminar producto del carrito", error)
            }
        } 
    
    async updateProduct(cartId, newProducts){
        try{
            const cart = await cartsModel.findById(cartId)
                if(!cart){
                    return "Carrito no encontrado"
                }
                cart.products = newProducts
                await cart.save()
                return "Carrito actualizado"
            }catch(error){
                console.error("Error al actualizar producto del carrito", error)
                return "Error al actualizar carrito"
            }
        }  

    async updateProduct(cartId, prodId, updatedProduct){
        try{
            const cart = await cartsModel.findById(cartId)
                if (!cart){
                    return "Carrito no encontrado"
                }

                const productToUpdate = cart.products.find((product) => product.productId === prodId)
                if(!productToUpdate){
                    return "Producto no encontrado en el carrito"
                } 

                Object.assign(productToUpdate, updatedProduct) 

                await cart.save()
                return "Carrito actualizado"
            }catch(error){
                console.error("Error al actualizar producto del carrito", error)
                return "Error al actualizar carrito"
            }
        }    
    
    async removeAllProducts(cartId){
        try{
            const cart = await cartsModel.findById(cartId)
            if(!cart){
                return "Carrito no encontrado"
            }

            cart.products = []
            await cart.save()
            return "Todos los productos fueron eliminados"
        } catch (error) {
            console.error("Error al eliminar productos del carrito", error)
            return "Error al eliminar productos del carrito"
        }
    }

    async getCartWithProducts(cartId){
        try{
            const cart = await cartsModel.findById(cartId).populate("products.productId").lean()
            if(!cart){
                return "Carrito no encontrado"
            }
            return cart
        } catch(error){
            console.error("Error al obtener el carrito:", error)
            return "Error al obtener el carrito"
        }
    }
}

export default CartManager