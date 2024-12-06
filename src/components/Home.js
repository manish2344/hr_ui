// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';

// const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

// const AuctionPage = () => {
//   const [auction, setAuction] = useState(null);
//   const [bidAmount, setBidAmount] = useState(0);
//   const [timer, setTimer] = useState(30);
//   const [user, setUser] = useState(null);
//   const [errorMessage, setErrorMessage] = useState('');
//   const { auctionId } = useParams();
//   const timerRef = useRef();

//   // Fetch user details
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios
//         .get('http://localhost:5000/api/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => setUser(response.data.user))
//         .catch((error) => console.error('Error fetching user:', error));
//     }
//   }, []);

//   // Fetch auction details
//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/auction/${auctionId}`)
//       .then((response) => {
//         setAuction(response.data);
//         setBidAmount(response.data.currentBid);
//       })
//       .catch((error) => {
//         setErrorMessage('Error fetching auction details.');
//         console.error(error);
//       });

//     socket.on('auction-update', (auctionData) => {
//       setAuction(auctionData);
//       setTimer(auctionData.timer);
//     });

//     return () => {
//       socket.off('auction-update');
//     };
//   }, [auctionId]);

//   useEffect(() => {
//     if (timer > 0) {
//       timerRef.current = setInterval(() => {
//         setTimer((prevTime) => prevTime - 1);
//       }, 1000);
//     } else {
//       clearInterval(timerRef.current);
//     }

//     return () => clearInterval(timerRef.current);
//   }, [timer]);

//   const handlePlaceBid = () => {
//     if (!user) {
//       return alert('You must be logged in to place a bid');
//     }
//     if (!bidAmount || isNaN(bidAmount) || bidAmount <= auction.currentBid) {
//       return alert('Enter a valid bid amount higher than the current bid.');
//     }

//     axios
//       .post(
//         'http://localhost:5000/api/auction/bid',
//         { auctionId, bidAmount },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       )
//       .then((response) => {
//         setBidAmount(response.data.auction.currentBid);
//       })
//       .catch((error) => {
//         const message = error.response?.data?.message || 'Error placing bid';
//         setErrorMessage(message);
//       });
//   };

//   const handleBuyNow = () => {
//     alert('You have purchased the item!');
//   };

//   if (!auction) return <div>Loading auction details...</div>;

//   return (
//     <div className="auction-container">
//       <h2>Auction for {auction.productName}</h2>
//       <p>Current Bid: ${auction.currentBid}</p>
//       <p>Highest Bidder: {auction.highestBidder || 'No bids yet'}</p>
//       <p>Time Remaining: {timer} seconds</p>

//       <input
//         type="number"
//         value={bidAmount}
//         onChange={(e) => setBidAmount(Number(e.target.value))}
//         placeholder="Enter your bid"
//       />
//       <button onClick={handlePlaceBid}>Place Bid</button>

//       {auction.highestBidder === user?.id && <button onClick={handleBuyNow}>Buy Now</button>}

//       {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//     </div>
//   );
// };

// export default AuctionPage;

import React from 'react'

function Home() {
  return (
    <div>Home</div>
  )
}

export default Home