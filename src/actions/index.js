export const storeDBConnection = (db) => {
    return {
        type: 'storeDBConnection',
        payload: db
    };
};