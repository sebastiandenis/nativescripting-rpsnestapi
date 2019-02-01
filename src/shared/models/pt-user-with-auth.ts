import { PtUserAuthInfo } from "./pt-user-auth-info";
import { PtUser } from "./domain";

export interface PtUserWithAuth extends PtUser {
  authInfo?: PtUserAuthInfo;
}
