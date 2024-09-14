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
      main: '#1976d2', // Main Blue
    },
    secondary: {
      main: '#4caf50', // Green Accent
    },
    background: {
      default: '#f4f6f8', // Light Background Color
    },
    text: {
      primary: '#333', // Darker Text Color
      secondary: '#666', // Subtle Text Color
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h4: {
      fontWeight: 700,
      color: '#1976d2',
      marginBottom: '20px',
      marginTop: '20px',
      fontSize: '50px'
    },
    h6: {
      fontWeight: 500,
      color: '#4caf50',
    },
    body1: {
      fontSize: '1.1rem',
      lineHeight: 1.7,
      color: '#555',
    },
  },
});

const Main = () => {
  const [gasCars, setGasCars] = useState(0);
  const [electricCars, setElectricCars] = useState(0);
  const [publicTransport, setPublicTransport] = useState(0);
  const [electricBikes, setElectricBikes] = useState(0);
  const [solar, setSolar] = useState(0);
  const [fossil, setFossil] = useState(0);
  const [electricity, setElectricity] = useState(0);
  const [carbonTax, setCarbonTax] = useState(0);
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

  const getEnergyArray = (initialEnergy, percentageChange) => {
    let energyArray = [];
    let currentEnergy = initialEnergy;

    for (let i = 0; i < 30; i++) {
      currentEnergy = currentEnergy * (1 + percentageChange / 100);
      energyArray.push(currentEnergy);
    }

    return energyArray;
  }

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

  const getSolarArray = (initialSolarEnergy) => {
    return getEnergyArray(initialSolarEnergy, solar);
  }

  const getFossilArray = (initialFossilEnergy) => {
    return getEnergyArray(initialFossilEnergy, fossil);
  }

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

  const calcSolarEnergyEmissions = () => {
    const em_per_solar = -20; //-4
    const solarArray = getSolarArray(1.1);
    const solarEmissions = [];

    for (let i = 0; i < 30; i++) {
      const solarDifference = solarArray[i] - 1.1; //1.1
      const emission = em_per_solar * solarDifference;
      solarEmissions.push(emission);
    }

    return solarEmissions;
  }

  const calcFossilEnergyEmissions = () => {
    const fossilArray = getFossilArray(4800);
    const fossilEmissions = [];

    for (let i = 0; i < 30; i++) {
      const fossilDifference = fossilArray[i] - 4800;
      const emission = .5*fossilDifference;
      fossilEmissions.push(emission);
    }

    return fossilEmissions;
  }
  const calcElectricityEmissions = () => {
    const electricityChange = [];

    for (let i = 0; i < 30; i++) {
      const pdecrease = electricity/1000
      const emission =  baselineCO2[i] * ((1+pdecrease)**i -1)
      electricityChange.push(emission);
    }

    return electricityChange;
  }

  const calcCarbonTax = () => {
    const carbonTaxChange = [];

    for (let i = 0; i < 30; i++) {
      const pdecrease = carbonTax/1000
      const emission =  baselineCO2[i] * ((1-pdecrease)**i -1)
      carbonTaxChange.push(emission);
    }

    return carbonTaxChange;
  }

  const combineEmissionsWithBaseline = () => {
    const GCEmissions = calcGCEmissions();
    const ECEmissions = calcElectricCarEmissions();
    const PTEmissions = calcPublicTransportEmissions();
    const EBEmissions = calcElectricBikeEmissions();
    const solarEmissions = calcSolarEnergyEmissions();
    const fossilEmissions = calcFossilEnergyEmissions();
    const carbonTaxChange = calcCarbonTax();
    const electrictyChange = calcElectricityEmissions();

    const combined = baselineCO2.map((baseline, index) => 
      baseline + GCEmissions[index] + ECEmissions[index] + PTEmissions[index] + EBEmissions[index] + solarEmissions[index] + fossilEmissions[index] + carbonTaxChange[index] + electrictyChange[index]
    );

    return combined;
  };

  // Use useEffect to recalculate combined emissions when any of the transportation sliders change
  useEffect(() => {
    const newCombinedEmissions = combineEmissionsWithBaseline();
    setCombinedEmissions(newCombinedEmissions);
  }, [gasCars, electricCars, publicTransport, electricBikes, solar, fossil, carbonTax, electricity]);

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
        label: 'CO2 Emissions Due to Policy Changes (Millions of Tons)',
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
        <Typography variant="h4" align="center" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)' }} gutterBottom>
          CO2 Emissions Simulator
        </Typography>

        <Tabs className="tabs-custom" value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Transportation Policies" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)' }}/>
          <Tab label="Energy Policies" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)' }}/>
          <Tab label="Industrial Policies" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)' }}/>
        </Tabs>

        <Box p={4}>
            <Grid container spacing={2} justifyContent="center">
                {selectedTab === 0 && (
                <Box 
                    component={Paper} 
                    elevation={5} 
                    p={3} 
                    m={2} 
                    sx={{ 
                    textAlign: 'center', 
                    backgroundColor: '#ffffff', 
                    maxWidth: '2000px', 
                    width: '2000px',
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    }}
                >
                    <Typography className="body1" variant="body1" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)', color: gasCars >= 0 ? 'green' : 'red'}}>
                    Gas Cars Percentage: 
                    <br />
                    {gasCars}%
                    </Typography>
                    <Typography className="body1" variant="body1" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)', color: electricCars >= 0 ? 'green' : 'red'}}>
                    Electric Cars Percentage: 
                    <br />
                    {electricCars}%
                    </Typography>
                    <Typography className="body1" variant="body1" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)', color: publicTransport >= 0 ? 'green' : 'red'}}>
                    Public Transport Percentage: 
                    <br />
                    {publicTransport}%
                    </Typography>
                    <Typography className="body1" variant="body1" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)', color: electricBikes >= 0 ? 'green' : 'red'}}>
                    Electric Bikes Percentage: 
                    <br />
                    {electricBikes}%
                    </Typography>
                </Box>
                )}

                {selectedTab === 1 && (
                <Box 
                    component={Paper} 
                    elevation={5} 
                    p={3} 
                    m={2} 
                    sx={{ 
                    textAlign: 'center', 
                    backgroundColor: '#ffffff', 
                    maxWidth: '2000px', 
                    width: '2000px',
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    }}
                >
                    <Typography className="body1" variant="body1" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)', color: solar >= 0 ? 'green' : 'red'}}>
                    Solar Energy Percentage Change: 
                    <br />
                    {solar}%
                    </Typography>
                    <Typography className="body1" variant="body1" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)', color: fossil >= 0 ? 'green' : 'red' }}>
                    Fossil Energy Percentage Change: 
                    <br />
                    {fossil}%
                    </Typography>
                    <Typography className="body1" variant="body1" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)', color: electricity >= 0 ? 'green' : 'red' }}>
                    Electricity Use Percentage Change: 
                    <br />
                    {electricity}%
                    </Typography>
                </Box>
                )}

                {selectedTab === 2 && (
                <Box 
                    component={Paper} 
                    elevation={5} 
                    p={3} 
                    m={2} 
                    sx={{ 
                    textAlign: 'center', 
                    backgroundColor: '#ffffff', 
                    maxWidth: '2000px', 
                    width: '2000px',
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    }}
                >
                    <Typography className="body1" variant="body1" sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)' }}>
                    Carbon Tax Change: 
                    <br />
                    {carbonTax}%
                    </Typography>
                </Box>
                )}
            </Grid>
        </Box>


        {selectedTab === 0 && (
          <Box component={Paper} elevation={8} p={4} mb={4}>
            <Typography variant="h6">Percent Change in Number of Gas Cars per Year</Typography>
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
            <Typography variant="h6">Percent Change in Number of Electric Cars per Year</Typography>
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
            <Typography variant="h6">Percent Change in Number of Public Transportation users per Year</Typography>
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
            <Typography variant="h6">Percent Change in Number of Electric Bikes per Year</Typography>
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
          <Box component={Paper} elevation={8} p={4} mb={4}>
            <Typography variant="h6">Change in Solar Energy</Typography>
            <Slider
              className="slider-custom"
              value={solar}
              onChange={(e, value) => setSolar(value)}
              aria-labelledby="energy-slider"
              valueLabelDisplay="auto"
              step={0.1}
              min={-10}
              max={10}
              marks={[
                { value: -10, label: '-10%' },
                { value: 10, label: '10%' }
              ]}
            />
            <Typography variant="h6">Change in Fossil Energy</Typography>
            <Slider
              className="slider-custom"
              value={fossil}
              onChange={(e, value) => setFossil(value)}
              aria-labelledby="agriculture-slider"
              valueLabelDisplay="auto"
              step={0.1}
              min={-5}
              max={5}
              marks={[
                { value: -5, label: '-5%' },
                { value: 5, label: '5%' }
              ]}
            />
            <Typography variant="h6">Change in Electricty Use</Typography>
            <Slider
              className="slider-custom"
              value={electricity}
              onChange={(e, value) => setElectricity(value)}
              aria-labelledby="agriculture-slider"
              valueLabelDisplay="auto"
              step={0.1}
              min={-5}
              max={5}
              marks={[
                { value: -5, label: '-5%' },
                { value: 5, label: '5%' }
              ]}
            />
          </Box>
        )}

        {selectedTab === 2 && (
          <Box component={Paper} elevation={8} p={4} mb={4}>
            <Typography variant="h6">Increase in Added Carbon Tax (USD / ton of C02)</Typography>
            <Slider
              className="slider-custom"
              value={carbonTax}
              onChange={(e, value) => setCarbonTax(value)}
              aria-labelledby="energy-slider"
              valueLabelDisplay="auto"
              step={0.1}
              min={0}
              max={30}
              marks={[
                { value: 0, label: '0%' },
                { value: 30, label: '30%' }
              ]}
            />
          </Box>
        )}

        <Paper className="paper-card" elevation={8} p={4}>
          <Line data={co2Data} />
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Main;