import axios from "axios"
import {getToken} from "./getToken"

const FETCH_URL = process.env.REACT_APP_SERVER_URL


const deleteUser = async(userIds) => {
    const token = await getToken("token")
    const result = await axios.post(FETCH_URL+"/api/user/deleteUser",
        {
            userIds: userIds
        },
        {
        headers: {
            Authorization: `Bearer ${token}`
        }}).catch((err)=>{
        console.log(err)
        return false
    })

    return result
}

const addUser = async(data) => {
    const token = await getToken("token")
    const result = await axios.post(FETCH_URL+"/api/user/addUser",
        {
            userInfo: {
                name: data.name,
                age: data.age,
                gender: data.gender,
                address: data.address,
                phone: data.phone
            }
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    ).catch((err)=>{
        console.log(err)
        return false
    })

    return result
}

const getUsers = async()=> {
    const token = await getToken("token")
    const result = await axios.get(FETCH_URL+"/api/user/getUsers",{
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).catch((err)=>{
        console.log(err)
        return []
    })
    if (result.data.success){
        return result.data.content.userList
    }else{
        console.log(result.data.msg)
        return []
    }


    
}

export {addUser, getUsers, deleteUser}