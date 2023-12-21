import React,{useState,useEffect} from 'react';
import { useForm } from 'react-hook-form';
import Spinner from '../../spinner/spinner';
import { getStorage } from '../../../utilities/storage';
import { apiPost,apiGet } from '../../../utilities/userAuth';
import { validateToken } from '../../../utilities/validateToken';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';

export default function AddCurrencyModal(props) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [allGames, setAllGames] = useState([]);
  const { register, handleSubmit,reset, formState: { errors } } = useForm({
    shouldFocusError: true,
    keepValues:true,
  });
  const {REACT_APP_API_URL} = process.env;
  useEffect( ()=>{
    validateToken();
    getGames();
  },[props]);

  const closePopup = () => {
    reset();
  }

  const getGames = () => {
    // setIsLoading(true);
    const userInfo = getStorage('userInfo');
    if(userInfo ){
        let url = `${REACT_APP_API_URL}/games/getAll`;
        const params = {
            token: userInfo.token,
            is_active: 1 // active only
        }
        apiGet(url,params).then(response => {
            if(response.data.code === 200){
                // setIsLoading(false);
                setAllGames(response.data.data);
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
      let url = `${REACT_APP_API_URL}/currency/create`;
      const params = {
        token : userInfo.token,
        game_id: formData.game_id,
        name: formData.name,
        symbol: formData.symbol,
        conversion_rate: formData.conversion_rate,
        is_active: formData.is_active,
      }
      apiPost(url,params).then(response => {
        setIsLoading(false);
        reset();
        if(parseInt(response.data.code) === 200){    
          NotificationManager.success(response.data.message);
        }else{
          NotificationManager.error(response.data.message);    
        }
      }).catch(error => {
        let msg = 'Something Wrong! Please try after some time.';
        NotificationManager.error(msg);
      });
    }else{
      window.location('/login');
    }
  }
   
    return (
      <>
        { isLoading ? <Spinner/> : '' }
        <NotificationContainer/>
        <div className="modal fade" id="addCurrencyModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addCurrencyModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addCurrencyModalLabel">
                  {props.addCurrency}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
              </div>
              <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                <div className="clearfix">
                  <div className="row bg-white p-1 m-1">
                    <div className="form-group col-sm-6">
                        <label htmlFor="game_id">Choose Game</label>
                        <select className="form-select" id="game_id" {...register("game_id", {required: 'This field is required!'})} >
                          <option value="">Choose option</option>
                          <option value="0">All Games</option>
                          {allGames && allGames.map(({ name,id }, index) => <option value={id} >{name}</option>)}
                        </select>
                        <p className='text-danger fs-7 p-1'>{errors.game_id?.message}</p>
                    </div>
                  </div>
                  <div className="row bg-white p-1 m-1">
                    <div className="form-group col-sm-6">
                        <label htmlFor="name">Name</label>
                        <input className="form-control" type="text" id="name" {...register("name", {required: 'This field is required!'})} />
                        <p className='text-danger fs-7 p-1'>{errors.name?.message}</p>
                    </div>
                    <div className="form-group col-sm-6">
                        <label htmlFor="symbol">Symbol</label>
                        <input className="form-control" type="text" id="symbol" {...register("symbol", {required: 'This field is required!'})} />
                        <p className='text-danger fs-7 p-1'>{errors.symbol?.message}</p>
                    </div> 
                  </div>

                  <div className="row bg-white p-1 m-1">
                    <div className="form-group col-sm-6">
                        <label htmlFor="conversion_rate">Conversion Rate</label>
                        <input className="form-control" type="text" id="conversion_rate" {...register("conversion_rate", {required: 'This field is required!'})} />
                        <p className='text-danger fs-7 p-1'>{errors.conversion_rate?.message}</p>
                    </div> 
                    <div className="form-group col-sm-6">
                        <label htmlFor="is_active">Status</label>
                        <select className="form-select" id="is_active" {...register("is_active", {required: 'This field is required!'})} >
                            <option value="">Choose option</option>
                            <option value="1">Active</option>
                            <option value="0">Disable</option>
                        </select>
                        <p className='text-danger fs-7 p-1'>{errors.is_active?.message}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closePopup} className="btn bg-gradient-danger" data-bs-dismiss="modal">Cancel</button>
                <input type="submit" name="submit" id="submit" className="btn bg-gradient-info" value={isLoading ? 'Loading...' : 'Submit'} disabled={isLoading}  />
              </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }