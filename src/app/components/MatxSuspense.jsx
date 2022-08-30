import { Suspense } from 'react'
import MuiLoading from './common/MuiLoadingApp'

const MatxSuspense = ({ children }) => {
  return <Suspense fallback={<MuiLoading />}>{children}</Suspense>
}

export default MatxSuspense
