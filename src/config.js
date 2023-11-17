import dotenv from "dotenv"
dotenv.config()

export default{
    port: process.env.PORT,
    mongoUrl: process.MONGO_URL
}