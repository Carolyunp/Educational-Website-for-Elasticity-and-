// Global variables
let M0 = 100;   // N·m
let F0 = 50;    // N
let T0 = 30;    // N
const ν = 0.3;  // Poisson's ratio
const E = 210e9; // Elastic modulus (Pa)
const I = 1e-6;  // Moment of inertia (m^4)
const q = 1000;  // Distributed load (N/m)
const l = 2;     // Beam length (m)
const h = 0.1;   // Beam height (m)

let currentCaseKey = null;

// Case definitions with formulas
const cases = {
    M0_F0_T0: {
        image: "styles/images/M0_F0_T0.png",
        title: "Case: \(M_0\), \(F_0\), \(T_0\)",
        beta: "\\[ \\beta = \\frac{8 + 9\\nu}{2 + \\nu} \\]",
        A4_formula: "\\[ A_4 = -\\frac{qh^2}{120I} - \\frac{M_0}{6I} \\]",
        A5_formula: "\\[ A_5 = \\frac{T_0}{2h} \\]",
        stress: "\\[ \\sigma_x = -\\frac{1}{I} \\left( \\frac{1}{2} qx^2 + F_0 x \\right) y + \\frac{1}{3I} qy^3 + 6A_4 y + 2A_5 \\] \\[ \\sigma_y = -\\frac{q}{2I} \\left( \\frac{1}{3} y^3 - \\frac{1}{4} h^2 y + \\frac{h^3}{12} \\right) \\] \\[ \\tau_{xy} = -\\frac{1}{2I} (qx + F_0) \\left( \\frac{h^2}{4} - y^2 \\right) \\]",
        displacement: "\\[ u = \\frac{1}{EI} \\left[ \\frac{1}{6} (2 + \\nu)(qx + F_0)y^3 - \\frac{1}{6} q(x^3 - l^3)y - \\frac{1}{2} F_0 (x^2 - l^2)y - 3I \\left( \\frac{\\nu q}{2h} - 2A_4 \\right) (x - l)y + I \\left( \\frac{\\nu q}{2} + 2A_5 \\right) (x - l) - \\frac{1}{4(1 + \\beta)EI} (1 + \\nu)(ql + F_0)h^2 y \\right] \\] \\[ v = \\frac{1}{EI} \\left[ \\frac{1}{24} q(x^4 - 4l^3 x + 3l^4) + \\frac{1}{6} F_0 (x^3 - 3l^2 x + 2l^3) - \\frac{1}{8} (1 + \\nu)q(x - l)^2 h^2 + \\frac{3I}{2} \\left( \\frac{\\nu q}{2h} - 2A_4 \\right) (x - l)^2 + \\frac{1}{2} \\nu \\left( \\frac{1}{2} qx^2 + F_0 x \\right) y^2 - \\frac{1}{24} (1 + 2\\nu) qy^4 + \\frac{3I}{2} \\left( \\frac{q}{2h} - 2\\nu A_4 \\right) y^2 - I \\left( \\frac{q}{2} + 2\\nu A_5 \\right) y - \\frac{\\beta}{4(1 + \\beta)EI} (1 + \\nu)(ql + F_0)(x - l)h^2 \\right] \\]",
        showM0: true,
        showF0: true,
        showT0: true
    },
    F0_T0: {
        image: "styles/images/F0_T0.jpg",
        title: "Case: \(M_0 = 0\), \(F_0\), \(T_0\)",
        beta: "\\[ \\beta = \\frac{8 + 9\\nu}{2 + \\nu} \\]",
        A4_formula: "\\[ A_4 = -\\frac{qh^2}{120I} \\]",
        A5_formula: "\\[ A_5 = \\frac{T_0}{2h} \\]",
        stress: "\\[ \\sigma_x = -\\frac{1}{I} \\left( \\frac{1}{2} qx^2 + F_0 x \\right) y + \\frac{1}{3I} qy^3 + 2A_5 \\] \\[ \\sigma_y = -\\frac{q}{2I} \\left( \\frac{1}{3} y^3 - \\frac{1}{4} h^2 y + \\frac{h^3}{12} \\right) \\] \\[ \\tau_{xy} = -\\frac{1}{2I} (qx + F_0) \\left( \\frac{h^2}{4} - y^2 \\right) \\]",
        displacement: "\\[ u = \\frac{1}{EI} \\left[ \\frac{1}{6} (2 + \\nu)(qx + F_0)y^3 - \\frac{1}{6} q(x^3 - l^3)y - \\frac{1}{2} F_0 (x^2 - l^2)y + I \\left( \\frac{\\nu q}{2} + 2A_5 \\right) (x - l) - \\frac{1}{4(1 + \\beta)EI} (1 + \\nu)(ql + F_0)h^2 y \\right] \\] \\[ v = \\frac{1}{EI} \\left[ \\frac{1}{24} q(x^4 - 4l^3 x + 3l^4) + \\frac{1}{6} F_0 (x^3 - 3l^2 x + 2l^3) - \\frac{1}{8} (1 + \\nu)q(x - l)^2 h^2 + \\frac{1}{2} \\nu \\left( \\frac{1}{2} qx^2 + F_0 x \\right) y^2 - \\frac{1}{24} (1 + 2\\nu) qy^4 - I \\left( \\frac{q}{2} + 2\\nu A_5 \\right) y - \\frac{\\beta}{4(1 + \\beta)EI} (1 + \\nu)(ql + F_0)(x - l)h^2 \\right] \\]",
        showM0: false,
        showF0: true,
        showT0: true
    },
    T0: {
        image: "styles/images/T0.png",
        title: "Case: \(M_0 = 0\), \(F_0 = 0\), \(T_0\)",
        beta: "\\[ \\beta = \\frac{8 + 9\\nu}{2 + \\nu} \\]",
        A4_formula: "\\[ A_4 = -\\frac{qh^2}{120I} \\]",
        A5_formula: "\\[ A_5 = \\frac{T_0}{2h} \\]",
        stress: "\\[ \\sigma_x = -\\frac{1}{I} \\left( \\frac{1}{2} qx^2 \\right) y + \\frac{1}{3I} qy^3 + 2A_5 \\] \\[ \\sigma_y = -\\frac{q}{2I} \\left( \\frac{1}{3} y^3 - \\frac{1}{4} h^2 y + \\frac{h^3}{12} \\right) \\] \\[ \\tau_{xy} = -\\frac{1}{2I} qx \\left( \\frac{h^2}{4} - y^2 \\right) \\]",
        displacement: "\\[ u = \\frac{1}{EI} \\left[ \\frac{1}{6} (2 + \\nu)qx y^3 - \\frac{1}{6} q(x^3 - l^3)y + I \\left( \\frac{\\nu q}{2} + 2A_5 \\right) (x - l) - \\frac{1}{4(1 + \\beta)EI} (1 + \\nu)ql h^2 y \\right] \\] \\[ v = \\frac{1}{EI} \\left[ \\frac{1}{24} q(x^4 - 4l^3 x + 3l^4) - \\frac{1}{8} (1 + \\nu)q(x - l)^2 h^2 + \\frac{1}{2} \\nu \\left( \\frac{1}{2} qx^2 \\right) y^2 - \\frac{1}{24} (1 + 2\\nu) qy^4 - I \\left( \\frac{q}{2} + 2\\nu A_5 \\right) y - \\frac{\\beta}{4(1 + \\beta)EI} (1 + \\nu)ql (x - l)h^2 \\right] \\]",
        showM0: false,
        showF0: false,
        showT0: true
    },
    M0_T0: {
        image: "styles/images/M0_T0.png",
        title: "Case: \(F_0 = 0\), \(M_0\), \(T_0\)",
        beta: "\\[ \\beta = \\frac{8 + 9\\nu}{2 + \\nu} \\]",
        A4_formula: "\\[ A_4 = -\\frac{qh^2}{120I} - \\frac{M_0}{6I} \\]",
        A5_formula: "\\[ A_5 = \\frac{T_0}{2h} \\]",
        stress: "\\[ \\sigma_x = -\\frac{1}{I} \\left( \\frac{1}{2} qx^2 \\right) y + \\frac{1}{3I} qy^3 + 6A_4 y + 2A_5 \\] \\[ \\sigma_y = -\\frac{q}{2I} \\left( \\frac{1}{3} y^3 - \\frac{1}{4} h^2 y + \\frac{h^3}{12} \\right) \\] \\[ \\tau_{xy} = -\\frac{1}{2I} qx \\left( \\frac{h^2}{4} - y^2 \\right) \\]",
        displacement: "\\[ u = \\frac{1}{EI} \\left[ \\frac{1}{6} (2 + \\nu)qx y^3 - \\frac{1}{6} q(x^3 - l^3)y - 3I \\left( \\frac{\\nu q}{2h} - 2A_4 \\right) (x - l)y + I \\left( \\frac{\\nu q}{2} + 2A_5 \\right) (x - l) - \\frac{1}{4(1 + \\beta)EI} (1 + \\nu)ql h^2 y \\right] \\] \\[ v = \\frac{1}{EI} \\left[ \\frac{1}{24} q(x^4 - 4l^3 x + 3l^4) - \\frac{1}{8} (1 + \\nu)q(x - l)^2 h^2 + \\frac{3I}{2} \\left( \\frac{\\nu q}{2h} - 2A_4 \\right) (x - l)^2 + \\frac{1}{2} \\nu \\left( \\frac{1}{2} qx^2 \\right) y^2 - \\frac{1}{24} (1 + 2\\nu) qy^4 + \\frac{3I}{2} \\left( \\frac{q}{2h} - 2\\nu A_4 \\right) y^2 - I \\left( \\frac{q}{2} + 2\\nu A_5 \\right) y - \\frac{\\beta}{4(1 + \\beta)EI} (1 + \\nu)ql (x - l)h^2 \\right] \\]",
        showM0: true,
        showF0: false,
        showT0: true
    },
    M0: {
        image: "styles/images/M0.png",
        title: "Case: \(F_0 = 0\), \(M_0\), \(T_0 = 0\)",
        beta: "\\[ \\beta = \\frac{8 + 9\\nu}{2 + \\nu} \\]",
        A4_formula: "\\[ A_4 = -\\frac{qh^2}{120I} - \\frac{M_0}{6I} \\]",
        A5_formula: "\\[ A_5 = 0 \\]",
        stress: "\\[ \\sigma_x = -\\frac{1}{I} \\left( \\frac{1}{2} qx^2 \\right) y + \\frac{1}{3I} qy^3 + 6A_4 y \\] \\[ \\sigma_y = -\\frac{q}{2I} \\left( \\frac{1}{3} y^3 - \\frac{1}{4} h^2 y + \\frac{h^3}{12} \\right) \\] \\[ \\tau_{xy} = -\\frac{1}{2I} qx \\left( \\frac{h^2}{4} - y^2 \\right) \\]",
        displacement: "\\[ u = \\frac{1}{EI} \\left[ \\frac{1}{6} (2 + \\nu)qx y^3 - \\frac{1}{6} q(x^3 - l^3)y - 3I \\left( \\frac{\\nu q}{2h} - 2A_4 \\right) (x - l)y + I \\left( \\frac{\\nu q}{2} \\right) (x - l) - \\frac{1}{4(1 + \\beta)EI} (1 + \\nu)ql h^2 y \\right] \\] \\[ v = \\frac{1}{EI} \\left[ \\frac{1}{24} q(x^4 - 4l^3 x + 3l^4) - \\frac{1}{8} (1 + \\nu)q(x - l)^2 h^2 + \\frac{3I}{2} \\left( \\frac{\\nu q}{2h} - 2A_4 \\right) (x - l)^2 + \\frac{1}{2} \\nu \\left( \\frac{1}{2} qx^2 \\right) y^2 - \\frac{1}{24} (1 + 2\\nu) qy^4 + \\frac{3I}{2} \\left( \\frac{q}{2h} - 2\\nu A_4 \\right) y^2 - I \\left( \\frac{q}{2} \\right) y - \\frac{\\beta}{4(1 + \\beta)EI} (1 + \\nu)ql (x - l)h^2 \\right] \\]",
        showM0: true,
        showF0: false,
        showT0: false
    },
    M0_F0: {
        image: "styles/images/M0_F0.png",
        title: "Case: \(T_0 = 0\), \(M_0\), \(F_0\)",
        beta: "\\[ \\beta = \\frac{8 + 9\\nu}{2 + \\nu} \\]",
        A4_formula: "\\[ A_4 = -\\frac{qh^2}{120I} - \\frac{M_0}{6I} \\]",
        A5_formula: "\\[ A_5 = 0 \\]",
        stress: "\\[ \\sigma_x = -\\frac{1}{I} \\left( \\frac{1}{2} qx^2 + F_0 x \\right) y + \\frac{1}{3I} qy^3 + 6A_4 y \\] \\[ \\sigma_y = -\\frac{q}{2I} \\left( \\frac{1}{3} y^3 - \\frac{1}{4} h^2 y + \\frac{h^3}{12} \\right) \\] \\[ \\tau_{xy} = -\\frac{1}{2I} (qx + F_0) \\left( \\frac{h^2}{4} - y^2 \\right) \\]",
        displacement: "\\[ u = \\frac{1}{EI} \\left[ \\frac{1}{6} (2 + \\nu)(qx + F_0)y^3 - \\frac{1}{6} q(x^3 - l^3)y - \\frac{1}{2} F_0 (x^2 - l^2)y - 3I \\left( \\frac{\\nu q}{2h} - 2A_4 \\right) (x - l)y + I \\left( \\frac{\\nu q}{2} \\right) (x - l) - \\frac{1}{4(1 + \\beta)EI} (1 + \\nu)(ql + F_0)h^2 y \\right] \\] \\[ v = \\frac{1}{EI} \\left[ \\frac{1}{24} q(x^4 - 4l^3 x + 3l^4) + \\frac{1}{6} F_0 (x^3 - 3l^2 x + 2l^3) - \\frac{1}{8} (1 + \\nu)q(x - l)^2 h^2 + \\frac{3I}{2} \\left( \\frac{\\nu q}{2h} - 2A_4 \\right) (x - l)^2 + \\frac{1}{2} \\nu \\left( \\frac{1}{2} qx^2 + F_0 x \\right) y^2 - \\frac{1}{24} (1 + 2\\nu) qy^4 + \\frac{3I}{2} \\left( \\frac{q}{2h} - 2\\nu A_4 \\right) y^2 - I \\left( \\frac{q}{2} \\right) y - \\frac{\\beta}{4(1 + \\beta)EI} (1 + \\nu)(ql + F_0)(x - l)h^2 \\right] \\]",
        showM0: true,
        showF0: true,
        showT0: false
    },
    F0: {
        image: "styles/images/F0.png",
        title: "Case: \(T_0 = 0\), \(M_0 = 0\), \(F_0\)",
        beta: "\\[ \\beta = \\frac{8 + 9\\nu}{2 + \\nu} \\]",
        A4_formula: "\\[ A_4 = -\\frac{qh^2}{120I} \\]",
        A5_formula: "\\[ A_5 = 0 \\]",
        stress: "\\[ \\sigma_x = -\\frac{1}{I} \\left( \\frac{1}{2} qx^2 + F_0 x \\right) y + \\frac{1}{3I} qy^3 \\] \\[ \\sigma_y = -\\frac{q}{2I} \\left( \\frac{1}{3} y^3 - \\frac{1}{4} h^2 y + \\frac{h^3}{12} \\right) \\] \\[ \\tau_{xy} = -\\frac{1}{2I} (qx + F_0) \\left( \\frac{h^2}{4} - y^2 \\right) \\]",
        displacement: "\\[ u = \\frac{1}{EI} \\left[ \\frac{1}{6} (2 + \\nu)(qx + F_0)y^3 - \\frac{1}{6} q(x^3 - l^3)y - \\frac{1}{2} F_0 (x^2 - l^2)y + I \\left( \\frac{\\nu q}{2} \\right) (x - l) - \\frac{1}{4(1 + \\beta)EI} (1 + \\nu)(ql + F_0)h^2 y \\right] \\] \\[ v = \\frac{1}{EI} \\left[ \\frac{1}{24} q(x^4 - 4l^3 x + 3l^4) + \\frac{1}{6} F_0 (x^3 - 3l^2 x + 2l^3) - \\frac{1}{8} (1 + \\nu)q(x - l)^2 h^2 + \\frac{1}{2} \\nu \\left( \\frac{1}{2} qx^2 + F_0 x \\right) y^2 - \\frac{1}{24} (1 + 2\\nu) qy^4 - I \\left( \\frac{q}{2} \\right) y - \\frac{\\beta}{4(1 + \\beta)EI} (1 + \\nu)(ql + F_0)(x - l)h^2 \\right] \\]",
        showM0: false,
        showF0: true,
        showT0: false
    },
    all_zero: {
        image: "styles/images/all_zero.png",
        title: "Case: \(F_0 = 0\), \(M_0 = 0\), \(T_0 = 0\)",
        beta: "\\[ \\beta = \\frac{8 + 9\\nu}{2 + \\nu} \\]",
        A4_formula: "\\[ A_4 = -\\frac{qh^2}{120I} \\]",
        A5_formula: "\\[ A_5 = 0 \\]",
        stress: "\\[ \\sigma_x = -\\frac{1}{I} \\left( \\frac{1}{2} qx^2 \\right) y + \\frac{1}{3I} qy^3 \\] \\[ \\sigma_y = -\\frac{q}{2I} \\left( \\frac{1}{3} y^3 - \\frac{1}{4} h^2 y + \\frac{h^3}{12} \\right) \\] \\[ \\tau_{xy} = -\\frac{1}{2I} qx \\left( \\frac{h^2}{4} - y^2 \\right) \\]",
        displacement: "\\[ u = \\frac{1}{EI} \\left[ \\frac{1}{6} (2 + \\nu)qx y^3 - \\frac{1}{6} q(x^3 - l^3)y + I \\left( \\frac{\\nu q}{2} \\right) (x - l) - \\frac{1}{4(1 + \\beta)EI} (1 + \\nu)ql h^2 y \\right] \\] \\[ v = \\frac{1}{EI} \\left[ \\frac{1}{24} q(x^4 - 4l^3 x + 3l^4) - \\frac{1}{8} (1 + \\nu)q(x - l)^2 h^2 + \\frac{1}{2} \\nu \\left( \\frac{1}{2} qx^2 \\right) y^2 - \\frac{1}{24} (1 + 2\\nu) qy^4 - I \\left( \\frac{q}{2} \\right) y - \\frac{\\beta}{4(1 + \\beta)EI} (1 + \\nu)ql (x - l)h^2 \\right] \\]",
        showM0: false,
        showF0: false,
        showT0: false
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up slider event listeners
    document.getElementById('m0Slider').addEventListener('input', function() {
        M0 = parseFloat(this.value);
        document.getElementById('m0Value').textContent = M0;
        updateResults();
    });
    
    document.getElementById('f0Slider').addEventListener('input', function() {
        F0 = parseFloat(this.value);
        document.getElementById('f0Value').textContent = F0;
        updateResults();
    });
    
    document.getElementById('t0Slider').addEventListener('input', function() {
        T0 = parseFloat(this.value);
        document.getElementById('t0Value').textContent = T0;
        updateResults();
    });
	// ✅ 默认显示 M0_F0_T0 的情况
    selectCase('M0_F0_T0');
});

