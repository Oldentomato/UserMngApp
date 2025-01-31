import {useEffect, useState, useCallback} from "react";
import axios from 'axios';
import { LockOutlined, UserOutlined, UsbOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import { requestLogin } from "../components/loginServer";
import "../css/loginView_css.css"
import { useNavigate } from "react-router-dom";


export default function LoginView(){
    const [isLoading, setIsLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [usbPath, setUsbPath] = useState("");
    const [localPass, setLocalPass] = useState("");
    const navigate = useNavigate();

    const FETCH_URL = process.env.REACT_APP_SERVER_URL



    const onFinish = async(values) => {
        requestLogin(values).then((result)=>{
            if(result === true){
                navigate("/main", { state: { isOnline: true, localPass: "" } })
            }else{
                console.log("error")
            }
            
        })
    };

    const onClickLocal = () => {
        navigate("/main", { state: { isOnline: false, localPass: localPass, localPath: usbPath } })
    }


    const findUsbData = async() => { //10초에 한번씩 호출되도록 수정해야함
        window.electronAPI.checkUsb().then((result)=>{
            if (result !== null){
                setUsbPath(result)
            }else{
                setUsbPath("")
            }
            
        })

    }

    const localPassChange = (e) =>{
        setLocalPass(e.target.value)
    }

    const fetchData = async () => {
        try {
          const response = await axios.get(FETCH_URL+'/api/healthcheck');
          if (response.data.success){
            setIsOnline(true);
          }else{
            setIsOnline(false)
          }
          
        } catch (err) {
            setIsOnline(false)
            // console.log(err.message);
        }
    };
        

    useEffect(() => {      
        findUsbData();
        fetchData();
    }, []);

    const IntervalFind = useCallback(() => { //useCallback사용 이유: fetchData 함수가 리렌더링 때마다 재생성되지 않도록 메모이제이션.
        findUsbData();
        fetchData();
      }, []);
    
    useEffect(() => {
        // 5초마다 fetchData를 호출하는 Interval 설정
        const intervalId = setInterval(() => {
            IntervalFind();
        }, 5000);
    
        // 컴포넌트가 언마운트될 때 Interval 정리
        return () => clearInterval(intervalId);
    }, [IntervalFind]);

    return(
        <div className="login">
            <div className="status">
                {isOnline ? 
                <p>online</p>:
                <p>offline</p>
                }
            </div>

            <div className="container">
                <h2>Login</h2>
                <Form
                    name="login"
                    initialValues={{
                        remember: true,
                    }}
                    style={{
                        maxWidth: 360,
                    }}
                    onFinish={onFinish}
                >
                <Form.Item
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                    ]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                    ]}
                >
                    <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Flex justify="space-between" align="center">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    </Flex>
                </Form.Item>

                <Form.Item>
                    {isOnline?
                        <Button block type="primary" htmlType="submit">
                            Log in
                        </Button>:
                        <Button block type="primary" disabled>
                            Offline
                        </Button>
                    }

                </Form.Item>
                </Form>
            </div>

            <div>
                <h2>
                    Login to USB Local Data
                </h2>
                <Input prefix={<LockOutlined />} onChange={localPassChange} type="password" placeholder="Password" />
                {usbPath === ""?
                    <Button type="primary" loading iconPosition="end">
                        Loading
                    </Button>:
                    
                    <Button type="primary" onClick={onClickLocal}>
                        <UsbOutlined />
                        Login to Local Data
                    </Button>
                }

            </div>



        </div>
    )
}