import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Modal, Box, IconButton, Typography, CircularProgress
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; // Import the close icon
import axios from "axios";

const CoinTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch coin list from API
  const fetchCoins = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.coincap.io/v2/assets");
      setCoins(response.data.data);
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
    setLoading(false);
  };

  // Fetch coin details by id
  const fetchCoinDetails = async (coinId) => {
    try {
      const response = await axios.get(`https://api.coincap.io/v2/assets/${coinId}`);
      setSelectedCoin(response.data.data);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching coin details:", error);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  // Handle Refresh Button
  const handleRefresh = () => {
    fetchCoins();
  };

  // Handle Modal close
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCoin(null);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleRefresh} style={{ marginBottom: "20px" }}>
        Refresh
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{background:"black"}}>
                <TableCell style={{color:"white",fontSize:'1rem',fontWeight:'bold'}}>Rank</TableCell>
                <TableCell style={{color:"white",fontSize:'1rem',fontWeight:'bold'}}>Name</TableCell>
                <TableCell style={{color:"white",fontSize:'1rem',fontWeight:'bold'}}>Symbol</TableCell>
                <TableCell style={{color:"white",fontSize:'1rem',fontWeight:'bold'}}>Price</TableCell>
                <TableCell style={{color:"white",fontSize:'1rem',fontWeight:'bold'}}>Market Cap</TableCell>
                <TableCell style={{color:"white",fontSize:'1rem',fontWeight:'bold'}}>Change (24H)</TableCell>
                <TableCell style={{color:"white",fontSize:'1rem',fontWeight:'bold'}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coins.map((coin) => (
                <TableRow key={coin.id}>
                  <TableCell>{coin.rank}</TableCell>
                  <TableCell>{coin.name}</TableCell>
                  <TableCell>{coin.symbol}</TableCell>
                  <TableCell>${parseFloat(coin.priceUsd).toFixed(2)}</TableCell>
                  <TableCell>${parseFloat(coin.marketCapUsd).toLocaleString()}</TableCell>
                  <TableCell>{parseFloat(coin.changePercent24Hr).toFixed(2)}%</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => fetchCoinDetails(coin.id)} // Fetch and open modal on click
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal to show coin details */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="h2">
              {selectedCoin?.name} Details
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {selectedCoin && (
            <div>
              <Typography variant="body1" gutterBottom>
                <strong>Name:</strong> {selectedCoin.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Symbol:</strong> {selectedCoin.symbol}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Price:</strong> ${parseFloat(selectedCoin.priceUsd).toFixed(2)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Market Cap:</strong> ${parseFloat(selectedCoin.marketCapUsd).toLocaleString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Change (24H):</strong> {parseFloat(selectedCoin.changePercent24Hr).toFixed(2)}%
              </Typography>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default CoinTable;
