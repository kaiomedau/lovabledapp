import React, { Component } from "react";

class MintButton extends Component {
  renderButton() {
    const { account, minting, mintStatus, onConnect, onClick } = this.props;

    if (!account || account === undefined || account === "") {
      return (
        <button className="mint-button" onClick={onConnect}>
          Connect Wallet
        </button>
      );
    } else if (!mintStatus) {
      return (
        <button className="mint-button" disabled>
          Mint Closed
        </button>
      );
    } else if (!minting) {
      return (
        <button className="mint-button" onClick={onClick}>
          Mint
        </button>
      );
    } else {
      return (
        <button className="mint-button" disabled>
          Minting...
        </button>
      );
    }
  }

  render() {
    return <>{this.renderButton()}</>;
  }
}

export default MintButton;
