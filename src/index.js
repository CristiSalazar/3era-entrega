import express from 'express'
import mongoose from 'mongoose'
import config from './config/config.js'
import passport from "passport"
import cookieParser from "cookie-parser"
import cartsRouter from './routes/carts.router.js'
import productsRouter from './routes/products.router.js'
import usersRouter from './routes/users.router.js'
import ticketsRouter from './routes/tickets.router.js'
import UserMongo from "./dao/mongo/users.mongo.js"
import ProdMongo from "./dao/mongo/products.mongo.js"
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import __dirname, { authorization, passportCall, transport } from "./utils.js"
import initializePassport from "./config/passport.config.js"
import * as path from "path"
import {generateAndSetToken} from "./jwt/token.js"
import UserDTO from './dao/DTOs/user.dto.js'
import { engine } from "express-handlebars"
import {Server} from "socket.io"
const app = express()
const port = 8080

const users = new UserMongo()
const products = new ProdMongo()


mongoose.connect(config.mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "Secret-key"
}

passport.use(
    new JwtStrategy(jwtOptions, (jwt_payload, done)=>{
        const user = users.findJWT((user) =>user.email ===jwt_payload.email)
        if(!user)
        {
            return done(null, false, {message:"Usuario no encontrado"})
        }
        return done(null, user)
    })
)


app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

const httpServer = app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto 8080`)
})

const socketServer = new Server(httpServer)

socketServer.on("connection", socket => {
    console.log("Socket Conectado")

    socket.on("message", data => {
        console.log(data)
    })

    socket.on("newProd", (newProduct) => {
        products.addProduct(newProduct)
        socketServer.emit("success", "Producto Agregado Correctamente");
    });
    socket.on("updProd", ({id, newProduct}) => {
        products.updateProduct(id, newProduct)
        socketServer.emit("success", "Producto Actualizado Correctamente");
    });
    socket.on("delProd", (id) => {
        products.deleteProduct(id)
        socketServer.emit("success", "Producto Eliminado Correctamente");
    });

    socket.on("newEmail", async({email, comment}) => {
        let result = await transport.sendMail({
            from:'<cristina.salazar125@gmail.com>',
            to:email,
            subject:'Correo',
            html:`
            <div>
                <h1>${comment}</h1>
            </div>
            `,
            attachments:[]
        })
        socketServer.emit("success", "Correo enviado correctamente");
    });

    socket.emit("test","mensaje desde servidor a cliente, se valida en consola de navegador")
})

app.use("/carts", cartsRouter)
app.use("/products", productsRouter)
app.use("/users", usersRouter)
app.use("/tickets", ticketsRouter)


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const emailToFind = email;
    const user = await users.findEmail({ email: emailToFind });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Error de autenticación" });
    }
    const token = generateAndSetToken(res, email, password);
    const userDTO = new UserDTO(user);
    const prodAll = await products.get()
    res.json({ token, user: userDTO, prodAll});
  });
app.post("/api/register", async(req,res)=>{
    const {first_name, last_name, email,age, password, rol} = req.body
    const emailToFind = email
    const exists = await users.findEmail({ email: emailToFind })
    if(exists) return res.status(400).send({status:"error", error: "Usuario ya existe"})
    const newUser = {
        first_name,
        last_name,
        email,
        age,
        password,
        rol
    };
    users.addUser(newUser)
    const token = generateAndSetToken(res, email, password) 
    res.send({token}) 
})
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: app.get('views') });
});
app.get('/register', (req, res) => {
    res.sendFile('register.html', { root: app.get('views') });
});
app.get('/current',passportCall('jwt', { session: false }), authorization('user'),(req,res) =>{
    authorization('user')(req, res,async() => {      
        const prodAll = await products.get();
        res.render('home', { products: prodAll });
    });
})
app.get('/admin',passportCall('jwt'), authorization('user'),(req,res) =>{
    authorization('user')(req, res,async() => {    
        const prodAll = await products.get();
        res.render('admin', { products: prodAll });
    });
})