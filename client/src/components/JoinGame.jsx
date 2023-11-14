import React from "react";
import { ethers } from "ethers";

function Join(props) {
  const state = props.state;

  const joinGame = async (event) => {
    event.preventDefault();
    const { contract, provider } = state;

    // Request MetaMask account access
    try {
      await window.ethereum.enable();
    } catch (error) {
      alert(
        "Error connecting to MetaMask. Please make sure it's installed and unlocked."
      );
      return;
    }

    // Get the connected account
    const accounts = await provider.listAccounts();
    if (accounts.length === 0) {
      alert("Please connect to MetaMask and select an account.");
      return;
    }

    const playerAddress = accounts[0]; // Use the first account as the player's address
    console.log("Player Address:", playerAddress);

    const betAmountInput = document.querySelector("#_betAmount");
    const amount = { value: ethers.utils.parseEther("0.001") };

    const betAmount = betAmountInput.value;

    if (!betAmount || isNaN(betAmount)) {
      alert("Please enter a valid bet amount.");
      return;
    }
    console.log(typeof betAmount);
    //console.log(ethers.utils.parseEther(betAmount));
    try {
      const tx = await contract.joinGame(betAmount, amount);

      await tx.wait();
      alert("You have successfully joined the game.");
    } catch (error) {
      console.error("Error joining the game:", error.message);
      alert("Error joining the game. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={joinGame}>
        <div className="inputbox">
          <input id="_betAmount" placeholder="Enter bet amount" />
          <input type="submit" value="Join Game" disabled={!state.contract} />
        </div>
      </form>
    </div>
  );
}

export default Join;
