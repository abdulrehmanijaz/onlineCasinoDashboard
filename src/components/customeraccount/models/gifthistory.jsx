import React from "react";

export default function Gifthistory() {
  return (
    <>
      <div className="modal fade big-modal" id="Gifthistory" tabindex="-1" aria-labelledby="GifthistoryLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body position-relative">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              <h2>Gift History</h2>
              <form id="_CURRENT_FORM_">
                <div className="game-history-wrap">
                  <div className="list-usual">
                    <div className="mb-3">
                      Customer ID:
                      <span className="txt-bluegreen"> -</span>
                    </div>
                    <div className="mb-3">
                      Name:
                      <span className="txt-bluegreen"> - </span>
                    </div>
                    <div className="mb-3">
                      <div className="row mx-0">
                        <input type="date" id="startDate" readonly="readonly" size="12" className="hasDatepicker col-5" />
                        <div className="col-md-1 col-2 text-center">~</div>
                        <input type="date" id="endDate" readonly="readonly" size="12" className="hasDatepicker col-5" />
                      </div>
                      <button className="col-12 mt-2" type="button" id="ReportsBtn">
                        Search
                      </button>
                    </div>
                    <div className="row mx-0">
                      <button className="blue-green mb-2 mb-md-0 me-md-2" type="button" onclick="setDate('T')" id="TimeTBtn">
                        Today
                      </button>
                      <button className="blue-green mb-2 mb-md-0 me-md-2" type="button" onclick="setDate('Y')" id="TimeYBtn">
                        Yesterday
                      </button>
                      <button className="blue-green mb-2 mb-md-0 me-md-2" type="button" onclick="setDate('W')" id="TimeTWBtn">
                        This Week
                      </button>
                      <button className="blue-green mb-2 mb-md-0 me-md-2" type="button" onclick="setDate('L')" id="TimeLWBtn">
                        Last Week
                      </button>
                    </div>
                  </div>
                  <div id="UserAwardHistory_wrapper" className="dataTables_wrapper no-footer">
                    <table className="dataTable cell-border no-footer table-responsive" id="UserAwardHistory" role="grid">
                      <thead>
                        <tr role="row">
                          <th>Title</th>
                          <th>Award Type </th>
                          <th>Time</th>
                          <th>Beginning Entries </th>
                          <th>Before Winnings </th>
                          <th>Award Entries </th>
                          <th>Award Winnings </th>
                          <th>Ending Entries </th>
                          <th>After Winnings </th>
                          <th>Award Item </th>
                          <th>Item Amount </th>
                          <th>Item Level </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="odd"></tr>
                      </tbody>
                    </table>
                  </div>
                  <br />
                  <div className="btn-wrap">
                    <button type="button" id="closeBtn">
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
