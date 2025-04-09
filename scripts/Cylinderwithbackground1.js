document.addEventListener('DOMContentLoaded', () => {
    const radiusSlider = document.getElementById('radius');
    const pressureASlider = document.getElementById('pressureA');
    const pressureBSlider = document.getElementById('pressureB');
    const radiusValue = document.getElementById('radiusValue');
    const pressureAValue = document.getElementById('pressureAValue');
    const pressureBValue = document.getElementById('pressureBValue');
    const sigmaRText = document.getElementById('sigmaR');
    const sigmaThetaText = document.getElementById('sigmaTheta');
    const canvas = document.getElementById('stressCanvas');
    const ctx = canvas.getContext('2d');
	
    const image = new Image();
    image.src = 'styles/images/Cylinderbackground.png';  // Path to your image file

    const a = 6;  // Inner radius (fixed)
    const b = 8;  // Outer radius (fixed)

    const centerX = 249.3; // Fixed center position
    const centerY = 303; // Fixed center position

    image.onload = function () {
        // Ensure canvas size matches background image size
        canvas.width = 588; // Match background image width
        canvas.height = 642; // Match background image height
        drawGraph(6);  // Initialize with the default radius of 6
    }

    function drawGraph(r) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear previous drawing

        // Draw the image as the background
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Draw the radius (r) at 45 degrees
        const rX = centerX + r * Math.cos(Math.PI / 4) * 20;  // r's x-coordinate based on r length and 45 degrees
        const rY = centerY - r * Math.sin(Math.PI / 4) * 20;  // r's y-coordinate based on r length and 45 degrees

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);  // Start at the circle center
        ctx.lineTo(rX, rY);  // End at the point defined by r at 45 degrees
        ctx.strokeStyle = 'blue';  // Set the color of the radius line
        ctx.lineWidth = 7;  // Make the radius line thicker
        ctx.stroke();

        // Draw radius label (r)
        ctx.fillStyle = 'blue';
        ctx.font = '24px Arial';
        ctx.fillText('r', rX + 10, rY - 10);  // Label r to the right of the arrow

        // Draw the dashed circle corresponding to radius r
        ctx.setLineDash([5, 5]);  // Define the dash pattern (5px dash, 5px space)
        ctx.beginPath();
        ctx.arc(centerX, centerY, r * 20, 0, Math.PI * 2);  // Draw a circle with radius r
        ctx.strokeStyle = 'blue';  // Set the color of the circle
        ctx.lineWidth = 4;  // Set the circle line thickness
        ctx.stroke();
        ctx.setLineDash([]);  // Reset line dash to solid line for future drawing

        // Draw the right triangle with the hypotenuse as r
        const triangleHeight = r * Math.sin(Math.PI / 4) * 20;  // Height of the triangle
        const triangleBase = r * Math.cos(Math.PI / 4) * 20;  // Base of the triangle

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);  // Start at the circle center
        ctx.lineTo(centerX + triangleBase, centerY);  // Horizontal line
        ctx.lineTo(rX, rY);  // Diagonal (hypotenuse) line
        ctx.closePath();
        ctx.strokeStyle = 'blue';  // Set triangle color
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label the angle θ
        const angleX = centerX + triangleBase / 2;
        const angleY = centerY - 10;
        ctx.fillStyle = 'blue';
        ctx.font = '16px Arial';
        ctx.fillText('θ', angleX, angleY);

        // Update the radius value on the page
        radiusValue.textContent = r;
        sigmaRText.textContent = calculateStressComponents(r).sigma_r.toFixed(2);
        sigmaThetaText.textContent = calculateStressComponents(r).sigma_theta.toFixed(2);
    }

    function calculateStressComponents(r) {
        const sigma_r = (a ** 2 * b ** 2 * (pressureASlider.value - pressureBSlider.value) / (b ** 2 - a ** 2)) * (1 / r ** 2) +
                        (-pressureASlider.value * a ** 2 + pressureBSlider.value * b ** 2) / (b ** 2 - a ** 2);

        const sigma_theta = -(a ** 2 * b ** 2 * (pressureASlider.value - pressureBSlider.value) / (b ** 2 - a ** 2)) * (1 / r ** 2) +
                            (-pressureASlider.value * a ** 2 + pressureBSlider.value * b ** 2) / (b ** 2 - a ** 2);

        return { sigma_r, sigma_theta };
    }

    // Update the graph when the slider changes
    radiusSlider.oninput = function () {
        const r = parseFloat(radiusSlider.value);
        drawGraph(r);
    };

    pressureASlider.oninput = function () {
        // Update the displayed inner pressure value
        pressureAValue.textContent = pressureASlider.value;
        const r = parseFloat(radiusSlider.value);
        drawGraph(r);
    };

    pressureBSlider.oninput = function () {
        // Update the displayed outer pressure value
        pressureBValue.textContent = pressureBSlider.value;
        const r = parseFloat(radiusSlider.value);
        drawGraph(r);
    };

    // Initialize the page with default values
    pressureAValue.textContent = pressureASlider.value;
    pressureBValue.textContent = pressureBSlider.value;
});
