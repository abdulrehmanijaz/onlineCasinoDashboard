import React,{useEffect} from "react";
import {useNavigate    } from "react-router";

export default function NotFound(){
    const navigate = useNavigate();
    useEffect(()=>{
        navigate('/dashboard')
    },[navigate])
    return(
        <>
            404 Not Found component....
        </>
    )
}