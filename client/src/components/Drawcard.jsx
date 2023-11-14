import React from "react";
import { ethers } from "ethers";

function Draw(props) {
  const state = props.state;

  const drawCard = async (event) => {
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

    const tx = await contract.drawCard({ from: playerAddress });
    await tx.wait();
    alert("Card drawn successfully!");
  };

  return (
    <div>
      <form onSubmit={drawCard}>
        <div className="inputbox">
          <input type="submit" value="Draw Card" disabled={!state.contract} />
        </div>
      </form>
    </div>
  );
}

export default Draw;

// import { ethers } from "ethers";

// const Draw = ({ state }) => {
//   const drawCard = async (event) => {
//     event.preventDefault();
//     const { contract } = state;
//     // const amount = { value:ethers.utils.parseEther( 0.001) };
//     const transaction = await contract.drawCard();
//     await transaction.wait();
//     console.log(betAmount);
//   };
//   return (
//     <div>
//       <form onSubmit={drawCard}>
//         <button>Draw Card</button>
//       </form>
//     </div>
//   );
// };

// export default Draw;
