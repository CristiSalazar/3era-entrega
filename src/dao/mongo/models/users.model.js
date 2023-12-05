import mongoose from "mongoose"

const usersCollection = "users";

const userSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: String,
    age: Number,
    rol: String
})

const usersModel = mongoose.model(usersCollection, userSchema)

export default usersModel

//