import mongoose from "mongoose"

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    description: { type: String, max: 100},
    price: { type: Number},
    stock: { type: Number}
})

const productsModel = mongoose.model(productsCollection, productsSchema)

export default productsModel;

//