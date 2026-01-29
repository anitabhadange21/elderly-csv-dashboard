let seniors = [];

fetch("senior_health_data.csv")
  .then(res => res.text())
  .then(data => {
    const rows = data.split("\n").slice(1);
    const select = document.getElementById("personSelect");

    rows.forEach(r => {
      const c = r.split(",");
      if (c.length < 12) return;

      seniors.push({
        name: c[1],
        age: +c[2],
        gender: c[3],
        sys: +c[4],
        dia: +c[5],
        hr: +c[6],
        diabetes: c[7],
        hyper: c[8]
      });

      select.innerHTML += `<option value="${c[1]}">${c[1]}</option>`;
    });

    document.getElementById("totalCount").innerText = seniors.length;
  });

document.getElementById("personSelect").addEventListener("change", e => {
  const p = seniors.find(s => s.name === e.target.value);
  if (!p) return;

  let risk = "Low";
  if (p.sys >= 160 || p.hr >= 100 || p.diabetes === "Yes") risk = "High";
  else if (p.sys >= 140 || p.hr >= 85 || p.hyper === "Yes") risk = "Medium";

  document.getElementById("personDetails").innerHTML = `
    <table>
      <tr><th>Age</th><th>Gender</th><th>BP</th><th>Heart Rate</th><th>Diabetes</th><th>Hypertension</th><th>Risk</th></tr>
      <tr>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td>${p.sys}/${p.dia}</td>
        <td>${p.hr}</td>
        <td>${p.diabetes}</td>
        <td>${p.hyper}</td>
        <td class="${risk.toLowerCase()}">${risk}</td>
      </tr>
    </table>
  `;

  let message = `
    <p>🌟 <b>Positive Note:</b> Regular monitoring helps maintain independence and quality of life.</p>
    <p><b>Focus Areas:</b> `;

  if (risk === "High")
    message += "Blood pressure, heart rate, and chronic condition management need attention.</p><p>💡 <b>Improvement:</b> Regular doctor visits, low-salt diet, daily walking, and medication adherence can greatly improve health and confidence.</p>";
  else if (risk === "Medium")
    message += "Blood pressure and lifestyle balance should be monitored.</p><p>💡 <b>Improvement:</b> Light exercise, stress reduction, and routine checkups are recommended.</p>";
  else
    message += "Current health indicators are stable.</p><p>💡 <b>Improvement:</b> Continue healthy habits and routine monitoring.</p>";

  document.getElementById("healthSummary").innerHTML = message;

  new Chart(document.getElementById("bpChart"), {
    type: "bar",
    data: {
      labels: ["Systolic BP", "Diastolic BP"],
      datasets: [{ data: [p.sys, p.dia] }]
    }
  });

  new Chart(document.getElementById("hrChart"), {
    type: "line",
    data: {
      labels: ["Heart Rate"],
      datasets: [{ data: [p.hr] }]
    }
  });
});
