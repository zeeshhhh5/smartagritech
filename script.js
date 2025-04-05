document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const API_KEY = '16dfc01f6f084abf9e1141035251003';
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks.classList.contains('active') && !event.target.closest('.navbar')) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn.querySelector('i').classList.contains('fa-times')) {
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            }
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                    mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Weather API integration
    const weatherBtn = document.getElementById('get-weather');
    const weatherData = document.getElementById('weather-data');
    const weatherPlaceholder = document.getElementById('weather-placeholder');
    const weatherLoading = document.getElementById('weather-loading');
    const weatherError = document.getElementById('weather-error');
    const weatherErrorMessage = document.getElementById('weather-error-message');
    
    if (weatherBtn) {
        weatherBtn.addEventListener('click', function() {
            const location = document.getElementById('location').value;
            if (!location) {
                showWeatherError('Please enter a location');
                return;
            }
            
            fetchWeatherData(location);
        });
    }
    
    // Function to fetch weather data
    async function fetchWeatherData(location) {
        // Show loading state
        weatherData.style.display = 'none';
        weatherPlaceholder.style.display = 'none';
        weatherLoading.style.display = 'flex';
        weatherError.style.display = 'none';
        
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`);
            const data = await response.json();
            
            if (data.error) {
                showWeatherError(data.error.message);
                return;
            }
            
            // Process and display weather data
            displayWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            showWeatherError('Failed to fetch weather data. Please try again.');
        }
    }
    
    // Function to display weather data
    function displayWeatherData(data) {
        // Hide loading and error states
        weatherLoading.style.display = 'none';
        weatherError.style.display = 'none';
        weatherPlaceholder.style.display = 'none';
        
        // Extract relevant data
        const location = `${data.location.name}, ${data.location.country}`;
        const temperature = data.current.temp_c;
        const condition = data.current.condition.text;
        const humidity = data.current.humidity;
        const windSpeed = data.current.wind_kph;
        const precipitation = data.current.precip_mm;
        const feelsLike = data.current.feelslike_c;
        const conditionCode = data.current.condition.code;
        
        // Update weather data elements
        document.getElementById('weather-location').textContent = location;
        document.getElementById('weather-date').textContent = data.location.localtime;
        
        // Set weather icon based on condition code
        const weatherIconElement = document.getElementById('weather-icon');
        setWeatherIcon(weatherIconElement, conditionCode, data.current.is_day);
        
        document.getElementById('weather-temp').textContent = `${temperature}°C`;
        document.getElementById('weather-desc').textContent = condition;
        document.getElementById('weather-feels').textContent = `${feelsLike}°C`;
        document.getElementById('weather-humidity').textContent = `${humidity}%`;
        document.getElementById('weather-wind').textContent = `${windSpeed} km/h`;
        document.getElementById('weather-precip').textContent = `${precipitation} mm`;
        
        document.getElementById('weather-farming-impact').textContent = getFarmingImpact(temperature, humidity, precipitation);
        
        // Show the weather data container
        weatherData.style.display = 'block';
        
        // Auto-fill irrigation calculator with weather data
        try {
            if (document.getElementById('current-temp')) {
                document.getElementById('current-temp').value = temperature;
            }
            if (document.getElementById('humidity')) {
                document.getElementById('humidity').value = humidity;
            }
            if (document.getElementById('last-rain')) {
                document.getElementById('last-rain').value = precipitation;
            }
        } catch (error) {
            console.error('Error auto-filling irrigation calculator:', error);
        }
    }
    
    // Function to set weather icon based on condition code
    function setWeatherIcon(iconElement, conditionCode, isDay) {
        // Map condition codes to Font Awesome icons
        // This is a simplified mapping, you can expand it for more conditions
        let iconClass = 'fas fa-cloud-sun';
        
        if (conditionCode >= 1000 && conditionCode < 1003) {
            // Clear or sunny
            iconClass = isDay ? 'fas fa-sun' : 'fas fa-moon';
        } else if (conditionCode >= 1003 && conditionCode < 1010) {
            // Partly cloudy
            iconClass = isDay ? 'fas fa-cloud-sun' : 'fas fa-cloud-moon';
        } else if (conditionCode >= 1010 && conditionCode < 1030) {
            // Cloudy
            iconClass = 'fas fa-cloud';
        } else if (conditionCode >= 1030 && conditionCode < 1070) {
            // Mist, fog, etc.
            iconClass = 'fas fa-smog';
        } else if (conditionCode >= 1070 && conditionCode < 1150) {
            // Light rain, drizzle
            iconClass = 'fas fa-cloud-rain';
        } else if (conditionCode >= 1150 && conditionCode < 1200) {
            // Heavy rain
            iconClass = 'fas fa-cloud-showers-heavy';
        } else if (conditionCode >= 1200 && conditionCode < 1250) {
            // Light snow
            iconClass = 'fas fa-snowflake';
        } else if (conditionCode >= 1250 && conditionCode < 1280) {
            // Heavy snow
            iconClass = 'fas fa-snowflake';
        } else if (conditionCode >= 1280) {
            // Thunderstorm
            iconClass = 'fas fa-bolt';
        }
        
        // Remove all existing classes except fa-4x
        iconElement.className = '';
        iconElement.classList.add(...iconClass.split(' '), 'fa-4x');
    }
    
    // Function to get farming impact based on weather conditions
    function getFarmingImpact(temperature, humidity, precipitation) {
        const temp = temperature;
        const humidityValue = humidity;
        const precip = precipitation;
        
        if (temp > 35) {
            return "High temperature alert: Consider additional irrigation and shade for sensitive crops. Water early morning or evening to reduce evaporation.";
        } else if (temp < 5) {
            return "Low temperature alert: Protect crops from potential frost damage. Consider using row covers or frost protection methods.";
        } else if (humidityValue > 85 && temp > 25) {
            return "High humidity and temperature: Monitor for fungal diseases. Ensure adequate spacing between plants and consider preventative fungicide application.";
        } else if (humidityValue > 85) {
            return "High humidity alert: Monitor for fungal diseases and reduce irrigation. Improve air circulation around plants if possible.";
        } else if (precip > 10) {
            return "Significant rainfall detected: Adjust irrigation schedules accordingly. Check for proper drainage to prevent waterlogging.";
        } else if (temp > 25 && humidityValue < 30) {
            return "Hot and dry conditions: Increase irrigation frequency and consider mulching to retain soil moisture.";
        } else {
            return "Current conditions are favorable for most farming activities. Maintain regular monitoring of crops and soil moisture.";
        }
    }
    
    // Function to show weather error
    function showWeatherError(message) {
        weatherData.style.display = 'none';
        weatherPlaceholder.style.display = 'none';
        weatherLoading.style.display = 'none';
        weatherError.style.display = 'flex';
        weatherErrorMessage.textContent = message;
    }
    
    // Smart Irrigation Calculator
    const calculateBtn = document.getElementById('calculate-irrigation');
    const irrigationData = document.getElementById('irrigation-data');
    const irrigationPlaceholder = document.getElementById('irrigation-placeholder');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            try {
                const cropType = document.getElementById('crop-type').value;
                const fieldSize = parseFloat(document.getElementById('field-size').value);
                const temperature = parseFloat(document.getElementById('current-temp').value);
                const humidity = parseFloat(document.getElementById('humidity').value);
                const rainfall = parseFloat(document.getElementById('last-rain').value);
                
                if (!cropType || isNaN(fieldSize) || isNaN(temperature) || isNaN(humidity) || isNaN(rainfall)) {
                    alert('Please fill all fields with valid values');
                    return;
                }
                
                const waterNeeds = calculateWaterNeeds(cropType, fieldSize, temperature, humidity, rainfall);
                displayIrrigationResults(waterNeeds, cropType, fieldSize);
            } catch (error) {
                console.error('Error calculating irrigation needs:', error);
                alert('An error occurred while calculating irrigation needs. Please try again.');
            }
        });
    }
    
    // Function to calculate water needs
    function calculateWaterNeeds(cropType, fieldSize, temperature, humidity, rainfall) {
        // Base water requirements in liters per acre per day
        const baseWaterNeeds = {
            'tomato': 16000,
            'potato': 14000,
            'wheat': 15000,
            'rice': 25000,
            'corn': 18000,
            'soybean': 17000,
            'cotton': 20000
        };
        
        // Get base water requirement
        let waterNeeds = baseWaterNeeds[cropType] || 15000;
        
        // Convert field size from acres to square meters (1 acre = 4046.86 square meters)
        const areaInSqMeters = fieldSize * 4046.86;
        
        // Temperature adjustment (increase water needs in high temperatures)
        let tempFactor = 1.0;
        if (temperature > 30) {
            tempFactor = 1.2; // 20% increase for hot weather
        } else if (temperature > 25) {
            tempFactor = 1.1; // 10% increase for warm weather
        } else if (temperature < 15) {
            tempFactor = 0.9; // 10% decrease for cool weather
        } else if (temperature < 10) {
            tempFactor = 0.8; // 20% decrease for cold weather
        }
        
        // Humidity adjustment (decrease water needs in high humidity)
        let humidityFactor = 1.0;
        if (humidity > 80) {
            humidityFactor = 0.8; // 20% decrease for high humidity
        } else if (humidity > 60) {
            humidityFactor = 0.9; // 10% decrease for moderate humidity
        } else if (humidity < 40) {
            humidityFactor = 1.1; // 10% increase for low humidity
        } else if (humidity < 20) {
            humidityFactor = 1.2; // 20% increase for very low humidity
        }
        
        // Rainfall adjustment (decrease water needs based on recent rainfall)
        let rainfallFactor = 1.0;
        if (rainfall > 20) {
            rainfallFactor = 0.6; // 40% decrease for heavy rainfall
        } else if (rainfall > 10) {
            rainfallFactor = 0.8; // 20% decrease for moderate rainfall
        } else if (rainfall > 5) {
            rainfallFactor = 0.9; // 10% decrease for light rainfall
        }
        
        // Calculate adjusted water needs per square meter
        const adjustedWaterPerSqMeter = (waterNeeds / 4046.86) * tempFactor * humidityFactor * rainfallFactor;
        
        // Calculate total water needs for the field
        const totalWaterNeeds = Math.round(adjustedWaterPerSqMeter * areaInSqMeters);
        
        return totalWaterNeeds;
    }
    
    // Function to display irrigation results
    function displayIrrigationResults(waterNeeds, cropType, fieldSize) {
        // Format the water needs with commas for thousands
        const formattedWaterNeeds = waterNeeds.toLocaleString();
        
        // Update the irrigation data elements
        document.getElementById('irrigation-crop-type').textContent = `${cropType.charAt(0).toUpperCase() + cropType.slice(1)} (${fieldSize} acres)`;
        document.getElementById('water-needs').textContent = `${formattedWaterNeeds} Liters`;
        document.getElementById('irrigation-recommendation').textContent = getIrrigationRecommendation(cropType, waterNeeds, fieldSize);
        
        // Hide placeholder and show results
        irrigationPlaceholder.style.display = 'none';
        irrigationData.style.display = 'block';
    }
    
    // Function to get irrigation recommendation
    function getIrrigationRecommendation(cropType, waterNeeds, fieldSize) {
        // Recommendations based on crop type and water needs
        const waterPerAcre = waterNeeds / fieldSize;
        let recommendation = '';
        
        if (waterPerAcre > 20000) {
            recommendation = `Your ${cropType} crop has high water requirements. Consider drip irrigation for water efficiency. Water early in the morning to reduce evaporation.`;
        } else if (waterPerAcre > 15000) {
            recommendation = `Your ${cropType} crop has moderate water requirements. Use scheduled irrigation and monitor soil moisture regularly.`;
        } else {
            recommendation = `Your ${cropType} crop has relatively low water requirements. Ensure consistent soil moisture and avoid overwatering.`;
        }
        
        // Add additional crop-specific advice
        switch(cropType) {
            case 'rice':
                recommendation += ' Rice benefits from flooded conditions during most growth stages.';
                break;
            case 'wheat':
                recommendation += ' Critical irrigation periods for wheat are during tillering, jointing, and grain filling stages.';
                break;
            case 'corn':
                recommendation += ' Corn is most sensitive to water stress during silking and tasseling stages.';
                break;
            case 'tomato':
                recommendation += ' Tomatoes need consistent moisture, especially during fruit development.';
                break;
            case 'potato':
                recommendation += ' Potatoes require consistent soil moisture; avoid letting soil dry out between waterings.';
                break;
            case 'cotton':
                recommendation += ' Cotton is drought-tolerant but needs adequate water during boll development.';
                break;
            case 'soybean':
                recommendation += ' Soybeans are most sensitive to water stress during flowering and pod filling.';
                break;
        }
        
        return recommendation;
    }
    
    // AI Recommendations functionality
    const generateRecommendationsBtn = document.getElementById('generate-recommendations');
    const aiRecommendation = document.getElementById('ai-recommendation');
    const aiPlaceholder = document.getElementById('ai-placeholder');
    
    if (generateRecommendationsBtn) {
        generateRecommendationsBtn.addEventListener('click', function() {
            const location = document.getElementById('farm-location').value;
            const soilType = document.getElementById('soil-type').value;
            const farmSize = document.getElementById('farm-size').value;
            const farmingGoal = document.getElementById('farming-goal').value;
            
            if (!location || !soilType || !farmSize || !farmingGoal) {
                alert('Please fill in all fields to get personalized recommendations');
                return;
            }
            
            generateFarmingRecommendations(location, soilType, farmSize, farmingGoal);
        });
    }
    
    // Function to generate farming recommendations
    function generateFarmingRecommendations(location, soilType, farmSize, farmingGoal) {
        // Hide placeholder and show loading indicator
        aiPlaceholder.style.display = 'none';
        
        // Simulate AI processing time
        setTimeout(() => {
            // Update farm details
            document.getElementById('ai-farm-details').textContent = 
                `${location} | ${soilType} soil | ${farmSize} acres | Goal: ${formatGoal(farmingGoal)}`;
            
            // Clear previous recommendations
            document.getElementById('recommended-crops').innerHTML = '';
            document.getElementById('farming-practices').innerHTML = '';
            document.getElementById('resource-management').innerHTML = '';
            
            // Generate recommendations based on inputs
            const recommendedCrops = getRecommendedCrops(soilType, farmingGoal);
            const farmingPractices = getFarmingPractices(farmingGoal, soilType);
            const resourceManagement = getResourceManagement(farmingGoal, soilType);
            
            // Add recommended crops
            recommendedCrops.forEach(crop => {
                const li = document.createElement('li');
                li.innerHTML = crop;
                document.getElementById('recommended-crops').appendChild(li);
            });
            
            // Add farming practices
            farmingPractices.forEach(practice => {
                const li = document.createElement('li');
                li.innerHTML = practice;
                document.getElementById('farming-practices').appendChild(li);
            });
            
            // Add resource management tips
            resourceManagement.forEach(tip => {
                const li = document.createElement('li');
                li.innerHTML = tip;
                document.getElementById('resource-management').appendChild(li);
            });
            
            // Show the recommendation
            aiRecommendation.style.display = 'block';
        }, 1500);
    }
    
    // Function to format farming goal
    function formatGoal(goal) {
        switch(goal) {
            case 'yield': return 'Maximize Yield';
            case 'sustainable': return 'Sustainable Farming';
            case 'organic': return 'Organic Certification';
            case 'cost': return 'Cost Reduction';
            case 'diversification': return 'Crop Diversification';
            default: return goal;
        }
    }
    
    // Function to get recommended crops
    function getRecommendedCrops(soilType, farmingGoal) {
        const cropRecommendations = {
            'clay': {
                'yield': ['<strong>Rice</strong> - Excellent for water retention', 
                          '<strong>Wheat</strong> - Good root development in clay', 
                          '<strong>Cabbage</strong> - Thrives in moisture-retentive soil'],
                'sustainable': ['<strong>Alfalfa</strong> - Improves soil structure', 
                                '<strong>Beans</strong> - Nitrogen fixing properties', 
                                '<strong>Winter Rye</strong> - Excellent cover crop'],
                'organic': ['<strong>Kale</strong> - Nutrient dense and clay tolerant', 
                            '<strong>Broccoli</strong> - Strong root system', 
                            '<strong>Brussels Sprouts</strong> - Cold tolerant for clay soils'],
                'cost': ['<strong>Sorghum</strong> - Low input requirements', 
                         '<strong>Millet</strong> - Drought tolerant once established', 
                         '<strong>Field Peas</strong> - Improves soil while producing crop'],
                'diversification': ['<strong>Pumpkins</strong> - Good clay tolerance', 
                                    '<strong>Chard</strong> - Adaptable leafy green', 
                                    '<strong>Sunflowers</strong> - Deep roots help break clay']
            },
            'sandy': {
                'yield': ['<strong>Carrots</strong> - Excellent root development', 
                          '<strong>Potatoes</strong> - Thrive in loose soil', 
                          '<strong>Asparagus</strong> - Deep-rooted perennial'],
                'sustainable': ['<strong>Cowpeas</strong> - Drought tolerant nitrogen fixer', 
                                '<strong>Sweet Potatoes</strong> - Soil improving crop', 
                                '<strong>Rosemary</strong> - Drought resistant herb'],
                'organic': ['<strong>Watermelons</strong> - Sprawling growth habit', 
                            '<strong>Eggplant</strong> - Heat loving crop', 
                            '<strong>Thyme</strong> - Mediterranean herb suited to sandy soil'],
                'cost': ['<strong>Bush Beans</strong> - Quick production cycle', 
                         '<strong>Radishes</strong> - Fast growing crop', 
                         '<strong>Green Onions</strong> - Minimal inputs required'],
                'diversification': ['<strong>Lavender</strong> - Value-added potential', 
                                    '<strong>Strawberries</strong> - Premium pricing', 
                                    '<strong>Melons</strong> - Variety of market options']
            },
            'loamy': {
                'yield': ['<strong>Corn</strong> - High yield potential', 
                          '<strong>Soybeans</strong> - Valuable rotation crop', 
                          '<strong>Tomatoes</strong> - Premium for quality fruit'],
                'sustainable': ['<strong>Mixed Vegetables</strong> - Crop rotation benefits', 
                                '<strong>Clover</strong> - Excellent green manure', 
                                '<strong>Oats</strong> - Versatile cover crop'],
                'organic': ['<strong>Lettuce</strong> - Quick growing salad crop', 
                            '<strong>Spinach</strong> - Nutrient dense leafy green', 
                            '<strong>Herbs</strong> - High value, low space requirement'],
                'cost': ['<strong>Squash</strong> - High yield per plant', 
                         '<strong>Turnips</strong> - Dual purpose crop (greens and roots)', 
                         '<strong>Mustard Greens</strong> - Fast growing and reseeding'],
                'diversification': ['<strong>Berries</strong> - High value fruits', 
                                    '<strong>Cut Flowers</strong> - Non-food market', 
                                    '<strong>Specialty Greens</strong> - Restaurant market']
            },
            'silty': {
                'yield': ['<strong>Sugar Beets</strong> - High sugar content', 
                          '<strong>Celery</strong> - Moisture loving crop', 
                          '<strong>Leeks</strong> - Premium allium crop'],
                'sustainable': ['<strong>Fava Beans</strong> - Nitrogen fixing properties', 
                                '<strong>Buckwheat</strong> - Quick soil building', 
                                '<strong>Barley</strong> - Adaptable grain crop'],
                'organic': ['<strong>Swiss Chard</strong> - Productive leafy green', 
                            '<strong>Beets</strong> - Dual purpose crop', 
                            '<strong>Peas</strong> - Early season nitrogen fixer'],
                'cost': ['<strong>Kale</strong> - Cut-and-come-again harvesting', 
                         '<strong>Collards</strong> - Long harvest window', 
                         '<strong>Garlic</strong> - High value storage crop'],
                'diversification': ['<strong>Artichokes</strong> - Perennial crop', 
                                    '<strong>Rhubarb</strong> - Early season perennial', 
                                    '<strong>Asparagus</strong> - High value perennial']
            },
            'peaty': {
                'yield': ['<strong>Blueberries</strong> - Acid loving high value crop', 
                          '<strong>Cranberries</strong> - Specialty bog crop', 
                          '<strong>Potatoes</strong> - Excellent in acidic soil'],
                'sustainable': ['<strong>Lingonberries</strong> - Acid loving perennial', 
                                '<strong>Azaleas</strong> - Ornamental option', 
                                '<strong>Rhododendrons</strong> - Landscape plant option'],
                'organic': ['<strong>Acid-loving Herbs</strong> - Specialized market', 
                            '<strong>Specialty Potatoes</strong> - Premium varieties', 
                            '<strong>Raspberries</strong> - High value berry crop'],
                'cost': ['<strong>Onions</strong> - Storage crop', 
                         '<strong>Carrots</strong> - Root crop for peaty soil', 
                         '<strong>Lettuce</strong> - Quick growing crop'],
                'diversification': ['<strong>Ornamental Grasses</strong> - Landscaping market', 
                                    '<strong>Mushrooms</strong> - Specialty fungi', 
                                    '<strong>Medicinal Herbs</strong> - Specialized market']
            },
            'chalky': {
                'yield': ['<strong>Lavender</strong> - Thrives in alkaline soil', 
                          '<strong>Grapes</strong> - Excellent for chalky slopes', 
                          '<strong>Spinach</strong> - Tolerates alkaline conditions'],
                'sustainable': ['<strong>Sainfoin</strong> - Nitrogen fixing for chalky soil', 
                                '<strong>Lucerne</strong> - Deep rooted legume', 
                                '<strong>Wild Flowers</strong> - Native chalk grassland species'],
                'organic': ['<strong>Thyme</strong> - Mediterranean herb', 
                            '<strong>Oregano</strong> - Alkaline tolerant herb', 
                            '<strong>Sage</strong> - Drought resistant herb'],
                'cost': ['<strong>Barley</strong> - Tolerant of alkaline soil', 
                         '<strong>Field Beans</strong> - Nitrogen fixing crop', 
                         '<strong>Oilseed Rape</strong> - Break crop for chalky soils'],
                'diversification': ['<strong>Walnuts</strong> - Long term tree crop', 
                                    '<strong>Apricots</strong> - Stone fruit for chalk', 
                                    '<strong>Aromatic Herbs</strong> - Value-added potential']
            }
        };
        
        // Default to loamy soil recommendations if soil type not found
        const soilRecommendations = cropRecommendations[soilType] || cropRecommendations['loamy'];
        
        // Default to sustainable recommendations if goal not found
        return soilRecommendations[farmingGoal] || soilRecommendations['sustainable'];
    }
    
    // Function to get farming practices
    function getFarmingPractices(farmingGoal, soilType) {
        const practices = {
            'yield': [
                '<strong>Precision Agriculture</strong> - Use soil testing and variable rate application for optimal inputs',
                '<strong>Intensive Planting</strong> - Maximize space utilization with appropriate spacing',
                '<strong>Succession Planting</strong> - Plan multiple harvests throughout the season',
                '<strong>Integrated Pest Management</strong> - Proactive pest control to minimize crop loss',
                '<strong>Fertigation</strong> - Apply nutrients through irrigation for efficient uptake'
            ],
            'sustainable': [
                '<strong>Cover Cropping</strong> - Plant soil-building crops during off-seasons',
                '<strong>Reduced Tillage</strong> - Minimize soil disturbance to maintain structure',
                '<strong>Crop Rotation</strong> - Plan 3-5 year rotations to break pest cycles',
                '<strong>Beneficial Insect Habitat</strong> - Plant flowering borders for natural pest control',
                '<strong>Composting</strong> - Recycle farm waste into valuable soil amendments'
            ],
            'organic': [
                '<strong>Biological Pest Control</strong> - Release beneficial insects for pest management',
                '<strong>Compost Tea Application</strong> - Foliar feed plants with microbial brew',
                '<strong>Mulching</strong> - Use organic mulches to suppress weeds and build soil',
                '<strong>Companion Planting</strong> - Intercrop compatible plants for pest management',
                '<strong>Green Manures</strong> - Incorporate nitrogen-fixing crops into soil'
            ],
            'cost': [
                '<strong>Input Optimization</strong> - Apply only what\'s needed when needed',
                '<strong>Energy Efficiency</strong> - Audit and reduce energy use in all operations',
                '<strong>Labor Planning</strong> - Schedule work efficiently to minimize overtime',
                '<strong>Direct Marketing</strong> - Sell directly to consumers to maximize margins'
            ],
            'diversification': [
                '<strong>Polyculture</strong> - Grow multiple crop types together',
                '<strong>Agroforestry</strong> - Integrate trees with annual crops',
                '<strong>Value-Added Processing</strong> - Create products from primary crops',
                '<strong>Specialty Crop Focus</strong> - Target niche markets with unique varieties',
                '<strong>Agritourism</strong> - Develop farm visits and educational experiences'
            ]
        };
        
        // Add soil-specific practice
        const soilPractices = {
            'clay': '<strong>Soil Amendment</strong> - Add organic matter to improve structure and drainage',
            'sandy': '<strong>Moisture Conservation</strong> - Use mulches to retain soil moisture',
            'loamy': '<strong>Soil Preservation</strong> - Maintain excellent structure with minimal tillage',
            'silty': '<strong>Erosion Control</strong> - Implement contour planting and windbreaks',
            'peaty': '<strong>Water Management</strong> - Monitor drainage to prevent excessive drying',
            'chalky': '<strong>pH Management</strong> - Select appropriate crops for alkaline conditions'
        };
        
        // Get practices for the farming goal
        const goalPractices = practices[farmingGoal] || practices['sustainable'];
        
        // Add the soil-specific practice if available
        if (soilPractices[soilType]) {
            return [soilPractices[soilType], ...goalPractices.slice(0, 4)];
        }
        
        return goalPractices;
    }
    
    // Function to get resource management tips
    function getResourceManagement(farmingGoal, soilType) {
        const resources = {
            'yield': [
                '<strong>Soil Testing</strong> - Regular testing to optimize fertilizer application',
                '<strong>Drip Irrigation</strong> - Efficient water delivery directly to plant roots',
                '<strong>Weather Monitoring</strong> - Time operations based on weather forecasts',
                '<strong>Crop Monitoring</strong> - Regular scouting for early problem detection'
            ],
            'sustainable': [
                '<strong>Water Conservation</strong> - Implement rainwater harvesting and efficient irrigation',
                '<strong>Renewable Energy</strong> - Consider solar or wind power for farm operations',
                '<strong>Biodiversity Enhancement</strong> - Create habitat zones for beneficial wildlife',
                '<strong>Soil Health Monitoring</strong> - Track organic matter and biological activity'
            ],
            'organic': [
                '<strong>Natural Fertilizers</strong> - Use compost, manure, and approved amendments',
                '<strong>Biological Controls</strong> - Maintain predator populations for pest management',
                '<strong>Record Keeping</strong> - Document all inputs and practices for certification',
                '<strong>Buffer Zones</strong> - Create separation from conventional farming operations'
            ],
            'cost': [
                '<strong>Input Optimization</strong> - Apply only what\'s needed when needed',
                '<strong>Energy Efficiency</strong> - Audit and reduce energy use in all operations',
                '<strong>Labor Planning</strong> - Schedule work efficiently to minimize overtime',
                '<strong>Direct Marketing</strong> - Sell directly to consumers to maximize margins'
            ],
            'diversification': [
                '<strong>Market Research</strong> - Identify profitable niches before planting',
                '<strong>Staggered Harvests</strong> - Plan for continuous market presence',
                '<strong>Storage Solutions</strong> - Invest in proper storage for extended sales',
                '<strong>Multiple Sales Channels</strong> - Develop retail, wholesale, and processing outlets'
            ]
        };
        
        return resources[farmingGoal] || resources['sustainable'];
    }
    
    // Medicine Chatbot functionality
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const sendMessageBtn = document.getElementById('send-message');
    const quickResponseBtns = document.querySelectorAll('.quick-response-btn');
    
    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleChatSubmit();
        });
    }
    
    if (quickResponseBtns.length > 0) {
        quickResponseBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const query = this.getAttribute('data-query');
                if (query) {
                    addUserMessage(query);
                    processChatQuery(query);
                }
            });
        });
    }
    
    function handleChatSubmit() {
        const message = chatInput.value.trim();
        
        if (message) {
            addUserMessage(message);
            processChatQuery(message);
            chatInput.value = '';
        }
    }
    
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user-message');
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function addBotMessage(message, recommendation = null) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot-message');
        
        let content = `
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        
        if (recommendation) {
            content += `
                <div class="recommendation-card">
                    <h4><i class="fas fa-prescription-bottle-alt"></i> ${recommendation.name}</h4>
                    <p>${recommendation.description}</p>
                    <div class="recommendation-dosage">
                        <i class="fas fa-info-circle"></i>
                        <span>${recommendation.dosage}</span>
                    </div>
                </div>
            `;
        }
        
        messageDiv.innerHTML = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add quick follow-up options after bot response
        if (!recommendation) {
            addQuickFollowUp();
        }
    }
    
    function addQuickFollowUp() {
        const followUpDiv = document.createElement('div');
        followUpDiv.classList.add('message', 'bot-message', 'quick-follow-up');
        
        followUpDiv.innerHTML = `
            <div class="message-content">
                <p>Would you like more information about:</p>
                <div class="quick-options">
                    <button class="quick-option" data-query="organic treatments">Organic Treatments</button>
                    <button class="quick-option" data-query="preventative measures">Preventative Measures</button>
                    <button class="quick-option" data-query="application methods">Application Methods</button>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(followUpDiv);
        
        // Add event listeners to quick options
        followUpDiv.querySelectorAll('.quick-option').forEach(btn => {
            btn.addEventListener('click', function() {
                const query = this.getAttribute('data-query');
                if (query) {
                    addUserMessage(query);
                    processChatQuery(query);
                }
                
                // Remove all quick follow-ups
                document.querySelectorAll('.quick-follow-up').forEach(el => {
                    el.remove();
                });
            });
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function processChatQuery(message) {
        message = message.toLowerCase();
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'bot-message', 'typing-indicator');
        typingIndicator.innerHTML = `
            <div class="message-content">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Define medicine recommendations
        const medicineRecommendations = {
            'fungal': {
                name: "Copper Fungicide",
                description: "A broad-spectrum fungicide effective against many fungal diseases including Early Blight, Late Blight, and Downy Mildew.",
                dosage: "2-4 tablespoons per gallon of water, spray every 7-10 days."
            },
            'insect': {
                name: "Neem Oil Extract",
                description: "An organic insecticide that disrupts the life cycle of many pests while being safe for beneficial insects when dry.",
                dosage: "2 tablespoons per gallon of water, apply every 7 days until pests are gone."
            },
            'blight': {
                name: "Mancozeb Fungicide",
                description: "Effective against Early and Late Blight in tomatoes and potatoes. Provides protective barrier on plant surfaces.",
                dosage: "1.5-2 tablespoons per gallon of water, apply every 7-10 days before symptoms appear."
            },
            'aphid': {
                name: "Insecticidal Soap",
                description: "Contact insecticide that's effective against soft-bodied insects like aphids, whiteflies, and mealybugs.",
                dosage: "2.5 tablespoons per gallon of water, thoroughly coat affected plants, focusing on undersides of leaves."
            },
            'rust': {
                name: "Tebuconazole Fungicide",
                description: "Systemic fungicide effective against rust diseases in wheat and other cereals.",
                dosage: "Follow product label instructions exactly. Typically 0.5-1 oz per 1000 sq ft, applied at first signs of disease."
            },
            'blast': {
                name: "Tricyclazole Fungicide",
                description: "Specific fungicide for controlling rice blast disease, protecting both leaves and panicles.",
                dosage: "Apply according to product label, typically 200-300g per hectare at early heading stage."
            },
            'nutrient': {
                name: "Balanced NPK Fertilizer with Micronutrients",
                description: "Complete plant nutrition with essential macronutrients and trace minerals for healthy crop development.",
                dosage: "Apply according to soil test results and crop requirements, typically 2-4 lbs per 100 square feet."
            }
        };
        
        // Process after a short delay to simulate thinking
        setTimeout(() => {
            // Remove typing indicator
            typingIndicator.remove();
            
            if (message.includes('tomato blight') || (message.includes('tomato') && message.includes('spots'))) {
                addBotMessage("Based on your description, your tomatoes might be suffering from Early Blight. This fungal disease causes dark spots with concentric rings on lower leaves first, then spreads upward.", medicineRecommendations.blight);
            } 
            else if (message.includes('aphid infestation') || message.includes('aphids')) {
                addBotMessage("It sounds like you're dealing with aphids. These small, soft-bodied insects cluster on new growth and undersides of leaves, causing curling and stunting. They also secrete honeydew that leads to sooty mold.", medicineRecommendations.aphid);
            }
            else if (message.includes('wheat rust')) {
                addBotMessage("Wheat rust is a serious fungal disease that appears as orange-red or brown pustules on leaves and stems. It can significantly reduce yields if not controlled early.", medicineRecommendations.rust);
            }
            else if (message.includes('rice blast')) {
                addBotMessage("Rice blast is one of the most destructive rice diseases worldwide. It causes diamond-shaped lesions on leaves and can infect all above-ground parts of the plant, including panicles.", medicineRecommendations.blast);
            }
            else if (message.includes('nutrient deficiency')) {
                addBotMessage("Nutrient deficiencies show various symptoms depending on which nutrients are lacking. Common signs include yellowing leaves, stunted growth, and poor fruit development.", medicineRecommendations.nutrient);
            }
            else if (message.includes('organic treatments') || message.includes('organic')) {
                addBotMessage("For organic farming, consider these options: neem oil for insects, copper or sulfur-based products for fungal diseases, and compost tea as a preventative treatment. Beneficial insects like ladybugs and lacewings can also help control pest populations naturally.");
            }
            else if (message.includes('preventative measures') || message.includes('prevent')) {
                addBotMessage("The best disease management approach is prevention. Practice crop rotation (3-4 year cycles), maintain proper plant spacing for airflow, water at the base of plants in the morning, remove infected plant material promptly, and use disease-resistant varieties when available.");
            }
            else if (message.includes('application methods') || message.includes('how to apply')) {
                addBotMessage("For effective application: 1) Use the right equipment (backpack sprayer for most treatments), 2) Apply in calm weather to prevent drift, 3) Ensure thorough coverage including leaf undersides, 4) Apply early morning or evening to prevent rapid evaporation, 5) Always follow label instructions for mixing rates and safety precautions.");
            }
            else if (message.includes('fungus') || message.includes('fungal') || message.includes('mold')) {
                addBotMessage("Fungal diseases thrive in humid conditions with poor air circulation. Early symptoms often include spots on leaves, white powdery patches, or fuzzy growth on plant surfaces.", medicineRecommendations.fungal);
            }
            else if (message.includes('insect') || message.includes('bug') || message.includes('pest')) {
                addBotMessage("Many crop pests can be controlled with integrated pest management. This includes identifying the specific pest, using appropriate treatments, and implementing preventative measures.", medicineRecommendations.insect);
            }
            else {
                addBotMessage("I need more specific information about your crop issue to recommend the right treatment. Could you tell me which crop you're growing and describe the symptoms you're seeing? For example, are there spots on leaves, insects visible, or wilting?");
            }
        }, 1200);
    }
    
    // Marketplace tabs functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding content
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
});
