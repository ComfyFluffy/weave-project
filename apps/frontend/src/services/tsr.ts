import { initTsrReactQuery } from '@ts-rest/react-query/v5'
import { contract } from '@weave/types/apis'

export const tsr = initTsrReactQuery(contract, {
  baseUrl: 'http://localhost:3001',
  baseHeaders: {
    'x-access-token': () => '123',
  },
})
