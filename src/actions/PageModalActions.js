export const TOGGLEMODAL = 'TOGGLEMODAL';
export const SETMODALPROPS = 'SETMODALPROPS';

export function showModal(modalVisibility) {
    return {
        type: TOGGLEMODAL,
        modalVisibility
    };
}

export function setModalProps(modalProps) {
    return {
        type: TOGGLEMODAL,
        modalVisibility
    };
}