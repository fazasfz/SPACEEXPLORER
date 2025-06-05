// Global data storage
var missions = [
    {
        id: '1',
        name: 'Artemis VII',
        destination: 'Mars Orbital Station',
        status: 'active',
        crewCount: 4,
        launchDate: '2024-03-15',
        duration: '180 days'
    },
    {
        id: '2',
        name: 'Europa Explorer',
        destination: 'Jupiter\'s Moon Europa',
        status: 'active',
        crewCount: 6,
        launchDate: '2024-01-10',
        duration: '2.5 years'
    },
    {
        id: '3',
        name: 'Titan Research',
        destination: 'Saturn\'s Moon Titan',
        status: 'planned',
        crewCount: 5,
        launchDate: '2024-06-22',
        duration: '3 years'
    }
];

var astronauts = [];
var discoveries = [];

// Navigation functionality
function initNavigation() {
    var navLinks = document.querySelectorAll('.nav-link');
    var pages = document.querySelectorAll('.page');
    var quickActionButtons = document.querySelectorAll('.space-button[data-page]');

    // Handle navigation clicks
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function(e) {
            e.preventDefault();
            var targetPage = this.getAttribute('data-page');
            showPage(targetPage);
            
            // Update active nav link
            for (var j = 0; j < navLinks.length; j++) {
                navLinks[j].classList.remove('active');
            }
            this.classList.add('active');
        });
    }

    // Handle quick action button clicks
    for (var i = 0; i < quickActionButtons.length; i++) {
        quickActionButtons[i].addEventListener('click', function(e) {
            e.preventDefault();
            var targetPage = this.getAttribute('data-page');
            showPage(targetPage);
            
            // Update active nav link
            for (var j = 0; j < navLinks.length; j++) {
                navLinks[j].classList.remove('active');
            }
            var targetNavLink = document.querySelector('.nav-link[data-page="' + targetPage + '"]');
            if (targetNavLink) {
                targetNavLink.classList.add('active');
            }
        });
    }

    function showPage(pageId) {
        for (var i = 0; i < pages.length; i++) {
            pages[i].classList.remove('active');
        }
        var targetPage = document.getElementById(pageId + '-page');
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }
}

// Mission card creation
function createMissionCard(mission) {
    var statusClass = mission.status.toLowerCase();
    var statusText = mission.status.charAt(0).toUpperCase() + mission.status.slice(1);
    
    return '<div class="mission-card">' +
            '<div class="mission-header">' +
                '<h3 class="mission-name">' + mission.name + '</h3>' +
                '<span class="mission-status ' + statusClass + '">' + statusText + '</span>' +
            '</div>' +
            '<div class="mission-details">' +
                '<div class="mission-detail">' +
                    '<span class="mission-detail-icon">🚀</span>' +
                    '<span>Destination: ' + mission.destination + '</span>' +
                '</div>' +
                '<div class="mission-detail">' +
                    '<span class="mission-detail-icon">👥</span>' +
                    '<span>Crew: ' + mission.crewCount + ' astronauts</span>' +
                '</div>' +
                '<div class="mission-detail">' +
                    '<span class="mission-detail-icon">📅</span>' +
                    '<span>Launch: ' + formatDate(mission.launchDate) + '</span>' +
                '</div>' +
                (mission.duration ? 
                    '<div class="mission-detail">' +
                        '<span class="mission-detail-icon">⏱️</span>' +
                        '<span>Duration: ' + mission.duration + '</span>' +
                    '</div>' : '') +
            '</div>' +
        '</div>';
}

// Render missions on home page
function renderMissions() {
    var missionsGrid = document.getElementById('missions-grid');
    if (missionsGrid) {
        var missionCards = '';
        for (var i = 0; i < missions.length; i++) {
            missionCards += createMissionCard(missions[i]);
        }
        missionsGrid.innerHTML = missionCards;
    }
}

// Form handlers
function initForms() {
    // Mission form
    var missionForm = document.getElementById('mission-form');
    if (missionForm) {
        missionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var formData = new FormData(missionForm);
            var mission = {
                id: Date.now().toString(),
                name: formData.get('name'),
                destination: formData.get('destination'),
                objective: formData.get('objective'),
                launchDate: formData.get('launchDate'),
                duration: formData.get('duration'),
                priority: formData.get('priority'),
                crewCount: parseInt(formData.get('crewSize')),
                status: 'planned'
            };
            
            missions.push(mission);
            renderMissions();
            updateStats();
            showToast('Mission created successfully!');
            missionForm.reset();
        });
    }

    // Astronaut form
    var astronautForm = document.getElementById('astronaut-form');
    if (astronautForm) {
        astronautForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var formData = new FormData(astronautForm);
            var astronaut = {
                id: Date.now().toString(),
                name: formData.get('name'),
                rank: formData.get('rank'),
                specialty: formData.get('specialty'),
                experience: parseInt(formData.get('experience'))
            };
            
            astronauts.push(astronaut);
            updateStats();
            showToast('Astronaut registered successfully!');
            astronautForm.reset();
        });
    }

    // Discovery form
    var discoveryForm = document.getElementById('discovery-form');
    if (discoveryForm) {
        discoveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var formData = new FormData(discoveryForm);
            var discovery = {
                id: Date.now().toString(),
                title: formData.get('title'),
                type: formData.get('type'),
                location: formData.get('location'),
                discoverer: formData.get('discoverer'),
                description: formData.get('description'),
                date: new Date().toISOString().split('T')[0]
            };
            
            discoveries.push(discovery);
            updateStats();
            showToast('Discovery logged successfully!');
            discoveryForm.reset();
        });
    }
}

