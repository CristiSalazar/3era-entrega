import express from "express"
import passport from "passport"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import session from "express-session"
import {Strategy as JwtStrategy} from "passport-jwt"
import {ExtractJwt as ExtractJwt} from "passport-jwt"
import * as path from "path"
import __dirname, {authorization, passportCall} from "./utils.js"
import initializePassport from "./config/passport.config.js"
import MongoStore from "connect-mongo"
import UserManager from "./dao/UserManager.js"
import CartManager from "./dao/CartManager.js"
import { generateToken } from "./jwt/token.js"
import config from "./config.js"

const users = new UserManager()
const carts = new CartManager()
const app = express()

const PORT = config.port

mongoose
  .connect(
    config.mongoUrl,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Conección exitosa");
  })
  .catch((error) => {
    console.error("No logró conectarse" + error);
  });

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        config.mongoUrl,
      ttl: 3600,
    }),
    secret: "clave",
    resave: false,
    saveUninitialized: false,
  })
);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "Secret-key"
}

passport.use(
    new JwtStrategy(jwtOptions, (jwt_payload, done)=>{
        const user = users.findJWT((user) => user.email === jwt_payload.email)
        if (!user)
        {
            return done(null, false, {message: "usuario no encontrado"})
        }
        return done(null, user)
    })
)

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.set("views", path.join(__dirname, "views"))
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.post("/login", async(req, res) =>{
    const{email, password} = req.body
    const emailToFind = email
    const user = await users.findEmail({email: emailToFind}) 

    if (!user || !user.password !== password){
        return res.status(401).json({message: "Error de autenticación"})
    }

    const token = generateToken(res, email, password)
    res.json({token,user: {email: user.email, rol: user.rol}})
})

app. post("/api/register", async(req,res)=>{
    const{first_name, last_name, email, age, password, rol} = req.body
    const emailToFind = email
    const exists = await users.findEmail({email: emailToFind})
    if(exists) return res.status(400).send({status: "error", error: "Usuario ya existe"})
    const newUser = {
        first_name,
        last_name,
        email,
        age, 
        password,
        cart: carts.addCart(),
        rol
    }
    users.addUser(newUser)
    const token = generateToken(res,email,password) 
    res.send({token})
})

app.get("/", (req, res) =>{
    res.sendFile("index.html", {root: app.get("views")})
})

app.get("/register", async(req,res)=>{
    res.sendFile("register.html", {
        root: app.get ("views")
    })
})

app.get("/current", passportCall("jwt"), authorization("user"),(req,res)=>{
    res.sendFile("home.html", {
        root: app.get ("views")
    })
})

app.listen(PORT,()=>{console.log("Escuchando en puerto 8080")})



