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
  estate_user?: EstateUserType & EstateUserDependentsType;
  security_estate_user?: EstateUserType;
  created_at: string;
};

export type DependentUserType = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  phone_number: string;
  status: string;
  verified: string;
  resident_data?: ResidentType;
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

export type EstateUserType = {
  id: number;
  estate_id: number;
  user_id: number;
  role: 'admin' | 'security' | 'superadmin' | 'resident';
  address: string;
  type: string;
  approval_status: string;
  created_at: string;
  updated_at: string;
};

/**
 * Estate user type for dependents
 */
export type DependentEstateUserType = EstateUserType & {
  user?: Omit<UserType, 'estate_user' | 'security_estate_user'>;
};

type EstateUserDependentsType = {
  dependents?: DependentListType;
};
