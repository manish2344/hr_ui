import React, { useState, useEffect } from 'react';
import Auction from './Auction';
import { useNavigate } from 'react-router-dom';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  // Fetch auctions from the backend
  useEffect(() => {
    const fetchAuctions = async () => {
      const response = await fetch('http://localhost:5000/api/auction/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authenticated request
        },
      });
      const data = await response.json();
      setAuctions(data);
    };

    fetchAuctions();
  }, []);

  return (
    <div className="auction-list">
      <h1>Active Auctions</h1>
      {auctions.length > 0 ? (
        auctions.map((auction) => (
          <Auction
            key={auction._id}
            auctionId={auction._id}
            product={auction.productName}
            currentBid={auction.currentBid}
            highestBidder={auction.highestBidder}
            timer={auction.timer}
            isActive={auction.sold === false}
          />
        ))
      ) : (
        <p>No active auctions available</p>
      )}
    </div>
  );
};

export default AuctionList;
