import React from 'react';
import Newcustomer from './newcustomer';
import Gamehistory from './gamehistory';
import Editcustomer from './editcustomer';
import Gifthistory from './gifthistory';
import SpecialcompsModel from './specialcomps';
import RedeemModel from './redeem';
import PurchaseModel from './purchase';
import Resetpassword from './resetpassword';

export default function AllModals(props) {
  return (
    <div>
      <Newcustomer />
      <Gamehistory />
      <Editcustomer dataGridRows={props.dataGridRows} />
      <RedeemModel dataGridRows={props.dataGridRows} />
      <PurchaseModel dataGridRows={props.dataGridRows} />
      <SpecialcompsModel dataGridRows={props.dataGridRows} />
      <Gifthistory />
      <Resetpassword dataGridRows={props.dataGridRows} />
      
    </div>
  );
}