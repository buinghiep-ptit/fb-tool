const initialState = []

const LeagueReducer = function (state = initialState, action) {
  switch (action.type) {
    case 'SAVE_LEAGUE_CURRENT': {
      console.log(action.payload)
      return action.payload
    }
    default: {
      return [...state]
    }
  }
}

export default LeagueReducer
