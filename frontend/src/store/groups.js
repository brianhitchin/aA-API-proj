import { csrfFetch } from "./csrf"

const initialState = {}

const POPULATE_PAGE = 'group/start'
const GET_ONE_GROUP = 'group/getone'
const ADD_GROUP = 'group/add'

export const startGroups = (payload) => {
    return {
        type: POPULATE_PAGE,
        payload
    }
}

export const getGroup = (payload) => {
    return {
        type: GET_ONE_GROUP,
        payload
    }
}

export const addGroup = (payload) => {
    return {
        type: ADD_GROUP,
        payload
    }
}

export const create = (value) => async dispatch => {
    const response = await csrfFetch('api/groups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(addGroup(data))
    }
}

export const oneGroup = (groupId) => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}`)
    if (response.ok) {
        const data = await response.json();
        dispatch(getGroup(data));
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
        case GET_ONE_GROUP:
            newState = {};
            newState = action.payload;
            return newState;
        case ADD_GROUP:
            newState = {...state}
            newState.groups[action.payload.id] = action.payload
            return newState;
        default:
            return state;
    }
};

export default groupsReducer