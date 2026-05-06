import { API_ENDPOINTS } from '@societiza/routes/endpoints';
import fetcher from '@societiza/lib/axios';
import {
  pagedUserDetailsSchema,
  pagedUserListSchema,
  userDetailSchema,
  userProfileSchema,
  type PagedUserDetails,
  type PagedUserList,
  type UpdateProfilePayload,
  type UserDetail,
  type UserProfile,
} from '../../schemas/identity-user.schema';

const api = API_ENDPOINTS.identityUsers;

export const identityUserService = {
  getMyProfile: async (): Promise<UserProfile> => {
    const response = await fetcher.get(api.myProfile);
    return userProfileSchema.parse(response.data);
  },

  updateMyProfile: async (payload: UpdateProfilePayload): Promise<void> => {
    await fetcher.put(api.updateProfile, payload);
  },

  listSystemAdmins: async (
    onlyActive = true,
    pageNumber = 1,
    pageSize = 10,
  ): Promise<PagedUserDetails> => {
    const response = await fetcher.get(
      api.systemAdmins(onlyActive, pageNumber, pageSize),
    );
    return pagedUserDetailsSchema.parse(response.data);
  },

  listAccountancyMembers: async (
    accountancyId: string,
    onlyActive = true,
    pageNumber = 1,
    pageSize = 10,
  ): Promise<PagedUserList> => {
    const response = await fetcher.get(
      api.accountancyMembers(accountancyId, onlyActive, pageNumber, pageSize),
    );
    return pagedUserListSchema.parse(response.data);
  },

  promoteAccountancyMember: async (
    accountancyId: string,
    userId: string,
  ): Promise<UserDetail> => {
    const response = await fetcher.post(
      api.promoteAccountancyMember(accountancyId, userId),
    );
    return userDetailSchema.parse(response.data);
  },

  deleteUser: async (userId: string, accountancyId?: string): Promise<void> => {
    await fetcher.delete(api.deleteUser(userId, accountancyId));
  },
};
