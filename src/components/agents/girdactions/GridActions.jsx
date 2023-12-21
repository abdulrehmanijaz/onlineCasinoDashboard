import React,{useState} from 'react';
import { getStorage } from '../../../utilities/storage';

import 'react-notifications/lib/notifications.css';

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

export default function GridActions(props) {

    const [dataGridUserActionData, setDataGridUserActionData] = useState(0);
   
    const setClearActions = userProps =>{
        props.setCheckShowGrid(false)
    }
    
    return (
        <div className='action_grid' id="action_grid">
            <div className="card">
                <div className="card-header">
                    <span className="float-start">
                        <h4>Agents</h4>
                    </span>
                    
                    <span className="float-end">
                        <a href='#'data-bs-toggle="modal" data-bs-target="#addAgentModal" className="btn btn-outline-primary"><PlusIcon/> Add Agent</a>
                    </span> 
               
                </div>
                <div className="card-body">
                    { props.isCheckShowGrid && Object.keys(props.userData).length !== 0  ? 
                    <>  <div className="alert alert-info p-2">
                          You are changing the user account for
                            <small>
                                <span className="float-end">
                                    <Button variant="text" className="text-white" startIcon={<ClearSharpIcon />}
                                        onClick={ e => setClearActions(props.userData) }
                                    />
                                </span> 
                                <ul className="mt-2">
                                    {props.userData ? <li><strong>ID: </strong> {props.userData.id} </li> : ''}
                                    {props.userData ? <li><strong>Customer Name: </strong> {props.userData.name} </li> : ''}
                                    {props.userData ? <li><strong>Email: </strong> {props.userData.email} </li> : ''}
                                </ul>
                            </small>
                          </div> 
                        <Button variant="text" startIcon={<EditIcon />}
                            data-bs-toggle="modal" 
                            data-bs-target="#EditAgentModal"
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
                        {/* <Button variant="text" startIcon={<WalletIcon />}
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
                        </Button> */}
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