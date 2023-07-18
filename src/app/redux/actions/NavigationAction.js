export const SET_USER_NAVIGATION = 'SET_USER_NAVIGATION'

const getfilteredNavigations = (navList = [], roles = []) => {
  return navList.reduce((array, nav) => {
    if (nav.auth) {
      if (nav.auth.filter(e => roles.indexOf(e) !== -1).length > 0) {
        array.push(nav)
      }
    } else {
      if (nav.children) {
        nav.children = getfilteredNavigations(nav.children, roles)
        array.push(nav)
      } else {
        array.push(nav)
      }
    }
    return array
  }, [])
}

export function getNavigationByUser(user, navigations) {
  return dispatch => {
    let filteredNavigations = getfilteredNavigations(
      navigations,
      user.authorities,
    )

    dispatch({
      type: SET_USER_NAVIGATION,
      payload: [...filteredNavigations],
    })
  }
}
