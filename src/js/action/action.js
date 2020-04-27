import { 
    IS_OBJECT_LIST_SHOWN, 
    SELECT_OBJECT_LIST,
    SHOULD_UPDATE_TRACKING_DATA,
} from './actionType';

/** Action Creator for Sidebar */
export const isObjectListShown = (boolean) => {
    return {
        type: IS_OBJECT_LIST_SHOWN,
        value: boolean
    }
}

export const selectObjectList = (array) => {
    return {
        type: SELECT_OBJECT_LIST,
        array: array,
    }
}

/** Retrieve tracking data action creator */

export const shouldUpdateTrackingData = (boolean) => {
    return {
        type: SHOULD_UPDATE_TRACKING_DATA,
        value: boolean 
    }
}
