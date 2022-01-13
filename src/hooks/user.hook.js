import React from 'react';

export const User = React.createContext({
    username: '',
    token: '',
    authSucc: false,
    dataLoad: false,
    timeOut: null
});