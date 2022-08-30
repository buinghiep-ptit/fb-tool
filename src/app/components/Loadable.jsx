import { Suspense } from 'react'
import MuiLoading from './common/MuiLoadingApp'

const Loadable = Component => props => {
  return (
    <Suspense fallback={<MuiLoading />}>
      <Component {...props} />
    </Suspense>
  )
}

export default Loadable
