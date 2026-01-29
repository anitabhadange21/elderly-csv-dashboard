let seniors = [];

fetch("senior_health_data.csv")
  .then(res => res.text())
  .then(data => {
    const rows = data.split("\n").slice(1);

    let low = 0, high = 0;

    rows.forEach(r => {
      const c = r.split(",");
      if (c.length < 12) return;

      const person = {
        name: c[1],
        age: c[2],
        bpSys: +c[4],
        bpDia: +c[5],
        hr: +c[6],
        diabetes: c[7],
        hyper: c[8]
      };

      person.risk = "Low";

      if (person.bpSys >= 160 || person.hr >= 100 || person.diabetes === "Yes") {
        person.risk = "High"; high++;
      } else {
        low++;
      }

      seniors.push(person);

      document.getElementById("personSelect").innerHTML +=
        `<option value="${person.name}">${person.name}</option>`;
    });

    document.getElementById("total").innerText = seniors.length;
    document.getElementById("low").innerText = low;
    document.getElementById("high").innerText = high;
  });

document.getElementById("personSelect").addEventListener("change", e => {
  const p = seniors.find(s => s.name === e.target.value);
  if (!p) return;

  let advice = "Maintain healthy lifestyle";

  if (p.risk === "High") {
    advice = "Consult doctor, monitor BP & sugar regularly";
  }

  document.getElementById("profile").innerHTML = `
    <h2>${p.name}</h2>
    <p>Age: ${p.age}</p>
    <p>Blood Pressure: ${p.bpSys}/${p.bpDia}</p>
    <p>Heart Rate: ${p.hr}</p>
    <p>Risk Level: <span class="${p.risk.toLowerCase()}">${p.risk}</span></p>
    <p><b>Recommendation:</b> ${advice}</p>
  `;
});
