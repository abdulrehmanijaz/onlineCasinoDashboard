import React, { Component } from 'react'
import axios from 'axios';

export async function apiDelete(url,params){
  return axios.delete( url, {params: params } ).then(response => {
  return response;
  }).catch(error => {
    return error.response;
  });
}

export async function apiGetOne(url,params){
  return axios.get( url, {params: params } ).then(response => {
    return response;
  }).catch(error => {
    return error.response;
  });
}

export async function apiGet(url,params){
  return axios.get( url, {params: params } ).then(response => {
    return response;
  }).catch(error => {
    return error.response;
  });
}

export async function apiPost(url,params,headers){
  let authorizedHeaders = '';
  if(headers){
    authorizedHeaders =  headers;
  }else{
    authorizedHeaders =  '';
  }
  return axios.post(url,params,authorizedHeaders).then(response => {
    return response;
  }).catch(error => {
    return error.response;
  });
}

export async function apiPut(url,params){
  return axios.put(url,params).then(response => {
    return response;
  }).catch(error => {
    return error.response;
  });
}


export default class userAuth extends Component {
  render() {
    return (
      <div>webapi</div>
    )
  }
}
