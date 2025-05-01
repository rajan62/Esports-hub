const tournaments = [
    {
        id: 1,
        game: 'bgmi',
        title: 'BGMI Pro League Season 1',
        date: '2025-04-10 17:00',
        prize: '₹10,00,000',
        entryFee: 'FREE',
        perKill: '₹5',
        teams: '64',
        format: 'Squad TPP',
        map: 'Erangel',
        status: 'Registration Open',
        teamSize: 4,
        type: 'Squad'
    },
    {
        id: 2,
        game: 'cod',
        title: 'COD Mobile Championship',
        date: '2025-04-12 15:00',
        prize: '₹5,00,000',
        entryFee: '₹100',
        perKill: '₹10',
        teams: '32',
        format: '5v5 TDM',
        map: 'Nuketown',
        status: 'Coming Soon',
        teamSize: 5,
        type: '5v5'
    },
    {
        id: 3,
        game: 'valorant',
        title: 'Valorant Premier League',
        date: '2025-04-15 18:00',
        prize: '₹15,00,000',
        entryFee: '₹200',
        perKill: '₹15',
        teams: '16',
        format: '5v5',
        map: 'Haven',
        status: 'Registration Open',
        teamSize: 5,
        type: '5v5'
    },
    {
        id: 4,
        game: 'coc',
        title: 'Clash of Clans World Cup',
        date: '2025-04-20 16:00',
        prize: '₹3,00,000',
        entryFee: '₹50',
        teams: '24',
        format: 'Clan Wars',
        map: 'Home Village',
        status: 'Coming Soon',
        teamSize: 1,
        type: 'Solo'
    },
    {
        id: 5,
        game: 'bgmi',
        title: 'BGMI Solo Showdown',
        date: '2025-04-13 14:00',
        prize: '₹2,50,000',
        entryFee: 'FREE',
        perKill: '₹10',
        teams: '100',
        format: 'Solo TPP',
        map: 'Erangel',
        status: 'Registration Open',
        teamSize: 1,
        type: 'Solo'
    },
    {
        id: 6,
        game: 'valorant',
        title: 'Valorant Community Cup',
        date: '2025-04-18 19:00',
        prize: '₹1,00,000',
        entryFee: 'FREE',
        perKill: '₹5',
        teams: '32',
        format: '5v5',
        map: 'Split',
        status: 'Coming Soon',
        teamSize: 5,
        type: '5v5'
    }
];

let registeredPlayers = [];

const tournamentsGrid = document.querySelector('.tournaments-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contactForm');
const registrationModal = document.getElementById('registration-modal');
const leaderboardModal = document.getElementById('leaderboard-modal');
const closeModal = document.querySelectorAll('.close-modal');
const registrationForm = document.getElementById('registerForm');
const modalTournamentTitle = document.getElementById('modal-tournament-title');
const teamMembersContainer = document.getElementById('team-members-container');
const teamMembersSection = document.getElementById('team-members-section');
const leaderboardTitle = document.getElementById('leaderboard-title');
const leaderboardBody = document.getElementById('leaderboard-body');
const leaderboardFilterButtons = document.querySelectorAll('.leaderboard-filter-btn');

function formatDateTime(dateString) {
    const date = new Date(dateString);
    
    const dateOptions = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    const formattedDate = date.toLocaleDateString(undefined, dateOptions);
    
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);
    
    return { formattedDate, formattedTime };
}

function getTimeRemaining(dateString) {
    const now = new Date();
    const endTime = new Date(dateString);
    const timeRemaining = endTime - now;
    
    if (timeRemaining <= 0) {
        return 'Registration Closed';
    }
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
        return `${days} days ${hours} hrs remaining`;
    } else if (hours > 0) {
        return `${hours} hrs ${minutes} mins remaining`;
    } else {
        return `${minutes} minutes remaining`;
    }
}

function getRegisteredTeamsCount(tournamentId) {
    return registeredPlayers.filter(player => player.tournamentId === tournamentId).length;
}

