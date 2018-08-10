export const SHOWPHOTOSTORAGE  = 'SHOWPHOTOSTORAGE';
export const HIDEPHOTOSTORAGE  = 'HIDEPHOTOSTORAGE';
export const CHOOSEDPHOTOURL  = 'CHOOSEDPHOTOURL';

export function showPhotoStorage(photoStorage) {
    return {
        type: SHOWPHOTOSTORAGE,
        photoStorage: photoStorage
    };
}

export function hidePhotoStorage() {
    return {
        type: HIDEPHOTOSTORAGE,
        photoStorage: {show: false}
    };
}

export function choosePhotoUrl(url) {
    return {
        type: CHOOSEDPHOTOURL,
        choosedPhotoUrl: url
    };
}
