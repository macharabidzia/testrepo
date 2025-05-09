export interface User {
  companyNameEn: string | null;
  companyNameGe: string | null;
  firstNameEn: string;
  firstNameGe: string;
  gender: string;
  id: number;
  lastNameEn: string;
  lastNameGe: string;
  phone: string | null;
  roomNumber: string;
  userName: string;
  userTypeId: number;
}

export interface LoginMessage {
  token: string;
  user: User;
}

export interface LoginSuccessResponse {
  type: "success";
  message: LoginMessage;
}

export interface LoginErrorResponse {
  type: "error";
  message: string;
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export interface LoginForm {
  userName: string;
  password: string;
  channel: string;
}
