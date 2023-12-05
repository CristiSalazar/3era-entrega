import mongoose from "mongoose"

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({ 
    products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'products', 
          },
          quantity: Number,
        },
      ],
})

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;

//l 