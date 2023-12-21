import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { getStorage } from "../../../utilities/storage";
import { apiPut, apiPost } from "../../../utilities/userAuth";
import { validateToken } from "../../../utilities/validateToken";
import "react-notifications/lib/notifications.css";
import PurchaseReceipt from "./purchasereceipt";

import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";

export default function PurchaseModel(props) {
  const [conversionRate, setconversionRate] = useState(0.01);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [entriesPoint, setEntriesPoint] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleSubmit, reset } = useForm({
    shouldFocusError: true,
    keepValues: true,
  });

  let closePopup = () => {
    reset();
  };
  let PurchaseCalculation = (val) => {
    let calculate_redeem = val / conversionRate;
    var round_value = Math.round(calculate_redeem * 10) / 10;
    setPurchaseAmount(val);
    setEntriesPoint(round_value);
  };
  const { REACT_APP_API_URL } = process.env;
  let onSubmit = () => {
    validateToken();
    setIsLoading(true);
    let userInfo = getStorage("userInfo");
    let drawer_no = getStorage("drawer_no");
    const shiftid = getStorage("shiftid");
    if (userInfo && userInfo.token && drawer_no !== -1) {
      let url = `${REACT_APP_API_URL}/usersPurchase/create`;
      const params = {
        token: userInfo.token,
        user_id: props.dataGridRows.id,
        drawer_id: drawer_no,
        drawer_shift_id: shiftid,
        current_entries: props.dataGridRows.total_entires,
        purchase_entries: entriesPoint,
        purchase_amount: purchaseAmount,
        is_active: 1,
      };
      apiPost(url, params)
        .then((response) => {
          if (response.data.code === 200) {
            let trans_url = `${REACT_APP_API_URL}/usersWalletTransactions/create`;
            const transaction_wallet = {
              token: userInfo.token,
              wallet_id: 0,
              user_id: props.dataGridRows.id,
              transaction_type: "Purchased",
              transaction_amount: purchaseAmount,
              transaction_comment: "User has Purchased the entries.",
              is_completed: 1,
              is_active: 1,
            };
            apiPost(trans_url, transaction_wallet)
              .then((responseTrans) => {
                if (responseTrans.data.code === 200) {
                  let url_entries = `${REACT_APP_API_URL}/gameEntries/update`;
                  const entries_countparams = {
                    token: userInfo.token,
                    user_id: props.dataGridRows.id,
                    entry_count: parseInt(props.dataGridRows.total_entires) + parseInt(entriesPoint),
                  };
                  apiPut(url_entries, entries_countparams)
                    .then((responseEntries) => {
                      if (responseEntries.data.code === 200) {
                        setIsLoading(false);
                        reset();
                        // setPurchaseAmount(0)
                        // setEntriesPoint(0)
                        document.getElementById("purchaseModelReceiptbtn").click();
                        // document.getElementById("closeBtnPurchaseModel").click();
                        // navigate('/customeraccount/'+props.dataGridRows.id);
                      }
                    })
                    .catch((error) => {
                      let msg = "Something Wrong! Please try after some time.";
                      NotificationManager.error(msg);
                    });
                }
              })
              .catch((error) => {
                let msg = "Something Wrong! Please try after some time.";
                NotificationManager.error(msg);
              });
          }
        })
        .catch((error) => {
          let msg = "Something Wrong! Please try after some time.";
          NotificationManager.error(msg);
        });
    } else {
    }
  };
  return (
    <>
      <NotificationContainer />
      <div className="modal fade big-modal" id="purchaseModel" tabIndex="-1" aria-labelledby="purchaseModelLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content position-relative">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <div className="modal-body">
              <h2>Purchase </h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="purchase-wrap">
                  <ul className="fill-in-form2 addwidth">
                    <li>
                      <div className="title">Customer ID</div>
                      <div className="detail">{props.dataGridRows.id}</div>
                    </li>
                    <li>
                      <div className="title">Internet Time</div>
                      <div className="detail">{props.dataGridRows.date_created}</div>
                    </li>
                    <li>
                      <div className="title">Entries</div>
                      <div className="detail">{props.dataGridRows.total_entires}</div>
                    </li>
                    <li>
                      <div className="title">Purchase Amount</div>
                      <div className="detail">
                        <span className="mr-5 txt-bluegreen">$</span>
                        <span className="mr-20 txt-bluegreen" id="_purchase_amount_">
                          {purchaseAmount}
                        </span>
                        &nbsp;
                        <span className="p-right">
                          <button type="button" className="red" onClick={() => setPurchaseAmount(0)}>
                            CLEAR
                          </button>
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="title">Purchase Select</div>
                      <div className="detail">
                        <button type="button" className="btn-aid me-1 mb-1 me-md-2 mb-md-2" onClick={() => PurchaseCalculation(1)}>
                          $1
                        </button>
                        <button type="button" className="btn-aid me-1 mb-1 me-md-2 mb-md-2" onClick={() => PurchaseCalculation(5)}>
                          $5
                        </button>
                        <button type="button" className="btn-aid me-1 mb-1 me-md-2 mb-md-2" onClick={() => PurchaseCalculation(10)}>
                          $10
                        </button>
                        <button type="button" className="btn-aid me-1 mb-1 me-md-2 mb-md-2" onClick={() => PurchaseCalculation(20)}>
                          $20
                        </button>
                        <button type="button" className="btn-aid me-1 mb-1 me-md-2 mb-md-2" onClick={() => PurchaseCalculation(50)}>
                          $50
                        </button>
                        <button type="button" className="btn-aid me-1 mb-1 me-md-2 mb-md-2" onClick={() => PurchaseCalculation(100)}>
                          $100
                        </button>
                      </div>
                    </li>
                  </ul>
                  <br />
                  <div className="btn-wrap">
                    <button type="button" style={{ display: "none" }} className="purple" id="purchaseModelReceiptbtn" data-bs-toggle="modal" data-bs-target="#purchaseModelReceipt">
                      Test
                    </button>
                    <button type="submit" id="saveBtn" disabled={isLoading || purchaseAmount === 0 ? true : false}>
                      {isLoading ? "Loading..." : "Save"}
                    </button>
                    &nbsp;&nbsp;
                    <input type="button" onClick={closePopup} className="btn btn-danger" id="closeBtnPurchaseModel" data-bs-dismiss="modal" value="Cancel" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <PurchaseReceipt dataGridRows={props.dataGridRows} purchaseAmount={purchaseAmount} purchaseEntries={entriesPoint} setPurchaseAmount={setPurchaseAmount} setEntriesPoint={setEntriesPoint} />
    </>
  );
}
