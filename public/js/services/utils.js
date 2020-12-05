  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
export function changeUser (event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
}

export function handleToggleModal(...args) {
  this.setState({ 
      showModal: !this.state.showModal,
      whichModal: args[1],
      purchaseOrSaleSuccess: ''
  });
}