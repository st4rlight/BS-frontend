export const changeIsLogin = ({commit}, isLogin) => {
    commit('setIsLogin', isLogin );
};

export const changeAccount = ({commit}, account )=> {
    commit('setAccount', account);
};

export const changeClicked = ( {commit}, clicked) =>{
    commit('setClicked', clicked);
};

export const changeTimestamp = ( {commit}, timestamp) =>{
    commit('setTimestamp', timestamp);
};

export const changeAccessToken = ( {commit}, accessToekn) =>{
    commit('setAccessToken', accessToekn);
};

export const resetState = ( {commit}, data) =>{
    commit('resetState');
};
export const recoverState = ( {commit}, data) =>{
    commit('recoverState');
};