import React, { useState, useEffect, useRef } from 'react';
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
    completedTimers,
    addTimer,
    updateTimer,
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
    halfwayAlert: false,
  });
  const [congratsOpen, setCongratsOpen] = useState(false);
  const [lastCompleted, setLastCompleted] = useState(null);
  const [halfwayOpen, setHalfwayOpen] = useState(false);
  const [halfwayTimer, setHalfwayTimer] = useState(null);
  const prevCompletedCount = useRef(completedTimers.length);
  const prevTimersRef = useRef([]);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Detect when a timer is completed
  useEffect(() => {
    if (completedTimers.length > prevCompletedCount.current) {
      const latest = completedTimers[completedTimers.length - 1];
      setLastCompleted(latest);
      setCongratsOpen(true);
    }
    prevCompletedCount.current = completedTimers.length;
  }, [completedTimers]);

  // Detect halfway alert
  useEffect(() => {
    timers.forEach((timer) => {
      if (
        timer.halfwayAlert &&
        !timer.halfwayAlertTriggered &&
        timer.remainingTime <= timer.duration / 2 &&
        timer.remainingTime > 0
      ) {
        // Show halfway alert
        setHalfwayTimer(timer);
        setHalfwayOpen(true);
        // Mark as triggered
        updateTimer({ ...timer, halfwayAlertTriggered: true });
      }
    });
    prevTimersRef.current = timers;
  }, [timers, updateTimer]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addTimer({
      ...newTimer,
      duration: parseInt(newTimer.duration),
      remainingTime: parseInt(newTimer.duration),
      status: 'idle',
      halfwayAlertTriggered: false,
    });
    setNewTimer({ name: '', duration: '', category: '', halfwayAlert: false });
    handleClose();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const categories = [...new Set(timers.map((timer) => timer.category))];
  const filteredCategories = categoryFilter === 'All' ? categories : [categoryFilter];

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

        {/* Category Filter Dropdown */}
        <Box sx={{ mb: 3, maxWidth: 250 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Filter by Category"
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {filteredCategories.map((category) => (
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

        {/* Halfway Alert Modal */}
        <Dialog open={halfwayOpen} onClose={() => setHalfwayOpen(false)}>
          <DialogTitle>Halfway There!</DialogTitle>
          <DialogContent>
            <Typography variant="h6">
              {halfwayTimer ? `You are halfway through the timer: "${halfwayTimer.name}"!` : ''}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setHalfwayOpen(false)} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Congratulatory Modal */}
        <Dialog open={congratsOpen} onClose={() => setCongratsOpen(false)}>
          <DialogTitle>Congratulations!</DialogTitle>
          <DialogContent>
            <Typography variant="h6">
              {lastCompleted ? `You completed the timer: "${lastCompleted.name}"!` : ''}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCongratsOpen(false)} autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>

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
                <InputLabel id="timer-category-label">Category</InputLabel>
                <Select labelId="timer-category-label"
                  id="timerCategory"
                  value={newTimer.category}
                  label="Category"
                  onChange={(e) => setNewTimer({ ...newTimer, category: e.target.value })}
                  required
                >
                  <MenuItem value="Workout">Workout</MenuItem>
                  <MenuItem value="Study">Study</MenuItem>
                  <MenuItem value="Break">Break</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ mt: 2 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={newTimer.halfwayAlert}
                    onChange={e => setNewTimer({ ...newTimer, halfwayAlert: e.target.checked })}
                  />
                  {' '}Enable halfway alert
                </label>
              </Box>
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