// Select a case and update the interface
function selectCase(caseKey) {
    currentCaseKey = caseKey;
    const caseData = cases[caseKey];
    
    // Show controls and image
    document.getElementById('controls').style.display = 'flex';
    document.getElementById('beamImage').style.display = 'block';
    
    // Update image and title
    document.getElementById("beamImage").src = caseData.image;
    document.getElementById("caseTitle").innerHTML = caseData.title;
    
    // Update formulas
    document.getElementById("betaFormula").innerHTML = caseData.beta;
    document.getElementById("A4Formula").innerHTML = caseData.A4_formula;
    document.getElementById("A5Formula").innerHTML = caseData.A5_formula;
    document.getElementById("stressFormula").innerHTML = caseData.stress;
    document.getElementById("displacementFormula").innerHTML = caseData.displacement;
    
    // Show/hide sliders based on case
    document.getElementById('m0Control').style.display = caseData.showM0 ? 'block' : 'none';
    document.getElementById('f0Control').style.display = caseData.showF0 ? 'block' : 'none';
    document.getElementById('t0Control').style.display = caseData.showT0 ? 'block' : 'none';
    
    // Update results
    updateResults();
    
    // Scroll to results section
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    
    // Re-render MathJax
    if (typeof MathJax !== 'undefined') {
    MathJax.typesetPromise();
    }
}

