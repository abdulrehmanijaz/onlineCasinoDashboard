import React,{useState,useEffect} from 'react';
import { NavLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/ModeEdit';
import { getStorage } from '../../../utilities/storage';
import { validateToken } from '../../../utilities/validateToken';
import { useForm } from 'react-hook-form';
import Spinner from '../../spinner/spinner';
import { apiGet,apiPut, apiDelete } from '../../../utilities/userAuth';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications/dist/react-notifications';
import swal from 'sweetalert';
export default function GameWinningsModal(props) {
    
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [gameWinnings, setGameWinnings] = useState([]);
  const { register, handleSubmit,getValue,setValue,reset, formState: { errors } } = useForm({
    shouldFocusError: true,
    keepValues:true,
  });

  const {REACT_APP_API_URL} = process.env;
    
  useEffect( () => {  
    if(props.userData.id >  0){
      validateToken();
      getGameWinnings();
    }
  },[props]);
    
  const closePopup = () => {
    reset();
  }
    
  const cancelUpdate = () => {
    setIsUpdated(false);
    reset();
  }
    
  const getGameWinnings = () => {
    setIsLoading(true);
    let userInfo = getStorage('userInfo');
    if(userInfo && userInfo.token){
      let url =  `${REACT_APP_API_URL}/gameWinnings/getByUserId`;
      const params = {
        token: userInfo.token,
        user_id: props.userData.id
      }
      apiGet(url,params).then(response => {
        setIsLoading(false);
        if(response.data.code === 200){
          setGameWinnings(response.data.data);
        }
      }).catch(error => {
        let msg = 'Response Error! Please try again later.';
        NotificationManager.error(msg);
      });
    }else{
      window.location('/login');
    }
  }

  const deleteEntry = (entry_id) =>{
    setIsLoading(true);
    let userInfo = getStorage('userInfo');
    if(userInfo && userInfo.token){

      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this imaginary file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          let url = `${REACT_APP_API_URL}/gameWinnings/deleteOne`;
          const params = {
            token: userInfo.token,
            id: entry_id
          }
          apiDelete(url,params).then(response => {
            setIsLoading(false);
            if(parseInt(response.data.code) === 200){
              swal(response.data.message, {
                icon: "success",
              });
              //NotificationManager.success(response.data.message);
              getGameWinnings();
            }
          }).catch(error => {
            let msg = 'Response Error! Please try again later.';
            NotificationManager.error(msg);
          });
        } else {
          setIsLoading(false);
          swal("Your record is safe!");
        }
      }); 
    }else{
      window.location('/login');
    }
  }

  const editWinning = (winning) => {
    setIsUpdated(true);
    setValue('winning_id',winning.id);
    setValue('game_name',winning.game_name);
    setValue('winning_count',winning.winning_count);
  }

  const onSubmit = (formData) =>{
    setIsLoading(true);
    let userInfo = getStorage('userInfo');
    if(userInfo && userInfo.token){
        let url = `${REACT_APP_API_URL}/gameWinnings/update`;
        const params = {
          token : userInfo.token,
          id: formData.winning_id,
          winning_count: formData.winning_count,
        }
        apiPut(url,params).then(response => {
          setIsLoading(false);
          if(parseInt(response.data.code) === 200){
            NotificationManager.success(response.data.message);
            reset();
            getGameWinnings();
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
        <div className="modal fade" id="gameWinningsModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="gameWinningsModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="gameWinningsModalLabel">
                  {props.gameWinnings}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cancel"></button>
              </div>
                <div className="modal-body">
                  <div className="alert alert-info p-2">
                    Game winnings for user  
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
                        <h5>Active Winnings</h5>
                      </div>
                      <div className="clearfix">
                        <form className="p-1" action="" onSubmit={handleSubmit(onSubmit)}>
                          {isUpdated === true ? 
                          <div className="row card-header p-3">
                            <h6>Update Winning Count</h6>
                            <input className="form-control" type="hidden" id="winning_id" {...register("winning_id", {required: 'This field is required!'})} />
                            <div className="form-group col-sm-4">
                                <label htmlFor="game_name">Game Name</label>
                                <input disabled="disabled" className="form-control" type="text" id="game_name" {...register("game_name", {required: 'This field is required!'})} />
                                <p className='text-danger fs-7 p-1'>{errors.game_name?.message}</p>
                            </div>
                            <div className="form-group col-sm-4">
                                <label htmlFor="winning_count">Winning Count</label>
                                <input className="form-control" type="number" id="winning_count" {...register("winning_count", {required: 'This field is required!'})} />
                                <p className='text-danger fs-7 p-1'>{errors.winning_count?.message}</p>
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
                    </div>
                    <table className="table table-sm table-hover">
                      <thead className="thead-light">
                        <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Game ID</th>
                        <th scope="col">Winning Count</th>
                        <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gameWinnings && gameWinnings.map((winning, index) => (
                          <tr data-index="">
                            <th scope="row">{winning.id + 1}</th>
                            <td>
                            <div className="clearfix">
                              {winning.game_name}
                            </div>
                            </td>
                            <td>{winning.winning_count}</td>
                            <td>
                            <NavLink className="" to="/users" onClick={ e => editWinning(winning) }><EditIcon/></NavLink>
                            &nbsp;
                            <NavLink className="" to="/users" onClick={ e => deleteEntry(winning.id) }><DeleteIcon/></NavLink>
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