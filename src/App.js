import React, { useState, useEffect } from 'react';
// import { Route, Switch } from 'react-router-dom';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
// import {Navigate } from 'react-router-dom';

// Bootstrap assets
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import './assets/css/default.css';
import './assets/js/site_script'
// Custom components
import Spinner from './components/spinner/spinner';
import Login from './components/login/login';
import Logout from './components/logout/logout';
import Dashboard from './components/dashboard/dashboard';
import Users from './components/users/users';
import Agents from './components/agents/agents';
import AgentInfo from './components/agents/agentinfo'
import Distributors from './components/distributors/distributors';
import DistributorInfo from './components/distributors/distributorinfo'
import Settings from './components/settings/settings';
import Products from './components/products/products';
import ProductsInfo from './components/products/productsinfo';

import Games from './components/games/games';
import Reports from './components/reports/reports';
import UserRole from './components/userrole/userrole';

import AdminstratorUsers from './components/adminstratoruser/aminstratoruser';
import AdminstratorInfo from './components/adminstratoruser/adminstratorinfo';

import NotFound from './components/notfound/notfound';
import UserNews from './components/usernews/UserNews'
import UserNewsInfo from './components/usernews/usernewsinfo';
import Ratings from './components/ratings/ratings'
import RatingInfo from './components/ratings/ratinginfo';

import UserChat from './components/userchat/userchat'
import UserChatInfo from './components/userchat/userchatinfo';
import UserLoan from './components/userloan/userloan';
import UserLoanInfo from './components/userloan/userloaninfo';
import UserWinners from './components/userwinners/userwinners';
import UserWinnersInfo from './components/userwinners/userwinnersinfo';
import WheelWinners from './components/userwinners/wheelwinners';
import DrawerSummary from './components/drawer/drawer';
import Customeraccount from './components/customeraccount/customeraccount';
import Customerinfo from './components/customeraccount/customerinfo';
import DrawerSetup from './components/drawer/drawersetup';
import Machines from './components/machines/machines';
import ReloaderReport from './components/reloader/reloader';
import GameInfo from './components/games/gameinfo';
import { getStorage } from './utilities/storage';

export default function App(props){
  
  const [loading,setLoading] = useState(false);
  const userInfo = getStorage('userInfo');

  var role_id = '';
    if(userInfo !== '' && userInfo !== null){
      const user_info = Object.values(userInfo);
      role_id = user_info[3].role_id 
    }

  useEffect (
    () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    },[]
  );
  return (
    <div  className="g-sidenav-show">
      {loading ? 
        <Spinner/>
      :
        <>
          <Router>
            { role_id ==='' ?
              <Routes>
                <Route path='/not-found' element={<NotFound/>} />
                <Route path="/logout" element={<Logout />} />
                <Route path='/login' exact element={<Login/>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path='/' exact element={<Navigate to ="/login" />} />
                <Route path="*" element={<NotFound/>}/> 
              </Routes> : '' 
            }
            { parseInt(role_id) === 2 ?
              <Routes> 
                
                
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/drawer" element={<DrawerSummary />} />
                <Route path='/customeraccount' element={<Customeraccount/>} />
                <Route path='/customeraccount/:id' element={<Customeraccount/>} />
                <Route path='/customerinfo' element={<Customerinfo/>} />
                <Route path='/drawersetup' element={<DrawerSetup/>} />
                <Route path='/machines' element={<Machines/>} />
                <Route path='/reloader' element={<ReloaderReport/>} />  

                <Route path="/adminstratorusers" element={<AdminstratorUsers/>} />
                <Route path="/adminstratorinfo/:id" element={<AdminstratorInfo />}/>


                <Route path="/users" element={<Users/>} />
                <Route path="/ratings" element={<Ratings/>} />
                <Route path="/rating/:id" element={<RatingInfo/>} />

                <Route path="/userchat" element={<UserChat/>} />
                <Route path="/userchatinfo/:id" element={<UserChatInfo/>} />
                
                <Route path="/userloan" element={<UserLoan/>} />
                <Route path="/userloanInfo/:id" element={<UserLoanInfo/>} />
                
                <Route path="/userwinners" element={<UserWinners/>} />
                <Route path="/wheelwinners" element={<WheelWinners/>} />

                <Route path="/userwinnersinfo/:id" element={<UserWinnersInfo/>} />
                

                
                <Route path="/usernews" element={<UserNews/>} />
                <Route path="/usernewsinfo/:id" element={<UserNewsInfo/>} />
                


                <Route path="/agents" element={<Agents/>} />
                <Route path="/agentInfo/:id" element={<AgentInfo/>} />
                

                <Route path="/distributors" element={<Distributors/>} />
                <Route path="/distributorinfo/:id" element={<DistributorInfo/>} />

                <Route path="/userrole" element={<UserRole/>} />
                
                <Route path="/games" element={<Games/>} />
                <Route path="/gameinfo/:id" element={<GameInfo/>} />

                <Route path="/reports" element={<Reports/>} />
                <Route path="/settings" element={<Settings/>} />
                <Route path="/products" element={<Products/>} />
                <Route path="/product/:id" element={<ProductsInfo/>} />
                
                <Route path='/not-found' element={<NotFound/>} />
                <Route path="/logout" element={<Logout />} />
                <Route path='/login' exact element={<Login/>} />
                <Route path='/' exact element={<Navigate to ="/login" />} />
                <Route path="*" element={<NotFound/>}/> 
              
              </Routes> 
            :''}
            { parseInt(role_id) === 3  ? 
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />  
                <Route path="/agents" element={<Agents/>} />
                <Route path="/agentInfo/:id" element={<AgentInfo/>} />
                <Route path='/not-found' element={<NotFound/>} />
                <Route path="/logout" element={<Logout />} />
                <Route path='/login' exact element={<Login/>} />
                <Route path='/' exact element={<Navigate to ="/login" />} />
                <Route path="*" element={<NotFound/>}/> 
              </Routes> 
            :''}
            { parseInt(role_id) === 4 ?  
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />  
                <Route path="/users" element={<Users/>} />
                <Route path="/ratings" element={<Ratings/>} />
                <Route path="/rating/:id" element={<RatingInfo/>} />
                <Route path="/userchat" element={<UserChat/>} />
                <Route path="/userchatinfo/:id" element={<UserChatInfo/>} />
                <Route path="/userloan" element={<UserLoan/>} />
                <Route path="/userloanInfo/:id" element={<UserLoanInfo/>} />
                <Route path="/userwinners" element={<UserWinners/>} />
                <Route path="/userwinnersinfo/:id" element={<UserWinnersInfo/>} />
                <Route path='/not-found' element={<NotFound/>} />
                <Route path="/logout" element={<Logout />} />
                <Route path='/login' exact element={<Login/>} />
                <Route path='/' exact element={<Navigate to ="/login" />} />
                <Route path="*" element={<NotFound/>}/> 
              </Routes>
            :''}
          </Router>
        </>
      }
    </div>
  );

}