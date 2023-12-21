import React, { useEffect} from "react";
import Header from "../header";
import {  getStorage } from '../../utilities/storage';
import { validateToken } from '../../utilities/validateToken';
import AttachMoneySharpIcon from '@mui/icons-material/AttachMoneySharp';

export default function UserRole(props){

    useEffect( () => {
        validateToken();
    },[props]);
    
    let userInfo = getStorage('userInfo');

    return(
        <>
            <Header/>
            <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
                <div className="container-fluid py-1">
                    <div className="row">
                        <div className='action_grid' id="action_grid">
                            <div className="card">
                                <div className="card-header">
                                    <span className="float-start">
                                        <h4>Permissions</h4>
                                    </span>
                                </div>
                                <div className="card-body">
                                    <form className="p-1" action=""  autoComplete='off'>
                                        <div className="form-group col-sm-6">
                                            <label htmlFor="role_id">Roles</label>
                                            <select className="form-select"  >
                                                <option value="">Choose option</option>
                                                <option value="2">Administrator</option>
                                                <option value="1">Player</option>
                                                <option value="3">Distributor</option>
                                                <option value="4">Agent</option>
                                            </select>
                                            <p className='text-danger fs-7 p-1'></p>
                                            <input type="submit" name="submit" value="Update Permission" className="btn  bg-gradient-info"  />
                                        </div>
                                        <div className="admin_premissions">
                                            <ul className="permissions_list">
                                                <li>
                                                    <input type="checkbox" 
                                                    className="permissions_input" 
                                                    name="user_permission" id="dashboard" value="dashboard"/>
                                                    <label for="dashboard">Dashboard</label>    
                                                </li>
                                                <li>
                                                    <input type="checkbox" 
                                                    className="permissions_input" 
                                                    name="user_permission" id="customer_games" value="customer_games"/>
                                                    <label for="customer_games">Customer Game</label>    
                                                </li> 
                                                <li>
                                                    <input type="checkbox" 
                                                    className="permissions_input" 
                                                    name="user_permission" id="" value="system_settings"/>
                                                    <label for="system_settings">System Settings</label>    
                                                </li>
                                                <li>
                                                    <input type="checkbox" 
                                                    className="permissions_input" 
                                                    name="user_permission" id="customers" value="customers"/>
                                                    <label for="customers">Customers</label>    
                                                </li>
                                                <li>
                                                    <input type="checkbox" 
                                                    className="permissions_input" 
                                                    name="user_permission" id="distributers" value="distributers"/>
                                                    <label for="distributers">Distributers</label>    
                                                </li> 
                                                <li>
                                                    <input type="checkbox" 
                                                    className="permissions_input" 
                                                    name="user_permission" id="agents" value="agents"/>
                                                    <label for="agents">Agents</label>    
                                                </li> 
                                                <li>
                                                    <input type="checkbox" 
                                                    className="permissions_input" 
                                                    name="user_permission" id="store_products" value="store_products"/>
                                                    <label for="store_products">Store products</label>    
                                                </li> 
                                                <li>
                                                    <input type="checkbox" 
                                                    className="permissions_input" 
                                                    name="user_permission" id="permissions" value="permissions"/>
                                                    <label for="permissions">Permissions</label>    
                                                </li>
                                                <li>
                                                    <input type="checkbox" 
                                                    className="permissions_input" 
                                                    name="user_permission" id="reports" value="reports"/>
                                                    <label for="reports">Reports</label>    
                                                </li>
                                                <li>
                                                    <input type="checkbox" 
                                                    className="permissions_input" 
                                                    name="user_permission" id="news" value="news"/>
                                                    <label for="news">News</label>    
                                                </li> 
                                            </ul>
                                        </div>
                                    </form>    
                                </div>
                            </div>
                            
                        </div>
                   
                    </div>
                </div>    
            </main>
        </>
    )
}