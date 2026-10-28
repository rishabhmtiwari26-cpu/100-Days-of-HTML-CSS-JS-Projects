const questionBank = {

    math: [
        {
            q: "What is 15 × 4?",
            a: ["45", "60", "55", "65"],
            correct: 1
        },
        {
            q: "What is half of 86?",
            a: ["42", "44", "43", "46"],
            correct: 2
        },
        {
            q: "If 3 + 3 × 3 = ?",
            a: ["18", "12", "15", "9"],
            correct: 1
        },
        {
            q: "What comes next: 5, 10, 15, 20, __?",
            a: ["22", "24", "25", "30"],
            correct: 2
        },
        {
            q: "What is 144 ÷ 12?",
            a: ["10", "11", "12", "14"],
            correct: 2
        },
        {
            q: "A shirt costs ₹200. A 10% discount saves how much?",
            a: ["₹10", "₹20", "₹30", "₹40"],
            correct: 1
        },
        {
            q: "What is 9²?",
            a: ["18", "72", "81", "99"],
            correct: 2
        },
        {
            q: "What is 125 + 275?",
            a: ["350", "375", "400", "425"],
            correct: 2
        }
    ],

    logic: [
        {
            q: "Which number does not belong?",
            a: ["2", "4", "7", "8"],
            correct: 2
        },
        {
            q: "All roses are flowers. Are all roses flowers?",
            a: ["Yes", "No", "Sometimes", "Cannot tell"],
            correct: 0
        },
        {
            q: "What comes next: 2, 4, 8, 16, __?",
            a: ["20", "24", "30", "32"],
            correct: 3
        },
        {
            q: "You overtake the person in second place. What place are you in?",
            a: ["First", "Second", "Third", "Fourth"],
            correct: 1
        },
        {
            q: "Which is the odd one out?",
            a: ["Apple", "Mango", "Carrot", "Banana"],
            correct: 2
        },
        {
            q: "A clock shows 3:00. What is the angle between its hands?",
            a: ["45°", "90°", "120°", "180°"],
            correct: 1
        },
        {
            q: "If yesterday was Monday, what day is tomorrow?",
            a: ["Tuesday", "Wednesday", "Thursday", "Sunday"],
            correct: 1
        },
        {
            q: "Which shape has exactly three sides?",
            a: ["Square", "Circle", "Triangle", "Rectangle"],
            correct: 2
        }
    ],

    memory: [
        {
            q: "Complete the pattern: 🔴 🔵 🔴 🔵 🔴 __",
            a: ["🔴", "🔵", "🟢", "🟡"],
            correct: 1
        },
        {
            q: "Which number is missing: 3, 6, 9, __, 15?",
            a: ["10", "11", "12", "13"],
            correct: 2
        },
        {
            q: "Remember this sequence: A, C, E, G. What comes next?",
            a: ["H", "I", "J", "K"],
            correct: 1
        },
        {
            q: "Which item is different?",
            a: ["🐶", "🐱", "🐰", "🚗"],
            correct: 3
        },
        {
            q: "Complete the sequence: 1, 4, 9, 16, __",
            a: ["20", "24", "25", "36"],
            correct: 2
        },
        {
            q: "Which letter comes next: Z, Y, X, W, __?",
            a: ["U", "V", "T", "S"],
            correct: 1
        },
        {
            q: "Find the missing number: 10, 20, 30, __, 50",
            a: ["35", "40", "45", "60"],
            correct: 1
        },
        {
            q: "Which pair matches?",
            a: ["Day–Night", "Hot–Fire", "Rain–Water", "Sun–Moonlight"],
            correct: 0
        }
    ]
};

let selectedCategory = "mixed";
let questions = [];
let currentQuestion = 0;
let score = 0;
let correctAnswers = 0;
let answeredCount = 0;
let timeLeft = 60;
let timerInterval = null;
let locked = false;
let gameActive = false;

const $ = id => document.getElementById(id);

function getBestScore() {
    try {
        return Number(localStorage.getItem("brainBoostBest")) || 0;
    } catch (e) {
        return 0;
    }
}

function setBestScore(value) {
    try {
        localStorage.setItem("brainBoostBest", String(value));
    } catch (e) {}
}

function updateStats() {
    $("score").textContent = score;
    $("timer").textContent = timeLeft;
    $("bestScore").textContent = getBestScore();
}

function shuffle(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".category").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        selectedCategory = button.dataset.category;
    });
});

