// Crop Health Advisor JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const uploadForm = document.getElementById('crop-image-upload-form');
    const dropZone = document.getElementById('drop-zone');
    const imageInput = document.getElementById('crop-image');
    const uploadBtn = document.getElementById('upload-btn');
    const aiDirectBtn = document.getElementById('ai-direct-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image-btn');
    const analysisLoading = document.getElementById('analysis-loading');
    const analysisResult = document.getElementById('analysis-result-container');
    
    // Initialize image upload functionality
    initImageUpload();
    
    // Initialize AI direct capture functionality
    initAIDirectCapture();
    
    // Initialize image zoom functionality
    initImageZoom();
    
    // Handle form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get the uploaded file
        const file = imageInput.files[0];
        
        if (file) {
            // Analyze the image
            analyzeImage(file);
        }
    });
    
    // Function to initialize image upload
    function initImageUpload() {
        // Handle file selection
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                displayImagePreview(file);
            }
        });
        
        // Handle upload button click
        uploadBtn.addEventListener('click', function() {
            imageInput.click();
        });
        
        // Handle drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Add highlight class when dragging over
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropZone.classList.add('highlight');
        }
        
        function unhighlight() {
            dropZone.classList.remove('highlight');
        }
        
        // Handle file drop
        dropZone.addEventListener('drop', function(e) {
            const file = e.dataTransfer.files[0];
            if (file && file.type.match('image.*')) {
                imageInput.files = e.dataTransfer.files;
                displayImagePreview(file);
            }
        });
        
        // Handle remove image button
        removeImageBtn.addEventListener('click', function() {
            resetImageUpload();
        });
    }
    
    // Function to initialize AI direct capture
    function initAIDirectCapture() {
        aiDirectBtn.addEventListener('click', function() {
            // Create a file input element for capturing images
            const aiDirectInput = document.createElement('input');
            aiDirectInput.type = 'file';
            aiDirectInput.accept = 'image/*';
            aiDirectInput.capture = 'environment'; // Use the environment-facing camera
            
            // Handle file selection
            aiDirectInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    // Ask for confirmation
                    if (confirm('Would you like to use this image for analysis?')) {
                        // Transfer the file to the main input
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        imageInput.files = dataTransfer.files;
                        
                        // Display the image preview
                        displayImagePreview(file);
                        
                        // Automatically analyze the image
                        analyzeImage(file);
                    }
                }
            });
            
            // Trigger the file input
            aiDirectInput.click();
        });
    }
    
    // Function to display image preview
    function displayImagePreview(file) {
        // Create a URL for the image
        const imageURL = URL.createObjectURL(file);
        
        // Set the image source
        imagePreview.src = imageURL;
        
        // Show the preview container and hide the prompt
        dropZone.querySelector('.drop-zone-prompt').style.display = 'none';
        previewContainer.style.display = 'block';
        
        // Enable the analyze button
        analyzeBtn.disabled = false;
        
        // Add the file name as a data attribute for reference
        imagePreview.dataset.filename = file.name;
    }
    
    // Function to reset image upload
    function resetImageUpload() {
        // Clear the input
        imageInput.value = '';
        
        // Clear the preview
        imagePreview.src = '';
        imagePreview.removeAttribute('data-filename');
        
        // Hide the preview container and show the prompt
        previewContainer.style.display = 'none';
        dropZone.querySelector('.drop-zone-prompt').style.display = 'flex';
        
        // Disable the analyze button
        analyzeBtn.disabled = true;
        
        // Reset the analysis
        resetAnalysis();
    }
    
    // Function to initialize image zoom
    function initImageZoom() {
        imagePreview.addEventListener('click', function() {
            // Create a modal for the zoomed image
            const modal = document.createElement('div');
            modal.className = 'image-zoom-modal';
            
            // Create a close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'zoom-close-btn';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            
            // Create an image element
            const zoomedImage = document.createElement('img');
            zoomedImage.src = imagePreview.src;
            zoomedImage.className = 'zoomed-image';
            
            // Add elements to the modal
            modal.appendChild(closeBtn);
            modal.appendChild(zoomedImage);
            
            // Add the modal to the body
            document.body.appendChild(modal);
            
            // Handle close button click
            closeBtn.addEventListener('click', function() {
                modal.classList.add('closing');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            });
            
            // Handle click outside the image
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.add('closing');
                    setTimeout(() => {
                        document.body.removeChild(modal);
                    }, 300);
                }
            });
        });
    }
    
    // Function to handle the analysis process
    function analyzeImage(file) {
        // Show loading animation
        analysisLoading.style.display = 'flex';
        analysisResult.style.display = 'none';
        
        // Simulate AI processing with a delay
        setTimeout(() => {
            // Detect crop type from the image
            const detectedCropType = detectCropType(file);
            
            // Hide loading and show results
            analysisLoading.style.display = 'none';
            analysisResult.style.display = 'block';
            
            // Get analysis results based on detected crop type and image
            const results = getAnalysisResults(file, detectedCropType);
            
            // Update the UI with analysis results
            document.getElementById('health-status').textContent = results.healthStatus;
            document.getElementById('confidence-level').textContent = results.confidenceLevel;
            document.getElementById('detected-issue').textContent = results.detectedIssue;
            document.getElementById('issue-description').textContent = results.issueDescription;
            document.getElementById('treatment-recommendation').textContent = results.treatmentRecommendation;
            document.getElementById('prevention-tips').textContent = results.preventionTips;
            
            // Set health status class
            const healthStatusElement = document.getElementById('health-status');
            healthStatusElement.className = 'health-status';
            if (results.healthStatus === 'Healthy') {
                healthStatusElement.classList.add('healthy');
            } else if (results.healthStatus === 'Unhealthy') {
                healthStatusElement.classList.add('unhealthy');
            } else {
                healthStatusElement.classList.add('unknown');
            }
            
            // Show AI suggestion toast if unhealthy
            if (results.healthStatus === 'Unhealthy') {
                showAISuggestionToast(detectedCropType, results.detectedIssue);
            }
            
            // Scroll to analysis results
            analysisResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 2500); // 2.5 seconds delay to simulate processing
    }
    
    // Function to detect crop type from image
    function detectCropType(file) {
        // In a real application, this would use AI image recognition
        // For this demo, we'll simulate detection based on the filename
        const fileName = file.name.toLowerCase();
        
        const cropTypes = {
            'tomato': ['tomato', 'tomat'],
            'potato': ['potato', 'potat'],
            'corn': ['corn', 'maize'],
            'wheat': ['wheat'],
            'rice': ['rice'],
            'soybean': ['soy', 'bean', 'soybean'],
            'cotton': ['cotton']
        };
        
        // Check if filename contains any crop type keywords
        for (const [cropType, keywords] of Object.entries(cropTypes)) {
            if (keywords.some(keyword => fileName.includes(keyword))) {
                return cropType;
            }
        }
        
        // If no match found, analyze image content (simulated)
        // In a real app, this would use machine learning to identify the crop
        
        // For demo purposes, return a random crop type
        const allCropTypes = Object.keys(cropTypes);
        return allCropTypes[Math.floor(Math.random() * allCropTypes.length)];
    }
    
    // Function to get analysis results based on crop type and image
    function getAnalysisResults(file, cropType) {
        // In a real application, this would analyze the image using AI
        // For this demo, we'll simulate results based on the filename and crop type
        
        const fileName = file.name.toLowerCase();
        let isUnhealthy = fileName.includes('disease') || 
                         fileName.includes('pest') || 
                         fileName.includes('unhealthy') ||
                         fileName.includes('blight') ||
                         fileName.includes('rot') ||
                         fileName.includes('spot');
        
        // Define common diseases by crop type
        const cropDiseases = {
            'tomato': {
                name: 'Early Blight',
                description: 'Early blight is a fungal disease that affects tomato plants, causing dark spots with concentric rings on lower leaves first, then spreading upward.',
                treatment: 'Apply copper fungicide every 7-10 days. Remove infected leaves. Ensure proper plant spacing for airflow.',
                prevention: 'Practice crop rotation. Water at the base of plants in the morning. Use disease-resistant varieties.'
            },
            'potato': {
                name: 'Late Blight',
                description: 'Late blight causes dark, water-soaked spots on leaves that quickly enlarge and turn brown with a green border. White fungal growth may appear on the underside of leaves in humid conditions.',
                treatment: 'Apply fungicide labeled for late blight. Remove and destroy infected plants to prevent spread.',
                prevention: 'Plant certified disease-free seed potatoes. Avoid overhead irrigation. Provide good air circulation.'
            },
            'corn': {
                name: 'Northern Corn Leaf Blight',
                description: 'Northern corn leaf blight causes long, narrow, tan lesions on corn leaves, which can reduce photosynthesis and yield.',
                treatment: 'Apply fungicide at first sign of disease. Remove and destroy infected plant material.',
                prevention: 'Plant resistant varieties. Practice crop rotation. Apply balanced fertilization.'
            },
            'wheat': {
                name: 'Wheat Rust',
                description: 'Wheat rust appears as orange-red or brown pustules on leaves and stems. It can significantly reduce yields if not controlled early.',
                treatment: 'Apply appropriate fungicide according to label instructions. Timing is critical for effective control.',
                prevention: 'Plant resistant varieties. Monitor fields regularly. Apply preventative fungicide in high-risk conditions.'
            },
            'rice': {
                name: 'Rice Blast',
                description: 'Rice blast causes diamond-shaped lesions on leaves and can infect all above-ground parts of the plant, including panicles.',
                treatment: 'Apply fungicide specifically labeled for rice blast. Follow recommended application rates and timing.',
                prevention: 'Use resistant varieties. Maintain proper water management. Apply balanced fertilization.'
            },
            'soybean': {
                name: 'Soybean Rust',
                description: 'Soybean rust causes small, yellow spots on leaves that eventually turn brown or reddish-brown. Pustules form on the undersides of leaves.',
                treatment: 'Apply fungicide at the first sign of disease. Timing is critical for effective control.',
                prevention: 'Plant early-maturing varieties. Monitor fields regularly. Consider preventative fungicide in high-risk areas.'
            },
            'cotton': {
                name: 'Cotton Leaf Spot',
                description: 'Cotton leaf spot causes circular lesions with dark borders and light centers. Severe infections can cause defoliation.',
                treatment: 'Apply appropriate fungicide. Ensure proper coverage of the entire plant.',
                prevention: 'Use resistant varieties. Practice crop rotation. Maintain proper plant spacing.'
            }
        };
        
        if (isUnhealthy) {
            const disease = cropDiseases[cropType] || {
                name: 'Unknown Disease',
                description: 'The image shows signs of disease, but more specific analysis is needed for accurate identification.',
                treatment: 'Consider consulting with a local agricultural extension service for precise diagnosis and treatment recommendations.',
                prevention: 'Practice good crop rotation, proper sanitation, and use disease-resistant varieties when available.'
            };
            
            return {
                healthStatus: 'Unhealthy',
                confidenceLevel: Math.floor(75 + Math.random() * 15) + '%', // Random between 75-90%
                detectedIssue: disease.name,
                issueDescription: disease.description,
                treatmentRecommendation: disease.treatment,
                preventionTips: disease.prevention
            };
        } else {
            return {
                healthStatus: 'Healthy',
                confidenceLevel: Math.floor(85 + Math.random() * 10) + '%', // Random between 85-95%
                detectedIssue: 'No issues detected',
                issueDescription: `Your ${cropType} plants appear healthy with no visible signs of disease or pest infestation.`,
                treatmentRecommendation: 'Continue regular maintenance and monitoring.',
                preventionTips: 'Maintain proper watering and fertilization schedule. Monitor for early signs of pests or disease.'
            };
        }
    }
    
    // Function to show AI suggestion toast
    function showAISuggestionToast(cropType, diseaseName) {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-header">
                <h4 class="toast-title"><i class="fas fa-robot"></i> AI Suggestion</h4>
                <button class="toast-close">&times;</button>
            </div>
            <div class="toast-body">
                <p>Would you like to see similar cases of ${diseaseName} in ${cropType} plants and how other farmers treated it successfully?</p>
                <div class="toast-actions">
                    <button class="toast-button primary">View Similar Cases</button>
                    <button class="toast-button secondary">Not Now</button>
                </div>
            </div>
        `;
        
        // Add toast to container
        toastContainer.appendChild(toast);
        
        // Add event listeners
        const closeButton = toast.querySelector('.toast-close');
        const primaryButton = toast.querySelector('.toast-button.primary');
        const secondaryButton = toast.querySelector('.toast-button.secondary');
        
        closeButton.addEventListener('click', () => {
            toast.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
        
        primaryButton.addEventListener('click', () => {
            // Simulate showing similar cases
            alert(`This feature will show similar cases of ${diseaseName} in ${cropType} plants and successful treatments from our database.`);
            toast.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
        
        secondaryButton.addEventListener('click', () => {
            toast.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
        
        // Auto-remove toast after 10 seconds
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.style.animation = 'slideOut 0.3s forwards';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }
        }, 10000);
    }
    
    // Function to reset analysis
    function resetAnalysis() {
        // Hide analysis containers
        analysisLoading.style.display = 'none';
        analysisResult.style.display = 'none';
    }
});
