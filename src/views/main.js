import {useEffect, useState, useCallback} from "react"
import "../css/mainView_css.css"
import { CloseOutlined, UserOutlined, ProductOutlined, MailOutlined, ScheduleOutlined, LogoutOutlined, ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";
import DashBoard from "./mainComponent/dashboard"
import ClientView from "./mainComponent/clients";
import MessageView from "./mainComponent/message";
import {requestLogout} from "../components/loginServer"
import {getUsers} from "../components/userServer"
import { getMsgList } from '../components/messageServer';
import { getToken } from "../components/getToken";
import {Modal, notification, Spin, Flex } from "antd";



export default function MainView({isOnline, localData}){
    const navigate = useNavigate();
    const [menuStatus, setMenuStatus] = useState("clients");
    const [api, nofiContextHolder] = notification.useNotification();
    const [userList, setUserList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataLoad, setDataLoad] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [msgList, setMsgList] = useState([]);

    const openNotification = (data) => {
        api.info({
          message: data.title,
          description:data.desc
        });
    };

    const confirm = () => {
      modal.warning({
        title: '로그인시간 지남',
        icon: <ExclamationCircleOutlined />,
        content: '로그인 시간이 지나서 자동으로 로그아웃됩니다.',
        okText: '확인',
        onOk:()=>navigate("/")
      });
    };

    const requestMsgs = async()=> {
        if(isOnline){
            const result = await getMsgList().catch((err)=>{
                console.log(err)
                return result
            })
            const arr = Object.entries(result.content.messageList); //object 형식에서 arr로 변경
            const modifiedList = arr.map((item)=>({
                key: item[0],
                content: item[1]
            }))
            
            if(result.success){
                setMsgList(modifiedList)
            }else{
                openNotification({
                    title: '실패',
                    desc: result.msg
                })
            }
        }

    }


    const getUsersInfo = async() => {
        if(isOnline){
            const result = await getUsers().catch((err)=>{
                console.log(err)
                return []
            })
            const arr = Object.entries(result); //object 형식에서 arr로 변경
            //item[0] = key, item[1] = value
            const modifiedList = arr.map((item) => ({
                key: item[0],
                name: item[1].name, 
                family: item[1].family, 
                address: item[1].address,
                phone: item[1].phone,
                etc:item[1].etc
              }));
    
              setUserList(modifiedList);
        }else{
            if(localData === null){
                openNotification({
                    title: '실패',
                    desc: 'usb 데이터 누락'
                })
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
        else if(menuStatus === "messages"){
            return <MessageView isOnline={isOnline} userDatas={userList} msgList={msgList} requestMsgs={() =>requestMsgs()} openNotification={openNotification} />
        }
    }

    const onClientsClick = () =>{
        setMenuStatus("clients")
    }

    const onDashboardClick = () =>{
        // setMenuStatus("dashboard") //나중에 기능구현하면 주석해제할것
    }

    const onMessageClick = () => {
        if(isOnline){
            setMenuStatus("messages")
        }else{
            openNotification({
                title: '실패',
                desc: '온라인 환경만 이용가능'
            })
        }
        
    }


    const onLogout = async() =>{
        if(isOnline && !logoutLoading){
            setLogoutLoading(true)
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

    const checkCookie = async() => {
        const result = await getToken("token")
        if(result === ""){
            setIsModalOpen(true)
            confirm()
        }
    }

    const IntervalFind = useCallback(() => { 
        if(!isModalOpen){
            checkCookie();
        }
        
    }, [isModalOpen]); //useCallback의 종속성 배열에 isModalOpen을 추가해 최신 값을 참조하도록 합니다.


    useEffect(() => {
        if(isOnline){
            // 5초마다 fetchData를 호출하는 Interval 설정
            const intervalId = setInterval(() => {
                IntervalFind();
            }, 10000);
        
            // 컴포넌트가 언마운트될 때 Interval 정리
            return () => clearInterval(intervalId);
        }

    }, [IntervalFind]);

    useEffect(() => {
        const fetchData = async () => {
            await getUsersInfo();
            await requestMsgs();
            setDataLoad(true);
        };

        fetchData();
    }, []);

    return (
        <>
            {
                dataLoad ? 
                <div className="mainView">
                {contextHolder}
                {nofiContextHolder}
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
                        <button className={menuStatus === "messages" ? "sidebarBtnActive" : "sidebarBtn" } onClick={onMessageClick}>
                            <h3>Messages</h3>
                            <span>
                                <MailOutlined />
                            </span>
                        </button>
                        {/* <button className={menuStatus === "schedule" ? "sidebarBtnActive" : "sidebarBtn" }>
                            <h3>Schedule</h3>
                            <span>
                                <ScheduleOutlined />
                            </span>
                        </button> */}
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
            </div> 
            : 
            <Flex style={{justifyContent: "center", alignItems: "center"}}>
                <Spin
                    indicator={
                        <LoadingOutlined
                        style={{
                            fontSize: 68,
                        }}
                        spin
                        />
                    }
                />
            </Flex>
            }
        </>


    )
}