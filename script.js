
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'login.html';
}


document.getElementById('username-display').textContent = currentUser.username;


document.getElementById('logout-button').addEventListener('click', () => {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});

const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const resetButton = document.querySelector(".reset-btn");
const scoreDisplay = document.querySelector(".score");
const backToGameButton = document.querySelector(".back-to-game");
const rankingContainer = document.querySelector(".ranking-container");
let score = 0;

const pointsPopup = document.createElement("div");
pointsPopup.className = "points-popup";
document.body.appendChild(pointsPopup);

let scoreInterval = setInterval(() => {
    score++;
    document.querySelector(".points").textContent = score;
}, 500);

resetButton.addEventListener("click", () => {
    window.location.reload();
});

backToGameButton.addEventListener("click", () => {
    rankingContainer.style.display = "none";
    window.location.reload();
});

const jump = () => {
    mario.classList.add("jump");

    const randomPoints = () => {
        const random = Math.random() * 100;
        if (random < 40) return 0;
        else if (random < 70) return 1;
        else if (random < 85) return 2;
        else if (random < 95) return 3;
        else if (random < 99) return 5;
        else return 10;
    };

    const pointsEarned = randomPoints();
    score += pointsEarned;
    document.querySelector(".points").textContent = score;

    if (pointsEarned > 0) {
        const marioRect = mario.getBoundingClientRect();
        pointsPopup.textContent = `+${pointsEarned}`;
        pointsPopup.style.left = `${marioRect.left + marioRect.width / 2}px`;
        pointsPopup.style.top = `${marioRect.top - 20}px`;

        
        if (pointsEarned >= 5) {
            pointsPopup.classList.add("high-score");
        } else {
            pointsPopup.classList.remove("high-score");
        }

        pointsPopup.style.display = "block";

        setTimeout(() => {
            pointsPopup.style.display = "none";
        }, 1500);
    }

    setTimeout(() => {
        mario.classList.remove("jump");
    }, 500);
};

const showRanking = () => {
    
    const rankings = JSON.parse(localStorage.getItem('rankings')) || [];
    
    
    const userIndex = rankings.findIndex(r => r.username === currentUser.username);
    
    if (userIndex !== -1) {
        
        if (score > rankings[userIndex].score) {
            rankings[userIndex].score = score;
        }
    } else {
        
        rankings.push({
            username: currentUser.username,
            score: score
        });
    }
    
    
    rankings.sort((a, b) => b.score - a.score);
    
    
    const top10 = rankings.slice(0, 10);
    
    localStorage.setItem('rankings', JSON.stringify(top10));
    
    
    const rankingList = document.querySelector('.ranking-list');
    rankingList.innerHTML = '';
    
    top10.forEach((user, index) => {
        const rankingItem = document.createElement('div');
        rankingItem.className = 'ranking-item';
        
        const usernameSpan = document.createElement('span');
        usernameSpan.textContent = `${index + 1}. ${user.username}`;
        
        const scoreSpan = document.createElement('span');
        scoreSpan.textContent = user.score;
        
        rankingItem.appendChild(usernameSpan);
        rankingItem.appendChild(scoreSpan);
        rankingList.appendChild(rankingItem);
    });
    
    rankingContainer.style.display = 'block';
};

const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = window.getComputedStyle(mario).bottom.replace("px", "");

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        pipe.style.animation = "none";
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = "none";
        mario.style.bottom = `${marioPosition}px`;

        mario.src = "fotos/game-over.png";
        mario.style.width = "75px";

        document.querySelector(".restart-button").style.display = "block";

        clearInterval(loop);
        clearInterval(scoreInterval);
        
        
        setTimeout(showRanking, 1000);
    }
}, 10);

document.addEventListener("keydown", jump);