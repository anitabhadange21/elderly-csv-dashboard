fetch("senior_health_data.csv")
  .then(res => res.text())
  .then(data => {
    const rows = data.split("\n").slice(1);
    const table = document.getElementById("healthTable");

    let low = 0, medium = 0, high = 0;

    rows.forEach(row => {
      const c = row.split(",");
      if (c.length < 12) return;

      const name = c[1];
      const age = +c[2];
      const gender = c[3];
      const sys = +c[4];
      const dia = +c[5];
      const hr = +c[6];
      const diabetes = c[7];
      const hyper = c[8];

      let risk = "Low";

      if (sys >= 160 || dia >= 100 || hr >= 100 || diabetes === "Yes") {
        risk = "High"; high++;
      } else if (sys >= 140 || dia >= 90 || hr >= 85 || hyper === "Yes") {
        risk = "Medium"; medium++;
      } else {
        low++;
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${name}</td>
        <td>${age}</td>
        <td>${gender}</td>
        <td>${sys}/${dia}</td>
        <td>${hr}</td>
        <td>${diabetes}</td>
        <td>${hyper}</td>
        <td class="${risk.toLowerCase()}">${risk}</td>
      `;
      table.appendChild(tr);
    });

    new Chart(document.getElementById("riskChart"), {
      type: "pie",
      data: {
        labels: ["Low Risk", "Medium Risk", "High Risk"],
        datasets: [{
          data: [low, medium, high]
        }]
      }
    });
  });
