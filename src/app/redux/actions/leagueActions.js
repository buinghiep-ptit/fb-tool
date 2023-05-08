// export const saveLeagueCurrent = league => dispatch => {
//   dispatch({
//     type: 'SAVE_LEAGUE_CURRENT',
//     payload: league,
//   })
// }

export const saveLeagueCurrent = league => {
  console.log('SAVE_LEAGUE_CURRENT', league)
  return {
    type: 'SAVE_LEAGUE_CURRENT',
    payload: league,
  }
}
