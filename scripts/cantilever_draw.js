// Image mapping based on selected forces
const imageMap = {
    "000": "img/no_loads.png",
    "100": "img/T0.png",
    "010": "img/M0.png",
    "001": "img/F0.png",
    "110": "img/T0_M0.png",
    "101": "img/T0_F0.png",
    "011": "img/M0_F0.png",
    "111": "styles/images/T0_M0_F0.png"
};

// Beta coefficient lookup table
const betaValues = {
    "000": "-",
    "100": "\\infty \\text{ (Only Axial Force)}",
    "010": "\\frac{8+9\\nu}{2+\\nu} \\text{ (Classical Bending)}",
    "001": "\\approx 1 \\text{ (Shear-Dominated)}",
    "110": "\\text{Increases with } T_0",
    "101": "\\text{Moderate (Shear + Axial)}",
    "011": "\\text{Reduced (Shear + Bending)}",
    "111": "\\text{Depends on Load Ratios}"
};

// Full step-by-step calculation for case 111 (T0, F0, M0 all present)
const calculations = {
    "111": `
         \\[
    \\textbf{Step 1: Define the Problem and Assumptions}
    \\]
    
    \\[
    \\textbf{Beam Geometry and Loadings:}
    \\]
    
    \\[
    \\begin{array}{l}
        \\text{Beam Length: } l \\\\
        \\text{Beam Thickness: } h \\text{ (plane stress condition)} \\\\
        \\text{Loads at } x = 0: \\\\
        \\quad \\text{Axial Force: } T_0 \\\\
        \\quad \\text{Transverse Force: } F_0 \\\\
        \\quad \\text{Moment: } M_0
    \\end{array}
    \\]

        \\[
        \\textbf{Step 2: Governing Equations}
        \\]
        \\[
        \\nabla^4 \\phi = \\frac{\\partial^4 \\phi}{\\partial x^4} + 2\\frac{\\partial^4 \\phi}{\\partial x^2\\partial y^2} + \\frac{\\partial^4 \\phi}{\\partial y^4} = 0
        \\]

        \\[
        \\textbf{Step 3: Boundary Conditions}
        \\]
        \\[
        \\sigma_y = -q, \\quad \\tau_{xy} = 0 \\quad \\text{ at } y = h/2
        \\]
        \\[
        N(0) = \\int_{-h/2}^{h/2} \\sigma_x(0, y) dy = T_0
        \\]
        \\[
        Q(0) = \\int_{-h/2}^{h/2} \\tau_{xy}(0, y) dy = F_0
        \\]
        \\[
        M(0) = \\int_{-h/2}^{h/2} \\sigma_x(0, y) y dy = M_0
        \\]

        \\[
        \\textbf{Step 4: Solve for Stress Components}
        \\]
        \\[
        \\sigma_x(x, y) = A_1 + A_4x + A_6y + A_8x^2 + A_{10}xy
        \\]
        \\[
        \\sigma_y(x, y) = B_1 + B_3x^2 + B_5y^2
        \\]
        \\[
        \\tau_{xy}(x, y) = C_1x + C_2y + C_3xy
        \\]

        \\[
        \\textbf{Step 5: Compute Displacements}
        \\]
        \\[
        u(x,y) = \\frac{1}{E} (\\sigma_x - \\nu \\sigma_y) x + C
        \\]
        \\[
        v(x,y) = \\frac{1}{E} (\\sigma_y - \\nu \\sigma_x) y + C'
        \\]
    `
};


function updateSimulation() {
    let key = `${+document.getElementById("T0").checked}${+document.getElementById("M0").checked}${+document.getElementById("F0").checked}`;

    // Update beam image
    document.getElementById("beamImage").src = imageMap[key];

    // Update Beta Coefficient
    document.getElementById("betaValue").innerHTML = katex.renderToString(betaValues[key]);

    // Update Stress Components
    document.getElementById("sigmaX").innerHTML = katex.renderToString("\\sigma_x(x,y) = A_1 + A_4x + A_6y + A_8x^2 + A_{10}xy");
    document.getElementById("sigmaY").innerHTML = katex.renderToString("\\sigma_y(x,y) = B_1 + B_3x^2 + B_5y^2");
    document.getElementById("tauXY").innerHTML = katex.renderToString("\\tau_{xy}(x,y) = C_1x + C_2y + C_3xy");

    // Update Displacement Components
    document.getElementById("dispU").innerHTML = katex.renderToString("u(x,y) = \\frac{1}{E} (\\sigma_x - \\nu \\sigma_y) x + C");
    document.getElementById("dispV").innerHTML = katex.renderToString("v(x,y) = \\frac{1}{E} (\\sigma_y - \\nu \\sigma_x) y + C'");

    // Update Calculation Output (this is where the issue occurs)
    let calculationDiv = document.getElementById("calculationOutput");
    calculationDiv.innerHTML = calculations[key] || "No calculation available.";

    // 🔹 Manually re-trigger KaTeX rendering to fix LaTeX display issue
    renderMathInElement(calculationDiv);
}

