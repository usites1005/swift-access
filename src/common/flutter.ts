import axios from 'axios';
import * as env from '../config/env';
import { LocationEnumType } from '../types/admin';

const flutterWaveTxn = (tx_id: number, location: LocationEnumType) => {
  return axios({
    method: 'GET',
    url: `https://api.flutterwave.com/v3/transactions/${tx_id}/verify`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.default.flutterSecertKey[location]}`,
    },
  });
};

export default flutterWaveTxn;
