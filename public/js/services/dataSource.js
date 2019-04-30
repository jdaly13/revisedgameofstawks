import {fetchContent} from '../modules/utilities';

const dataSource = {
    authorizeUser(formData) { //login user returns success or not and user uuID
        return fetchContent('POST', `/auth/login`, null, 'application/x-www-form-urlencoded',formData );
     },
     getUserData(token) {
         return fetchContent('GET', '/api/dashboard', token, 'application/x-www-form-urlencoded', null )
     },
     createUser(formData) {
         
     }
}

export default dataSource;