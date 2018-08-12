export default (state = null, action) => {
    switch (action.type) {
        case 'storeDBConnection':
            return action.payload;
        default:
            return state;
    }
};