export const setIsLogin = (state, payload) => {
    state.isLogin = payload.isLogin;
    localStorage.setItem('isLogin', payload.isLogin);
};

export const setAccount = (state, payload) => {
    state.account = payload.account;
    localStorage.setItem('account', payload.account);
};

export const setClicked = ( state, payload) => {
    state.clicked = payload.clicked;
    localStorage.setItem('clicked', payload.clicked);
};

export const setTimestamp = ( state, payload) => {
    state.timestamp = payload.timestamp;
    localStorage.setItem('timestamp', payload.timestamp);
};

export const setAccessToken = ( state, payload ) =>{
    state.accessToken = payload.accessToken;
    localStorage.setItem('accessToken', payload.accessToken);
};

export const resetState = ( state, payload ) => {
        state.isLogin =  false;
        state.account = '';
        state.clicked = '/home';
        state.timestamp = '';
        state.accessToken = '';
};

export const recoverState = (state, payload ) =>{
    state.isLogin = localStorage.getItem('isLogin');
    state.account = localStorage.getItem('account');
    state.clicked = localStorage.getItem('clicked');
    state.timestamp = localStorage.getItem('timestamp');
    state.accessToken = localStorage.getItem('accessToken');
};