import { csrfFetch } from "./csrf"

const initialState = { all_memberships: {} }

const ALL_MEMBERS = "membership/all"
const ADD_MEMBERS = "membership/add"
const DEL_MEMBERS = "membership/del"

export const AllMembers = (payload) => {
    return {
        type: ALL_MEMBERS,
        payload
    }
}

export const AddMembers = (payload) => {
    return {
        type: ADD_MEMBERS,
        payload
    }
}

export const DelMembers = (eid) => {
    return {
        type: DEL_MEMBERS,
        eid
    }
}

export const AllMembersThunk = () => async dispatch => {
    const response = await csrfFetch('/api/membership')

    if (response.ok) {
        const data = await response.json()
        dispatch(AllMembers(data))
    }
}

export const AddMembersThunk = (id) => async dispatch => {
    const response = await csrfFetch(`/api/events/${id}/attendance`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(AddMembers(data))
    }
}

export const DelMembersThunk = (eid, body) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eid}/attendance`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(DelMembers(data))
    }
}

const memberReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case ALL_MEMBERS:
            newState = { ...state, all_memberships: {} }
            action.payload.forEach((membership) => {
                newState.all_memberships[membership.id] = membership
            })
            return newState
        case ADD_MEMBERS:
            newState = { ...state, all_memberships: { ...state.all_memberships }}
            newState.all_memberships[action.payload.id] = action.payload
            return newState
        case DEL_MEMBERS:
            newState = { ...state, all_memberships: { ...state.all_memberships } }
            delete newState.all_memberships[action.eid]
            return newState
        default:
            return state
    }
}

export default memberReducer