// Calculate stress components
function calculateStress(x, y) {
    const currentCase = document.getElementById("caseTitle").textContent;
    let A4, A5;
    
    if (cases[currentCaseKey].showM0) {
        A4 = -q*h*h/(120*I) - M0/(6*I);
    } else {
        A4 = -q*h*h/(120*I);
    }
    
    if (cases[currentCaseKey].showT0) {
        A5 = T0/(2*h);
    } else {
        A5 = 0;
    }
    
    let F0_term = 0;
    if (cases[currentCaseKey].showF0) {
        F0_term = F0*x;
    }
    
    const σ_x = -(1/I)*(0.5*q*x*x + F0_term)*y + (1/(3*I))*q*y*y*y + 6*A4*y + 2*A5;
    const σ_y = -(q/(2*I))*(y*y*y/3 - h*h*y/4 + h*h*h/12);
    
    let τ_xy_term = q*x;
    if (cases[currentCaseKey].showF0) {
        τ_xy_term += F0;
    }
    const τ_xy = -(1/(2*I))*τ_xy_term*(h*h/4 - y*y);
    
    return { σ_x, σ_y, τ_xy };
}

// Calculate displacement
function calculateDisplacement(x, y) {
    const β = (8 + 9*ν)/(2 + ν);
    const currentCase = document.getElementById("caseTitle").textContent;
    
    let A4, A5;
    if (cases[currentCaseKey].showM0) {
        A4 = -q*h*h/(120*I) - M0/(6*I);
    } else {
        A4 = -q*h*h/(120*I);
    }
    
    if (cases[currentCaseKey].showT0) {
        A5 = T0/(2*h);
    } else {
        A5 = 0;
    }
    
    // u calculation
    let u_F0_term = 0;
    let u_F0_quad_term = 0;
    if (cases[currentCaseKey].showF0) {
        u_F0_term = F0;
        u_F0_quad_term = F0*(x*x - l*l)*y/2;
    }
    
    const u = (1/(E*I))*(
        (1/6)*(2 + ν)*(q*x + u_F0_term)*y*y*y - 
        (1/6)*q*(x*x*x - l*l*l)*y - 
        u_F0_quad_term - 
        3*I*(ν*q/(2*h) - 2*A4)*(x - l)*y + 
        I*(ν*q/2 + 2*A5)*(x - l) - 
        (1/(4*(1 + β)*E*I))*(1 + ν)*(q*l + (cases[currentCaseKey].showF0 ? F0 : 0))*h*h*y
    );
    
    // v calculation
    let v_F0_cubic_term = 0;
    let v_F0_quad_term = 0;
    if (cases[currentCaseKey].showF0) {
        v_F0_cubic_term = (1/6)*F0*(x*x*x - 3*l*l*x + 2*l*l*l);
        v_F0_quad_term = (1/2)*ν*(0.5*q*x*x + F0*x)*y*y;
    } else {
        v_F0_quad_term = (1/2)*ν*(0.5*q*x*x)*y*y;
    }
    
    const v = (1/(E*I))*(
        (1/24)*q*(x*x*x*x - 4*l*l*l*x + 3*l*l*l*l) + 
        v_F0_cubic_term - 
        (1/8)*(1 + ν)*q*(x - l)*(x - l)*h*h + 
        (3*I/2)*(ν*q/(2*h) - 2*A4)*(x - l)*(x - l) + 
        v_F0_quad_term - 
        (1/24)*(1 + 2*ν)*q*y*y*y*y + 
        (3*I/2)*(q/(2*h) - 2*ν*A4)*y*y - 
        I*(q/2 + 2*ν*A5)*y - 
        (β/(4*(1 + β)*E*I))*(1 + ν)*(q*l + (cases[currentCaseKey].showF0 ? F0 : 0))*(x - l)*h*h
    );
    
    return { u, v };
}

