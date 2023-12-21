import React, { useEffect,useState } from 'react'
import { getStorage } from '../../../utilities/storage';
import { useNavigate } from "react-router";
import ReactToPrint from 'react-to-print';
import dateFormat from "dateformat";
export default function SpecialCompsReceipt(props) {
    let userInfo = getStorage('userInfo');
    const navigate = useNavigate();
    const now = new Date();
    let closePopup = ()=>{
       
        props.setSpecialCompsAmount(0)
        props.setEntriesPoint(0)
        
        setTimeout(function(){
            navigate('/customeraccount/'+props.dataGridRows.id);  
        },250)
        
    } 
    return (
        <>
            <div class="modal fade" id="specialCompsModelReceipt" tabindex="-1" aria-labelledby="specialCompsModelReceiptLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content position-relative">
                        <div class="modal-body">                          
                            <form>
                                <div class="wrap popup">
                                    <div class="purchase-wrap">
                                        <div id="wrapperPrint">
                                            <div class="printPageHtml ft20" id="ComprintPageHtmlID">
                                                <div class="purchase-wrap">
                                                    <div id="TopPanel" class="t-center">
                                                        <div>Cashier: {userInfo.user_info.username}</div>
                                                    </div>

                                                    <div class="HR t-center mt-10 mb-10">
                                                        <hr class="dsp"/>
                                                        <div class="fontBold">SPECIAL COMPS</div>
                                                        <hr class="dsp"/>
                                                    </div>

                                                    <div class="t-center fontBold mb-10">
                                                        <div>Player PIN</div>
                                                        <div>{props.dataGridRows.id}</div>
                                                    </div>

                                                    <div class="clearfix">
                                                        <div class="d_left">Special Comps Amount:</div>
                                                        <div class="d_right">${props.specialCompsAmount}</div>
                                                    </div>
                                                    
                                                        <div class="clearfix">
                                                            <div class="d_left">Entries Added:</div>
                                                            <div class="d_right">{props.entriesPoint}</div>
                                                        </div>
                                                    
                                                    <hr class="sp"/>
                                                    
                                                        <div class="clearfix">
                                                            <div class="d_left">Entries Balance:</div>
                                                            <div class="d_right">{props.dataGridRows.total_entires}</div>
                                                        </div>
                                                    


                                                    <div class="mt-20">&nbsp;</div>

                                                    <div class="t-center">
                                                        Datetime: {props.dataGridRows.date_created}
                                                    </div>
                                                
                                                </div>   
                                            </div>
                                            <div class="btn-wrap">
                                                <br/>
                                                <ReactToPrint 
                                                copyStyles
                                                trigger={() => {
                                                    return <button type="button" class="smallbtn" id="printBtn">Print</button>;
                                                }}
                                                content={() => document.getElementById('ComprintPageHtmlID')}
                                                />
                                                &nbsp;
                                                <input type="button" onClick={closePopup} className="btn btn-danger" id="closeSpecialMbtn" data-bs-dismiss="modal" value="Cancel" />
                                                
                                            </div>
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