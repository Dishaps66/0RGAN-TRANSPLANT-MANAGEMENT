function calcPriorityScore(p) {
  return (
    (1 - p.GFR / 90) * 0.25 +
    (p.Serum_Creatinine / 16) * 0.15 +
    (p.Blood_Urea / 200) * 0.15 +
    (p.Severity_Score / 10) * 0.20 +
    (p.Wait_Time_Days / 1800) * 0.15 +
    p.Compatibility_Score * 0.10
  );
}

const patients = [
  { Patient_ID: 'PID018', Age: 41, GFR: 35.32, Serum_Creatinine: 13.03, Blood_Urea: 114.12, Severity_Score: 9, Wait_Time_Days: 1773, Compatibility_Score: 0.89 },
  { Patient_ID: 'PID032', Age: 70, GFR: 11.29, Serum_Creatinine: 13.84, Blood_Urea: 86.55, Severity_Score: 8, Wait_Time_Days: 985, Compatibility_Score: 0.33 },
  { Patient_ID: 'PID039', Age: 33, GFR: 31.43, Serum_Creatinine: 15.12, Blood_Urea: 62.72, Severity_Score: 7, Wait_Time_Days: 1763, Compatibility_Score: 0.41 },
  { Patient_ID: 'PID013', Age: 72, GFR: 6.1, Serum_Creatinine: 8.77, Blood_Urea: 157.38, Severity_Score: 10, Wait_Time_Days: 1657, Compatibility_Score: 0.09 },
  { Patient_ID: 'PID048', Age: 68, GFR: 23.88, Serum_Creatinine: 7.83, Blood_Urea: 174.87, Severity_Score: 9, Wait_Time_Days: 133, Compatibility_Score: 0.95 },
  { Patient_ID: 'PID046', Age: 35, GFR: 19.71, Serum_Creatinine: 2.1, Blood_Urea: 63.19, Severity_Score: 8, Wait_Time_Days: 929, Compatibility_Score: 0.79 },
  { Patient_ID: 'PID037', Age: 41, GFR: 67.07, Serum_Creatinine: 3.21, Blood_Urea: 83.59, Severity_Score: 8, Wait_Time_Days: 482, Compatibility_Score: 0.81 },
  { Patient_ID: 'PID045', Age: 33, GFR: 80.69, Serum_Creatinine: 7.59, Blood_Urea: 108.74, Severity_Score: 10, Wait_Time_Days: 1426, Compatibility_Score: 0.63 },
  { Patient_ID: 'PID011', Age: 36, GFR: 68.68, Serum_Creatinine: 12.61, Blood_Urea: 128.59, Severity_Score: 5, Wait_Time_Days: 158, Compatibility_Score: 0.74 },
  { Patient_ID: 'PID019', Age: 84, GFR: 12.68, Serum_Creatinine: 2.49, Blood_Urea: 178.68, Severity_Score: 8, Wait_Time_Days: 369, Compatibility_Score: 0.09 },
  { Patient_ID: 'PID002', Age: 53, GFR: 85.76, Serum_Creatinine: 0.97, Blood_Urea: 104.66, Severity_Score: 8, Wait_Time_Days: 129, Compatibility_Score: 0.42 },
  { Patient_ID: 'PID010', Age: 27, GFR: 83.02, Serum_Creatinine: 11.13, Blood_Urea: 53.65, Severity_Score: 4, Wait_Time_Days: 150, Compatibility_Score: 0.64 },
  { Patient_ID: 'PID005', Age: 28, GFR: 22.16, Serum_Creatinine: 4.13, Blood_Urea: 188.33, Severity_Score: 3, Wait_Time_Days: 1306, Compatibility_Score: 0.52 },
  { Patient_ID: 'PID008', Age: 76, GFR: 51.59, Serum_Creatinine: 1.74, Blood_Urea: 29.97, Severity_Score: 7, Wait_Time_Days: 807, Compatibility_Score: 0.37 },
  { Patient_ID: 'PID014', Age: 27, GFR: 22.43, Serum_Creatinine: 11.52, Blood_Urea: 37.62, Severity_Score: 10, Wait_Time_Days: 562, Compatibility_Score: 0.38 }
];

function rankPatients(updateTable = true) {
  for (const p of patients) {
    p.Priority_Score = calcPriorityScore(p);
  }
  patients.sort((a,b) => b.Priority_Score - a.Priority_Score);
  patients.forEach((p,i) => p.Rank = i + 1);
  if (updateTable) fillTable();
  drawFactorBarChart();
}

