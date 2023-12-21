import React from 'react';
// import AddUserModal from './add_user';
import EditUserModal from './edit_user';
// import ChangePasswordModal from './change_password';
// import WalletDetailsModal from './wallet_details';
// import GameEntries from './game_entries';
// import GameWinnings from './game_winnings';
// import BatchEditUsers from './batch_editusers';
// import BuyCredit from './buy_credit';



export default function AllModals(props) {

  return (
    <div>
      {/* <AddUserModal userData={props.userData} addUser={props.addUser} setDataGridLoading={props.setDataGridLoading} /> */}
      <EditUserModal    userData={props.dataGridRows}   />
      {/*<BatchEditUsers setDataGridLoading={props.setDataGridLoading} selectedRows={props.selectedRows} apiRef={props.apiRef} userData={props.userData} />*/}
      {/*<ChangePasswordModal userData={props.userData} changePassword={props.changePassword} /> */}
      {/* <WalletDetailsModal userData={props.userData} walletDetails={props.walletDetails} />
      <GameEntries userData={props.userData} gameEntries={props.gameEntries} />
      <BuyCredit userData={props.userData} buyCredit={props.buyCredit} />
      <GameWinnings userData={props.userData} gameWinnings={props.gameWinnings} /> */}
      
    </div>
  );
}