/* NOT IN USE
import React from 'react';
import Auth from '../modules/Auth';
import {withRouter} from 'react-router-dom';
import LoginPage from './LoginPage';

class HomeComponent extends React.Component {
    constructor(props) {
        super(props)
        if (Auth.isUserAuthenticated()) {
            this.props.history.push("/profile"+this.props.history.location.search)
        }
    }

    render() {
        return (
            <LoginPage />
        )
    }

}

export default withRouter(HomeComponent);
*/