function fillTable() {
  const tbody = document.querySelector('#patients-table tbody');
  tbody.innerHTML = '';
  patients.slice(0,15).forEach(p => {
    const tr=document.createElement('tr');
    tr.className = p.Rank === 1 ? 'rank-1' : p.Rank === 2 ? 'rank-2' : p.Rank === 3 ? 'rank-3' : '';
    tr.innerHTML=`
      <td>${p.Rank}</td>
      <td>${p.Patient_ID}</td>
      <td>${p.Age}</td>
      <td>${p.GFR.toFixed(2)}</td>
      <td>${p.Serum_Creatinine.toFixed(2)}</td>
      <td>${p.Blood_Urea.toFixed(2)}</td>
      <td>${p.Severity_Score}</td>
      <td>${p.Wait_Time_Days}</td>
      <td>${p.Compatibility_Score.toFixed(2)}</td>`;
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  rankPatients();

  // Donor form submit logic
  document.getElementById('donor-form').onsubmit = e => {
    e.preventDefault();
    const name = document.getElementById('donor-name').value.trim();
    const age = +document.getElementById('donor-age').value;
    const email = document.getElementById('donor-email').value.trim();
    const msg = document.getElementById('donor-message');
    if (name && age >= 18 && age <= 120 && email) {
      msg.className = "msg success";
      msg.textContent = `Thank you, ${name}. Your pledge can give hope to many!`;
      e.target.reset();
    } else {
      msg.className = "msg error";
      msg.textContent = "Please enter valid details.";
    }
  };

  // Add patient form submit logic
  document.getElementById('add-patient-form').onsubmit = e => {
    e.preventDefault();
    const newP = {
      Patient_ID: document.getElementById('pid').value.trim(),
      Age: +document.getElementById('age').value,
      GFR: +document.getElementById('gfr').value,
      Serum_Creatinine: +document.getElementById('creat').value,
      Blood_Urea: +document.getElementById('urea').value,
      Severity_Score: +document.getElementById('sev').value,
      Wait_Time_Days: +document.getElementById('wait').value,
      Compatibility_Score: +document.getElementById('comp').value
    };
    const msg = document.getElementById('patient-message');
    if (
      !newP.Patient_ID ||
      isNaN(newP.Age) || isNaN(newP.GFR) || isNaN(newP.Serum_Creatinine) ||
      isNaN(newP.Blood_Urea) || isNaN(newP.Severity_Score) ||
      isNaN(newP.Wait_Time_Days) || isNaN(newP.Compatibility_Score)
    ) {
      msg.className = "msg error";
      msg.textContent = "All fields are required and must be valid numbers!";
      return;
    }
    if (patients.some(p => p.Patient_ID === newP.Patient_ID)) {
      msg.className = "msg error";
      msg.textContent = "Patient ID already exists!";
      return;
    }
    patients.push(newP);
    e.target.reset();
    msg.className = "msg success";
    msg.textContent = "New patient added and ranked!";
    rankPatients();
  };
});

// Calculate normalized contribution of each factor across all patients for bar chart
function calculateFactorContributions() {
  const factors = {
    'GFR': 0,
    'Serum Creatinine': 0,
    'Blood Urea': 0,
    'Severity Score': 0,
    'Wait Time': 0,
    'Compatibility Score': 0
  };
  let totalSum = 0;
  for (const p of patients) {
    const gfr = (1-p.GFR/90)*0.25;
    const creat = (p.Serum_Creatinine/16)*0.15;
    const urea = (p.Blood_Urea/200)*0.15;
    const sev = (p.Severity_Score/10)*0.20;
    const wait = (p.Wait_Time_Days/1800)*0.15;
    const comp = p.Compatibility_Score*0.10;
    const total = gfr + creat + urea + sev + wait + comp;
    factors['GFR'] += gfr;
    factors['Serum Creatinine'] += creat;
    factors['Blood Urea'] += urea;
    factors['Severity Score'] += sev;
    factors['Wait Time'] += wait;
    factors['Compatibility Score'] += comp;
    totalSum += total;
  }
  for (const k in factors) {
    factors[k] = factors[k] / totalSum;
  }
  return factors;
}

// Draw bar chart to show factor contributions
let barChart = null;
function drawFactorBarChart() {
  const factorData = calculateFactorContributions();
  const labels = Object.keys(factorData);
  const data = labels.map(l => factorData[l]);

  const ctx = document.getElementById('factorBarChart').getContext('2d');
  if (barChart) barChart.destroy();

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Contribution to Priority Ranking',
        data: data,
        backgroundColor: [
          '#f94144', '#f3722c', '#f9844a', '#f9c74f',
          '#90be6d', '#43aa8b'
        ]
      }]
    },
    options: {
      scales: {
        y: {
          min: 0,
          max: 1,
          ticks: {
            callback: value => `${(value * 100).toFixed(0)}%`
          },
          title: {
            display: true,
            text: 'Contribution Percentage'
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${(ctx.parsed.y * 100).toFixed(2)}%`
          }
        }
      }
    }
  });
}
