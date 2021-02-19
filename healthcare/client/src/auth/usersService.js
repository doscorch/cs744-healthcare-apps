
import { ERROR } from "../errorHandling";
import client from "../feathersClient";

const users = client.service('users');

// call api to register user
export const registerUser = async (username, password, firstName, lastName) => {
    return await users.create({ "username": username, "password": password, "firstName": firstName, "lastName": lastName, userRole: "patient" }, {});
}

// call api to get users
export const getUsers = async () => {
    return users.find().then(u => u.data)
}

// call api to register user by username
export const getUser = async (username) => {
    return users.find({
        query: {
            username: username
        }
    }).then(u => u.data.length ? u.data[0] : undefined)
}

// call api to update user
export const updateUser = async (user) => {
    return await users.update(user._id, user, {});
}

// call api to patch user
export const patchUser = async (userPartial) => {
    return await users.patch(userPartial._id, userPartial, {})
}

// call api to login user
export const loginUser = async (username, password) => {
    try {
        if (!username && !password) {
            let auth = await client.reAuthenticate();
            return {
                userId: auth.user?._id,
                username: auth.user?.username,
                error: false,
            }
        } else {
            let auth = await client.authenticate({
                strategy: 'local',
                username: username,
                password: password,
            });
            return {
                user: auth.user,
                error: false,
            }
        }
    } catch (error) {
        console.log(error);
        let message = error?.message ?? ERROR;
        return {
            error: message,
        };
    }
}

// logout user on client
export const logout = async () => {
    return await client.logout();
}
