import React, { useEffect, useState } from "react";
import Spinner from "../../components/spinner/spinner";
import { getStorage, flushStorage } from '../../utilities/storage';
import { useNavigate    } from "react-router";
import { apiPost } from '../../utilities/userAuth';

export default function Logout(props){
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {REACT_APP_API_URL} = process.env;
    useEffect( ()=> {
        setLoading(true);
        let userInfo = getStorage('userInfo');
        if(userInfo){
            let url = `${REACT_APP_API_URL}/users/logout`;
            const data = {
                token: userInfo.token,
                user_id: userInfo.user_info.id
            }
            apiPost(url,data).then(response => {
                setLoading(false);
                flushStorage();
                navigate('/login'); 
                
            }).catch(error => {
                setLoading(false);
                flushStorage();
                navigate('/login'); 
            });
        }else{
            flushStorage();
            navigate('/login'); 
        }
    },[]);
    
   
    return(
        <>
            { loading ? <Spinner/>  : ''  }
        </>
    )
}


