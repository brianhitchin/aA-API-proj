import { csrfFetch } from "./csrf"

const initialState = {}

const POPULATE_PAGE = 'group/start'

export const startGroups = (payload) => {
    return {
        type: POPULATE_PAGE,
        payload
    }
}

export const initialGroups = () => async dispatch => {
    const response = await csrfFetch('/api/groups');
    if (response.ok) {
        const data = await response.json();
        dispatch(startGroups(data));
    }
};

const groupsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case POPULATE_PAGE:
            newState = Object.assign({}, state);
            newState = action.payload;
            return newState;
        default:
            return state;
    }
};

export default groupsReducer