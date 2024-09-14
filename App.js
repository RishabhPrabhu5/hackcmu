import React, { useState, useEffect } from 'react';
import { Container, Typography, Slider, Box, Paper, Tabs, Tab, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';

// Define custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: 'Poppins',
  },
});

const App = () => {
  const [gasCars, setGasCars] = useState(0);
  const [electricCars, setElectricCars] = useState(0);
  const [publicTransport, setPublicTransport] = useState(0);
  const [electricBikes, setElectricBikes] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [agriculture, setAgriculture] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [combinedEmissions, setCombinedEmissions] = useState([]);

  const baselineCO2 = [
    5494.59, 5541.33, 5441.64, 5212.69, 5162.21, 5154.9, 5142.67, 5113.03, 5066.8, 4996.56,
    4955.94, 4931.03, 4907.22, 4877.69, 4819.97, 4762.14, 4695.88, 4635, 4556.1, 4487.26,
    4462.64, 4446.69, 4437.43, 4422.38, 4400.83, 4391.74, 4391.68, 4396.54, 4405.45, 4409.36
  ];

  const getVehicleArray = (initialVehicles, percentageChange) => {
    let vehicleArray = [];
    let currentVehicles = initialVehicles;

    for (let i = 0; i < 30; i++) {
      currentVehicles = currentVehicles * (1 + percentageChange / 100);
      vehicleArray.push(currentVehicles);
    }

    return vehicleArray;
  };

  const getGasCarArray = (initialGasCars) => {
    return getVehicleArray(initialGasCars, gasCars);
  };

  const getElectricCarArray = (initialElectricCars) => {
    return getVehicleArray(initialElectricCars, electricCars);
  };

  const getPublicTransportArray = (initialPublicTransport) => {
    return getVehicleArray(initialPublicTransport, publicTransport);
  };

  const getElectricBikeArray = (initialElectricBikes) => {
    return getVehicleArray(initialElectricBikes, electricBikes);
  };

  const calcGCEmissions = () => {
    const em_per_car = 4.6;
    const getCarsArrayResult = getGasCarArray(231);
    const GCEmissions = [];

    for (let i = 0; i < 30; i++) {
      const carDifference = getCarsArrayResult[i] - 231;
      const emission = em_per_car * carDifference;
      GCEmissions.push(emission);
    }

    return GCEmissions;
  };

  const calcElectricCarEmissions = () => {
    const em_per_electric_car = 2.3;
    const electricCarsArray = getElectricCarArray(16.5);
    const ECEmissions = [];

    for (let i = 0; i < 30; i++) {
      const carDifference = electricCarsArray[i] - 16.5;
      const emission = em_per_electric_car * carDifference;
      ECEmissions.push(emission);
    }

    return ECEmissions;
  };

  const calcPublicTransportEmissions = () => {
    const em_per_public_transport = 3.22;
    const publicTransportArray = getPublicTransportArray(9.2);
    const PTEmissions = [];

    for (let i = 0; i < 30; i++) {
      const transportDifference = publicTransportArray[i] - 9.2;
      const emission = em_per_public_transport * transportDifference;
      PTEmissions.push(emission);
    }

    return PTEmissions;
  };

  const calcElectricBikeEmissions = () => {
    const em_per_bike = 0.05;
    const electricBikeArray = getElectricBikeArray(1.28);
    const EBEmissions = [];

    for (let i = 0; i < 30; i++) {
      const bikeDifference = electricBikeArray[i] - 1.28;
      const emission = em_per_bike * bikeDifference;
      EBEmissions.push(emission);
    }

    return EBEmissions;
  };

  const combineEmissionsWithBaseline = () => {
    const GCEmissions = calcGCEmissions();
    const ECEmissions = calcElectricCarEmissions();
    const PTEmissions = calcPublicTransportEmissions();
    const EBEmissions = calcElectricBikeEmissions();

    const combined = baselineCO2.map((baseline, index) => 
      baseline + GCEmissions[index] + ECEmissions[index] + PTEmissions[index] + EBEmissions[index]
    );

    return combined;
  };

  // Use useEffect to recalculate combined emissions when any of the transportation sliders change
  useEffect(() => {
    const newCombinedEmissions = combineEmissionsWithBaseline();
    setCombinedEmissions(newCombinedEmissions);
  }, [gasCars, electricCars, publicTransport, electricBikes]);

  const co2Data = {
    labels: Array.from({ length: 30 }, (_, i) => 2021 + i),
    datasets: [
      {
        label: 'Baseline CO2 Emissions (Millions of Tons)',
        data: baselineCO2,
        fill: false,
        borderColor: 'rgba(255,99,132,1)',
        borderDash: [5, 5],
        tension: 0.1
      },
      {
        label: 'Gas Car CO2 Emissions Added (Millions of Tons)',
        data: combinedEmissions,
        fill: false,
        borderColor: 'rgba(54,162,235,1)',
        tension: 0.1
      }
    ]
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className="container">
        <Typography variant="h4" align="center" gutterBottom>
          CO2 Emissions Simulator
        </Typography>

        <Tabs className="tabs-custom" value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Transportation" />
          <Tab label="Energy & Agriculture" />
        </Tabs>

        <Box p={4}>
          <Grid container spacing={2}>
            {selectedTab === 0 && (
              <Box className="percentagesBox" item xs={6}>
                <Typography className="body1" variant="body1">Gas Cars Percentage: {gasCars}%</Typography>
                <Typography className="body1" variant="body1">Electric Cars Percentage: {electricCars}%</Typography>
                <Typography className="body1" variant="body1">Public Transport Percentage: {publicTransport}%</Typography>
                <Typography className="body1" variant="body1">Electric Bikes Percentage: {electricBikes}%</Typography>
              </Box>
            )}

            {selectedTab === 1 && (
              <>
                <Grid item xs={6}>
                  <Typography variant="body1">Energy Policy: {energy}%</Typography>
                  <Typography variant="body1">Agriculture Policy: {agriculture}%</Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Box> 

        {selectedTab === 0 && (
          <Box component={Paper} p={4} mb={4}>
            <Typography variant="h6">Change in Gas Car Percentage</Typography>
            <Slider
              className="slider-custom"
              value={gasCars}
              onChange={(e, value) => setGasCars(value)}
              aria-labelledby="gas-cars-slider"
              valueLabelDisplay="auto"
              step={0.1}
              min={-2}
              max={2}
              marks={[
                { value: -2, label: '-2%' },
                { value: 2, label: '2%' }
              ]}
            />
            <Typography variant="h6">Change in Electric Car Percentage</Typography>
            <Slider
              className="slider-custom"
              value={electricCars}
              onChange={(e, value) => setElectricCars(value)}
              aria-labelledby="electric-cars-slider"
              valueLabelDisplay="auto"
              step={0.1}
              min={-10}
              max={10}
              marks={[
                { value: -10, label: '-10%' },
                { value: 10, label: '10%' }
              ]}
            />
            <Typography variant="h6">Change in Public Transportation Percentage</Typography>
            <Slider
              className="slider-custom"
              value={publicTransport}
              onChange={(e, value) => setPublicTransport(value)}
              aria-labelledby="public-transport-slider"
              valueLabelDisplay="auto"
              step={0.1}
              min={-10}
              max={10}
              marks={[
                { value: -10, label: '-10%' },
                { value: 10, label: '10%' }
              ]}
            />
            <Typography variant="h6">Change in Electric Bike Percentage</Typography>
            <Slider
              className="slider-custom"
              value={electricBikes}
              onChange={(e, value) => setElectricBikes(value)}
              aria-labelledby="electric-bike-slider"
              valueLabelDisplay="auto"
              step={0.1}
              min={-20}
              max={20}
              marks={[
                { value: -20, label: '-20%' },
                { value: 20, label: '20%' }
              ]}
            />
          </Box>
        )}

        {selectedTab === 1 && (
          <Box component={Paper} p={4} mb={4}>
            <Typography variant="h6">Energy Policy</Typography>
            <Slider
              className="slider-custom"
              value={energy}
              onChange={(e, value) => setEnergy(value)}
              aria-labelledby="energy-slider"
              valueLabelDisplay="auto"
              step={0.1}
              min={-2}
              max={2}
            />
            <Typography variant="h6">Agriculture Policy</Typography>
            <Slider
              className="slider-custom"
              value={agriculture}
              onChange={(e, value) => setAgriculture(value)}
              aria-labelledby="agriculture-slider"
              valueLabelDisplay="auto"
              step={0.1}
              min={-2}
              max={2}
            />
          </Box>
        )}

        <Paper className="paper-card" elevation={3} p={4}>
          <Line data={co2Data} />
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;