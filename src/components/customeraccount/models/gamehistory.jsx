import React from "react";

export default function Gamehistory() {
  return (
    <>
      <div class="modal fade big-modal" id="historygame" tabindex="-1" aria-labelledby="historygameLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content position-relative">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <div class="modal-body">
              <h2>Game History </h2>
              <form id="_CURRENT_FORM_">
                <div class="game-history-wrap">
                  <div class="list-usual">
                    <div className="mb-3">
                      {" "}
                      Customer ID:
                      <span class="txt-bluegreen">7960877</span>
                    </div>
                    <div className="mb-3">
                      {" "}
                      Name:
                      <span class="txt-bluegreen">Castile Mace </span>
                    </div>
                    <div className="mb-3">
                      <div className="row mx-0">
                        <input type="date" id="startDate" readonly="readonly" size="12" class="hasDatepicker col-5" />
                        <div className="col-md-1 col-2 text-center">~</div>
                        <input type="date" id="endDate" readonly="readonly" size="12" class="hasDatepicker col-5" />
                      </div>
                      <button class="mt-3" type="button" id="ReportsBtn">
                        Search
                      </button>
                    </div>
                    <div className="mb-3">
                      <div>Period Limit：</div>
                      <span>Max. Time Period 2 days.</span>
                    </div>
                  </div>
                  <div id="UserGameHistory_wrapper" class="dataTables_wrapper no-footer">
                    <table class="dataTable table-responsive" id="Test" role="grid">
                      <thead>
                        <tr role="row">
                          <th>Round NO </th>
                          <th>Serial NO </th>
                          <th>Time</th>
                          <th>Game Name </th>
                          <th>Beginning Entries </th>
                          <th>Before Winnings </th>
                          <th>JPBET</th>
                          <th>Game Bet </th>
                          <th>Extra Bet </th>
                          <th>Win</th>
                          <th>Ending Entries </th>
                          <th>After Winnings </th>
                          <th>Weapon Type </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="btn-wrap">
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
