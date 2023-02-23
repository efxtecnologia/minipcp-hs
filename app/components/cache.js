function Cache() {

    function refresh({ state }, refreshFn) {
        if ( ! state.invalid ) {
            return state;
        }
        return { ...state, invalid: false, data: refreshFn() };
    }

    function Container(refreshFn) {
        const container = { state: { invalid: true } };
        return {
            ...container,
            refresh: () => container.state = refresh(container, refreshFn),
            invalidate: () => container.state = { ...container.state, invalid: true },
            get: (key) => {
                if ( container.state.invalid ) {
                    container.state = refresh(container, refreshFn);
                }
                return container.state.data[key];
            }
        };
    };

    return {
        Container,
    };
}

module.exports = Cache;
