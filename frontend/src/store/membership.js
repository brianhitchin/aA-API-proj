import { csrfFetch } from "./csrf"

const initialState = {all_memberships: {}}

const ALL_MEMBERS = "membership/all"

export const AllMembers = (payload) => {
    return {
        type: ALL_MEMBERS,
        payload
    }
}

export const AllMembersThunk = () => async dispatch => {
    const response = await csrfFetch('/api/membership')

    if (response.ok) {
        const data = await response.json()
        dispatch(AllMembers(data))
    }
}

const memberReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case ALL_MEMBERS:
            newState = {...state, all_memberships: {}}
            action.payload.forEach((membership) => {
                newState.all_memberships[membership.id] = membership
            })
            return newState
        default:
            return state
    }
}

export default memberReducer