import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { getStorage } from "../../../utilities/storage";
import { apiPut, apiPost } from "../../../utilities/userAuth";
import { validateToken } from "../../../utilities/validateToken";
import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications/dist/react-notifications";
import SpecialCompsReceipt from "./specialcompsreceipt";

export default function SpecialcompsModel(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [specialCompsAmount, setSpecialCompsAmount] = useState(0);
  const [conversionRate, setconversionRate] = useState(0.01);
  const [entriesPoint, setEntriesPoint] = useState(0);
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();
  const {
    handleSubmit,
    reset,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
    keepValues: true,
  });
  // useEffect(() => {
  //     validateToken();
  // },[props]);

  let closePopup = () => {
    reset();
  };
  let freeCompsChange = (e) => {
    var specialVal = e.target.value;
    setSelected(specialVal);
    let calculate_redeem = specialVal / conversionRate;
    var round_value = Math.round(calculate_redeem * 10) / 10;
    setSpecialCompsAmount(specialVal);
    setEntriesPoint(round_value);
  };

  // console.log(drawer_no)
  const { REACT_APP_API_URL } = process.env;
  let onSubmit = () => {
    setIsLoading(true);
    validateToken();
    let userInfo = getStorage("userInfo");
    let drawer_id = getStorage("drawer_no");
    const shiftid = getStorage("shiftid");
    if (userInfo && userInfo.token) {
      let url = `${REACT_APP_API_URL}/userSpecialComps/create`;
      const params = {
        token: userInfo.token,
        user_id: props.dataGridRows.id,
        drawer_id: drawer_id,
        drawer_shift_id: shiftid,
        current_entries: props.dataGridRows.total_entires,
        special_comps_entries: entriesPoint,
        special_comps_amount: specialCompsAmount,
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
              transaction_type: "special_comps",
              transaction_amount: specialCompsAmount,
              transaction_comment: "Special comps transaction created.",
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
                        // setSpecialCompsAmount(0)
                        // setEntriesPoint(0)
                        setSelected("0");

                        document.getElementById("specialCompsModelReceiptbtn").click();
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
      navigate("/login/");
    }
  };
  return (
    <>
      <NotificationContainer />
      <div className="modal fade big-modal" id="specialComps" tabindex="-1" aria-labelledby="specialCompsLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content position-relative">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <div className="modal-body">
              <h2>Special Comps </h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="purchase-wrap">
                  <ul className="fill-in-form2 addwidth">
                    <li>
                      <div className="title">Customer ID</div>
                      <div className="detail">{props.dataGridRows.id}</div>
                    </li>
                    <li>
                      <div className="title">Entries</div>
                      <div className="detail">{props.dataGridRows.total_entires}</div>
                    </li>
                    <li>
                      <div className="title">Special Comps Amount</div>
                      <div className="detail">
                        <label for="freeComps" className="form-label txt-bluegreen">
                          $
                        </label>
                        <select name="freeComps" id="freeComps" value={selected} className="form-control" aria-hidden="true" style={{ width: "21%", display: "inline-block" }} onChange={(e) => freeCompsChange(e)}>
                          <option value="0">Please Select</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          <option value="10">10</option>
                          <option value="15">15</option>
                          <option value="20">20</option>
                          <option value="25">25</option>
                          <option value="30">30</option>
                          <option value="35">35</option>
                          <option value="40">40</option>
                          <option value="45">45</option>
                          <option value="50">50</option>
                          <option value="55">55</option>
                          <option value="60">60</option>
                          <option value="65">65</option>
                          <option value="70">70</option>
                          <option value="75">75</option>
                          <option value="80">80</option>
                          <option value="85">85</option>
                          <option value="90">90</option>
                          <option value="95">95</option>
                          <option value="100">100</option>
                        </select>
                        <p className="text-danger fs-7 p-1">{errors.freeComps?.message}</p>
                      </div>
                    </li>
                  </ul>
                  <br />
                  <div className="btn-wrap d-flex">
                    <button type="button" style={{ display: "none" }} class="purple" id="specialCompsModelReceiptbtn" data-bs-toggle="modal" data-bs-target="#specialCompsModelReceipt">
                      Test
                    </button>
                    <button type="submit" id="saveBtn" disabled={isLoading || parseInt(specialCompsAmount) === 0 ? true : false}>
                      {isLoading ? "Loading..." : "Save"}
                    </button>
                    &nbsp;&nbsp;
                    <input type="button" onClick={closePopup} className="btn btn-danger" id="closeBtnCompModel" data-bs-dismiss="modal" value="Cancel" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <SpecialCompsReceipt dataGridRows={props.dataGridRows} specialCompsAmount={specialCompsAmount} entriesPoint={entriesPoint} setSpecialCompsAmount={setSpecialCompsAmount} setEntriesPoint={setEntriesPoint} setValue={setValue} />
    </>
  );
}
