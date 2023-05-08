import { combineReducers } from 'redux'
import EcommerceReducer from './EcommerceReducer'
import LeagueReducer from './LeaguesReducer'
import NavigationReducer from './NavigationReducer'
import NotificationReducer from './NotificationReducer'
import UploadFile from './upload/uploadFile.reducer'

const RootReducer = combineReducers({
  notifications: NotificationReducer,
  navigations: NavigationReducer,
  ecommerce: EcommerceReducer,
  UploadFile: UploadFile,
  leagues: LeagueReducer,
})

export default RootReducer
