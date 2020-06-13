import {fetchContent} from '../modules/utilities';

const dataSource = {
    authorizeUser(formData) { //login user returns success or not and user uuID
        return fetchContent('POST', `/auth/login`, null, 'application/x-www-form-urlencoded',formData );
     },
     getUserData(token) {
         return fetchContent('GET', '/api/dashboard', token, 'application/x-www-form-urlencoded', null )
     },
     createUser(formData) {
        return fetchContent('POST', '/auth/signup', null, 'application/x-www-form-urlencoded', formData )
     },
     getStockData(url) {
        return fetchContent('GET', url, null, 'application/json', null, true )
     },
     makePurchase(token, body) {
        return fetchContent('POST', 'api/purchaseequities', token, 'application/json', body, false )
     },
     makeSale(token, body) {
        return fetchContent('POST', 'api/sellequities', token, 'application/json', body, false )
     }
}

export default dataSource;