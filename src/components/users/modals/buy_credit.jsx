import React,{useState,useEffect} from 'react';
import { getStorage } from '../../../utilities/storage';
import { validateToken } from '../../../utilities/validateToken';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useForm } from 'react-hook-form';
import Spinner from '../../spinner/spinner';
import Button from '@mui/material/Button';
import { apiPost,apiGet,apiPut } from '../../../utilities/userAuth';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';
import swal from 'sweetalert';

export default function BuyCreditModal(props) {
    
    const [isLoading, setIsLoading] = useState(false);
    const [allUserWallets, setAllUserWallets] = useState([]);
    const [userWalletBalance, setUserWalletBalance] = useState('');
    const [isError,setIsError]=useState(''); 
    const[availableBalance, setAvailableBalance]=useState('');

    const { register, handleSubmit,reset, formState: { errors } } = useForm({
      shouldFocusError: true,
      keepValues:true,
    });
    const {REACT_APP_API_URL} = process.env;
    useEffect( () => {
      if(props.userData.id >  0){
        validateToken();
        getUserWallets();
      }
    },[props]);

    const closePopup =()=>{

    }
    const handleChange = (e) =>{
      setAvailableBalance('')
      const idx = e.target.selectedIndex;
      const option = e.target.querySelectorAll('option')[idx];
      const balance = option.getAttribute('data-balance');
      setAvailableBalance(balance);
    }

    const getUserWallets = () => {
        // setIsLoading(true);
      const userInfo = getStorage('userInfo');
      if(userInfo ){
        let url = `${REACT_APP_API_URL}/usersWallet/getByUserId`;
        const params = {
          token: userInfo.token,
          user_id: props.userData.id
        }
          apiGet(url,params).then(response => {
            if(parseInt(response.data.code) === 200){
                // setIsLoading(false);
              setAllUserWallets(response.data.data);
            }else{
              // setIsLoading(false);
            }
          }).catch(error => {
            setIsLoading(false);
          });
      }else{
        setIsLoading(false);
      }
    }

    const onSubmit = (formData) =>{
      setIsLoading(true);
      let userInfo = getStorage('userInfo');
      if(userInfo && userInfo.token){
        if(formData.entry_count !==""){
          let url = `${REACT_APP_API_URL}/usersWalletTransactions/create`;
          const params = {
            token : userInfo.token,
            wallet_id: formData.wallet_id,
            user_id: props.userData.id,
            currency_id: 0, //formData.currency_id,
            game_id: 0, //formData.game_id,
            transaction_type: 'Credit',
            transaction_amount: formData.entry_count,
            transaction_comment: 'Purchased an game entry from wallet balance',
            is_completed: 1,
            is_active: 1
          }
          apiPost(url,params).then(response => {
            setIsLoading(false);
            if(parseInt(response.data.code) === 200){
              //Calculate wallet balance here and update it
              NotificationManager.success(response.data.message);
              reset();
            }else{
              NotificationManager.error(response.data.message);    
            }
          }).catch(error => {
            let msg = 'Something Wrong! Please try after some time.';
            NotificationManager.error(msg);   
          });
        }else if(formData.card_number !==""){
          let conver_rate = 0.5;
          let coins_val = formData.amount/conver_rate;
          coins_val     = parseInt(coins_val);

          let availbln  = parseInt(availableBalance);

          let conis_upval = coins_val + availbln;

          let url = `${REACT_APP_API_URL}/payment/stripe/makePaymentWithOutCustomer`;
          const params = {
            token:userInfo.token,
            card:{
              number:formData.card_number,
              exp_month:formData.exp_month,
              exp_year:formData.exp_year,
              cvc:formData.exp_cvc,
            },
            customer:{
              description:formData.customer_discription
            },
            amount:formData.amount
          }

          apiPost(url,params).then(response => {
            if(parseInt(response.data.code) === 200 && response.data.success){
              NotificationManager.success(response.data.message);
              let wallet_trans = `${REACT_APP_API_URL}/usersWalletTransactions/create`;
              const wallet_trans_pram = {
                token:userInfo.token,
                wallet_id:formData.wallet_id,
                user_id:props.userData.id,
                transaction_type:'credit',
                transaction_amount:formData.amount,
                transaction_comment:'Purchased coins from dashboard.',
                is_completed:1,
                is_active:1
              }
              apiPost(wallet_trans,wallet_trans_pram).then(usersWalletTransactionscreate => {
                if(usersWalletTransactionscreate.data.success){
                  
                    let   update_wallet = `${REACT_APP_API_URL}/usersWallet/update`;
                    const update_wallet_pram = {
                      token:userInfo.token,
                      id:formData.wallet_id,
                      available_balance:conis_upval,
                      is_active:'1',
                    }
                    apiPut(update_wallet,update_wallet_pram).then(usersWalletupdate => {
                      //console.log(usersWalletupdate)
                      reset();
                      setIsError('');
                      NotificationManager.success(usersWalletupdate.data.message);
                      setIsLoading(false);
                    }).catch(usersWalletupdateerror => {
                      let msg = 'Something Wrong! Please try after some time.';
                      NotificationManager.error(msg);   
                    });
    
                }else{
    
                  let msg = 'Something Wrong! Please try after some time.';
                  NotificationManager.error(msg);   
                  setIsLoading(false);
    
                }
                
              }).catch(usersWalletTransactionserror => {
                let msg = 'Something Wrong! Please try after some time.';
                NotificationManager.error(msg);   
                setIsLoading(false);
              });
              
              //reset();
            }else{
              if(response.data.data.message !==""){
                setIsError(response.data.data.message)
    
              }else{
                let msg = 'Something Wrong! Please try after some time.';
                NotificationManager.error(msg);  
              }
              setIsLoading(false);
              //NotificationManager.error(response.data.message);    
            }
          }).catch(error => {
            let msg = 'Something Wrong! Please try after some time.';
            NotificationManager.error(msg);   
          });  
        }
       
      }else{
        window.location.href = "/login";
      }
    }
    return (
      <>
        {/* { isLoading ? <Spinner/> : '' } */}
        <NotificationContainer/>
        <div className="modal fade" id="buyCreditModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="buyCreditModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="buyCreditModalLabel">
                  {props.buyCredit}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info p-2">
                  You are adding credit for user  
                  <small>
                    <ul className="mt-2">
                      {props.userData ? <li><strong>ID: </strong> {props.userData.id} </li> : ''}
                      {props.userData ? <li><strong>Customer Name: </strong> {props.userData.name} </li> : ''}
                      {props.userData ? <li><strong>Email: </strong> {props.userData.email} </li> : ''}
                    </ul>
                  </small>
                </div>
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-6 text-start">
                      <h5>Buy Game Credit</h5>
                    </div>
                    <div className="clearfix">
                      <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)}>
                        <div className="row card-header p-3">
                          {/* <input className="form-control" type="hidden" id="currency_id" {...register("currency_id", {required: 'This field is required!'})} /> */}
                            <div className="row">
                                <div className="form-group col-sm-8">
                                  <label htmlFor="type">What to buy?</label>
                                  <select onClick={ e => setUserWalletBalance(e.target.value) }   className="form-select" id="type" {...register("type", {required: 'This field is required!'})} >
                                    <option value="">Choose option</option>
                                    <option value="wallet_balance">Refill wallet credit from credit/debit card</option>
                                    <option value="game_entries">Buy a game entry from wallet balance</option>
                                  </select>
                                  <p className='text-danger fs-7 p-1'>{errors.type?.message}</p>
                                </div>
                                {userWalletBalance === 'wallet_balance' ?  
                                    /* Strip card options */
                                  <div className="row">
                                    <div className="col-lg-12">
                                    <Card variant="outlined">
                                      <CardContent>
                                          {/* <h1 htmlFor="card"> Card </h1> */}
                                          {/* <form id="payment-form"  onSubmit={handleSubmit(onSubmit)}> */}
                                            <div className="row bg-white p-1 m-1">
                                              <div className="form-group col-sm-6">
                                                <label htmlFor="wallet_id">Wallet</label>
                                                <select className="form-select" {...register("wallet_id", {required: 'This field is required!'})} 
                                                onChange={(e) => handleChange(e)}>
                                                  
                                                  {allUserWallets && allUserWallets.map((wallet, index) => (
                                                    <option data-balance={wallet.available_balance} value={wallet.id}> {wallet.currency_name} - {'Balance:' + wallet.available_balance} </option>
                                                  ))} 
                                                      
                                                </select>
                                                <p className='text-danger fs-7 p-1'>{errors.wallet_id?.message}</p>
                                              </div>
                                              <div className="form-group col-sm-6">
                                                <label htmlFor="amount">Amount</label>
                                                <input className="form-control" 
                                                type="number" 
                                                id="amount" 
                                                placeholder="Amount" {...register("amount", {required: 'This field is required!'})} 
                                                autoComplete="off"/>
                                                <p className='text-danger fs-7 p-1'>{errors.amount?.message}</p>
                                              </div>
                                            </div>
                                            <div className="row bg-white p-1 m-1">
                                              <h2>Card</h2>
                                              <div className="form-group col-sm-5">
                                                <label htmlFor="card_number">Card number</label>
                                                <input className="form-control" 
                                                  type="number" 
                                                  id="card_number" 
                                                  placeholder="Card number" {...register("card_number", {required: 'This field is required!'})} 
                                                  autoComplete="off"
                                                />
                                                <p className='text-danger fs-7 p-1'>{errors.card_number?.message}</p>
                                              </div>
                                              <div className="form-group col-sm-3">
                                                <label htmlFor="exp_month">Expiry month</label>
                                                <input className="form-control" 
                                                type="number" 
                                                id="exp_month" 
                                                placeholder="Expiry month" {...register("exp_month", {required: 'This field is required!'})} 
                                                autoComplete="off"/>
                                                <p className='text-danger fs-7 p-1'>{errors.exp_month?.message}</p>
                                              </div>
                                              <div className="form-group col-sm-2">
                                                <label htmlFor="exp_year">Expiry year</label>
                                                <input className="form-control" 
                                                type="number" 
                                                id="exp_year" 
                                                placeholder="Expiry year" {...register("exp_year", {required: 'This field is required!'})} 
                                                autoComplete="off"/>
                                                <p className='text-danger fs-7 p-1'>{errors.exp_year?.message}</p>
                                              </div>
                                              <div className="form-group col-sm-2">
                                                <label htmlFor="exp_cvc">Expiry CVC</label>
                                                <input className="form-control" 
                                                type="number" 
                                                id="exp_cvc" 
                                                placeholder="Expiry CVC" {...register("exp_cvc", {required: 'This field is required!'})} 
                                                autoComplete="off"/>
                                                <p className='text-danger fs-7 p-1'>{errors.exp_cvc?.message}</p>
                                              </div>   
                                            </div>
                                            <div className="row bg-white p-1 m-1">
                                              <h2>Customer description</h2>
                                              <textarea className="form-control" id="customer" 
                                              placeholder="Customer Description" {...register("customer_discription", {required: 'This field is required!'})} 
                                              autoComplete="off"></textarea>  
                                              <p className='text-danger fs-7 p-1'>{errors.customer_discription?.message}</p>
                                            </div>
                                            { isError !== '' ? 
                                              <div className="alert alert-danger p-2">
                                                {isError}
                                              </div>
                                            : ' ' }
                                            <Button type="submit" variant="contained" className='mt-5' disabled={isLoading} >{isLoading ? 'Loading...' : 'Pay'} </Button>
                                          
                                      </CardContent>
                                    </Card>
                                    </div>
                                  </div>
                                : 
                                    /* Other buying options */
                                  <div className="row">
                                    <div className="form-group col-sm-4">
                                      <label htmlFor="wallet_id">Choose Wallet</label>
                                      <select className="form-select" id="wallet_id" {...register("wallet_id", {required: 'This field is required!'})} >
                                        <option value="">Choose option</option>
                                        {allUserWallets && allUserWallets.map((wallet, index) => (
                                          <option value={wallet.id}> {wallet.currency_name} - {'Balance:' + wallet.available_balance} </option>
                                        ))}  
                                      </select>
                                      <p className='text-danger fs-7 p-1'>{errors.wallet_id?.message}</p>
                                    </div>
                                    <div className="form-group col-sm-4">
                                      <label htmlFor="entry_count">How many entries? </label>
                                      <input className="form-control" type="number" id="entry_count" {...register("entry_count", {required: 'This field is required!'})} />
                                      <p className='text-danger fs-7 p-1'>{errors.entry_count?.message}</p>
                                    </div>
                                      <div className="form-group col-sm-12">
                                        <button type="button" onClick={closePopup} className="btn bg-gradient-danger" data-bs-dismiss="modal">Cancel</button>
                                        &nbsp;
                                        <input type="submit" name="submit"  className="btn bg-gradient-info" value={isLoading ? 'Loading...' : 'Submit'} disabled={isLoading}  />
                                      </div>
                                  </div>
                                } 
                            </div>
                        </div>
                      </form>
                    </div>
                  </div>
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