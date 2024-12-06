import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './Auction.css';

const Auction = ({ auctionId, product, currentBid, highestBidder, timer, isActive }) => {
  const [bidAmount, setBidAmount] = useState(currentBid + 5);  // Minimum bid increment
  const [timerCountdown, setTimerCountdown] = useState(timer);
  const [userBid, setUserBid] = useState(currentBid);
  const [isAuctionActive, setIsAuctionActive] = useState(isActive);  // Track auction status
  const [isWinner, setIsWinner] = useState(false);
  const [authToken] = useState(localStorage.getItem('token'));

  const socket = io('http://localhost:5000', {
    auth: { token: authToken },
  });

  // Join the auction room and listen for updates
  useEffect(() => {
    socket.emit('joinAuction', { auctionId });

    socket.on('bidUpdate', (data) => {
      if (data.auctionId === auctionId) {
        setUserBid(data.currentBid);
        setTimerCountdown(data.timer);
        setIsAuctionActive(data.isActive); // Update auction status
      }
    });

    socket.on('timerUpdate', (data) => {
      if (data.auctionId === auctionId) {
        setTimerCountdown(data.timer);
      }
    });

    socket.on('auctionEnded', (data) => {
      if (data.auctionId === auctionId) {
        setIsAuctionActive(false);  // Mark the auction as ended
        setIsWinner(data.highestBidder === localStorage.getItem('userId'));
      }
    });

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

    socket.emit('placeBid', {
      auctionId,
      bidAmount,
      userId: localStorage.getItem('userId'),
    });
  };

  const handleBuyNow = () => {
    if (isWinner) {
      alert('Proceeding to purchase');
    } else {
      alert('You are not the winner');
    }
  };

  const handleEndAuction = () => {
    if (isAuctionActive) {
      socket.emit('endAuction', { auctionId });
    }
  };

  return (
    <div className="auction-item">
      <h2>{product}</h2>
      <p>Current Bid: ${userBid}</p>
      <p>Highest Bidder: {highestBidder || 'None'}</p>
      <p>Time Remaining: {timerCountdown} seconds</p>

      {isAuctionActive && !isWinner && (
        <div>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(parseFloat(e.target.value))}
            min={userBid + 5} // Minimum bid increment
          />
          <button onClick={handlePlaceBid}>Place Bid</button>
        </div>
      )}

      {!isAuctionActive && isWinner && (
        <div>
          <button onClick={handleBuyNow}>Buy Now</button>
        </div>
      )}

      {!isAuctionActive && !isWinner && <p>Auction Ended. You did not win.</p>}

      {/* End auction button */}
      {isAuctionActive && (
        <button onClick={handleEndAuction}>End Auction</button>
      )}
    </div>
  );
};

export default Auction;