function createTournamentCard(tournament) {
    const card = document.createElement('div');
    card.className = 'tournament-card';
    
    const gameLogo = `../images/${tournament.game}.jpeg`;
    
    const { formattedDate, formattedTime } = formatDateTime(tournament.date);
    
    const timeRemaining = getTimeRemaining(tournament.date);
    
    const isRegistrationClosed = timeRemaining === 'Registration Closed';
    
    const hasPerKillReward = tournament.game !== 'coc';
    
    const registeredCount = getRegisteredTeamsCount(tournament.id);
    const totalSpots = parseInt(tournament.teams);
    const spotsLeft = totalSpots - registeredCount;
    const progressPercentage = (registeredCount / totalSpots) * 100;
    
    card.innerHTML = `
        <div class="tournament-header">
            <img src="${gameLogo}" alt="${tournament.game.toUpperCase()} Logo" class="game-logo">
            <div class="tournament-title">
                <h3>${tournament.title}</h3>
                <p class="tournament-time">${formattedDate} at ${formattedTime}</p>
                <p class="registration-timer ${isRegistrationClosed ? 'closed' : ''}">${timeRemaining}</p>
            </div>
        </div>
        <div class="tournament-info">
            <div class="info-grid ${hasPerKillReward ? 'three-columns' : 'two-columns'}">
                <div class="info-item">
                    <span class="label">PRIZE POOL</span>
                    <span class="value">${tournament.prize}</span>
                </div>
                ${hasPerKillReward ? `
                <div class="info-item">
                    <span class="label">PER KILL</span>
                    <span class="value">${tournament.perKill}</span>
                </div>
                ` : ''}
                <div class="info-item">
                    <span class="label">PLAY FOR</span>
                    <span class="value">${tournament.entryFee}</span>
                </div>
            </div>
            <div class="tournament-details">
                <div class="details-row">
                    <div class="detail-item">
                        <span class="label">TYPE</span>
                        <span class="value">${tournament.type}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">VERSION</span>
                        <span class="value">${tournament.format}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">MAP</span>
                        <span class="value">${tournament.map}</span>
                    </div>
                </div>
            </div>
            <div class="spots-progress">
                <div class="spots-text">
                    ${spotsLeft > 0 ? 
                        `<span>${spotsLeft} Spots Left</span>` : 
                        `<span>Tournament Full</span>`
                    }
                    <span>${registeredCount}/${totalSpots}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progressPercentage}%"></div>
                </div>
            </div>
            <div class="tournament-actions">
                <button class="register-btn" data-tournament-id="${tournament.id}" 
                    ${isRegistrationClosed || spotsLeft === 0 ? 'disabled' : ''}>
                    ${isRegistrationClosed ? 'Registration Closed' : 
                      spotsLeft === 0 ? 'Tournament Full' : 'Join'}
                </button>
                <button class="leaderboard-btn" data-tournament-id="${tournament.id}">View Leaderboard</button>
            </div>
        </div>
    `;
    
    if (!isRegistrationClosed) {
        const timerElement = card.querySelector('.registration-timer');
        setInterval(() => {
            timerElement.textContent = getTimeRemaining(tournament.date);
        }, 60000); 
    }
    
    return card;
}

function displayTournaments(filter = 'all') {
    if (!tournamentsGrid) return;
    
    tournamentsGrid.innerHTML = '';
    const filteredTournaments = filter === 'all' 
        ? tournaments 
        : tournaments.filter(tournament => tournament.game === filter);
    
    if (filteredTournaments.length === 0) {
        tournamentsGrid.innerHTML = '<div class="no-tournaments">No tournaments available for this game.</div>';
        return;
    }
    
    filteredTournaments.forEach(tournament => {
        const card = createTournamentCard(tournament);
        card.setAttribute('data-game', tournament.game);
        tournamentsGrid.appendChild(card);
    });
    
    addRegisterButtonListeners();
    addLeaderboardButtonListeners();
}

