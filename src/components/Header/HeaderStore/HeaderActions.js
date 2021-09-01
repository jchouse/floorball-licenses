export const LOGIN  = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LOCALE = 'LOCALE';
export const IMAGES_LIST = 'IMAGES_LIST';

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
