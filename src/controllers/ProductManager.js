import { productsModel } from "../models/products.models.js"

class ProductManager extends productsModel {
    constructor() {
        super()
    }
    
    async getProductsFinal(page=1, limit =10)
    {
        try
        {
            const query = ProductManager.find(filter)
                .skip(startIndex)
                .limit(limit)
                .sort(sortOptions)
            const products = await query.exec()

            const totalProducts = await ProductManager.countDocuments(filter)
            const totalPages = Math.ceil(totalProducts/limit)
            const hasPrevPage = startIndex > 0
            const hasNextPage = endIndex < totalProducts
            const prevLink = hasPrevPage ? `/api/products?page=${page-1}&limit=${limit}`: null
            const nextLink = hasNextPage ? `/api/products?page=${page+1}&limit=${limit}`: null

            return{
                status: "succes",
                playload: products,
                totalPages: totalPages,
                prevPage: hasPrevPage ? page-1: null,
                nextPage: hasNextPage? page+1:null,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink,
            }
        }catch(error){
            console.error("error al obtener los productos", error)
            return {status: "error", playload:"error al obtener los productos"}
        }
    } 

    async deleteProduct(id){ 
        try{
            const product= await ProductManager.findById(id)
            if (!product){
                return "Producto no encontrado"
            }
            await product.remove()
            return "Producto eliminado"
        }catch(error){
            console.error("Error al eliminar el producto", error)
            return "Error al eliminar el producto"
        }
    }
}

export default ProductManager
