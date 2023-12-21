import React from 'react';
import AddDistributorModal from './add_distributor';
import EditDistriButorModal from './edit_distributor';
import ChangePasswordModal from './change_password';
import WalletDetailsModal from './wallet_details';
import GameEntries from './game_entries';
import GameWinnings from './game_winnings';
import BatchEditDistributor from './batch_editdistributor';
import BuyCredit from './buy_credit';



export default function AllModals(props) {

  return (
    <div>
      <AddDistributorModal userData={props.userData} addUser={props.addUser} setDataGridLoading={props.setDataGridLoading} />
      <EditDistriButorModal  setDataGridLoading={props.setDataGridLoading} setCheckShowGrid={props.setCheckShowGrid} apiRef={props.apiRef}  userData={props.userData} editUser={props.editUser}  />
      <BatchEditDistributor setDataGridLoading={props.setDataGridLoading} selectedRows={props.selectedRows} apiRef={props.apiRef} userData={props.userData} />
      <ChangePasswordModal userData={props.userData} changePassword={props.changePassword} />
      {/* <WalletDetailsModal userData={props.userData} walletDetails={props.walletDetails} />
      <GameEntries userData={props.userData} gameEntries={props.gameEntries} />
      <BuyCredit userData={props.userData} buyCredit={props.buyCredit} />
      <GameWinnings userData={props.userData} gameWinnings={props.gameWinnings} /> */}
      
    </div>
  );
}