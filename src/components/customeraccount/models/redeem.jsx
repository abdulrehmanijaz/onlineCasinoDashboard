import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { getStorage } from "../../../utilities/storage";
import { apiPut, apiPost } from "../../../utilities/userAuth";
import { validateToken } from "../../../utilities/validateToken";
import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";

export default function RedeemModel(props) {
  const [redeemAmount, setRedeemAmount] = useState(0);
  const [conversionRate, setconversionRate] = useState(0.01);
  const [isLoading, setIsLoading] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { handleSubmit, reset } = useForm({
    shouldFocusError: true,
    keepValues: true,
  });

  let RedeemCalculation = (val) => {
    if (val !== "max") {
      let calculate_redeem = val / conversionRate;
      var round_value = Math.round(calculate_redeem * 10) / 10;
      if (round_value > props.dataGridRows.total_winnings) {
        let msg = "Winning counts are not enough.";
        setErrorMessage(msg);
        NotificationManager.warning(msg);
      } else {
        setErrorMessage("");
        setRedeemAmount(val);
      }
    } else {
      setErrorMessage("");
      let redeemVal = props.dataGridRows.total_winnings * conversionRate;
      let calculate_redeem = redeemVal / conversionRate;
      round_value = Math.round(calculate_redeem * 10) / 10;
      setRedeemAmount(redeemVal);
    }
    setRedeemPoints(round_value);
  };
  let closePopup = () => {
    reset();
  };
  const { REACT_APP_API_URL } = process.env;
  let onSubmit = () => {
    setIsLoading(true);
    validateToken();
    let userInfo = getStorage("userInfo");
    let drawer_no = getStorage("drawer_no");
    const shiftid = getStorage("shiftid");
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/usersRedeem/create`;
      const params = {
        token: userInfo.token,
        user_id: props.dataGridRows.id,
        drawer_id: parseInt(drawer_no),
        drawer_shift_id: shiftid,
        current_winnings: props.dataGridRows.total_winnings,
        redeem_winnings: redeemPoints,
        redeem_entries: redeemPoints,
        redeem_amount: redeemAmount,
        is_active: 1,
      };
      apiPost(url, params)
        .then((response) => {
          // setIsLoading(false);
          if (response.data.code === 200) {
            var user_id = response.data.data.user_id;
            // var current_winnings =  response.data.data.current_winnings;
            // var redeem_winnings =  response.data.data.redeem_winnings;
            // var redeem_amount =  response.data.data.redeem_amount;
            let trans_url = `${REACT_APP_API_URL}/usersWalletTransactions/create`;
            const transaction_wallet = {
              token: userInfo.token,
              wallet_id: 0,
              user_id: user_id,
              transaction_type: "Redeem",
              transaction_amount: redeemAmount,
              transaction_comment: "User has Redeemed the amount for entries.",
              is_completed: 1,
              is_active: 1,
            };
            apiPost(trans_url, transaction_wallet)
              .then((responseTrans) => {
                if (responseTrans.data.code === 200) {
                  let url_winnings = `${REACT_APP_API_URL}/gameWinnings/update`;
                  const winning_countparams = {
                    token: userInfo.token,
                    user_id: props.dataGridRows.id,
                    winning_count: props.dataGridRows.total_winnings - redeemPoints,
                  };
                  apiPut(url_winnings, winning_countparams)
                    .then((responseWinnings) => {
                      if (responseWinnings.data.code === 200) {
                        let url_entries = `${REACT_APP_API_URL}/gameEntries/update`;
                        const entries_countparams = {
                          token: userInfo.token,
                          user_id: props.dataGridRows.id,
                          entry_count: parseInt(props.dataGridRows.total_entires) + parseInt(redeemPoints),
                        };
                        apiPut(url_entries, entries_countparams)
                          .then((responseEntries) => {
                            if (responseEntries.data.code === 200) {
                              setIsLoading(false);
                              reset();
                              setRedeemAmount(0);
                              setRedeemPoints(0);
                              document.getElementById("closeBtnRedeemModel").click();
                              navigate("/customeraccount/" + props.dataGridRows.id);
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
          }
        })
        .catch((error) => {
          let msg = "Something Wrong! Please try after some time.";
          NotificationManager.error(msg);
        });
    } else {
      navigate("/login/");
    }
  };

  return (
    <>
      <NotificationContainer />
      <div className="modal fade big-modal" id="redeemModel" tabIndex="-1" aria-labelledby="redeemModelLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content position-relative">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <div className="modal-body">
              <h2>Redeem </h2>
              {errorMessage !== "" ? <p className="alert alert-warning">{errorMessage}</p> : ""}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="purchase-wrap">
                  <ul className="fill-in-form2 addwidth">
                    <li>
                      <div className="title">Customer ID</div>
                      <div className="detail">{props.dataGridRows.id}</div>
                    </li>
                    <li>
                      <div className="title">Winnings</div>
                      <div className="detail">
                        {" "}
                        {props.dataGridRows.total_winnings} &nbsp; <span id="ammount_dollars"> (${props.dataGridRows.total_winnings * conversionRate}) </span>
                        <input type="hidden" id="user_winners_redeem" value={props.dataGridRows.total_winnings} />
                      </div>
                    </li>
                    <li>
                      <div className="title">Drawer Balance</div>
                      <div className="detail">
                        {" "}
                        $ 0
                        <input type="hidden" id="drawer_balance_redeem" value="0" />
                      </div>
                    </li>
                    <li>
                      <div className="title">Redeem Amount</div>
                      <div className="detail">
                        <span className="mr-5 txt-bluegreen">$</span>
                        <span className="mr-20 txt-bluegreen" id="redeem_amount">
                          {redeemAmount}
                        </span>
                        &nbsp;
                        <span className="p-right">
                          <button type="button" className="red" onClick={() => setRedeemAmount(0)}>
                            CLEAR
                          </button>
                        </span>
                      </div>
                    </li>
                    <li>
                      <div className="title">Redeem Select</div>
                      <div className="detail">
                        <button type="button" className="btn-aid mb-1 mb-md-2 me-1 me-md-2" onClick={() => RedeemCalculation(1)}>
                          $1
                        </button>
                        <button type="button" className="btn-aid mb-1 mb-md-2 me-1 me-md-2" onClick={() => RedeemCalculation(5)}>
                          $5
                        </button>
                        <button type="button" className="btn-aid mb-1 mb-md-2 me-1 me-md-2" onClick={() => RedeemCalculation(10)}>
                          $10
                        </button>
                        <button type="button" className="btn-aid mb-1 mb-md-2 me-1 me-md-2" onClick={() => RedeemCalculation(20)}>
                          $20
                        </button>
                        <button type="button" className="btn-aid mb-1 mb-md-2 me-1 me-md-2" onClick={() => RedeemCalculation(50)}>
                          $50
                        </button>
                        <button type="button" className="btn-aid mb-1 mb-md-2 me-1 me-md-2" onClick={() => RedeemCalculation(100)}>
                          $100
                        </button>
                        <button type="button" className="btn-aid mb-1 mb-md-2 me-1 me-md-2" onClick={() => RedeemCalculation("max")}>
                          Max
                        </button>
                      </div>
                    </li>
                  </ul>
                  <br />
                  <div className="btn-wrap">
                    <button type="submit" id="saveBtn" disabled={isLoading || redeemAmount === 0 ? true : false}>
                      {isLoading ? "Loading..." : "Save"}
                    </button>
                    &nbsp;&nbsp;
                    <input type="button" onClick={closePopup} className="btn btn-danger" id="closeBtnRedeemModel" data-bs-dismiss="modal" value="Cancel" />
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
