import React from 'react';
import AddAgentModal from './add_agents';
import EditAgentModal from './edit_agent';
import ChangePasswordModal from './change_password';
import WalletDetailsModal from './wallet_details';
import GameEntries from './game_entries';
import GameWinnings from './game_winnings';
import BatchEditAgent from './batch_editagent';
import BuyCredit from './buy_credit';



export default function AllModals(props) {

  return (
    <div>
      <AddAgentModal userData={props.userData} addUser={props.addUser} setDataGridLoading={props.setDataGridLoading} />
      <EditAgentModal  setDataGridLoading={props.setDataGridLoading} setCheckShowGrid={props.setCheckShowGrid} apiRef={props.apiRef}  userData={props.userData} editUser={props.editUser}  />
      <BatchEditAgent setDataGridLoading={props.setDataGridLoading} selectedRows={props.selectedRows} apiRef={props.apiRef} userData={props.userData} />
      <ChangePasswordModal userData={props.userData} changePassword={props.changePassword} />
      {/* <WalletDetailsModal userData={props.userData} walletDetails={props.walletDetails} />
      <GameEntries userData={props.userData} gameEntries={props.gameEntries} />
      <BuyCredit userData={props.userData} buyCredit={props.buyCredit} />
      <GameWinnings userData={props.userData} gameWinnings={props.gameWinnings} /> */}
      
    </div>
  );
}