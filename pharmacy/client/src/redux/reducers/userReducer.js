import tokenManager from "../../serviceClient/authToken";
const STORAGE_KEY = "pharmacy-user";
const init = () => {
    let saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved)
        saved = JSON.parse(saved);
    return saved || {};
}

const reduce = (state, action) => {
    switch (action.type) {
        case "LOGIN": {
            return {
                ...action.user,
            };
        }
        case "LOGOUT": {
            tokenManager.set(null);
            return {

            };
        }
        default:
            return state;
    }
}
const reducer = (state = init(), action) => {
    state = reduce(state, action);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
}

export default reducer;