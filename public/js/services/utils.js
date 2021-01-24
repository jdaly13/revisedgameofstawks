import React, { useState } from 'react';
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
//https://dev.to/filippofilip95/i-replaced-usestate-hook-with-custom-one-3dn1
export const useChangeUser = (initialState = {}) => {
  const [user, regularSetState] = useState(initialState);

  const setState = (event) => {
    const field = event.target.name;
    user[field] = event.target.value;
    regularSetState(prevState => ({
      ...prevState,
      ...user
    }));
  };

  return [user, setState];
};

export function handleToggleModal(...args) {
  this.setState({ 
      showModal: !this.state.showModal,
      whichModal: args[1],
      purchaseOrSaleSuccess: ''
  });
}