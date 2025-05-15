import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useTimer } from '../context/TimerContext';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const navigate = useNavigate();
  const { completedTimers } = useTimer();

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Completed Timers
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Completed At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {completedTimers.map((timer) => (
                <TableRow key={timer.id}>
                  <TableCell>{timer.name}</TableCell>
                  <TableCell>{timer.category}</TableCell>
                  <TableCell>{timer.duration} seconds</TableCell>
                  <TableCell>{formatDate(timer.completedAt)}</TableCell>
                </TableRow>
              ))}
              {completedTimers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No completed timers yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default History; 