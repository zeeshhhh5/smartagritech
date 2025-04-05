/**
 * Smart Agri Farming - Image Management
 * 
 * This file contains information about images that should be generated with AI
 * for each section of the website. For each section, we provide:
 * 1. A description of what the image should contain
 * 2. A placeholder URL that can be used until the AI-generated image is ready
 * 3. Alt text for accessibility
 */

// Image data for each section
const sectionImages = {
    // Hero section
    hero: {
        description: "A modern farm with advanced technology like drones, sensors, and smart irrigation systems. Show a diverse landscape with crops and a farmer using a tablet to monitor the farm.",
        placeholder: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        alt: "Smart Agriculture Technology on Modern Farm"
    },
    
    // Weather section
    weather: {
        description: "A weather station in a farm field with sensors for temperature, humidity, and rainfall. Show real-time data visualization on a nearby display or tablet.",
        placeholder: "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        alt: "Farm Weather Station with Real-time Data"
    },
    
    // Irrigation section
    irrigation: {
        description: "Smart irrigation system in action with precision water delivery to crops. Show drip irrigation, soil moisture sensors, and automated sprinklers with a control panel.",
        placeholder: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        alt: "Smart Precision Irrigation System"
    },
    
    // AI Recommendations section
    aiRecommendations: {
        description: "A split-screen view showing AI analysis of crop health. On one side, show data visualization and AI recommendations; on the other side, show healthy crops resulting from following these recommendations.",
        placeholder: "https://images.unsplash.com/photo-1581093458791-9a9cd7093ae4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        alt: "AI-Powered Farming Recommendations"
    },
    
    // Medicine Chatbot section
    medicineChatbot: {
        description: "A farmer using a tablet with the crop health chatbot interface. Show close-up of plant with disease symptoms and the chatbot providing diagnosis and treatment recommendations.",
        placeholder: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
        alt: "Crop Health Chatbot Diagnosis"
    },
    
    // Success Farmers - specific farmers
    farmers: {
        rajeshPatel: {
            description: "Indian farmer in Gujarat standing in a cotton field using a tablet to monitor irrigation. He should look proud and successful with modern farming equipment visible.",
            placeholder: "https://images.unsplash.com/photo-1591339531024-62d996e2b8c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            alt: "Farmer Rajesh Patel in Gujarat"
        },
        mariaRodriguez: {
            description: "Hispanic female farmer in California inspecting organic vegetables with modern monitoring equipment. Show greenhouse with advanced technology.",
            placeholder: "https://images.unsplash.com/photo-1595413031356-e3c9d2b13811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            alt: "Farmer Maria Rodriguez with Organic Vegetables"
        },
        johnWilliams: {
            description: "American farmer in Iowa standing in a vast corn field with drone flying overhead. Show him using smart farming technology on a tablet.",
            placeholder: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            alt: "Farmer John Williams in Iowa"
        },
        sarahJohnson: {
            description: "Australian female farmer in Victoria examining wheat crops with soil testing equipment. Show rolling hills of wheat fields with modern farm equipment.",
            placeholder: "https://images.unsplash.com/photo-1569880153113-3581a5387919?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            alt: "Farmer Sarah Johnson in Victoria"
        },
        chenWei: {
            description: "Chinese farmer in Sichuan province monitoring rice paddies with smart water sensors. Show terraced rice fields with modern monitoring equipment.",
            placeholder: "https://images.unsplash.com/photo-1520052203542-d3095f1b6cf0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            alt: "Farmer Chen Wei in Sichuan"
        },
        amaraOkafor: {
            description: "Nigerian female farmer in Lagos examining cassava crops with soil testing equipment. Show her using a tablet for crop monitoring.",
            placeholder: "https://images.unsplash.com/photo-1595475207225-428b62bda831?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            alt: "Farmer Amara Okafor in Lagos"
        },
        miguelHernandez: {
            description: "Mexican farmer in Jalisco inspecting avocado trees with advanced monitoring equipment. Show irrigation system and fruit quality testing.",
            placeholder: "https://images.unsplash.com/photo-1571504211935-1c936b327411?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            alt: "Farmer Miguel Hernandez in Jalisco"
        },
        emmaLarsson: {
            description: "Swedish female farmer in Skåne inside a high-tech greenhouse with berry plants and vegetables. Show climate control system and energy-efficient lighting.",
            placeholder: "https://images.unsplash.com/photo-1530507629858-e3c9d2b13811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            alt: "Farmer Emma Larsson in Skåne"
        }
    },
    
    // Featured crops
    featuredCrops: {
        tomato: {
            description: "Close-up of healthy tomato plants with ripe tomatoes. Show advanced irrigation system and monitoring sensors in a modern farm setting.",
            placeholder: "https://images.unsplash.com/photo-1592865656869-1b83f1b4cea7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            alt: "Smart Tomato Farming"
        },
        rice: {
            description: "Aerial view of rice paddies with smart water management system. Show water level sensors and automated irrigation gates with a farmer monitoring via tablet.",
            placeholder: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
            alt: "Smart Rice Cultivation"
        }
    },
    
    // Marketplace sections
    marketplace: {
        fruits: {
            description: "Display of fresh, high-quality fruits grown using smart farming techniques. Show apples, oranges, and berries with quality monitoring equipment.",
            placeholder: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6",
            alt: "Premium Fruits from Smart Farms"
        },
        medicines: {
            description: "Modern agricultural medicines and bio-pesticides in a laboratory setting. Show natural and organic pest control solutions with scientific equipment.",
            placeholder: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88",
            alt: "Organic Agricultural Medicines"
        },
        equipment: {
            description: "Advanced farming equipment including drones, sensors, and smart irrigation systems. Show modern technology for precision agriculture.",
            placeholder: "https://images.unsplash.com/photo-1592878040004-a61d2e5dffbe",
            alt: "Smart Farming Equipment"
        },
        seeds: {
            description: "High-yield, disease-resistant seeds developed for smart agriculture. Show seed testing and quality control in a laboratory setting.",
            placeholder: "https://images.unsplash.com/photo-1585155784229-aff921ccfa10",
            alt: "Premium Agricultural Seeds"
        },
        smartTech: {
            description: "Comprehensive smart farming technology including soil sensors, weather stations, and farm management systems. Show integration with mobile devices.",
            placeholder: "https://images.unsplash.com/photo-1580584126903-c17d41830450",
            alt: "Integrated Smart Farming Technology"
        }
    },
    
    // About section
    about: {
        description: "Team of agricultural experts and technology specialists working together on smart farming solutions. Show diverse team in both field and laboratory settings.",
        placeholder: "https://images.unsplash.com/photo-1500382017468-e3759c371e91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmFybXxlbnwwfHwwfHw%3D%3D&w=1000&q=80",
        alt: "Smart Agri Farming Team"
    }
};

// Function to update image sources with AI-generated images when available
function updateSectionImages() {
    // This function would be called when AI-generated images are ready
    // For now, it uses the placeholder images
    
    // Example of how to update an image:
    // document.querySelector('#hero-image').src = sectionImages.hero.aiGenerated || sectionImages.hero.placeholder;
    
    console.log("Image placeholders are ready. Replace with AI-generated images when available.");
}

// Export the image data for use in other scripts
window.sectionImages = sectionImages;

// Initialize images when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateSectionImages();
});
