import api from "./api";

export const profileService = {

  async getUserProfile(userId) {
    return api.get(`/profile/user/me/${userId}`);
  },

  async updateUserProfile(userId, profileData) {
    return api.put(`/profile/user/update/${userId}`, profileData);
  }

};