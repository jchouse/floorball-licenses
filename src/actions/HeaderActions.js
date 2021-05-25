export const LOGIN  = 'LOGIN',
    LOGOUT = 'LOGOUT',
    LOCALE = 'LOCALE',
    IMAGES_LIST = 'IMAGES_LIST';

export function login(user) {
    return {
        type: LOGIN,
        user,
    };
}

export function logout() {
    return {
        type: LOGOUT,
        user: {},
    };
}

export function locale(locale) {
    return {
        type: LOCALE,
        locale,
    };
}
