import React from "react";
import { ethers } from "ethers";

function Start(props) {
  const state = props.state;

  const startGame = async (event) => {
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

    const ownerAddress = accounts[0]; // Use the first account as the owner's address
    console.log("Owner Address:", ownerAddress);

    const tx = await contract.startGame({ from: ownerAddress });
    await tx.wait();
    alert("Game has started!");
  };

  return (
    <div>
      <form onSubmit={startGame}>
        <div className="inputbox">
          <input type="submit" value="Start Game" disabled={!state.contract} />
        </div>
      </form>
    </div>
  );
}

export default Start;

// const Start = ({ state }) => {
//   const startGame = async (event) => {
//     event.preventDefault();
//     const { contract } = state;
//     // const amount = { value:ethers.utils.parseEther( 0.001) };
//     const transaction = await contract.startGame();
//     await transaction.wait();
//     console.log(betAmount);
//   };
//   return (
//     <div>
//       <form onSubmit={startGame}>
//         <button>Start Game</button>
//       </form>
//     </div>
//   );
// };

// export default Start;
