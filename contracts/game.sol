// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
// import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ExplodingKittens is ERC721, IERC721Receiver {
    // using SafeMath for uint256;

    uint256 public constant PLATFORM_FEE_PERCENT = 5;
    uint256 public constant MIN_PLAYERS = 3;
    uint256 public constant MIN_GAME_CARDS = 10;

    address public platformWallet;
    uint256 public pot;
    uint256 public gameId;
    address public currentPlayer;

    enum CardType { Game, Death }
    enum GameStatus { Ongoing, Ended }

    GameStatus public gameStatus;

    struct Player {
        uint256 playerId;
        uint256 betAmount;
        CardType[] cards;
    }

    mapping(address => Player) public players;
    mapping(uint256 => address) public playerAddresses;

    event PlayerJoined(uint256 playerId, address player, uint256 betAmount);
    event CardDrawn(address indexed player,uint256 playerId, CardType cardType);
    event Exploded(uint256 playerId);
    event GameEnded(address winner, uint256 winnings);
    event GameStarted(address indexed gameOwner, uint256 indexed gameId, uint256 pot);
    event GameState(address indexed player, uint256 indexed gameId, uint256 pot, address currentPlayer);

    constructor(address _platformWallet) ERC721("ExplodingKittensNFT", "EKNFT") {
        platformWallet = _platformWallet;
    }

    modifier onlyPlayers() {
        require(players[msg.sender].playerId != 0, "You are not a player");
        _;
    }

    function joinGame(uint256 _betAmount) external payable {
        require(players[msg.sender].playerId == 0, "You are already in the game");

        gameId++;
        uint256 playerId = gameId;

        players[msg.sender] = Player(playerId, _betAmount, new CardType[](0));
        playerAddresses[playerId] = msg.sender;
        pot = pot+(_betAmount);

        emit PlayerJoined(playerId, msg.sender, _betAmount);
    }

    function startGame() external {
        require(gameId > 0, "No players in the game");
        require(gameId >= MIN_PLAYERS, "Not enough players to start the game");

        distributeCards();

        pot = address(this).balance;
        currentPlayer = playerAddresses[1];
        gameStatus = GameStatus.Ongoing;

        emit GameStarted(msg.sender, gameId, pot);
    }

function drawCard() external onlyPlayers {
    emit GameState(msg.sender, gameId, pot, currentPlayer);

    uint256 playerId = players[msg.sender].playerId;
    require(playerId != 0, "You are not a player");
    require(players[msg.sender].cards.length > 0, "No cards to draw");

    uint256 cardIndex = random(players[msg.sender].cards.length);
    CardType drawnCardType = players[msg.sender].cards[cardIndex];

    emit CardDrawn(msg.sender,playerId, drawnCardType);

    if (drawnCardType == CardType.Death) {
        emit Exploded(playerId);
        handleDeathCardDraw(playerId);
    }

    if (gameStatus == GameStatus.Ongoing) {
        if (cardIndex < players[msg.sender].cards.length - 1) {
            players[msg.sender].cards[cardIndex] = players[msg.sender].cards[players[msg.sender].cards.length - 1];
        }
        players[msg.sender].cards.pop();

        currentPlayer = nextPlayer();
        emit CardDrawn(msg.sender, players[msg.sender].playerId, drawnCardType);

        // Check if two players have drawn a death card
        uint256 deathCount = 0;
        address remainingPlayer;

        for (uint256 i = 1; i <= gameId; i++) {
            if (players[playerAddresses[i]].cards.length > 0 && players[playerAddresses[i]].cards[0] == CardType.Death) {
                deathCount++;
            } else {
                remainingPlayer = playerAddresses[i];
            }

            if (deathCount == 2) {
                endGame(remainingPlayer);
                break;
            }
        }
    }
}



    function handleDeathCardDraw(uint256 playerId) private {
        if (gameStatus == GameStatus.Ongoing) {
            emit Exploded(playerId);
        }
    }

    function endGame(address winner) private {
        payout(winner);
        resetGame();
    }

    function payout(address winner) private {
        uint256 winnings = pot-(calculatePlatformFee());
        (bool success, ) = payable(winner).call{ value: winnings }("");
        require(success, "Failed to send winnings to the winner");

        emit GameEnded(winner, winnings);
    }

    function calculatePlatformFee() private view returns (uint256) {
        return pot*(PLATFORM_FEE_PERCENT)/(100);
    }

    function distributeCards() private {
        uint256 deathCardCount = 2;
        uint256 randomPlayerId = random(gameId) + 1;

        distributeGameCards(randomPlayerId, 4);

        for (uint256 i = 1; i <= gameId; i++) {
            if (i != randomPlayerId) {
                distributeGameCards(i, 3);
                distributeDeathCards(i, 1);
            }
        }
    }

    function distributeGameCards(uint256 playerId, uint256 count) private {
        for (uint256 j = 0; j < count; j++) {
            uint256 tokenId = playerId * 1000 + j;
            _mint(playerAddresses[playerId], tokenId);
            players[playerAddresses[playerId]].cards.push(CardType.Game);
        }
    }

    function distributeDeathCards(uint256 playerId, uint256 count) private {
        for (uint256 j = 0; j < count; j++) {
            uint256 tokenId = playerId * 1000 + MIN_GAME_CARDS + j;
            _mint(playerAddresses[playerId], tokenId);
            players[playerAddresses[playerId]].cards.push(CardType.Death);
        }
    }

    function resetGame() private {
        pot = 0;
        currentPlayer = address(0);
        gameStatus = GameStatus.Ended;
    }

    function nextPlayer() private view returns (address) {
        uint256 nextPlayerId = (players[currentPlayer].playerId % gameId) + 1;
        return playerAddresses[nextPlayerId];
    }

    function random(uint256 max) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, currentPlayer))) % max;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {

    }
}