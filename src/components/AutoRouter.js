import {
    HashRouter as Router,
    Routes,
    Route,
    Navigate,
    useLocation 
} from 'react-router-dom';
import axios from "axios"
import React,{useState, useEffect} from 'react';
import {getToken} from './getToken'
import MainView from "../views/main"
import LoginView from "../views/login"
// import Cookies from 'js-cookie';

const RouterInfo = [
{ path: '/', element: <LoginView />, withAuthorization: false},
{ path: '/main', element: <MainView />, withAuthorization: true }
];

const FETCH_URL = process.env.REACT_APP_SERVER_URL

const Authorization = ({
  redirectTo,
  children,
}) => {
    // let isAuthenticated = false;
    const location = useLocation();
    const [isAuth, setIsAuth] = useState(null)
    const [localData, setLocalData] = useState(null)
    const { isOnline, localPass, localPath } = location.state;


    const findUsbData = async() => { 
        const apiResult = await window.electronAPI.getUsbData({localPath:localPath, localPass:localPass})
        return apiResult
    }

    const fetchAndSetToken = async () => {
        const token = await getToken('token');
        const result = await axios.post(FETCH_URL+"/api/admin/getAdmin", {
            token: token
        }).catch((err)=> {
            console.log(err)
        })

        if(result.data.success){
            return true;
        }else{
            return false;
        }
        
    };

    useEffect(()=>{
        if(isOnline){
            fetchAndSetToken().then((result)=>{
                if (result) {
                    setIsAuth(true);
                } else {
                    setIsAuth(false);
                }
            })
    
        }
        else{
            findUsbData().then((isFind)=>{
                if(isFind.success){
                    setLocalData(isFind.content)
                    setIsAuth(true);
                }else{
                    setIsAuth(false);
                }
            })
            
        }
    },[isOnline])



    if (isAuth === true) {
        return React.cloneElement(children, { isOnline: isOnline, localData: localData })
        // return <>{typeof children === 'function' ? children(isOnline) : children}</>;
            

        
    } else if(isAuth === false) {
        return <Navigate to={redirectTo} />;
    }
    else{
        return <></>
    }

};

const AutoRouter = () => {
    return (
        <Router>
        <Routes>
            {RouterInfo.map((route) => {
            return (
                <Route
                key={route.path}
                path={route.path}
                element={
                    route.withAuthorization ? (
                    <Authorization
                        redirectTo='/'
                    >
                        {/* {route.param ? React.cloneElement(route.element, { localLogin: true }) : route.element} */}
                        {route.element}
                    </Authorization>
                    ) : (
                    route.element
                    )
                }
                />
            );
            })}
        </Routes>
        </Router>
    );
};

export default AutoRouter;