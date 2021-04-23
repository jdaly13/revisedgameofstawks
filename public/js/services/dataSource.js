import {fetchContent} from '../modules/utilities';

const dataSource = {
    authorizeUser(formData) { //login user returns success or not and user uuID
        return fetchContent('POST', `/auth/login`, null, 'application/x-www-form-urlencoded',formData );
     },
     getUserData(jwtToken) {
         return fetchContent('GET', '/api/dashboard', jwtToken, 'application/x-www-form-urlencoded', null )
     },
     createUser(formData) {
        return fetchContent('POST', '/auth/signup', null, 'application/x-www-form-urlencoded', formData )
     },
     getStockData(url) {
        return fetchContent('GET', url, null, 'application/json', null, true )
     },
     makePurchase(jwtToken, body) {
        return fetchContent('POST', 'api/purchaseequities', jwtToken, 'application/json', body, false )
     },
     makeSale(jwtToken, body) {
        return fetchContent('POST', 'api/sellequities', jwtToken, 'application/json', body, false )
     },
     checkGOSTtoken(jwtToken, body) {
        return fetchContent('GET', 'api/getTokenInfo', jwtToken, 'application/json', body, false)
     },
     checkTokenTransaction(jwtToken) {
        return fetchContent('GET', 'api/tokenTransaction', jwtToken, 'application/json', null)
     }
}

export default dataSource;