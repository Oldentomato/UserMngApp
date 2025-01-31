import axios from "axios"
import {getToken} from "./getToken"

const FETCH_URL = process.env.REACT_APP_SERVER_URL

const requestLogin = async(data) => {
    const result = await axios.post(FETCH_URL+"/api/admin/login",{
        username: data.username,
        password: data.password
    }).catch((err)=>{
        console.log(err)
        return false;
    })

    if(!result){
        return false;
    }

    if(result.data.success){
        const token = result.data.token
        window.electronAPI.setCookieByName({
            name: 'token',
            value: token
        })
        return true;
    }else{
        return false;
    }
}

const requestLogout = async() => {
    const token = await getToken('token')
    const result = await axios.get(FETCH_URL+"/api/admin/logout",{
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).catch((err)=>{
        console.log(err)
        return false;
    })

    if(result.data.success){
        return true;
    }else{
        return false;
    }
}

export {requestLogin, requestLogout}