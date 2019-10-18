import React from 'react';
import {Link} from 'react-router-dom';
import Auth from '../modules/Auth';


class Header extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    render() {
        return (
        <header>
            <div className="top-bar">
                <div className="top-bar-left">
                    <Link to="/">GAME OF STAWKS</Link>
                </div>
            {Auth.isUserAuthenticated() ? (
                <div className="top-bar-right">
                <Link to="/logout">Log out</Link>
                </div>
            ) : (
                <div className="top-bar-right">
                <Link to="/login">Log in</Link>
                <Link to="/signup">Sign up</Link>
                </div>
            )}
            </div>

        </header>
        )
    }
}

export default Header;