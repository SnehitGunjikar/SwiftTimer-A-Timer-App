import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  LinearProgress,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTimer } from '../context/TimerContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const {
    timers,
    addTimer,
    deleteTimer,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer();
  const [open, setOpen] = useState(false);
  const [newTimer, setNewTimer] = useState({
    name: '',
    duration: '',
    category: '',
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addTimer({
      ...newTimer,
      duration: parseInt(newTimer.duration),
      remainingTime: parseInt(newTimer.duration),
      status: 'idle',
    });
    setNewTimer({ name: '', duration: '', category: '' });
    handleClose();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const categories = [...new Set(timers.map((timer) => timer.category))];

  // Bulk action handlers
  const handleStartAll = (category) => {
    timers.filter((timer) => timer.category === category).forEach((timer) => startTimer(timer));
  };
  const handlePauseAll = (category) => {
    timers.filter((timer) => timer.category === category).forEach((timer) => pauseTimer(timer));
  };
  const handleResetAll = (category) => {
    timers.filter((timer) => timer.category === category).forEach((timer) => resetTimer(timer));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Timer Manager
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              sx={{ mr: 2 }}
            >
              Add Timer
            </Button>
            <Button variant="outlined" onClick={() => navigate('/history')}>
              View History
            </Button>
          </Box>
        </Box>

        {categories.map((category) => (
          <Accordion key={category}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Typography>{category}</Typography>
                <Stack direction="row" spacing={1} onClick={e => e.stopPropagation()}>
                  <Button size="small" variant="outlined" startIcon={<PlayArrowIcon />} onClick={() => handleStartAll(category)}>
                    Start All
                  </Button>
                  <Button size="small" variant="outlined" startIcon={<PauseIcon />} onClick={() => handlePauseAll(category)}>
                    Pause All
                  </Button>
                  <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={() => handleResetAll(category)}>
                    Reset All
                  </Button>
                </Stack>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {timers
                .filter((timer) => timer.category === category)
                .map((timer) => (
                  <Box
                    key={timer.id}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6">{timer.name}</Typography>
                      <Box>
                        <IconButton
                          onClick={() =>
                            timer.status === 'running' ? pauseTimer(timer) : startTimer(timer)
                          }
                        >
                          {timer.status === 'running' ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton onClick={() => resetTimer(timer)}>
                          <RefreshIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteTimer(timer.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="h4" align="center" sx={{ my: 2 }}>
                      {formatTime(timer.remainingTime)}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(timer.remainingTime / timer.duration) * 100}
                      sx={{ height: 10, borderRadius: 5, '& .MuiLinearProgress-bar': { transition: 'width 1s linear' } }}
                    />
                  </Box>
                ))}
            </AccordionDetails>
          </Accordion>
        ))}

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Timer</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Timer Name"
                fullWidth
                value={newTimer.name}
                onChange={(e) => setNewTimer({ ...newTimer, name: e.target.value })}
                required
              />
              <TextField
                margin="dense"
                label="Duration (seconds)"
                type="number"
                fullWidth
                value={newTimer.duration}
                onChange={(e) => setNewTimer({ ...newTimer, duration: e.target.value })}
                required
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Category</InputLabel>
                <Select
                  value={newTimer.category}
                  onChange={(e) => setNewTimer({ ...newTimer, category: e.target.value })}
                  required
                >
                  <MenuItem value="Workout">Workout</MenuItem>
                  <MenuItem value="Study">Study</MenuItem>
                  <MenuItem value="Break">Break</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Add Timer
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Home; 