import React,{useState} from 'react';
import { getStorage } from '../../../utilities/storage';
import DataTablePlayers from '../dataTable/dataTablePlayers'
import { apiGet } from '../../../utilities/userAuth';


export default function GridActions(props) {

    const [getUsers, setUserRole] = useState([]);
    const [selectUserID, setselectUserID] = useState('');

    const {REACT_APP_API_URL} = process.env;
    
    const handleChange = (e) =>{
        const userInfo = getStorage('userInfo');
        if(userInfo && userInfo.token){
            if(e !==""){
                let url = `${REACT_APP_API_URL}/users/getAll`;
                const params = {
                    token: userInfo.token,
                    role_id:e
                }
                apiGet(url,params).then(response => {
                    if(response.data.code === 200){
                        setUserRole(response.data.data);
                    }else{
                        
                    }
                }).catch(error => {
                    
                });
            }else{
                setUserRole([]);
                setselectUserID('')
            }
        }else{
            
        }
    }

    const handleGetReports = (e) =>{
        setselectUserID(e)
    }
   
    return (
        <>
            <div className='action_grid' id="action_grid">
                <div className="card">
                    <div className="card-body">
                        <h2>System Reports</h2>
                        <form action="">
                            <div className='row'>
                                <div className="form-group col-sm-6">
                                    <label htmlFor="role_id">User Roles</label>
                                    <select className="form-select" id="role_id" onChange={(e) => handleChange(e.target.value)} >
                                        <option value="">Choose option</option>
                                        {/* <option value="2">Adminstrator</option>
                                        <option value="3">Distributor</option>
                                        <option value="4">Agent</option> */}
                                        <option value="1">Player</option>
                                    </select>
                                </div>
                                <div className="form-group col-sm-6">
                                    { getUsers.length !== 0 ?
                                        <>
                                            <label htmlFor="user_info">Users</label>
                                            <select className="form-select" id="user_info" onChange={(e) => handleGetReports(e.target.value)}>
                                                <option value="">Select user</option>    
                                                {
                                                    getUsers && getUsers.map((userVal, index) => (
                                                        <option key={userVal.id} value={userVal.id} role_id={userVal.role_id}> {userVal.username}</option>
                                                    ))
                                                } 
                                            </select>
                                        </>
                                    : '' }
                                </div>
                                
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
            <DataTablePlayers selectUserID={selectUserID}/>
        </>
    );
}