import { DependentListType } from './dependents';

export type UserType = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  phone_number: string;
  status: string;
  verified: string;
  resident_data?: ResidentType;
  estate_user?: EstateUserType;
  created_at: string;
};

type ResidentType = {
  id: number;
  gender: string;
  marital_status: string;
  profile_image_link: string;
  type: string;

  created_at: string;
  updated_at: string;
};

type EstateUserType = {
  id: number;
  estate_id: number;
  user_id: number;
  role: string;
  address: string;
  dependents?: DependentListType;
  type: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
};
