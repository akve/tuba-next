import { ILookup } from './ILookup';

const UserRolesLookup: ILookup = {
  options: [
    { value: 'user', label: 'Real user' },
    { value: 'referred', label: 'Fake referral account' },
  ],
};

const UserRolesWithAdminLookup: ILookup = {
  options: [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
    { value: 'referred', label: 'Referred' },
  ],
};

const UserCategoryLookup: ILookup = {
  options: [
    { value: 'normal', label: 'Normal' },
    { value: 'vip', label: 'VIP' },
  ],
};

export { UserRolesLookup, UserRolesWithAdminLookup, UserCategoryLookup };
