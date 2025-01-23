import axios from "axios"
import {getToken} from "./getToken"

const FETCH_URL = process.env.REACT_APP_SERVER_URL

function generateId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let token = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        token += characters[randomIndex];
    }
    
    return token;
}

const addUser = async(data) => {
    const result = await axios.post(FETCH_URL+"/api/user/addUser",{
        key: generateId(10),
        name: data.name,
        age: data.age,
        gender: data.gender,
        address: data.address,
        phone: data.phone
    }).catch((err)=>{
        console.log(err)
        return false
    })

    return result
}

const getUsers = async()=> {
    const result = await axios.get(FETCH_URL+"/api/user/getUsers").catch((err)=>{
        console.log(err)
        return []
    })
    if (result.data.success){
        return result.data.content
    }else{
        console.log(result.data.msg)
        return []
    }
    
}

export {addUser, getUsers}