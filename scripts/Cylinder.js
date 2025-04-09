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

    const a = 5;  // Inner radius (fixed)
    const b = 8;  // Outer radius (fixed)

    function calculateStressComponents(r, sigma_a, sigma_b) {
        // Radial stress formula (σr)
        const sigma_r = (a ** 2 * b ** 2 * (sigma_a - sigma_b) / (b ** 2 - a ** 2)) * (1 / r ** 2) +
                        (-sigma_a * a ** 2 + sigma_b * b ** 2) / (b ** 2 - a ** 2);

        // Circumferential stress formula (σθ)
        const sigma_theta = -(a ** 2 * b ** 2 * (sigma_a - sigma_b) / (b ** 2 - a ** 2)) * (1 / r ** 2) +
                            (-sigma_a * a ** 2 + sigma_b * b ** 2) / (b ** 2 - a ** 2);

        return { sigma_r, sigma_theta };
    }

     function drawGraph(r, sigma_r, sigma_theta) {
        const centerX = 300;
        const centerY = 300;

        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear previous drawing

        // Draw outer circle (b)
        ctx.beginPath();
        ctx.arc(centerX, centerY, b * 20, 0, Math.PI * 2);  
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw inner circle (a)
        ctx.beginPath();
        ctx.arc(centerX, centerY, a * 20, 0, Math.PI * 2);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw radius (r)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + r * 20, centerY);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw arrows for pressures
        drawArrow(centerX + b * 20 + 10, centerY, 10, 0, "σb");
        drawArrow(centerX - a * 20 - 10, centerY, -10, 0, "σa");
		

        // Draw labels for radii and pressures
        drawLabel(centerX + b * 20 + 10, centerY, 'σb');
        drawLabel(centerX - a * 20 - 10, centerY, 'σa');
        drawLabel(centerX + r * 20 + 10, centerY, 'r');
        drawLabel(centerX, centerY + b * 20 + 10, '2b');
        drawLabel(centerX, centerY - a * 20 - 10, '2a');
    }

    function drawArrow(x, y, dx, dy, label) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + dx, y + dy);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw label
        ctx.fillStyle = 'blue';
        ctx.font = '16px Arial';
        ctx.fillText(label, x + dx + 10, y + dy);
    }

    function drawLabel(x, y, text) {
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(text, x, y);
    }

    function updateValues() {
        const r = parseFloat(radiusSlider.value);
        const sigma_a = parseFloat(pressureASlider.value);
        const sigma_b = parseFloat(pressureBSlider.value);

        // Update values displayed for radius and pressures
        radiusValue.textContent = r;
        pressureAValue.textContent = sigma_a;
        pressureBValue.textContent = sigma_b;

        // Calculate stresses
        const { sigma_r, sigma_theta } = calculateStressComponents(r, sigma_a, sigma_b);

        // Update stress values on the page
        sigmaRText.textContent = sigma_r.toFixed(2);
        sigmaThetaText.textContent = sigma_theta.toFixed(2);

        // Draw the graph
        drawGraph(r, sigma_r, sigma_theta);
    }

    // Attach event listeners to the sliders
    radiusSlider.oninput = updateValues;
    pressureASlider.oninput = updateValues;
    pressureBSlider.oninput = updateValues;

    // Initialize with default values
    updateValues();
});