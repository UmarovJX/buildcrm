import { axiosV1CRM, axiosV2 } from '@/services/core/base'
import Core from '@/services/core/index'

class User extends Core {
  constructor(axios = axiosV1CRM) {
    super(axios)
  }

  getUserData() {
    return this.get('oauth/me')
  }

  deleteUserFromDB(userId) {
    return this.delete(`users/${userId}`)
  }

  updateUserAvatar(data, config) {
    return this.post('users/me', data, config)
  }

  updateUserPassword(data) {
    return this.put('users/me', data)
  }

  getUsersList() {
    return this.get('users')
  }

  fetchUserData(userId) {
    return this.get(`users/${userId}`)
  }

  updateUserData(userId, body) {
    return this.put(`users/${userId}`, body)
  }

  addNewUserToDB(body) {
    return this.post('users', body)
  }
}

class UserV2 extends Core {
  constructor(axios = axiosV2) {
    super(axios)
  }

  getUserData() {
    return this.get('oauth/me')
  }

  //
  // getUsersList() {
  //     return this.get('users')
  // }

  getUser() {
    return this.get('users/me')
  }

  deleteUserFromDB(userId) {
    return this.delete(`users/${userId}`)
  }

  updateUserAvatar(data, config) {
    return this.post('users/me', data, config)
  }

  updateUserPassword(data) {
    return this.put('users/me', data)
  }

  getUsersList(query) {
    return this.get('users', { params: query })
  }

  getUsersAll() {
    return this.get('users/all')
  }

  fetchUserData(userId) {
    return this.get(`users/${userId}`)
  }

  updateUserData(userId, body) {
    return this.put(`users/${userId}`, body)
  }

  addNewUserToDB(body) {
    return this.post('users', body)
  }

  removeUserBlock(id) {
    return this.put(`users/remove-block/${id}`)
  }
}

export default {
  User,
  UserV2,
}
