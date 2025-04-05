// Farm Management Functions

// Crop Planning
function addCropPlan() {
    const plotName = document.getElementById('plot-name').value;
    const crop = document.getElementById('crop-selection').value;
    const plantingDate = document.getElementById('planting-date').value;

    if (!plotName || !crop || !plantingDate) {
        alert('Please fill in all crop planning fields');
        return;
    }

    const planItem = document.createElement('div');
    planItem.className = 'list-item';
    planItem.innerHTML = `
        <span>${plotName} - ${crop}</span>
        <span>${new Date(plantingDate).toLocaleDateString()}</span>
        <button onclick="this.parentElement.remove()" class="btn-small">×</button>
    `;

    document.getElementById('crop-plan-list').appendChild(planItem);
    clearForm(['plot-name', 'crop-selection', 'planting-date']);
}

// Inventory Management
function addInventoryItem() {
    const itemName = document.getElementById('item-name').value;
    const category = document.getElementById('item-category').value;
    const quantity = document.getElementById('item-quantity').value;

    if (!itemName || !category || !quantity) {
        alert('Please fill in all inventory fields');
        return;
    }

    const inventoryItem = document.createElement('div');
    inventoryItem.className = 'list-item';
    inventoryItem.innerHTML = `
        <span>${itemName}</span>
        <span>${category} - ${quantity}</span>
        <button onclick="this.parentElement.remove()" class="btn-small">×</button>
    `;

    document.getElementById('inventory-list').appendChild(inventoryItem);
    clearForm(['item-name', 'item-category', 'item-quantity']);
}

// Task Management
function addTask() {
    const taskName = document.getElementById('task-name').value;
    const priority = document.getElementById('task-priority').value;
    const dueDate = document.getElementById('task-due').value;

    if (!taskName || !priority || !dueDate) {
        alert('Please fill in all task fields');
        return;
    }

    const taskItem = document.createElement('div');
    taskItem.className = 'list-item';
    taskItem.innerHTML = `
        <span>${taskName}</span>
        <span>${priority} - ${new Date(dueDate).toLocaleDateString()}</span>
        <button onclick="this.parentElement.remove()" class="btn-small">×</button>
    `;

    document.getElementById('task-list').appendChild(taskItem);
    clearForm(['task-name', 'task-priority', 'task-due']);
}

// Financial Tracking
let transactions = [];

function addTransaction() {
    const type = document.getElementById('transaction-type').value;
    const category = document.getElementById('transaction-category').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);

    if (!category || !amount) {
        alert('Please fill in all transaction fields');
        return;
    }

    const transaction = {
        type,
        category,
        amount: type === 'expense' ? -amount : amount,
        date: new Date().toISOString()
    };

    transactions.push(transaction);
    updateFinancialSummary();
    clearForm(['transaction-type', 'transaction-category', 'transaction-amount']);
}

function updateFinancialSummary() {
    const summary = document.getElementById('financial-summary');
    const income = transactions.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const balance = income + expenses;

    summary.innerHTML = `
        <div class="summary-item">
            <span>Total Income:</span>
            <span>$${income.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Total Expenses:</span>
            <span>$${Math.abs(expenses).toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Balance:</span>
            <span>$${balance.toFixed(2)}</span>
        </div>
    `;
}

// Yield Tracking & Analytics
let yieldData = [];
let cropAnalytics = {};

function addYieldRecord() {
    const cropName = document.getElementById('yield-crop').value;
    const harvestDate = document.getElementById('harvest-date').value;
    const quantity = parseFloat(document.getElementById('yield-quantity').value);
    const quality = document.getElementById('yield-quality').value;
    
    if (!cropName || !harvestDate || !quantity || !quality) {
        alert('Please fill in all yield tracking fields');
        return;
    }
    
    const yieldRecord = {
        cropName,
        harvestDate,
        quantity,
        quality,
        timestamp: new Date().toISOString()
    };
    
    yieldData.push(yieldRecord);
    updateYieldAnalytics();
    displayYieldRecord(yieldRecord);
    clearForm(['yield-crop', 'harvest-date', 'yield-quantity', 'yield-quality']);
}

function displayYieldRecord(record) {
    const yieldItem = document.createElement('div');
    yieldItem.className = 'list-item';
    yieldItem.innerHTML = `
        <span>${record.cropName}</span>
        <span>${new Date(record.harvestDate).toLocaleDateString()} - ${record.quantity} kg</span>
        <span class="quality-badge ${record.quality.toLowerCase()}">${record.quality}</span>
        <button onclick="this.parentElement.remove(); removeYieldRecord('${record.timestamp}')" class="btn-small">×</button>
    `;
    
    document.getElementById('yield-records').appendChild(yieldItem);
}

function removeYieldRecord(timestamp) {
    yieldData = yieldData.filter(record => record.timestamp !== timestamp);
    updateYieldAnalytics();
}

function updateYieldAnalytics() {
    // Reset analytics
    cropAnalytics = {};
    
    // Calculate analytics per crop
    yieldData.forEach(record => {
        if (!cropAnalytics[record.cropName]) {
            cropAnalytics[record.cropName] = {
                totalQuantity: 0,
                records: 0,
                qualityDistribution: {
                    'Excellent': 0,
                    'Good': 0,
                    'Average': 0,
                    'Poor': 0
                }
            };
        }
        
        cropAnalytics[record.cropName].totalQuantity += record.quantity;
        cropAnalytics[record.cropName].records += 1;
        cropAnalytics[record.cropName].qualityDistribution[record.quality] += 1;
    });
    
    displayYieldAnalytics();
}

