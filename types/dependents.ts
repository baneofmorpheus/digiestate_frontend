import { EstateUserType } from './estate_user';

export type SingleDependentType = {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  gender: string;
  phone_number: string;
  relationship_to_resident: string;
  profile_image_link: string;
  estate_user?: EstateUserType;
  created_at: string;
  updated_at: string;
};

export type DependentListType = Array<SingleDependentType>;
