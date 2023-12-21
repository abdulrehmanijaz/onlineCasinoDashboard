import React,{useState,useEffect} from 'react';
import Spinner from '../../spinner/spinner';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/ModeEdit';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { apiGet, apiPut, apiDelete } from '../../../utilities/userAuth';
import { getStorage } from '../../../utilities/storage';
import { validateToken } from '../../../utilities/validateToken';

import swal from 'sweetalert';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';

export default function WalletDetailsModal(props) {
    
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [userWallets, setUserWallets] = useState([]);
    const { register, handleSubmit,setValue,reset, formState: { errors } } = useForm({
      shouldFocusError: true,
      keepValues:true,
    });
    const {REACT_APP_API_URL} = process.env;
    useEffect( () => {
      
      if(props.userData.id >  0){
        validateToken();
        getWallets();
      }
      
    },[props]);
    
    const closePopup = () => {
      reset();
    }

    const getWallets = () => {
      setIsLoading(true);
      let userInfo = getStorage('userInfo');
      if(userInfo && userInfo.token){
        let url = `${REACT_APP_API_URL}/usersWallet/getByUserId`;
        const params = {
          token: userInfo.token,
          user_id: props.userData.id
        }
        apiGet(url,params).then(response => {
          setIsLoading(false);
          if(parseInt(response.data.code) === 200){
            setUserWallets(response.data.data);
          }
        }).catch(error => {
          let msg = 'Response Error! Please try again later.';
          NotificationManager.error(msg);
        });
      }else{
        window.location('/login');
      }
    }

    const deleteWallet = (wallet_id) =>{
      setIsLoading(true);
      let userInfo = getStorage('userInfo');
      if(userInfo && userInfo.token){
        
        swal({
          title: "Are you sure?",
          text: "Once deleted, you will not be able to recover this wallet!",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            
            let url = `${REACT_APP_API_URL}/usersWallet/deleteOne`;
            const params = {
              token: userInfo.token,
              id: wallet_id
            }
            apiDelete(url,params).then(response => {
              setIsLoading(false);
              if(parseInt(response.data.code) === 200){
                swal(response.data.message, {
                  icon: "success",
                });
                //NotificationManager.success(response.data.message);
                getWallets();
              }
            }).catch(error => {
              setIsLoading(false);
              let msg = 'Response Error! Please try again later.';
              NotificationManager.error(msg);
            });
          } else {
            swal("Wallet is safe!");
            setIsLoading(false);
          }
        });
      }else{
        window.location('/login');
      }
    }

    const cancelUpdate = () => {
      setIsUpdated(false);
      reset();
    }

    const editWallet = (wallet) => {
      setIsUpdated(true);
      setValue('wallet_id',wallet.id);
      setValue('currency_name',wallet.currency_name);
      setValue('available_balance',wallet.available_balance);
    }

    const onSubmit = (formData) =>{
      setIsLoading(true);
      let userInfo = getStorage('userInfo');
      if(userInfo && userInfo.token){
          let url = `${REACT_APP_API_URL}/usersWallet/update`;
          const params = {
            token : userInfo.token,
            id: formData.wallet_id,
            currency_name: formData.currency_name,
            available_balance: formData.available_balance,
          }
          apiPut(url,params).then(response => {
            setIsLoading(false);
            if(response.data.code === 200){
              NotificationManager.success(response.data.message);
              reset();
              getWallets();
              setIsUpdated(false);
            }else{
              NotificationManager.error(response.data.message);    
            }
          }).catch(error => {
            let msg = 'Something Wrong! Please try after some time.';
            NotificationManager.error(msg);   
          });
      }else{
        window.location.href = "/login";
      }
    }

    return (
      <>
        {/* { isLoading ? <Spinner/> : '' } */}
        <NotificationContainer/>
        <div className="modal fade" id="walletDetailsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="walletDetailsModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="walletDetailsModalLabel">
                  {props.walletDetails}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info p-2">
                  Wallet details for the user  
                  <small>
                    <ul className="mt-2">
                      {props.userData ? <li><strong>ID: </strong> {props.userData.id} </li> : ''}
                      {props.userData ? <li><strong>Customer Name: </strong> {props.userData.name} </li> : ''}
                      {props.userData ? <li><strong>Email: </strong> {props.userData.email} </li> : ''}
                    </ul>
                  </small>
                </div>
                <div className="col-lg-12">
                  <br/>
                  <div className="row">
                    <div className="col-6 text-start">
                      <h5>Active Wallets</h5>
                    </div>
                  </div>
                  <div className="clearfix">
                    <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)}>
                      {isUpdated === true ? 
                      <div className="row card-header p-3">
                        <h6>Update Balance</h6>
                        <input className="form-control" type="hidden" id="wallet_id" {...register("wallet_id", {required: 'This field is required!'})} />
                        <div className="form-group col-sm-4">
                            <label htmlFor="currency_name">Currency</label>
                            <input disabled="disabled" className="form-control" type="text" id="currency_name" {...register("currency_name", {required: 'This field is required!'})} />
                            <p className='text-danger fs-7 p-1'>{errors.currency_name?.message}</p>
                        </div>
                        <div className="form-group col-sm-4">
                            <label htmlFor="available_balance">Available Balance</label>
                            <input className="form-control" type="number" id="available_balance" {...register("available_balance", {required: 'This field is required!'})} />
                            <p className='text-danger fs-7 p-1'>{errors.available_balance?.message}</p>
                        </div>
                        <div className="form-group col-sm-4">
                          <br/>
                          <button type="button" onClick={cancelUpdate} className="btn bg-gradient-danger">Cancel</button>
                          &nbsp;
                          <input type="submit" name="submit" id="submit" className="btn bg-gradient-info" value={isLoading ? 'Loading...' : 'Update'} disabled={isLoading}  />
                        </div>
                      </div>
                      : '' }
                    </form>
                  </div>
                  <table className="table table-sm table-hover">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Currency</th>
                        <th scope="col">Available Balance</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userWallets && userWallets.map((wallet, index) => (
                        <tr data-index="">
                          <th scope="row">{wallet.id + 1}</th>
                          <td>
                            <div className="clearfix">
                              {wallet.currency_name}
                            </div>
                          </td>
                          <td>{wallet.available_balance}</td>
                          <td>
                            <NavLink className="" to="/users" onClick={ e => editWallet(wallet) }><EditIcon/></NavLink>
                            &nbsp;
                            <NavLink className="" to="/users" onClick={ e => deleteWallet(wallet.id) }><DeleteIcon/></NavLink>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closePopup} className="btn bg-gradient-danger" data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }