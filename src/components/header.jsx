import React, { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import Spinner from "../components/spinner/spinner";
import { useNavigate } from "react-router";
import { apiPost, apiPut } from "../utilities/userAuth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DrawerIcon from "../assets/img/icon_Drawer.png";
import CustomerAccountIcon from "../assets/img/icon_CustomerAccount.png";
import MachineIcon from "../assets/img/icon_Machine.png";
import ReportsIcon from "../assets/img/icon_Reports.png";
import SystemIcon from "../assets/img/icon_SystemSetup.png";
import BulitInIcon from "../assets/img/icon_BulletinBoard.png";
import LogoutIcon from "../assets/img/icon_Logout.png";
import MobileHeader from "./mobileHeader";
import UserIcon from "@mui/icons-material/Person";
// import GameIcon from '@mui/icons-material/SportsEsports';
// import ReportIcon from '@mui/icons-material/Assessment';
// // import WalletIcon from '@mui/icons-material/Wallet';
// import SettingsIcon from '@mui/icons-material/Settings';
// import ProductIcon from '@mui/icons-material/BadgeSharp';
//
// import NewspaperIcon from '@mui/icons-material/Newspaper';
// import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import BoyIcon from "@mui/icons-material/Boy";
// import KeySharpIcon from '@mui/icons-material/KeySharp';
import GradeIcon from "@mui/icons-material/Grade";
// import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { getStorage, flushStorage } from "../utilities/storage";
import { validateToken } from "../utilities/validateToken";
import ChatIcon from "@mui/icons-material/Chat";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";

export default function Header(props) {
  const location = useLocation();
  const [show, setShow] = useState();

  const [loading, setLoading] = useState(false);
  const [logoutEveryWhere, setlogoutEveryWhere] = useState(false);
  const userInfo = getStorage("userInfo");
  const drawer_no = getStorage("drawer_no");
  const shiftid = getStorage("shiftid");

  var role_id = "";
  if (userInfo !== "" && userInfo !== null) {
    const user_info = Object.values(userInfo);
    role_id = user_info[3].role_id;
  }

  const getNavLinkClass = (path) => {
    for (let i = 0; i < path.length; i++) {
      if (path[i] === location.pathname) {
        return "active";
      }
    }
  };
  const { REACT_APP_API_URL } = process.env;
  const navigate = useNavigate();
  const getShowClass = (path) => {
    for (let i = 0; i < path.length; i++) {
      if (path[i] === location.pathname) {
        return "block";
      }
    }
  };
  const justLogout = () => {
    if (userInfo) {
      let url = `${REACT_APP_API_URL}/users/logout`;
      const data = {
        token: userInfo.token,
        user_id: userInfo.user_info.id,
      };
      apiPost(url, data)
        .then((response) => {
          document.getElementById("closeLogoutpopup").click();
          setTimeout(function () {
            setLoading(false);
            flushStorage();
            navigate("/login");
          }, 250);
        })
        .catch((error) => {
          setLoading(false);
          flushStorage();
          navigate("/login");
        });
    } else {
      flushStorage();
      navigate("/login");
    }
  };
  const logOutEveryWhere = () => {
    if (userInfo) {
      setlogoutEveryWhere(true);
      let update_req = `${REACT_APP_API_URL}/userDrawersShift/update`;
      const params = {
        token: userInfo.token,
        id: shiftid,
        is_logout: 1,
        is_completed: 1,
      };
      apiPut(update_req, params)
        .then((updateresponse) => {
          if (updateresponse.data.code === 200) {
            let url = `${}/users/logout`;
            const data = {
              token: userInfo.token,
              user_id: userInfo.user_info.id,
            };
            apiPost(url, data)
              .then((response) => {
                setlogoutEveryWhere(false);
                document.getElementById("closeLogoutpopup").click();
                setTimeout(function () {
                  flushStorage();
                  navigate("/login");
                }, 250);
              })
              .catch((error) => {
                setlogoutEveryWhere(false);
                flushStorage();
                navigate("/login");
              });
          } else {
            setlogoutEveryWhere(false);
            flushStorage();
            navigate("/login");
          }
        })
        .catch((error) => {
          setlogoutEveryWhere(false);
          flushStorage();
          navigate("/login");
        });
    } else {
      flushStorage();
      setlogoutEveryWhere(false);
      navigate("/login");
    }
  };
  return (
    <>
      {loading ? <Spinner /> : ""}
      <header className="header">
        <div className="row align-items-center height-100">
          <div className="col-md-6 d-flex align-items-center justify-content-between mb-1 mb-md-0">
            <h1>
              Golden Dragon Pos
              <span className="ft15"> (Release)</span>
            </h1>
            <h1 className="d-block d-lg-none" onClick={() => setShow(!show)}>
              <i className="fa fa-bars"></i>
            </h1>
          </div>
          <div className="col-md-6">
            <div className="header-right d-flex justify-content-md-end justify-content-center align-items-center">
              <div className="username">Welcome ~ {userInfo ? userInfo.user_info.name : ""}</div>
              <div className="nation Navigation">
                <ul className="lanNav">
                  <li>
                    <a href>English</a>
                    <ul>
                      <li>
                        <a href>English</a>
                      </li>

                      <li>
                        <a href>简体中文</a>
                      </li>

                      <li>
                        <a href>Español</a>
                      </li>
                    </ul>
                  </li>
                </ul>
                <br className="clear" />
              </div>
              <div className="username">{parseInt(role_id) === 3 ? "Distributor" : parseInt(role_id) === 4 ? "Agent" : parseInt(role_id) === 1 ? "Player" : parseInt(role_id) === 2 ? "Adminstrator" : ""}</div>
            </div>
          </div>
        </div>
      </header>
      {window.innerWidth < 992 && <MobileHeader show={show} setShow={setShow} />}
      <div id="MarqueeDiv" className="scroll-text marquee-wrap">
        <ul>
          <li data-delay="15">Please be advised that the following behaviors are NOT allowed on GD. Any violation will lead to terminate the account immediately!</li>
          <li>Please be advised that the following behaviors are NOT allowed on GD. Any violation will lead to terminate the account immediately!</li>
        </ul>
      </div>
      <>
        <aside className="sidenav p-0 d-lg-block d-none" id="sidenav-main">
          <div className="sidenav-header">
            <div className="dash-menu">
              {parseInt(role_id) === 2 ? (
                <ul className="nav">
                  <li>
                    <NavLink to="/dashboard">
                      {" "}
                      <DashboardIcon />
                      &nbsp;Dashboard{" "}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/drawer">
                      {" "}
                      <img src={DrawerIcon} alt="" />
                      &nbsp;Drawer{" "}
                    </NavLink>
                  </li>
                  <li>
                    <a href className={getNavLinkClass(["/customeraccount", "/customerinfo"])}>
                      <img src={CustomerAccountIcon} alt="" />
                      Customer Account
                    </a>
                    <ul style={{ display: getShowClass(["/customeraccount", "/customerinfo"]) }}>
                      <li>
                        <NavLink to="/customeraccount"> Customer Account </NavLink>
                      </li>
                      <li>
                        <NavLink to="/customerinfo"> Customer Info </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li className={getNavLinkClass(["/ratings", "/userchat", "/userwinners", "/userloan"])}>
                    <a href>
                      <LocalActivityIcon /> &nbsp; Customer Activity
                    </a>
                    <ul style={{ display: getShowClass(["/ratings", "/userchat", "/userwinners", "/userloan"]) }}>
                      <li>
                        <NavLink to="/ratings">Rating</NavLink>
                      </li>
                      <li>
                        <NavLink to="/userchat">User Chat</NavLink>
                      </li>
                      <li>
                        <NavLink to="/userwinners">User Winner</NavLink>
                      </li>
                      <li>
                        <NavLink to="/userloan">User Loan</NavLink>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <NavLink to="/machines">
                      {" "}
                      <img src={MachineIcon} alt="" />
                      &nbsp;Machines{" "}
                    </NavLink>
                  </li>
                  <li className="">
                    <NavLink className="nav-link" to="/reports">
                      <img src={ReportsIcon} alt="" />
                      &nbsp;Reports
                    </NavLink>
                  </li>
                  <li className={getNavLinkClass(["/drawersetup", "/products", "/reloader", "/games"])}>
                    <a href>
                      <img src={SystemIcon} alt="" />
                      &nbsp;System Setup
                    </a>
                    <ul style={{ display: getShowClass(["/drawersetup", "/products", "/reloader", "/games"]) }}>
                      <li>
                        <NavLink className="nav-link" to="/products">
                          Store Products
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/drawersetup"> Drawer Setup </NavLink>
                      </li>
                      <li>
                        <NavLink to="/reloader"> Reloader </NavLink>
                      </li>
                      <li>
                        <NavLink to="/games"> Games </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li className={getNavLinkClass(["/adminstratorusers", "/distributors", "/agents", "/users"])}>
                    <a href>
                      <AccountBoxIcon />
                      &nbsp; Account Settings
                    </a>
                    <ul style={{ display: getShowClass(["/adminstratorusers", "/distributors", "/agents", "/users"]) }}>
                      <li>
                        <NavLink to="/adminstratorusers">Adminstrator</NavLink>
                      </li>
                      <li>
                        <NavLink to="/distributors">Distributors</NavLink>
                      </li>
                      <li>
                        <NavLink to="/agents">Agent</NavLink>
                      </li>
                      {/* <li>
                                            <NavLink to="/users">Players</NavLink>
                                        </li> */}
                    </ul>
                  </li>

                  <li>
                    <NavLink to="/usernews">
                      <img src={BulitInIcon} alt="" /> GD platform news
                    </NavLink>
                  </li>

                  <li>
                    {/* <NavLink to="/logout"><img src={LogoutIcon} alt=''/>&nbsp;Logout</NavLink> */}
                    <a href data-bs-toggle="modal" data-bs-target="#Logoutpopup">
                      <img src={LogoutIcon} alt="" />
                      &nbsp;Logout
                    </a>
                    {/* <NavLink to="/logout"></NavLink> */}
                  </li>
                </ul>
              ) : (
                ""
              )}

              {parseInt(role_id) === 4 ? (
                <ul className="nav">
                  <li>
                    <NavLink to="/dashboard">
                      {" "}
                      <DashboardIcon />
                      &nbsp;Dashboard{" "}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/users">
                      <UserIcon />
                      &nbsp;Players
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/ratings">
                      <GradeIcon />
                      &nbsp;Rating
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/userchat">
                      <ChatIcon />
                      &nbsp;User Chat
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/userloan">
                      <CreditScoreIcon />
                      &nbsp;User Loan
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/userwinners">
                      <EmojiEventsIcon />
                      &nbsp;User Winner
                    </NavLink>
                  </li>
                  <li>
                    {/* <NavLink to="/logout"><img src={LogoutIcon} alt=''/>&nbsp;Logout</NavLink> */}
                    <a href data-bs-toggle="modal" data-bs-target="#Logoutpopup">
                      <img src={LogoutIcon} alt="" />
                      &nbsp;Logout
                    </a>
                  </li>
                </ul>
              ) : (
                ""
              )}

              {parseInt(role_id) === 3 ? (
                <ul className="nav">
                  <li>
                    <NavLink to="/dashboard">
                      {" "}
                      <DashboardIcon />
                      &nbsp;Dashboard{" "}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/agents">
                      <BoyIcon />
                      &nbsp;Agent
                    </NavLink>
                  </li>
                  <li>
                    {/* <NavLink to="/logout"><img src={LogoutIcon} alt=''/>&nbsp;Logout</NavLink> */}
                    <a href data-bs-toggle="modal" data-bs-target="#Logoutpopup">
                      <img src={LogoutIcon} alt="" />
                      &nbsp;Logout
                    </a>
                  </li>
                </ul>
              ) : (
                ""
              )}
            </div>
          </div>
        </aside>
      </>
      <div className="modal fade big-modal" id="Logoutpopup" tabIndex="-1" aria-labelledby="LogoutpopupLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content position-relative">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <div className="modal-body">
              <h2>Message </h2>
              <form id="_CURRENT_FORM_">
                <div className="game-history-wrap">
                  <p>
                    Logging out closes the sessions of <strong>Drawer {drawer_no}</strong> and prints a drawer report.
                  </p>
                  <br />
                  <br />
                  <p>Do you want to continue?</p>
                </div>
                <div className="modal-footer logout">
                  <button type="button" className="btn btn-secondary" onClick={justLogout} disabled={loading ? true : false}>
                    {loading ? "Logging out" : "No,just Logout"}
                  </button>
                  <div className="btn-group-footer">
                    <button type="button" className="btn btn-primary" onClick={logOutEveryWhere} disabled={logoutEveryWhere ? true : false}>
                      {logoutEveryWhere ? "Logging out " : "Ok"}
                    </button>
                    &nbsp;
                    <button type="button" className="btn btn-secondary" id="closeLogoutpopup" data-bs-dismiss="modal">
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
