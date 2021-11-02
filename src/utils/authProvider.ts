import authConfig from "./authConfig";
import {Auth0Client} from '@auth0/auth0-spa-js';

export const auth0 = new Auth0Client({
    domain: authConfig.domain,
    client_id: authConfig.clientID,
    redirect_uri: authConfig.redirectURI,
    cacheLocation: 'localstorage',
    useRefreshTokens: true
});

export default {
    // called when the user attempts to log in
    login: (url:any) => {
        if (typeof url === 'undefined') {
            return auth0.loginWithRedirect()
        }
        return auth0.handleRedirectCallback(url.location).then((res)=>setTimeout(()=>
            window.location.reload()
        ,1000
        ));
    },
    // called when the user clicks on the logout button
    logout: () => {
        return auth0.isAuthenticated().then(function (isAuthenticated:any) {
            if (isAuthenticated) { // need to check for this as react-admin calls logout in case checkAuth failed
                return auth0.logout({
                    federated: true // have to be enabled to invalidate refresh token
                });
            }
            return Promise.resolve()
        })
    },
    // called when the API returns an error
    checkError: ({status } : any ) => {
        if (status === 401 || status === 403) {
            return Promise.reject();
        }
        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        console.log('checking auth');
        return auth0.isAuthenticated().then(function (isAuthenticated:any) {
            console.log(isAuthenticated,window.location);
            if (isAuthenticated) {
                return Promise.resolve();
            } else {
                return Promise.reject();
            }
        })
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => {
        return Promise.resolve()
    },
};
