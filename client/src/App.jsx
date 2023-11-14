// import { useState, useEffect } from "react";
// import abi from "./contractJson/ExplodingKittens.json";
// import { ethers } from "ethers";
// // import Memos from './components/Memos'
// // import Buy from './components/Buy'
// // import chai from "./chai.png";
// import "./App.css";

// function App() {
//   const [state, setState] = useState({
//     provider: null,
//     signer: null,
//     contract: null,
//   });
//   const [account, setAccount] = useState("Not connected");
//   useEffect(() => {
//     const template = async () => {
//       const contractAddres = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//       const contractABI = abi.abi;
//       //Metamask part
//       //1. In order do transactions on goerli testnet
//       //2. Metmask consists of infura api which actually help in connectig to the blockhain
//       try {
//         const { ethereum } = window;
//         const account = await ethereum.request({
//           method: "eth_requestAccounts",
//         });

//         window.ethereum.on("accountsChanged", () => {
//           window.location.reload();
//         });
//         setAccount(account);
//         const provider = new ethers.providers.Web3Provider(ethereum); //read the Blockchain
//         const signer = provider.getSigner(); //write the blockchain

//         const contract = new ethers.Contract(
//           contractAddres,
//           contractABI,
//           signer
//         );
//         console.log(contract);
//         setState({ provider, signer, contract });
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     template();
//   }, []);
//   return (
//     <div>
//       <p style={{ marginTop: "10px", marginLeft: "5px" }}>
//         <small>Connected Account - {account}</small>
//       </p>
//       {/*
//       <Buy state={state} />
//       <Memos state={state} />
//     */}
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import abi from "./contractJson/ExplodingKittens.json";
import { ethers } from "ethers";
import "./App.css";
import Join from "./components/JoinGame";
import Start from "./components/StartGame";
import Draw from "./components/Drawcard";

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("Not connected");
  // const [currentPlayer, setCurrentPlayer] = useState("No player yet");
  // const [pot, setPot] = useState(0);

  useEffect(() => {
    const initContract = async () => {
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Add your contract address here
      const contractABI = abi.abi;

      try {
        const { ethereum } = window;
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });
        // console.log(account[0]);

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
          setAccount(account[0]);
        });

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const accountaddr = await signer.getAddress();
        setAccount(accountaddr);
        console.log(accountaddr);
        setState({ provider, signer, contract });
        console.log(contract);

        // // Fetch and set initial game state
        // const currentPlayer = await contract.currentPlayer();
        // const pot = await contract.pot();

        // setCurrentPlayer(currentPlayer);
        // setPot(pot);
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };

    initContract();
  }, []);

  // const joinGame = async (betAmount) => {
  //   try {
  //     const transaction = await state.contract.joinGame(betAmount, {
  //       value: ethers.utils.parseEther(betAmount.toString()),
  //     });
  //     await transaction.wait();
  //   } catch (error) {
  //     console.error("Error joining the game:", error);
  //   }
  // };

  // const drawCard = async () => {
  //   try {
  //     const transaction = await state.contract.drawCard();
  //     await transaction.wait();

  //     // Fetch and update game state after drawing a card
  //     const currentPlayer = await state.contract.currentPlayer();
  //     const pot = await state.contract.pot();

  //     setCurrentPlayer(currentPlayer);
  //     setPot(pot);
  //   } catch (error) {
  //     console.error("Error drawing a card:", error);
  //   }
  // };

  return (
    <div className="App">
      <h1>Exploding Kittens Game</h1>

      <p>
        <small>Connected Account - {account}</small>
      </p>

      <div className="container">
        <div className="component">
          <h2>Join Game</h2>
          <Join state={state} acc={account}></Join>
        </div>
        <div className="component">
          <h2>Start Game</h2>
          <Start state={state} acc={account}></Start>
        </div>

        <div className="component">
          <h2>Draw Card</h2>
          <Draw state={state} acc={account}></Draw>
        </div>
      </div>
    </div>
  );
}

export default App;
