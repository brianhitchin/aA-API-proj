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
    
}