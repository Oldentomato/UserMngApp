import {useEffect, useState} from "react"
import "../css/mainView_css.css"
import { CloseOutlined, UserOutlined, ProductOutlined, MailOutlined, ScheduleOutlined, LogoutOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";
import DashBoard from "./mainComponent/dashboard"
import ClientView from "./mainComponent/clients";
import {requestLogout} from "../components/loginServer"
import {getUsers} from "../components/userServer"



export default function MainView({isOnline, localData}){
    const navigate = useNavigate();
    const [menuStatus, setMenuStatus] = useState("dashboard")
    const [userList, setUserList] = useState([])


    const getUsersInfo = async() => {
        if(isOnline){
            const result = await getUsers().catch((err)=>{
                console.log(err)
                return []
            })
            const modifiedList = result.map((item) => ({
                key: item.key,
                name: item.name, 
                age: item.age, 
                gender: item.gender,
                address: item.address,
                phone: item.phone
              }));
    
              setUserList(modifiedList);
        }else{
            if(localData === null){
                console.log("usb 데이터 누락") //나중에 modal로 교체할것
            }else{
                setUserList(localData.userList)
            }
        }

        
    }

    const ReturnPage = () =>{
        if(menuStatus === "dashboard"){
            return <DashBoard />
        }
        else if(menuStatus === "clients"){
            return <ClientView isOnline={isOnline} userDatas={userList} getUserInfo={() => getUsersInfo()} />
        }
    }

    const onClientsClick = () =>{
        setMenuStatus("clients")
    }

    const onDashboardClick = () =>{
        setMenuStatus("dashboard")
    }


    const onLogout = async(event) =>{
        if(isOnline){
            const fetchAndLogout = async () => {
                const result = await window.electronAPI.deleteCookieByName('token');
                return result;
            };
            requestLogout().then((result)=>{
                if(result){
                    fetchAndLogout().then((result)=>{
                        if(result){
                            navigate('/')
                        }
                        else{
                            // performToast({msg:"토큰 삭제에 문제가 생겼습니다" , type:"error"})
                            console.log("fail")
                        }
                    })
                }
            })
            
        }else{
            navigate("/")
        }
    }

    useEffect(()=>{
        // getUsbData()
        getUsersInfo()
    },[])

    return (
        <div className="mainView">
            
            <div className="mainContainer">
                <aside>
                    <div className="top">
                        <div className="logo">  
                            <h2>C<span className="danger">Manager</span></h2>
                        </div>
                        <div className="close">
                            <CloseOutlined />
                        </div>
                    </div>

                    <div className="sidebar">
                        <button className= {menuStatus === "dashboard" ? "sidebarBtnActive" : "sidebarBtn" } onClick={onDashboardClick}>
                            <h3>Dashboard</h3>
                            <span>
                                <ProductOutlined />
                            </span>
                        </button>
                        <button className={menuStatus === "clients" ? "sidebarBtnActive" : "sidebarBtn" } onClick={onClientsClick}>
                            <h3>Clients</h3>
                            <span>
                                <UserOutlined />
                            </span>
                        </button>
                        <button className={menuStatus === "messages" ? "sidebarBtnActive" : "sidebarBtn" }>
                            <h3>Messages</h3>
                            <span>
                                <MailOutlined />
                            </span>
                        </button>
                        <button className={menuStatus === "schedule" ? "sidebarBtnActive" : "sidebarBtn" }>
                            <h3>Schedule</h3>
                            <span>
                                <ScheduleOutlined />
                            </span>
                        </button>
                        <button className="sidebarBtn" onClick={onLogout}>
                            <h3>logout</h3>
                            <span>
                                <LogoutOutlined />
                            </span>
                        </button>
                    </div>
                </aside>
                <ReturnPage />


            </div>
            {/* <button onClick={getUsbData}>get</button>
            <button onClick={setUsbData}>set</button> */}
        </div>

    )
}