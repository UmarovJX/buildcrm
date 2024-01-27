import { axiosV1CRM, axiosV2 } from '@/services/core/base'
import Core from '@/services/core/index'

let cashedMe = null

class AuthV1 extends Core {
  constructor(axios = axiosV1CRM) {
    super(axios)
  }

  checkAuth() {
    return this.get('api/auth/check')
  }

  getMe() {
    if (cashedMe) return cashedMe;
    return cashedMe = this.get('oauth/me')
  }
}

class AuthV2 extends Core {
  constructor(axios = axiosV2) {
    super(axios)
  }

  login(username, password) {
    return this.post('oauth/login', {
      username,
      password,
      grant_type: process.env.VUE_APP_GRANT_TYPE_DEFAULT,
      client_id: process.env.VUE_APP_CLIENT_ID,
      client_secret: process.env.VUE_APP_CLIENT_SECRET,
    })
  }

  refreshToken(refreshToken) {
    return this.post('oauth/login', {
      refresh_token: refreshToken,
      grant_type: process.env.VUE_APP_GRANT_TYPE_AUTH,
      client_id: process.env.VUE_APP_CLIENT_ID,
      client_secret: process.env.VUE_APP_CLIENT_SECRET,
    })
  }

  getMe() {
    return this.get('users/me')
  }
}

export default {
  AuthV1,
  AuthV2,
}