function addRegisterButtonListeners() {
    const registerButtons = document.querySelectorAll('.register-btn');
    registerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tournamentId = parseInt(button.getAttribute('data-tournament-id'));
            const tournament = tournaments.find(t => t.id === tournamentId);
            
            if (tournament) {
                const token = getToken();
                
                if (!token) {
                    alert('Please log in to register for tournaments.');
                    window.location.href = 'login.html';
                    return;
                }
                
                openRegistrationModal(tournament);
            }
        });
    });
}

function addLeaderboardButtonListeners() {
    const leaderboardButtons = document.querySelectorAll('.leaderboard-btn');
    leaderboardButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tournamentId = parseInt(button.getAttribute('data-tournament-id'));
            const tournament = tournaments.find(t => t.id === tournamentId);
            
            if (tournament) {
                openLeaderboardModal(tournament);
            }
        });
    });
}

function createTeamMemberFields(tournament) {
    if (!teamMembersContainer) return;
    
    teamMembersContainer.innerHTML = '';
    
    // Skip team member fields for solo tournaments
    if (tournament.teamSize <= 1) {
        teamMembersSection.style.display = 'none';
        return;
    }
    
    teamMembersSection.style.display = 'block';
    
    // Create input fields for additional team members (excluding captain)
    for (let i = 1; i < tournament.teamSize; i++) {
        const memberFieldset = document.createElement('fieldset');
        memberFieldset.className = 'team-member-fieldset';
        
        memberFieldset.innerHTML = `
            <legend>Team Member ${i + 1}</legend>
            <div class="form-group">
                <label for="memberName${i}">Name</label>
                <input type="text" id="memberName${i}" name="memberName${i}" required>
            </div>
            <div class="form-group">
                <label for="memberEmail${i}">Email</label>
                <input type="email" id="memberEmail${i}" name="memberEmail${i}" required>
            </div>
            <div class="form-group">
                <label for="memberPhone${i}">Phone</label>
                <input type="tel" id="memberPhone${i}" name="memberPhone${i}" required>
            </div>
        `;
        
        teamMembersContainer.appendChild(memberFieldset);
    }
}

function openRegistrationModal(tournament) {
    modalTournamentTitle.textContent = `Register for ${tournament.title}`;
    registrationModal.style.display = 'block';
    
    // Reset form fields
    document.getElementById('teamName').value = '';
    document.getElementById('captainName').value = '';
    document.getElementById('captainEmail').value = '';
    document.getElementById('captainPhone').value = '';
    
    // Set tournament ID for form submission
    registrationForm.setAttribute('data-tournament-id', tournament.id);
    
    // Create team member fields based on tournament type
    createTeamMemberFields(tournament);
}

function openLeaderboardModal(tournament) {
    leaderboardTitle.textContent = `${tournament.title} - Leaderboard`;
    leaderboardModal.style.display = 'block';
    
    leaderboardModal.setAttribute('data-tournament-id', tournament.id);
    
    displayLeaderboardEntries(tournament.id, 'all');
}

function displayLeaderboardEntries(tournamentId, filter = 'all') {
    if (!leaderboardBody) return;
    
    leaderboardBody.innerHTML = '';
    
    let filteredPlayers = registeredPlayers.filter(player => player.tournamentId === tournamentId);
    
    if (filter !== 'all') {
        filteredPlayers = filteredPlayers.filter(player => player.status === filter);
    }
    
    filteredPlayers.sort((a, b) => b.id - a.id);
    
    if (filteredPlayers.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="5" style="text-align: center; padding: 2rem;">
                No ${filter === 'all' ? 'teams' : filter} found for this tournament.
            </td>
        `;
        leaderboardBody.appendChild(emptyRow);
        return;
    }
    
    filteredPlayers.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="rank">${index + 1}</td>
            <td>${player.teamName}</td>
            <td>${player.captainName}</td>
            <td><span class="status ${player.status}">${player.status.charAt(0).toUpperCase() + player.status.slice(1)}</span></td>
        `;
        leaderboardBody.appendChild(row);
    });
}

