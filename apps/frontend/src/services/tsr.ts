import { initTsrReactQuery } from '@ts-rest/react-query/v5'
import { contract } from '@weave/types/apis'
import { getStoredToken } from '../hooks/auth'

export const tsr = initTsrReactQuery(contract, {
  baseUrl: 'http://localhost:3001/api',
  baseHeaders: {
    get Authorization() {
      return `Bearer ${getStoredToken()}`
    },
  },
})
