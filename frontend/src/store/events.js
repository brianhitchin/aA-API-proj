const initialState = {}

const POPULATE_EPAGE = 'events/start'

export const startEvents = (payload) => {
    return {
        type: POPULATE_EPAGE,
        payload
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
        default:
            return state;
    }
}

export default eventsReducer