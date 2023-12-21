import React ,{useEffect, useState,useRef} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate    } from "react-router";
import Spinner from  '../spinner/spinner';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { setStorage, getStorage, flushStorage } from '../../utilities/storage';
import { apiPost,apiGet } from '../../utilities/userAuth';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
export default function Login (){
    const [inputs, setInputs] = useState({});
    const [layoutName, setLayoutName] = useState("default");
    const [inputName, setInputName] = useState("default");
    const [drawerAgents,setDrawerAgents] = useState([]);
    const [moneyBoxVal,setmoneyBoxVal] = useState([]);
    const navigate = useNavigate();
    const keyboard = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit,setValue, formState: { errors,isSubmitSuccessful } } = useForm({
        defaultValues: {
            mobile_id: '',
            password: '',
            MoneyBox: ''
        }
    });
    const {REACT_APP_API_URL} = process.env;
    useEffect( () => {
        let userInfo = getStorage('userInfo');
        if(userInfo && userInfo.token){
            window.location.href=('/dashboard'); 
           
        }
    },[navigate]);

    useEffect(
    () => {
        if(!isSubmitSuccessful){
            if(inputs.mobile_id !== undefined){   
                setValue('mobile_id',inputs.mobile_id);
            }    
            if(inputs.password !== undefined){
                setValue('password',inputs.password);
            }
           
        }
    },[isSubmitSuccessful,setValue,inputs.mobile_id,inputs.password]);
    useEffect(
    () => {
        let url = `${REACT_APP_API_URL}/userDrawers/getAllAgentDrawer`;
        apiGet(url).then(response => {
            if(parseInt(response.data.code) === 200){
                setDrawerAgents(response.data.data)
            }
           
        }).catch(error => {
            flushStorage();    
            let msg = 'Something is wrong, please try after some time.';
            NotificationManager.error(msg);    
        });
    },[REACT_APP_API_URL]);

    let checkUserShiftLog = (userInfo,drawerID)=> {
        return new Promise((resolve, reject) => {
            let url = `${REACT_APP_API_URL}/userDrawersShift/getOne`
            const params = {
                token: userInfo.token,
                user_id:userInfo.user_info.id,
                drawer_id:parseInt(drawerID),
                is_logout:0
            }
            var checkExists = 0;
            var shiftId = 0;
            apiGet(url,params).then(response => {
                
                if(parseInt(response.data.code) === 200){
                    if(response.data.data.length !==0){
                        var checkExistsVal = response.data.data[0];
                        if(parseInt(checkExistsVal.is_logout)===0){
                            checkExists = 1;
                            shiftId = checkExistsVal.id;
                        }
                    } 
                }else{
                    let msg = 'Something is wrong, please try again later.';
                    NotificationManager.error(msg);
                }
                
                let sendparam = {
                    ifexists:checkExists,
                    userInf:userInfo,
                    shiftIds:shiftId
                }
                resolve(sendparam);
            }).catch(err => {
                flushStorage();
                setIsLoading(false);
                let msg = 'Something is wrong, please try again later.';
                NotificationManager.error(msg);
            });
        });
    }

    const onSubmit = data => {
        setIsLoading(true);
        let url = `${REACT_APP_API_URL}/users/login`;
        apiPost(url,data).then(response => {
            setIsLoading(false);
            if(parseInt(response.data.code) === 200){
                setStorage('userInfo',response.data.data);
                if(moneyBoxVal.length === 0 || moneyBoxVal === -1){
                    setStorage('drawer_no',-1);
                }else{
                    setStorage('drawer_no',moneyBoxVal);
                }

                const userInfo = response.data.data;   
                checkUserShiftLog(userInfo,moneyBoxVal).then(function(returnData){
                   var exits = returnData.ifexists;
                   var userinf = returnData.userInf;
                   var shiftid =  returnData.shiftIds;
                  
                    if(parseInt(exits) !== 1){
                        let url22 = `${REACT_APP_API_URL}/userDrawersShift/create`;
                        const params = {
                            token: userinf.token,
                            user_id:userinf.user_info.id,
                            drawer_id:moneyBoxVal,
                            is_logout:0,
                            is_completed:0,
                            is_active: 1 // active only
                        }
                        apiPost(url22,params).then(response22 => {
                            if(response22.data.code === 200){
                                setStorage('shiftid',response22.data.data.id);
                                setTimeout(() => {
                                    window.location.href=('/dashboard'); 
                                }, 250);
                            }else{
                                flushStorage();
                                setIsLoading(false);
                                if(parseInt(response22.status) === 404 ){
                                    NotificationManager.error(response22.data.message);
                                }else{
                                    let msg = 'Something is wrong, please try again later.';
                                    NotificationManager.error(msg);
                                }    
                            }
                        
                        }).catch(error22 => {
                            flushStorage();
                            setIsLoading(false);
                            if(parseInt(response.status) === 404 ){
                                NotificationManager.error(response.data.message);
                            }else{
                                let msg = 'Something is wrong, please try again later.';
                                NotificationManager.error(msg);
                            }    
                        });
                    }else{
                        setStorage('shiftid',shiftid);
                        setTimeout(() => {
                            window.location.href=('/dashboard'); 
                        }, 250);
                    }
                });
                
            }else{
                flushStorage();
                setIsLoading(false);
                if(parseInt(response.status) === 404 ){
                    NotificationManager.error(response.data.message);
                }else if(parseInt(response.status) === 422 ){
                    let msg = 'User already logged in.';
                    NotificationManager.error(msg);
                }    
            }
        }).catch(error => {
            flushStorage();
            setIsLoading(false);    
            let msg = 'Something is wrong, please try after some time.';
            NotificationManager.error(msg);    
        });
    } 
   

    const onChangeAll = inputs => {
        /**
         * Here we spread the inputs into a new object
         * If we modify the same object, react will not trigger a re-render
         */
        setInputs({ ...inputs });
        //console.log("Inputs changed", inputs);
    };
    
      const handleShift = () => {
        const newLayoutName = layoutName === "default" ? "shift" : "default";
        setLayoutName(newLayoutName);
      };
    
    const onKeyPress = button => {
        //console.log("Button pressed", button);
        /**
         * If you want to handle the shift and caps lock buttons
         */
        if (button === "{shift}" || button === "{lock}") handleShift();
    };
    
    const onChangeInput = event => {
        const inputVal = event.target.value;
    
        setInputs({
          ...inputs,
          [inputName]: inputVal
        });
    
        keyboard.current.setInput(inputVal);
    };
    
    const getInputValue = inputName => {
        return inputs[inputName] || "";
    };
    let showPassowrd = ()=> {
        var x = document.getElementById("password");
        if (x.type === "password") {
          x.type = "text";
        } else {
          x.type = "password";
        }
    }
    return(
        <>
            <header className="header login-header">
                <div className="row align-items-center height-100">
                    <div className="col-md-6 d-flex align-items-center">
                        <h1>
                            Golden Dragon Pos
                            <span className="ft15"> (Release)</span>
                        </h1>
                    </div>
                    <div className="col-md-6">
                        <div className="header-right d-flex justify-content-end align-items-center">
                            <div className="nation Navigation">
                                <ul className="lanNav">
                                    <li> 
                                        <a href>English</a>
                                        <ul>
                                            <li>
                                                <a href>
                                                    English
                                                </a>
                                            </li>
                                            
                                            <li>
                                                <a href>
                                                    简体中文
                                                </a>
                                            </li>
                                            
                                            <li>
                                                <a href>
                                                    Español
                                                </a>
                                            </li>
                                            
                                        </ul>
                                    </li>
                                </ul>
                                <br className="clear" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            { isLoading ? <Spinner/> : '' } 
            <NotificationContainer/>
            <div className='logn-form-wrapper'>
                <div className='logn-form-wrapper-inner'>
                    <div className='fancybox-outer'>
                        <div className="popupContainer">
                            <div className="popupHeader text-center">
                                <span className="header_title">Log In</span>
                            </div>
                            <section className="popupBody">
                                <div className="user_login">
                                    <form action="" onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <PersonIcon />
                                                <input type="text" 
                                                id="mobile_id" 
                                                name="mobile_id" 
                                                onFocus={() => setInputName("mobile_id")}
                                                placeholder="Enter your mobile id" 
                                                className="form-control-login" 
                                                {...register("mobile_id", {required: 'This field is required!'})} 
                                                onChange={onChangeInput}
                                                autoComplete='off' />
                                                <p className='text-danger fs-7 p-1'>{errors.mobile_id?.message}</p>
                                            </div>
                                            <div className='col-md-12'>
                                                <KeyIcon />
                                                <input type="password" 
                                                id="password" 
                                                name="password" 
                                                onFocus={() => setInputName("password")}
                                                placeholder="Enter your password"
                                                className="form-control-login"  
                                                onChange={onChangeInput}
                                                {...register("password", {required: 'This field is required!'})} 
                                                autoComplete='off' />
                                                <div className="form-check password">
                                                    <input className="form-check-input" 
                                                    type="checkbox"
                                                    id="showPassword" onChange={showPassowrd}/>
                                                    <label className="form-check-label" htmlFor="showPassword">
                                                        Show Password
                                                    </label>
                                                </div>
                                                <p className='text-danger fs-7 p-1'>{errors.password?.message}</p>
                                            </div>
                                            <div>
                                                <VideoLabelIcon/>
                                                <select   {...register("MoneyBox", {required: 'This field is required!'})} onChange={(e)=>setmoneyBoxVal(e.target.value)}>
                                                    <option value="">Please Select Drawer</option>
                                                    {
                                                        drawerAgents && drawerAgents.map((index,val)=>(
                                                            <option key={index.id} value={index.id}>Drawer {index.id}</option>
                                                        ))
                                                    }
                                                </select>
                                                <p className='text-danger fs-7 p-1'>{errors.MoneyBox?.message}</p>
                                            </div>
                                            <div className="clearfix"></div>    
                                        </div>
                                        <br />
                                        <Keyboard
                                            keyboardRef={r => (keyboard.current = r)}
                                            inputName={inputName}
                                            theme={"hg-theme-default hg-layout-default ui-keyboard"}
                                            layoutName={layoutName}
                                            onChangeAll={onChangeAll}
                                            onKeyPress={onKeyPress}
                                        />
                                        <div className="btn-wrap">
                                            <button id="login_email" type="submit" className="last"  disabled={isLoading}>{isLoading ? 'Loading...' : 'Log in'}</button>
                                        </div>
                                    </form>
                                    
                                </div>
                            </section>
                        </div>   
                    </div>
                </div>
            </div>
        </>
    )
} 