import React from 'react';

class ModalSimple extends React.Component {
    constructor(props) {
      super(props);
  
      this.handleKeyUp = this.handleKeyUp.bind(this);
      this.handleOutsideClick = this.handleOutsideClick.bind(this);
    }
  
    componentDidMount() {
      window.addEventListener('keyup', this.handleKeyUp, false);
      document.addEventListener('click', this.handleOutsideClick, false);
    }
  
    componentWillUnmount() {
      window.removeEventListener('keyup', this.handleKeyUp, false);
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
  
    handleKeyUp(e) {
      const { onCloseRequest } = this.props;
      const keys = {
        27: () => {
          e.preventDefault();
          onCloseRequest();
          window.removeEventListener('keyup', this.handleKeyUp, false);
        },
      };
  
      if (keys[e.keyCode]) { keys[e.keyCode](); }
    }
  
    handleOutsideClick(e) {
      const { onCloseRequest } = this.props;
      if (this.modal) {
        if (!this.modal.contains(e.target)) {
          onCloseRequest();
          document.removeEventListener('click', this.handleOutsideClick, false);
        }
      }
    }
  
    render () {
      const {
        onCloseRequest,
        children
      } = this.props;
      
      return (
        <div className="modal_overlay ">
          <div
            className="modal_container main-wrapper" 
            ref={node => (this.modal = node)}
          >
            <div className="modal_content login-container">
              {children}
            </div>
            <span
            type="button"
            className="modal_close"
            onClick={onCloseRequest}
          />
          </div>
  

        </div>
      );
    }
  }


export default ModalSimple;