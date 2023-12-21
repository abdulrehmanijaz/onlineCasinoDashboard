import React,{useState,useEffect} from 'react';


import 'react-notifications/lib/notifications.css';
import { apiGet } from '../../../utilities/userAuth';
import Button from '@mui/material/Button';
import PlusIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import PasswordIcon from '@mui/icons-material/Security';
import WalletIcon from '@mui/icons-material/Wallet';
import GameIcon from '@mui/icons-material/SportsEsports';
import CupIcon from '@mui/icons-material/EmojiEvents';
import BuyIcon from '@mui/icons-material/CreditCard';
import ClearSharpIcon from '@mui/icons-material/ClearSharp';
import AllModals from '../modals/all_modals';
import { getStorage } from '../../../utilities/storage';

export default function GridActions(props) {

    const [dataGridUserActionData, setDataGridUserActionData] = useState(0);
    const [dataEnhanceDetails,setEnhanceDetails]=useState([]);

    const {REACT_APP_API_URL} = process.env;

    const setClearActions = userProps =>{
        props.setCheckShowGrid(false)
    }

    useEffect(() => {
        getEnhancedDetails();
    },[props.isCheckShowGrid,props.userData]);

    const getEnhancedDetails = () => {
        // setIsLoading(true);
        const userInfo = getStorage('userInfo');
        if(userInfo ){
          let url = `${REACT_APP_API_URL}/users/getEnhanceDetails`;
          const params = {
            token: userInfo.token,
            user_id: props.userData.id // active only
          }
          apiGet(url,params).then(response => {
            if(response.data.code === 200){
              
              setEnhanceDetails(response.data.data);
            }else{
              
            }
          }).catch(error => {
            props.setCheckShowGrid(false)
          });
        }else{
            props.setCheckShowGrid(false)
        }
      }
     
    return (
        <div className='action_grid' id="action_grid">
            <div className="card">
                <div className="card-header">
                    <span className="float-start">
                        <h4>Players</h4>
                    </span>
                    <span className="float-end">
                        <a href='#'data-bs-toggle="modal" data-bs-target="#addUserModal" className="btn btn-outline-primary"><PlusIcon/> Add Player</a>
                    </span> 
                </div>
                <div className="card-body">
                    { props.isCheckShowGrid && Object.keys(props.userData).length !== 0  ? 
                    <>  
                    
                    <div className="alert p-2 bg-white">
                          You are changing the user account for
                          
                            <small>
                                <span className="float-end">
                                    <Button variant="text" className="text-black" startIcon={<ClearSharpIcon />}
                                        onClick={ e => setClearActions(props.userData) }
                                    />
                                </span> 
                                <ul className="userdetails list-group mt-2">
                                    {props.userData ? <li className='list-group-item'><strong>ID: </strong> {props.userData.id} </li> : ''}
                                    {props.userData ? <li className='list-group-item'><strong>Customer Name: </strong> {props.userData.name} </li> : ''}
                                    {props.userData ? <li className='list-group-item'><strong>Email: </strong> {props.userData.email} </li> : ''}
                                    {props.userData ? <li className='list-group-item'><strong>Driver Licence: </strong> {props.userData.driver_license} </li> : ''}
                                    {props.userData ? <li className='list-group-item'><strong>Mobile ID: </strong> {props.userData.mobile_id} </li> : ''}
                                    {dataEnhanceDetails ? <li className='list-group-item'><strong>Game Entries: </strong>{dataEnhanceDetails.get_entry_count} </li> : ''}
                                    {dataEnhanceDetails ?<li className='list-group-item'><strong>Game Winnings: </strong>{dataEnhanceDetails.get_game_winnigs} </li> : ''}
                                    {/* {dataEnhanceDetails && dataEnhanceDetails.wallet_details.map(({ currency_name,available_balance}, index) => 
                                    <li className='list-group-item'><strong>{currency_name}</strong> {available_balance}</li>)} */}
                                </ul>
                            </small>
                          </div> 
                        <Button variant="text" startIcon={<EditIcon />}
                            data-bs-toggle="modal" 
                            data-bs-target="#editUserModal"
                            onClick={ e => setDataGridUserActionData(props.userData) }
                        >
                            Edit Profile
                        </Button>
                        <Button variant="text" startIcon={<PasswordIcon />}
                            data-bs-toggle="modal" 
                            data-bs-target="#changePasswordModal"
                            onClick={ e => setDataGridUserActionData(props.userData) }
                        >
                            Change Password
                        </Button>
                        <Button variant="text" startIcon={<WalletIcon />}
                            data-bs-toggle="modal" 
                            data-bs-target="#walletDetailsModal"
                            onClick={ e => setDataGridUserActionData(props.userData) }
                        >
                            Wallet Balance
                        </Button>
                        <Button variant="text" startIcon={<GameIcon />}
                            data-bs-toggle="modal" 
                            data-bs-target="#gameEntriesModal"
                            onClick={ e => setDataGridUserActionData(props.userData) }
                        >
                            Game Entries
                        </Button>
                        <Button variant="text" startIcon={<CupIcon />}
                            data-bs-toggle="modal" 
                            data-bs-target="#gameWinningsModal"
                            onClick={ e => setDataGridUserActionData(props.userData) }
                        >
                            Winnings
                        </Button>
                        <Button variant="text" startIcon={<BuyIcon />}
                            data-bs-toggle="modal" 
                            data-bs-target="#buyCreditModal"
                            onClick={ e => setDataGridUserActionData(props.userData) }
                        >
                            Buy Credit
                        </Button>
                        <Button variant="text" startIcon={<DeleteIcon />}
                            onClick={ e => props.deleteUser(props.userData)}
                        >
                        Delete
                        </Button>
                        
                    </>    
                    : ' ' }
                   <AllModals setDataGridLoading={props.setDataGridLoading} setCheckShowGrid={props.setCheckShowGrid} selectedRows= {props.selectedRows} userData={dataGridUserActionData} apiRef={props.apiRef}  />
                </div>
            </div>
        </div>
    );
  }