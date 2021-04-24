import { Request } from 'express';

export interface RequestContext {
  req: Request;
}

export enum TokenFor {
  // tokens for sending requests e.g token from login
  Access = 'ACCESS',
  AccountVerification = 'ACCOUNT_VERIFICATION',
  ResetPassword = 'RESET_PASSWORD',
}