$("startBtn").addEventListener("click", startGame);
$("nextBtn").addEventListener("click", nextQuestion);
$("playAgainBtn").addEventListener("click", startGame);
$("homeBtn").addEventListener("click", goHome);

function startGame() {
    clearInterval(timerInterval);

    if (selectedCategory === "mixed") {
        questions = shuffle([
            ...questionBank.math,
            ...questionBank.logic,
            ...questionBank.memory
        ]);
    } else {
        questions = shuffle(questionBank[selectedCategory]);
    }

    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    answeredCount = 0;
    timeLeft = 60;
    locked = false;
    gameActive = true;

    $("homeScreen").classList.add("hidden");
    $("resultScreen").classList.add("hidden");
    $("quizScreen").classList.remove("hidden");

    updateStats();
    showQuestion();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateStats();

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function showQuestion() {
    if (!gameActive) return;

    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }

    locked = false;

    const question = questions[currentQuestion];

    $("questionCount").textContent =
        "Question " + (currentQuestion + 1) + " / " + questions.length;

    $("categoryLabel").textContent =
        selectedCategory === "mixed"
            ? "Mixed Quiz"
            : selectedCategory.charAt(0).toUpperCase()
              + selectedCategory.slice(1);

    $("progress").style.width =
        (currentQuestion / questions.length * 100) + "%";

    $("questionText").textContent = question.q;

    $("feedback").classList.add("hidden");
    $("nextBtn").classList.add("hidden");

    $("options").innerHTML = "";

    question.a.forEach((answer, index) => {
        const button = document.createElement("button");

        button.className = "option";
        button.textContent =
            String.fromCharCode(65 + index) + ". " + answer;

        button.addEventListener("click", () => {
            checkAnswer(index, button);
        });

        $("options").appendChild(button);
    });
}

function checkAnswer(selected, selectedButton) {
    if (locked || !gameActive) return;

    locked = true;
    answeredCount++;

    const question = questions[currentQuestion];
    const buttons = $("options").querySelectorAll(".option");

    buttons.forEach(button => {
        button.disabled = true;
    });

    const feedback = $("feedback");

    if (selected === question.correct) {
        score += 10;
        correctAnswers++;

        selectedButton.classList.add("correct");
        feedback.textContent = "✅ Correct! +10 points";
    } else {
        selectedButton.classList.add("wrong");
        buttons[question.correct].classList.add("correct");

        feedback.textContent =
            "❌ Not quite! Correct answer: " +
            question.a[question.correct];
    }

    updateStats();

    const best = getBestScore();

    if (score > best) {
        setBestScore(score);
        updateStats();
    }

    feedback.classList.remove("hidden");
    $("nextBtn").classList.remove("hidden");

    $("nextBtn").textContent =
        currentQuestion === questions.length - 1
            ? "See Results 🏆"
            : "Next Question →";
}

function nextQuestion() {
    if (!gameActive || !locked) return;

    currentQuestion++;
    showQuestion();
}

function endGame() {
    if (!gameActive) return;

    gameActive = false;
    clearInterval(timerInterval);

    $("quizScreen").classList.add("hidden");
    $("resultScreen").classList.remove("hidden");

    $("progress").style.width = "100%";

    $("finalScore").textContent = score;

    let title = "";
    let icon = "";
    let message = "";

    if (score >= 100) {
        title = "Brain Champion!";
        icon = "🏆";
        message = "Outstanding! Your brain training session was amazing.";
    } else if (score >= 60) {
        title = "Great Job!";
        icon = "🥇";
        message = "Excellent effort! Keep challenging your mind.";
    } else if (score >= 30) {
        title = "Nice Work!";
        icon = "🚀";
        message = "Good start! Play again to improve your score.";
    } else {
        title = "Keep Practicing!";
        icon = "💪";
        message = "Every challenge is a new opportunity to learn.";
    }

    $("resultTitle").textContent = title;
    $("resultIcon").textContent = icon;
    $("resultMessage").textContent = message;

    const accuracy = answeredCount > 0
        ? Math.round(correctAnswers / answeredCount * 100)
        : 0;

    $("accuracyText").textContent =
        "Accuracy: " + accuracy + "%";

    $("answeredText").textContent =
        "Questions answered: " + answeredCount +
        " | Correct: " + correctAnswers;

    updateStats();
}

function goHome() {
    clearInterval(timerInterval);
    gameActive = false;

    $("quizScreen").classList.add("hidden");
    $("resultScreen").classList.add("hidden");
    $("homeScreen").classList.remove("hidden");

    score = 0;
    timeLeft = 60;

    updateStats();
}

updateStats();