function displayYieldAnalytics() {
    const analyticsContainer = document.getElementById('yield-analytics');
    analyticsContainer.innerHTML = '';
    
    for (const [crop, data] of Object.entries(cropAnalytics)) {
        const avgYield = data.totalQuantity / data.records;
        const qualityRating = calculateQualityRating(data.qualityDistribution);
        
        const analyticsItem = document.createElement('div');
        analyticsItem.className = 'analytics-item';
        analyticsItem.innerHTML = `
            <h4>${crop}</h4>
            <div class="analytics-details">
                <div class="analytics-metric">
                    <span>Total Yield:</span>
                    <span>${data.totalQuantity.toFixed(2)} kg</span>
                </div>
                <div class="analytics-metric">
                    <span>Average Yield:</span>
                    <span>${avgYield.toFixed(2)} kg</span>
                </div>
                <div class="analytics-metric">
                    <span>Quality Rating:</span>
                    <span>${qualityRating}/10</span>
                </div>
            </div>
        `;
        
        analyticsContainer.appendChild(analyticsItem);
    }
}

function calculateQualityRating(distribution) {
    const totalRecords = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    if (totalRecords === 0) return 0;
    
    const weightedSum = 
        distribution['Excellent'] * 10 + 
        distribution['Good'] * 7.5 + 
        distribution['Average'] * 5 + 
        distribution['Poor'] * 2.5;
    
    return (weightedSum / totalRecords).toFixed(1);
}

// Resource Utilization Tracking
let resourceUsage = [];

function addResourceUsage() {
    const resourceType = document.getElementById('resource-type').value;
    const usageDate = document.getElementById('usage-date').value;
    const quantity = parseFloat(document.getElementById('resource-quantity').value);
    const unit = document.getElementById('resource-unit').value;
    
    if (!resourceType || !usageDate || !quantity || !unit) {
        alert('Please fill in all resource usage fields');
        return;
    }
    
    const resourceRecord = {
        resourceType,
        usageDate,
        quantity,
        unit,
        timestamp: new Date().toISOString()
    };
    
    resourceUsage.push(resourceRecord);
    displayResourceUsage(resourceRecord);
    updateResourceEfficiency();
    clearForm(['resource-type', 'usage-date', 'resource-quantity', 'resource-unit']);
}

function displayResourceUsage(record) {
    const resourceItem = document.createElement('div');
    resourceItem.className = 'list-item';
    resourceItem.innerHTML = `
        <span>${record.resourceType}</span>
        <span>${new Date(record.usageDate).toLocaleDateString()} - ${record.quantity} ${record.unit}</span>
        <button onclick="this.parentElement.remove(); removeResourceUsage('${record.timestamp}')" class="btn-small">×</button>
    `;
    
    document.getElementById('resource-records').appendChild(resourceItem);
}

function removeResourceUsage(timestamp) {
    resourceUsage = resourceUsage.filter(record => record.timestamp !== timestamp);
    updateResourceEfficiency();
}

function updateResourceEfficiency() {
    // Calculate resource efficiency metrics
    const resourceTypes = [...new Set(resourceUsage.map(r => r.resourceType))];
    const efficiencyContainer = document.getElementById('resource-efficiency');
    efficiencyContainer.innerHTML = '';
    
    resourceTypes.forEach(type => {
        const typeRecords = resourceUsage.filter(r => r.resourceType === type);
        const totalUsage = typeRecords.reduce((sum, r) => sum + r.quantity, 0);
        const unit = typeRecords[0].unit;
        
        const efficiencyItem = document.createElement('div');
        efficiencyItem.className = 'efficiency-item';
        efficiencyItem.innerHTML = `
            <h4>${type}</h4>
            <div class="efficiency-details">
                <div class="efficiency-metric">
                    <span>Total Usage:</span>
                    <span>${totalUsage.toFixed(2)} ${unit}</span>
                </div>
                <div class="efficiency-metric">
                    <span>Usage per Day:</span>
                    <span>${calculateDailyUsage(typeRecords).toFixed(2)} ${unit}</span>
                </div>
            </div>
        `;
        
        efficiencyContainer.appendChild(efficiencyItem);
    });
}

function calculateDailyUsage(records) {
    if (records.length === 0) return 0;
    
    const dates = records.map(r => new Date(r.usageDate).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const daysDiff = Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)));
    
    const totalUsage = records.reduce((sum, r) => sum + r.quantity, 0);
    return totalUsage / daysDiff;
}

// Utility Functions
function clearForm(ids) {
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element.tagName === 'SELECT') {
            element.selectedIndex = 0;
        } else {
            element.value = '';
        }
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    updateFinancialSummary();
    
    // Set up event listeners for new functionality
    const yieldSubmitBtn = document.getElementById('add-yield');
    if (yieldSubmitBtn) {
        yieldSubmitBtn.addEventListener('click', addYieldRecord);
    }
    
    const resourceSubmitBtn = document.getElementById('add-resource');
    if (resourceSubmitBtn) {
        resourceSubmitBtn.addEventListener('click', addResourceUsage);
    }
});
