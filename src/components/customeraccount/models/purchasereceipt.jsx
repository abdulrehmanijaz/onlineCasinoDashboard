import React, { useEffect,useState } from 'react'
import { getStorage } from '../../../utilities/storage';
import { useNavigate } from "react-router";
import QrCodeLogo  from '../../../assets/images/qrCodelogo.png';
import ReactToPrint from 'react-to-print';
import dateFormat from "dateformat";
export default function PurchaseReceipt(props) {
    let userInfo = getStorage('userInfo');
    const navigate = useNavigate();
    const now = new Date();
    let closePopup = ()=>{
        props.setPurchaseAmount(0)
        props.setEntriesPoint(0)
        setTimeout(function(){
            navigate('/customeraccount/'+props.dataGridRows.id);  
        },250)
        
    } 
    return (
        <>
            <div className="modal fade" id="purchaseModelReceipt" tabindex="-1" aria-labelledby="purchaseModelReceiptLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content position-relative">
                        <div className="modal-body">                          
                            <form>
                                <div className="wrap popup">
                                    <div className="purchase-wrap">
                                        <div id="wrapperPrint">
                                            <div className="printPageHtml ft20" id="printPageHtmlID">
                                                <div id="TopPanel" className="t-center">
                                                    {/* <h2>Got Skills </h2>
                                                    <div>751 High  St</div> */}
                                                    <div>Cashier: {userInfo.user_info.username}</div>
                                                </div>

                                                <div className="HR t-center mt-10 mb-10">
                                                    <hr className="dsp"/>
                                                    <div className="fontBold">PURCHASE</div>
                                                    <hr className="dsp"/>
                                                </div>

                                                <div className="t-center fontBold mb-10">
                                                    <div>Player PIN</div>
                                                    <div>{props.dataGridRows.id}</div>
                                                </div>

                                                <div className="clearfix">
                                                    <div className="d_left">Purchase Amount:</div>
                                                    <div className="d_right">${props.purchaseAmount}</div>
                                                </div>

                                                <div className="clearfix">
                                                    <div className="d_left">Comps Amount:</div>
                                                    <div className="d_right">$0.00</div>
                                                </div>

                                                <div className="clearfix">
                                                    <div className="d_left">Added Internet Time:</div>
                                                    <div className="d_right">{dateFormat(props.dataGridRows.date_created, "h:MM:ss")}</div>
                                                </div>
                                                
                                                    <div className="clearfix">
                                                        <div className="d_left">Entries Added:</div>
                                                        <div className="d_right">{props.purchaseEntries}</div>
                                                    </div>
                                                

                                                <hr className="sp"/>
                                                <div className="clearfix">
                                                    <div className="d_left">Internet Time:</div>
                                                    <div className="d_right">{dateFormat(now, "h:MM:ss")}</div>
                                                </div>
                                                
                                                    <div className="clearfix">
                                                        <div className="d_left">Entries Balance:</div>
                                                        <div className="d_right">{props.dataGridRows.total_entires}</div>
                                                    </div>
                                                
                                                
                                                    <div className="clearfix">
                                                        <div className="d_left">Winnings Balance:</div>
                                                        <div className="d_right">{props.dataGridRows.total_winnings}</div>
                                                    </div>
                                                
                                                <div className="t-center">
                                                    Datetime: {props.dataGridRows.date_created}
                                                </div>

                                            
                                                <div className="t-center fontBold mb-10">
                                                    <hr className="dsp"/>
                                                    <div>Mobile ID</div>
                                                    <div>{props.dataGridRows.mobile_id}</div>
                                                </div>

                                                <div className="t-center">
                                                    <img src={QrCodeLogo} alt=''/>
                                                </div>
                                            
                                            </div>   
                                        </div>
                                        <div className="btn-wrap">
                                            <br/>
                                            <ReactToPrint 
                                            copyStyles
                                            trigger={() => {
                                                return <button type="button" className="smallbtn" id="printBtn">Print</button>;
                                            }}
                                              content={() => document.getElementById('wrapperPrint')}
                                            />
                                            &nbsp;
                                            <input type="button" onClick={closePopup} classNameName="btn btn-danger" id="closeBtnPurchaseModelReceipt" data-bs-dismiss="modal" value="Cancel" />
                                            
                                        </div>
                                    </div>

                                </div>
                                    
                            </form>
                        </div>
                    </div>
                </div>
            </div>  
        </>
    )
}