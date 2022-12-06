import { UserType } from './user';

export type EstateUserType = {
  id: number;
  address: string;
  role: string;
  estate_id: number;
  user_id: number;
  user?: UserType;
  created_at: string;
  updated_at: string;
};
