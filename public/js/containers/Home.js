import React from 'react';
import Auth from '../modules/Auth';
import DashboardPage from './DashboardPage';
import LoginPage from './LoginPage';

class HomeComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: false,
            data: null
        }
    }

    componentDidMount() {
        this.setState({
           auth:  Auth.isUserAuthenticated()
        })
    }

    render() {
        return (
            <React.Fragment>
                {this.state.auth ? (
                    <DashboardPage/>
                ) : (
                    <LoginPage />
                )}
            </React.Fragment>
        )
    }

}

export default HomeComponent;