function closeRegistrationModal() {
    registrationModal.style.display = 'none';
}

function closeLeaderboardModal() {
    leaderboardModal.style.display = 'none';
}

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameFilter = button.getAttribute('data-game');
            console.log('Filter clicked:', gameFilter);
            
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Display filtered tournaments
            displayTournaments(gameFilter);
        });
    });
}

if (closeModal.length > 0) {
    closeModal.forEach(button => {
        button.addEventListener('click', () => {
            if (button.closest('#registration-modal')) {
                closeRegistrationModal();
            } else if (button.closest('#leaderboard-modal')) {
                closeLeaderboardModal();
            }
        });
    });
}

window.addEventListener('click', (e) => {
    if (e.target === registrationModal) {
        closeRegistrationModal();
    } else if (e.target === leaderboardModal) {
        closeLeaderboardModal();
    }
});

if (leaderboardFilterButtons.length > 0) {
    leaderboardFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            leaderboardFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const tournamentId = parseInt(leaderboardModal.getAttribute('data-tournament-id'));
            
            displayLeaderboardEntries(tournamentId, button.dataset.filter);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Initialize tournaments display
    if (tournamentsGrid) {
        displayTournaments('all');
    }
    
    // Contact form handling
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const formObject = Object.fromEntries(formData);
            console.log('Form submitted:', formObject);
        });
    }
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Check if user is logged in
function isUserLoggedIn() {
    // This is a placeholder - you should implement proper authentication check
    return false;
}

// Add form submission handler
if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate the form
        const teamName = document.getElementById('teamName').value.trim();
        const captainName = document.getElementById('captainName').value.trim();
        const captainEmail = document.getElementById('captainEmail').value.trim();
        const captainPhone = document.getElementById('captainPhone').value.trim();
        
        if (!teamName || !captainName || !captainEmail || !captainPhone) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(captainEmail)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        const tournamentId = parseInt(registrationForm.getAttribute('data-tournament-id'));
        const tournament = tournaments.find(t => t.id === tournamentId);
        
        if (!tournament) {
            alert('Tournament not found!');
            return;
        }
        
        // Validate team members for team tournaments
        if (tournament.teamSize > 1) {
            for (let i = 1; i < tournament.teamSize; i++) {
                const memberName = document.getElementById(`memberName${i}`).value.trim();
                const memberEmail = document.getElementById(`memberEmail${i}`).value.trim();
                const memberPhone = document.getElementById(`memberPhone${i}`).value.trim();
                
                if (!memberName || !memberEmail || !memberPhone) {
                    alert(`Please fill in all details for Team Member ${i + 1}.`);
                    return;
                }
                
                if (!emailRegex.test(memberEmail)) {
                    alert(`Please enter a valid email address for Team Member ${i + 1}.`);
                    return;
                }
            }
        }
        
        const newRegistration = {
            id: registeredPlayers.length + 1,
            tournamentId: tournamentId,
            teamName: teamName,
            captainName: captainName,
            captainEmail: captainEmail,
            captainPhone: captainPhone,
            registrationDate: new Date().toISOString(),
            status: 'pending',
            members: []
        };
        
        if (tournament.teamSize > 1) {
            for (let i = 1; i < tournament.teamSize; i++) {
                const memberName = document.getElementById(`memberName${i}`).value.trim();
                const memberEmail = document.getElementById(`memberEmail${i}`).value.trim();
                const memberPhone = document.getElementById(`memberPhone${i}`).value.trim();
                
                newRegistration.members.push({
                    name: memberName,
                    email: memberEmail,
                    phone: memberPhone
                });
            }
        }
        
        // Add to registered players array
        registeredPlayers.push(newRegistration);
        
        closeRegistrationModal();
        alert(`Team ${teamName} has been registered for ${tournament.title}. Registration status: Pending approval.`);
        
        displayTournaments(document.querySelector('.filter-btn.active')?.dataset.game || 'all');
    });
} 

