import UserDTO from "../dao/DTOs/user.dto.js";

export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    getUsers = async () => {
        let result = await this.dao.get()
        return result
    }

    createUser = async (user) => {
        let userToInsert = new UserDTO(user)
        let result = await this.dao.addUser(userToInsert)
        return result
    }
}
//lis