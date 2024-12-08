// import React, { useState, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import './Auction.css';

// const Auction = ({ auctionId, product, currentBid, highestBidder, timer, isActive }) => {
//   const [bidAmount, setBidAmount] = useState(currentBid + 5);  // Minimum bid increment
//   const [timerCountdown, setTimerCountdown] = useState(timer);
//   const [userBid, setUserBid] = useState(currentBid);
//   const [isWinner, setIsWinner] = useState(false);
//   const [authToken] = useState(localStorage.getItem('token'));

//   const socket = io('http://localhost:5000', {
//     auth: { token: authToken },
//   });

//   // Join the auction room and listen for updates
//   useEffect(() => {
//     socket.emit('joinAuction', { auctionId });

//     socket.on('bidUpdate', (data) => {
//       if (data.auctionId === auctionId) {
//         setUserBid(data.currentBid);
//         setTimerCountdown(30);  // Reset the timer to 30 seconds whenever a new bid is placed
//       }
//     });

//     socket.on('timerUpdate', (data) => {
//       if (data.auctionId === auctionId) {
//         setTimerCountdown(data.timer);
//       }
//     });

//     socket.on('auctionEnded', (data) => {
//       if (data.auctionId === auctionId) {
//         setIsWinner(data.winner === localStorage.getItem('userId'));
//       }
//     });

//     return () => {
//       socket.off('bidUpdate');
//       socket.off('timerUpdate');
//       socket.off('auctionEnded');
//     };
//   }, [auctionId]);

//   const handlePlaceBid = () => {
//     if (!authToken) {
//       alert('Please login to place a bid');
//       return;
//     }

//     if (bidAmount <= userBid) {
//       alert('Bid must be higher than the current bid');
//       return;
//     }

//     // Emit the bid to the server
//     socket.emit('placeBid', {
//       auctionId,
//       bidAmount,
//       userId: localStorage.getItem('userId'),
//     });
//   };

//   const handleBuyNow = () => {
//     if (isWinner) {
//       // Handle Buy Now functionality
//       alert('Proceeding to purchase');
//     } else {
//       alert('You are not the winner');
//     }
//   };

//   const handleEndAuction = () => {
//     if (isActive) {
//       socket.emit('endAuction', { auctionId });
//     }
//   };

//   return (
//     <div className="auction-item">
//       <h2>{product}</h2>
//       <p>Current Bid: ${userBid}</p>
//       <p>Highest Bidder: {highestBidder || 'None'}</p>
//       <p>Time Remaining: {timerCountdown} seconds</p>

//       {isActive && !isWinner && (
//         <div>
//           <input
//             type="number"
//             value={bidAmount}
//             onChange={(e) => setBidAmount(parseFloat(e.target.value))}
//             min={userBid + 5} // Minimum bid increment
//           />
//           <button onClick={handlePlaceBid}>Place Bid</button>
//         </div>
//       )}

//       {!isActive && isWinner && (
//         <div>
//           <button onClick={handleBuyNow}>Buy Now</button>
//         </div>
//       )}

//       {!isActive && !isWinner && <p>Auction Ended. You did not win.</p>}

//       {/* End auction button */}
//       {isActive && (
//         <button onClick={handleEndAuction}>End Auction</button>
//       )}
//     </div>
//   );
// };

// export default Auction;
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './Auction.css';

const Auction = ({ auctionId, product, currentBid, highestBidder, timer, isActive }) => {
  const [bidAmount, setBidAmount] = useState(currentBid + 5);  // Minimum bid increment
  const [timerCountdown, setTimerCountdown] = useState(timer); 
  const [userBid, setUserBid] = useState(currentBid);
  const [isWinner, setIsWinner] = useState(false);
  const [authToken] = useState(localStorage.getItem('token'));

  const socket = io('http://localhost:5000', {
    auth: { token: authToken },
  });

  // Join the auction room and listen for updates
  useEffect(() => {
    // Emit to join auction room
    socket.emit('joinAuction', { auctionId });

    // Listen for updates
    socket.on('bidUpdate', (data) => {
      if (data.auctionId === auctionId) {
        setUserBid(data.currentBid);
        setTimerCountdown(30);  // Reset timer to 30 seconds on a new bid
      }
    });

    socket.on('timerUpdate', (data) => {
      if (data.auctionId === auctionId) {
        setTimerCountdown(data.timer);
      }
    });

    socket.on('auctionEnded', (data) => {
      if (data.auctionId === auctionId) {
        setIsWinner(data.winner === localStorage.getItem('userId'));
      }
    });

    // Cleanup socket listeners
    return () => {
      socket.off('bidUpdate');
      socket.off('timerUpdate');
      socket.off('auctionEnded');
    };
  }, [auctionId]);

  const handlePlaceBid = () => {
    if (!authToken) {
      alert('Please login to place a bid');
      return;
    }

    if (bidAmount <= userBid) {
      alert('Bid must be higher than the current bid');
      return;
    }

    // Emit the bid to the server
    socket.emit('placeBid', {
      auctionId,
      bidAmount,
      userId: localStorage.getItem('userId'),
    });
  };

  const handleBuyNow = () => {
    if (isWinner) {
      // Handle Buy Now functionality
      alert('Proceeding to purchase');
    } else {
      alert('You are not the winner');
    }
  };

  const handleEndAuction = () => {
    if (isActive) {
      socket.emit('endAuction', { auctionId });
    }
  };

  return (
    <div className="auction-item">
      <h2>{product}</h2>
      <p>Current Bid: ${userBid}</p>
      <p>Highest Bidder: {highestBidder || 'None'}</p>
      <p>Time Remaining: {timerCountdown} seconds</p>

      {/* Place bid section */}
      {isActive && !isWinner && (
        <div>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(parseFloat(e.target.value))}
            min={userBid + 5} // Minimum bid increment of 5
          />
          <button onClick={handlePlaceBid}>Place Bid</button>
        </div>
      )}

      {/* Buy Now section */}
      {!isActive && isWinner && (
        <div>
          <button onClick={handleBuyNow}>Buy Now</button>
        </div>
      )}

      {/* Auction Ended notification */}
      {!isActive && !isWinner && <p>Auction Ended. You did not win.</p>}

      {/* End Auction button */}
      {isActive && (
        <button onClick={handleEndAuction}>End Auction</button>
      )}
    </div>
  );
};

export default Auction;
