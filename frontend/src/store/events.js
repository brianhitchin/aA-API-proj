import { csrfFetch } from "./csrf"

const initialState = {}

const POPULATE_EPAGE = 'events/start'
const GET_ONE_EVENT = 'events/getone'

export const getEvent = (payload) => {
    return {
        type: GET_ONE_EVENT,
        payload
    }
}

export const startEvents = (payload) => {
    return {
        type: POPULATE_EPAGE,
        payload
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
        default:
            return state;
    }
}

export default eventsReducer