// Search functionality
function performSearch() {
    var searchInput = document.getElementById('search-input');
    var searchType = document.getElementById('search-type');
    var searchResults = document.getElementById('search-results');
    
    var query = searchInput.value.toLowerCase().trim();
    var type = searchType.value;
    
    if (!query) {
        searchResults.innerHTML = '<p style="color: #ccc; text-align: center;">Please enter a search term.</p>';
        return;
    }
    
    var results = [];
    
    if (type === 'all' || type === 'missions') {
        for (var i = 0; i < missions.length; i++) {
            var mission = missions[i];
            if (mission.name.toLowerCase().indexOf(query) !== -1 ||
                mission.destination.toLowerCase().indexOf(query) !== -1 ||
                mission.status.toLowerCase().indexOf(query) !== -1) {
                results.push({
                    type: 'Mission',
                    title: mission.name,
                    subtitle: mission.destination,
                    status: mission.status
                });
            }
        }
    }
    
    if (type === 'all' || type === 'astronauts') {
        for (var i = 0; i < astronauts.length; i++) {
            var astronaut = astronauts[i];
            if (astronaut.name.toLowerCase().indexOf(query) !== -1 ||
                astronaut.rank.toLowerCase().indexOf(query) !== -1 ||
                astronaut.specialty.toLowerCase().indexOf(query) !== -1) {
                results.push({
                    type: 'Astronaut',
                    title: astronaut.name,
                    subtitle: astronaut.rank + ' - ' + astronaut.specialty,
                    status: 'available'
                });
            }
        }
    }
    
    if (type === 'all' || type === 'discoveries') {
        for (var i = 0; i < discoveries.length; i++) {
            var discovery = discoveries[i];
            if (discovery.title.toLowerCase().indexOf(query) !== -1 ||
                discovery.type.toLowerCase().indexOf(query) !== -1 ||
                discovery.location.toLowerCase().indexOf(query) !== -1) {
                results.push({
                    type: 'Discovery',
                    title: discovery.title,
                    subtitle: discovery.type + ' - ' + discovery.location,
                    status: 'logged'
                });
            }
        }
    }
    
    renderSearchResults(results);
}

function renderSearchResults(results) {
    var searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p style="color: #ccc; text-align: center;">No results found.</p>';
        return;
    }
    
    var resultsHTML = '';
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        resultsHTML += '<div class="mission-card">' +
            '<div class="mission-header">' +
                '<h3 class="mission-name">' + result.title + '</h3>' +
                '<span class="mission-status ' + result.status + '">' + result.type + '</span>' +
            '</div>' +
            '<div class="mission-details">' +
                '<div class="mission-detail">' +
                    '<span class="mission-detail-icon">📋</span>' +
                    '<span>' + result.subtitle + '</span>' +
                '</div>' +
            '</div>' +
        '</div>';
    }
    
    searchResults.innerHTML = resultsHTML;
}

function quickFilter(filterType) {
    var searchResults = document.getElementById('search-results');
    var results = [];
    
    if (filterType === 'active') {
        for (var i = 0; i < missions.length; i++) {
            if (missions[i].status === 'active') {
                results.push({
                    type: 'Mission',
                    title: missions[i].name,
                    subtitle: missions[i].destination,
                    status: missions[i].status
                });
            }
        }
    } else if (filterType === 'discoveries') {
        var recentDiscoveries = discoveries.slice(-5);
        for (var i = 0; i < recentDiscoveries.length; i++) {
            var discovery = recentDiscoveries[i];
            results.push({
                type: 'Discovery',
                title: discovery.title,
                subtitle: discovery.type + ' - ' + discovery.location,
                status: 'logged'
            });
        }
    } else if (filterType === 'crew') {
        for (var i = 0; i < astronauts.length; i++) {
            var astronaut = astronauts[i];
            results.push({
                type: 'Astronaut',
                title: astronaut.name,
                subtitle: astronaut.rank + ' - ' + astronaut.specialty,
                status: 'available'
            });
        }
    }
    
    renderSearchResults(results);
}

// Update statistics
function updateStats() {
    var activeMissions = 0;
    for (var i = 0; i < missions.length; i++) {
        if (missions[i].status === 'active') {
            activeMissions++;
        }
    }
    
    var totalAstronauts = astronauts.length;
    var totalDiscoveries = discoveries.length;
    
    var completedMissions = 0;
    for (var i = 0; i < missions.length; i++) {
        if (missions[i].status === 'completed') {
            completedMissions++;
        }
    }
    
    var successRate = missions.length > 0 ? Math.round((completedMissions / missions.length) * 100) : 94;
    
    // Update stat cards
    var statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        statValues[0].textContent = activeMissions;
        statValues[1].textContent = totalAstronauts;
        statValues[2].textContent = totalDiscoveries;
        statValues[3].textContent = successRate + '%';
    }
}

// Toast notification
function showToast(message) {
    var toast = document.getElementById('toast');
    var toastContent = document.getElementById('toast-content');
    
    toastContent.textContent = message;
    toast.classList.add('show');
    
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

// Utility functions
function formatDate(dateString) {
    var date = new Date(dateString);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initForms();
    renderMissions();
    updateStats();
    
    // Add search functionality
    var searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// Make functions global for onclick handlers
window.performSearch = performSearch;
window.quickFilter = quickFilter;