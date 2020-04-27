const StateReducer = (state, action) => {
    switch (action.type) {
        case 'setArea':
          return {
            ...state,
            areaId: action.value
          };
        case 'setUpdateTrackingData':
          return {
              ...state,
              shouldUpdateTrackingData: action.value
          }
        default:
          return state;
    }
}

export default StateReducer
