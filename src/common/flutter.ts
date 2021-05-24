import axios from 'axios';
import * as env from '../config/env';

const flutterWaveTxn = (tx_id: number) => {
  return axios({
    method: 'GET',
    url: `https://api.flutterwave.com/v3/transactions/${tx_id}/verify`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.default.flutterSecertKey}`,
    },
  });
};

export default flutterWaveTxn;
