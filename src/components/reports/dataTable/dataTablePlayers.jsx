import React,{useState,useEffect} from 'react';

import { apiGet } from '../../../utilities/userAuth';
import { getStorage } from '../../../utilities/storage';
import { validateToken } from '../../../utilities/validateToken';
import LoadingIcon from '../../../assets/images/loading-icon.gif'

export default function DataTablePlayers(props) {
  const {REACT_APP_API_URL} = process.env;

  const [isLoading, setLoading] = useState(false);
  const [isGirdLoading, setGirdLoading] = useState(false);
  const [dataGridRows, setDataGridRows] = useState([]);

 
  useEffect( () => {
    validateToken();
    if(props.selectUserID !==  ''){
        
      const userInfo = getStorage('userInfo');
      setLoading(true)
      if(userInfo && userInfo.token){
        let url = `${REACT_APP_API_URL}/users/getReports`;
        const params = {
          token: userInfo.token,
          role_id:0,
          user_id:props.selectUserID 
        }
        apiGet(url,params).then(response => {
          if(response.data.code === 200){
            setGirdLoading(true)
            setDataGridRows(response.data.data)
            setLoading(false)
            // console.log(dataGridRows.game_details);
          }else{
           
          }
        }).catch(error => {
         
        });
      }  

    }else{
      setGirdLoading(false)
    }
  },[props,REACT_APP_API_URL]);
  return (
    <div>
       { isLoading ? <img src={LoadingIcon} className="loading_img" alt="" /> : '' }
        {isGirdLoading ? 
      <div className="card mt-3" >
        <div className="card-body">
          <>
            <table id='report_table' className='table table-bordered p-5'>
              <thead>
                <tr style={{ background: '#fff' ,'margin':'3px 0px'}}>
                  <h4>User Info</h4>
                </tr>
                <tr>
                  <td>Player Name</td>
                  <td>Status</td>
                  <td>Created Date</td>
                </tr>
                <tr>
                  <td>{dataGridRows.user_info[0].username}</td>
                  <td>{ parseInt(dataGridRows.user_info[0].status) === 1 ? 'Active' : 'Disable'}</td>
                  <td>{dataGridRows.user_info[0].created_date}</td>
                </tr>
              </thead>
              {dataGridRows.game_details.length !== 0 ? 
              <>
                <tr style={{ background: '#fff' ,'margin':'3px 0px'}}>
                  <h4>Game</h4>
                </tr>
                <tr>  
                  <td>Game Name</td>
                  <td>Winning Count</td>
                  <td>Created Date</td>
                </tr>
                {
                  dataGridRows.game_details && dataGridRows.game_details.map((gameval, gameindex) => (
                  <tr>
                    <td>{gameval.game_name}</td>
                    <td>{gameval.game_winnigs_count}</td>
                    <td>{gameval.game_created_entry}</td>
                  </tr> 
                  ))
                } 
              </>
              : '' }
              {dataGridRows.wallet_details.length !== 0 ? 
              <>
                <tr style={{ background: '#fff' ,'margin':'3px 0px'}}>
                  <h4>Wallet Details</h4>
                </tr>
                <tr>  
                  <td>Wallet Name</td>
                  <td>Available balance</td>
                  <td>Created Date</td>
                </tr>
                {
                  dataGridRows.wallet_details && dataGridRows.wallet_details.map((wallet_val, walletindex) => (
                  <tr>
                    <td>{wallet_val.wallet_name}</td>
                    <td>{wallet_val.available_balance}</td>
                    <td>{wallet_val.created_at}</td>
                  </tr> 
                  ))
                }  
                </>
              : '' }
              {dataGridRows.transactions_details.length !== 0 ? 
              <>
                <tr style={{ background: '#fff' ,'margin':'3px 0px'}}>
                  <h4>Transaction Details</h4>
                </tr>
                <tr>  
                  <td>Wallet Name</td>
                  <td>Transaction Type</td>
                  <td>Transaction Comment</td>
                  <td>Transaction Ammount</td>
                  <td>Is Completed</td>
                </tr>
                {
                  dataGridRows.transactions_details && dataGridRows.transactions_details.map((wallet_tr_val, walletindex) => (
                  <tr>
                    <td>{wallet_tr_val.wallet_name}</td>
                    <td>{wallet_tr_val.transaction_type}</td>
                    <td>{wallet_tr_val.transaction_comment}</td>
                    <td>{wallet_tr_val.transaction_amount}</td>
                    <td>{ parseInt(wallet_tr_val.is_completed) === 1 ? 'Completed' : 'Not Complete'}</td>
                  </tr> 
                  ))
                }  
                </>
              : '' }  
              
            </table>  
          </>
        </div> 
      </div> 
      : '' }
    </div>     
  );
}  

