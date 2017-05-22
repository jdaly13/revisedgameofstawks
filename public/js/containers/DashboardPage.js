import React from 'react';
import Auth from '../modules/Auth';
import Profile from '../components/Dashboard.js';


class DashboardPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    this.state = {
      secretData: '',
			data: ''
    };
  }

  /**
   * This method will be executed after initial rendering.
   */
  componentDidMount() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/api/dashboard');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
			console.log(xhr.response.data);
      if (xhr.status === 200) {
        this.setState({
          secretData: xhr.response.message,
					data: xhr.response.data
        });
				console.log(this.state.data);
      }
    });
    xhr.send();
  }

  /**
   * Render the component.
   */
  render() {
		if (this.state.data) {
    	return (<Profile secretData={this.state.secretData} data={this.state.data} />);
		} else {
			return (<div>Loading ... </div>)					
		}
  }

}

export default DashboardPage;
