document.addEventListener("DOMContentLoaded", function() {
    renderMathInElement(document.body, { delimiters: [
        {left: "\\(", right: "\\)", display: false},
        {left: "\\[", right: "\\]", display: true}
    ]});
});

const feedbackMessages = {
    "q1": {
        "correct": "Your answer is correct. This question is about the biharmonic relationship. <br>The correct answer is: <span class='math'>\\( \\nabla^4 \\phi(x,y) = 0 \\)</span>",
        "incorrect": "Your answer is incorrect.This question is about the biharmonic relationship. <br>The correct answer is: <span class='math'>\\( \\nabla^4 \\phi(x,y) = 0 \\)</span>"
    },
    "q2": {
        "correct": "Your answer is correct.<br>Check stress notation and positive directions in Lecture 1, Slide 55.<br>The correct answers are: <span class='math'>\\( \\tau_{xy} = 0 \\)</span>, <span class='math'>\\( \\int_{-L}^{L} \\tau_{xy} dx = 0 \\)</span>",
        "incorrect": "Your answer is incorrect.<br>Check stress notation and positive directions in Lecture 1, Slide 55.<br>The correct answers are: <span class='math'>\\( \\tau_{xy} = 0 \\)</span>, <span class='math'>\\( \\int_{-L}^{L} \\tau_{xy} dx = 0 \\)</span>"
    },
    "q3": {
        "correct": "Your answer is correct.<br>This question involves static equilibrium conditions and stress boundary conditions.  <br>The correct answers are: <span class='math'>\\( \\sigma_y = -w \\)</span>, <span class='math'>\\( \\int_{-L}^{L} \\sigma_y dx = 0 \\)</span>",
        "incorrect": "Your answer is incorrect.<br>This question involves static equilibrium conditions and stress boundary conditions. <br>The correct answers are: <span class='math'>\\( \\sigma_y = -w \\)</span>, <span class='math'>\\( \\int_{-L}^{L} \\sigma_y dx = 0 \\)</span>"
    },
    "q4": {
        "correct": "Your answer is correct.<br>This question involves static equilibrium conditions and stress boundary conditions. <br>The correct answers are: <span class='math'>\\( \\sigma_y = 0 \\)</span>, <span class='math'>\\( \\int_{-L}^{L} \\sigma_y dx = 0 \\)</span>",
        "incorrect": "Your answer is incorrect.<br>This question involves static equilibrium conditions and stress boundary conditions. <br>The correct answers are: <span class='math'>\\( \\sigma_y = 0 \\)</span>, <span class='math'>\\( \\int_{-L}^{L} \\sigma_y dx = 0 \\)</span>"
    },
	 "q5": {
        "correct": "Your answer is correct.<br>Revise slide 50 \"Boundary Conditions\" from Lecture Notes.<br>The correct answer is: <span class='math'>\\( \\int_{-h}^{h} \\tau_{xy} dy = -wL \\)</span>",
        "incorrect": "Your answer is incorrect.<br>Revise slide 50 \"Boundary Conditions\" from Lecture Notes.<br>The correct answer is: <span class='math'>\\( \\int_{-h}^{h} \\tau_{xy} dy = -wL \\)</span>"
    },
    "q6": {
        "correct": "Your answer is correct.<br>The correct answer is: <span class='math'>\\( \\int_{-h}^{h} \\tau_{xy} dy = wL \\)</span>",
        "incorrect": "Your answer is incorrect.<br>The correct answer is: <span class='math'>\\( \\int_{-h}^{h} \\tau_{xy} dy = wL \\)</span>"
    },
	"q7": {
        "correct": "Your answer is correct.<br>The correct answer is: <span class='math'>\\( \\int_{-h}^{h} \\sigma_x dy = 0 \\)</span>",
        "incorrect": "Your answer is incorrect.<br>The correct answer is: <span class='math'>\\( \\int_{-h}^{h} \\sigma_x dy = 0 \\)</span>"
    },
	"q8": {
        "correct": "Your answer is correct.<br>The correct answer is: <span class='math'>\\( M = \\int_{-h}^{h} \\sigma_{x} y dy = 0 \\)</span>",
        "incorrect": "Your answer is incorrect.<br>The correct answer is: <span class='math'>\\( M = \\int_{-h}^{h} \\sigma_{x} y dy = 0 \\)</span>"
    },
	"q9": {
        "correct": "Your answer is correct.<br>The correct answer is: <span class='math'>\\( 3 \\)</span>",
        "incorrect": "Your answer is incorrect.<br>The correct answer is: <span class='math'>\\( 3 \\)</span>"
    },
    "q10": {
        "correct": "Your answer is correct.<br>The correct answer is: <span class='math'>\\( 3 \\)</span>",
        "incorrect": "Your answer is incorrect.<br>The correct answer is: <span class='math'>\\( 3 \\)</span>"
    },
	"q11": {
        "correct": "Your answer is correct.<br>The correct answer is: <span class='math'>\\( M = \\int_{-h}^{h} \\sigma_{x} y dy = 0 \\)</span>",
        "incorrect": "Your answer is incorrect.<br>The correct answer is: <span class='math'>\\( M = \\int_{-h}^{h} \\sigma_{x} y dy = 0 \\)</span>"
    },
	"q12": {
        "correct": "Your answer is correct.<br>The correct answer is: <span class='math'>\\( M = \\int_{-h}^{h} \\sigma_{x} y dy = 0 \\)</span>",
        "incorrect": "Your answer is incorrect.<br>The correct answer is: <span class='math'>\\( M = \\int_{-h}^{h} \\sigma_{x} y dy = 0 \\)</span>"
    },
	"q13": {
        "correct": "Your answer is correct.<br>The correct answer is: <span class='math'>\\( M = \\int_{-h}^{h} \\sigma_{x} y dy = 0 \\)</span>",
        "incorrect": "Your answer is incorrect.<br>The correct answer is: <span class='math'>\\( M = \\int_{-h}^{h} \\sigma_{x} y dy = 0 \\)</span>"
    },
};

function checkAnswer(questionId) {
    let resultElement = document.getElementById(`result-${questionId}`);
    let selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
    let userAnswer = document.getElementById(`answer-${questionId}`);
    
    if (selectedOption) { // For multiple-choice questions
        if (selectedOption.value === "correct") {
            resultElement.innerHTML = feedbackMessages[questionId].correct;
            resultElement.className = "result correct";
        } else {
            resultElement.innerHTML = feedbackMessages[questionId].incorrect;
            resultElement.className = "result incorrect";
        }
    } else if (userAnswer) { // For input-based questions
        let userInput = userAnswer.value.trim();
        if (userInput === "3") {
            resultElement.innerHTML = feedbackMessages[questionId].correct;
            resultElement.className = "result correct";
        } else {
            resultElement.innerHTML = feedbackMessages[questionId].incorrect;
            resultElement.className = "result incorrect";
        }
    } else {
        resultElement.textContent = "Please select an answer or enter a response.";
        resultElement.style.color = "blue";
    }
    renderMathInElement(resultElement);
}

function toggleFlag(questionId) {
    let flagElement = document.querySelector(`#${questionId} .flag`);
    flagElement.classList.toggle("active");
}