// Update results display
function updateResults() {
    // Calculate at sample point (x=0.5l, y=0.5h)
    const x = 0.5*l;
    const y = 0.5*h;
    
    const stress = calculateStress(x, y);
    const displacement = calculateDisplacement(x, y);
    const β = (8 + 9*ν)/(2 + ν);
    
    // Get current case
    const currentCase = document.getElementById("caseTitle").textContent;
    let A4, A5;
    
    if (cases[currentCaseKey].showM0) {
        A4 = -q*h*h/(120*I) - M0/(6*I);
    } else {
        A4 = -q*h*h/(120*I);
    }
    
    if (cases[currentCaseKey].showT0) {
        A5 = T0/(2*h);
    } else {
        A5 = 0;
    }
    
    // Update β value
    document.getElementById('betaValue').innerHTML = `\\(\\beta = ${β.toFixed(3)}\\)`;
    
    // Update A4 and A5 values
    document.getElementById('A4Value').innerHTML = `\\(A_4 = ${A4.toExponential(3)}\\)`;
    document.getElementById('A5Value').innerHTML = `\\(A_5 = ${A5.toExponential(3)}\\)`;
    
    // Update stress results
    document.getElementById('stressResults').innerHTML = `
        <p><strong>At (x=${x.toFixed(2)}m, y=${y.toFixed(2)}m):</strong></p>
        <p>\\(\\sigma_x = ${stress.σ_x.toExponential(3)} \\) Pa</p>
        <p>\\(\\sigma_y = ${stress.σ_y.toExponential(3)} \\) Pa</p>
        <p>\\(\\tau_{xy} = ${stress.τ_xy.toExponential(3)} \\) Pa</p>
    `;
    
    // Update displacement results
    document.getElementById('displacementResults').innerHTML = `
        <p><strong>At (x=${x.toFixed(2)}m, y=${y.toFixed(2)}m):</strong></p>
        <p>\\(u = ${displacement.u.toExponential(3)} \\) m</p>
        <p>\\(v = ${displacement.v.toExponential(3)} \\) m</p>
    `;
    
    // Re-render MathJax
    if (typeof MathJax !== 'undefined') {
        MathJax.typesetPromise();
    }
}