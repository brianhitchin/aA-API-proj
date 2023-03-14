import { csrfFetch } from "./csrf"

const initialState = {}

const POPULATE_EPAGE = 'events/start'
const GET_ONE_EVENT = 'events/getone'
const ADD_EVENT = 'events/add'

export const getEvent = (payload) => {
    return {
        type: GET_ONE_EVENT,
        payload
    }
}

export const addAEvent = (payload) => {
    return {
        type: ADD_EVENT,
        payload
    }
}

export const startEvents = (payload) => {
    return {
        type: POPULATE_EPAGE,
        payload
    }
}

export const create = (groupId, value) => async dispatch => {
    const response = await csrfFetch(`http://localhost:8000/api/groups/${groupId}/events`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({value})
    })

    if (response.ok) {
        const data = await response.json();
        console.log(data)
        dispatch(addAEvent(data))
        return data.id
    }
}

export const oneEvent = (eventId) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}`)
    if (response.ok) {
        const data = await response.json();
        dispatch(getEvent(data));
    }
}

export const initialEvents = () => async dispatch => {
    const response = await csrfFetch('/api/events');
    if (response.ok) {
        const data = await response.json();
        dispatch(startEvents(data));
    }
};

const eventsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case POPULATE_EPAGE:
            newState = Object.assign({}, state);
            newState = action.payload;
            return newState;
        case GET_ONE_EVENT:
            newState = { ...action.payload };
            return newState;
        case ADD_EVENT:
            newState = { ...state, events: {...state.events, [action.payload.id]: action.payload}}
            return newState;
        default:
            return state;
    }
}

export default eventsReducer