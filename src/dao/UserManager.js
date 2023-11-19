import {userModel as usersModel} from "../models/users.models.js"

class UserManager extends usersModel
{
    constructor(){
        super()
    }

        async addUser(userData)
        {
            try 
            {
                let userCreate = await usersModel.create(userData)
                return "usuario agregado"
            } catch(error){
                console.error("Error al agregar usuario", error)
                return "Error al agregar el usuario"
            }
        }

        async updateUser(id, userData)
        {
            try{
                const user= await UserManager.findById(id)
                if(!user){
                    return("Usuario no encontrado")
                }
                user.set(userData)
                await user.save()
                return "Usuario actualizado"
            } catch(error){
                console.error("Error al actualizar er usuario", error)
                return "Error al actualizar el usuario"
            }
        }

        async getUsers() {
            try {
                const users = await UserManager.find({})
                return users
            }catch (error)
            {
                console.error("Error al obtener usuarios", error)
                return[]
            }
        }

        async getUserById(id){
            try{
                const user = await UserManager.findById(id).lean()
                if(!user){
                    return "Usuario no encontrado"
                }
                return user
            } catch(error){
                console.error("Error al obtener el usuario", error)
                return "Error al obtener el usuario"
            }
        }

        async deletUserId(id){
            try{
                const user= await UserManager.findById(id)
                if(!user){
                    return "Usuario no encontrado"
                }
                await user.remove()
                return "Usuario elminado"
            } catch(error){
                console.error("Error al eliminar el usuario", error)
                return "Error al eliminar el usuario"
            }
        }

        async findUser(email){
            try{
                const user = await UserManager.findOne({email}, {email:1, first_name:1, last_name:1, password:1, rol:1})

                if(!user){
                    return "Usuario no encontrado"
                }
                return user
            } catch(error){
                console.error("Error al validar usuario")
                return "Error al obtener usuario"
            }
        }

        async findEmail(param){
            try{
                const user = await UserManager.findOne(param)
                return user
            } catch(error){
                console.error("error al validar usuario", error)
                return "Error al obtener el usuario"
            }
        }
}
export default UserManager