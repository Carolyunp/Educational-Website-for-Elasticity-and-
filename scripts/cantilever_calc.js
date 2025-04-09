// 该文件用于读取用户输入并计算悬臂梁在均布载荷作用下的解
function solve() {
  // 读取输入值
  const L = parseFloat(document.getElementById('beamLength').value);
  const h = parseFloat(document.getElementById('beamThickness').value);
  const E_input = parseFloat(document.getElementById('youngsModulus').value);
  const q = parseFloat(document.getElementById('uniformLoad').value);
  
  const answerArea = document.getElementById('answerArea');
  answerArea.innerHTML = "";
  
  // 输入有效性检查
  if (isNaN(L) || L <= 0) {
    answerArea.innerHTML = "Please enter a valid beam length.";
    return;
  }
  if (isNaN(h) || h <= 0) {
    answerArea.innerHTML = "Please enter a valid beam thickness.";
    return;
  }
  if (isNaN(E_input) || E_input <= 0) {
    answerArea.innerHTML = "Please enter a valid Young's Modulus.";
    return;
  }
  if (isNaN(q)) {
    answerArea.innerHTML = "Please enter a valid uniform load.";
    return;
  }
  
  // 将 E 从 MPa 转换为 Pa（N/m²）
  const E = E_input * 1e6;
  
  // 梁截面矩（假设宽度为1 m）： I = h³/12
  const I = Math.pow(h, 3) / 12;
  
  // 均布载荷 q 单位为 kN/m，转换为 N/m
  const q_N = q * 1000;
  
  // 悬臂梁基本公式（固定端在左，免费端在右）：
  // 最大挠度（免费端）： δ = q * L^4 / (8 * E * I)
  const delta = q_N * Math.pow(L, 4) / (8 * E * I);
  
  // 固定端弯矩： M = q * L² / 2
  const M = q_N * Math.pow(L, 2) / 2;
  
  // 固定端剪力： V = q * L
  const V = q_N * L;
  
  // 最大弯曲应力： σ_max = M * (h/2) / I
  const sigma_max = M * (h / 2) / I;
  
  // 对结果进行格式化
  const deltaFormatted = delta.toFixed(4);
  const MFormatted = M.toFixed(2);
  const VFormatted = V.toFixed(2);
  const sigmaFormatted = sigma_max.toFixed(2);
  
  // 显示结果
  answerArea.innerHTML = `
    <h3>Results for Cantilever Beam (Uniform Load)</h3>
    <p>Beam Length, L = ${L} m</p>
    <p>Beam Thickness, h = ${h} m</p>
    <p>Young's Modulus, E = ${E_input} MPa</p>
    <p>Uniform Load, q = ${q} kN/m</p>
    <hr>
    <p>Maximum deflection at free end, δ = ${deltaFormatted} m</p>
    <p>Fixed end bending moment, M = ${MFormatted} N·m</p>
    <p>Fixed end shear force, V = ${VFormatted} N</p>
    <p>Maximum bending stress, σ_max = ${sigmaFormatted} Pa</p>
  `;
  
  // 更新 canvas 绘图
  drawCantileverBeam(L);
}

function resetSimulation() {
  document.getElementById('beamLength').value = "";
  document.getElementById('beamThickness').value = "";
  document.getElementById('youngsModulus').value = "";
  document.getElementById('uniformLoad').value = "";
  document.getElementById('answerArea').innerHTML = "";
  const canvas = document.getElementById('beamCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
