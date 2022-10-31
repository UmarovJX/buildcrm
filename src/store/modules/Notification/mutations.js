export default {
    setNotify(state, xNotify) {
        if (xNotify && Object.keys(xNotify).length) {
            let defaultProperty = {}
            if (xNotify && xNotify.type === 'success') {
                defaultProperty = {
                    visible: true,
                    type: 'success',
                    message: 'successfully',
                    duration: 2000,
                }
            } else {
                defaultProperty = {
                    visible: true,
                    type: 'error',
                    message: 'error',
                    duration: 2000,
                }
            }
            state.xNotify = Object.assign({}, defaultProperty, xNotify);
        } else {
            state.xNotify = xNotify
        }
    },
    finishNotify(state, visible) {
        state.xNotify.visible = visible;
    },
}