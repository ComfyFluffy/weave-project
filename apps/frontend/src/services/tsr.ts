import { initTsrReactQuery } from '@ts-rest/react-query/v5'
import { contract } from '@weave/types/apis'
import { getStoredToken } from '../utils/auth-storage'

export const tsr = initTsrReactQuery(contract, {
  baseUrl: 'http://localhost:3001/api',
  baseHeaders: {
    get Authorization() {
      const token = getStoredToken()
      return token ? `Bearer ${token}` : ''
    },
  },
})
