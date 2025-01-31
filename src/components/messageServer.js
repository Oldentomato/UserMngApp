import axios from "axios"
import {getToken} from "./getToken"

const FETCH_URL = process.env.REACT_APP_SERVER_URL

const getMsgList = async() =>{
    const token = await getToken("token")
    const result = await axios.get(FETCH_URL+'/api/message/getMsgList', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .catch(error => {
        console.error(error); // 에러 처리
    });

    if(result.data.success){
        return {success: true, content: result.data.content};
    }else{
        return {success: false, msg: result.data.msg}
    }
}

const addMsg = async(data) =>{
    const token = await getToken("token")
    const result = await axios.post(FETCH_URL+'/api/message/addMsg', 
    {
        inputData: data
    },
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    ).catch(error => {
        console.error(error); // 에러 처리
        return {success: false, msg: error}
    });

    if(result.data.success){
        return {success: true};
    }else{
        return {success: false, msg: result.data.msg}
    }
}

const deleteMsg = async(data) =>{
    const token = await getToken("token")
    const result = await axios.post(FETCH_URL+'/api/message/deleteMsg', 
    {
        msgId: data
    },
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    ).catch(error => {
        console.error(error); // 에러 처리
        return {success: false, msg: error}
    });

    if(result.data.success){
        return {success: true};
    }else{
        return {success: false, msg: result.data.msg}
    }
}

export {getMsgList, addMsg, deleteMsg}