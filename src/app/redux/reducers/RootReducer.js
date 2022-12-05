import { combineReducers } from 'redux'
import EcommerceReducer from './EcommerceReducer'
import NavigationReducer from './NavigationReducer'
import NotificationReducer from './NotificationReducer'
import UploadFile from './upload/uploadFile.reducer'

const RootReducer = combineReducers({
  notifications: NotificationReducer,
  navigations: NavigationReducer,
  ecommerce: EcommerceReducer,
  UploadFile: UploadFile,
})

export default RootReducer
