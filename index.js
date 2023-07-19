// DOM 

const amount = document.querySelector('#amount');
const todayInput = document.querySelector('#today');
const totalResult = document.querySelector('#totalResult');
const lateFee = document.querySelector('#lateFee');
const GST = document.querySelector('#GST');
const clearBtn = document.querySelector('#clear');
const printBtn = document.querySelector('#printBtn');
const toggleBtn = document.querySelector('#toggleBtn');
const formula = document.querySelector('#formula');
const arrow = document.querySelector('#arrow');
const toggleClearSwitch = document.querySelector('#toggleClear');
const dueDate = document.querySelector('#dueDate');

let daysVal, primaryLateFee, secondaryFee, finalResults;

//date

let todaysDate = document.getElementById("today");
let dateWarning = document.getElementById("dateWarning");

window.onload = function(){
  fetch('http://worldtimeapi.org/api/timezone/Asia/Kolkata')
  .then(response => response.json())
  .then(data => {
      let today = new Date(data.datetime);
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); 
      let yyyy = today.getFullYear();
      let formattedDate = yyyy + '-' + mm + '-' + dd;
      todayInput.value = formattedDate;
      dueDate.max = formattedDate;
  })
  .catch((error) => {
      console.error('Error:', error);

      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); 
      let yyyy = today.getFullYear();
      let formattedDate = yyyy + '-' + mm + '-' + dd;
      todayInput.value = formattedDate;
      dueDate.max = formattedDate;
  });

  todaysDate.addEventListener("change", function() {
    let todayVal = new Date(todaysDate.value);
    let currentDateTime = new Date();
    
    let todayDateOnly = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate());
    let selectedDateOnly = new Date(todayVal.getFullYear(), todayVal.getMonth(), todayVal.getDate());
  
    if (selectedDateOnly.getTime() > todayDateOnly.getTime()) {
        dateWarning.textContent = "Future Date Selected";
        dateWarning.style.color = 'red';
    } else if (selectedDateOnly.getTime() < todayDateOnly.getTime()) {
        dateWarning.textContent = "Past Date Selected";
        dateWarning.style.color = 'black';
    } else {
        dateWarning.textContent = '';
    }
    
    dueDate.max = todaysDate.value; 
  });
  


  dueDate.addEventListener("change", function() {
      let dueDateVal = new Date(dueDate.value);
      let todayVal = new Date(todaysDate.value);

      if (dueDateVal.getTime() > todayVal.getTime()) {
          dueDate.style.borderColor = 'red';  
          dateWarning.textContent = "Future date?"; 
          dateWarning.style.color = 'red';
      } else {
          dueDate.style.borderColor = 'black';  
          dateWarning.textContent = '';
      }
  });
}

function clearFields(){
  amount.value = '';
  dueDate.value = '';
  totalResult.textContent = 'Result';
  lateFee.textContent = 'Fee on delay';
  GST.textContent = 'GST on late fee';
  invoiceNumber.value = ''; 
  invoiceNumber.style.display = 'none'; 
  printBtn.style.display = 'none';
}

// Logic
function calc(event){
  if(amount.value !== '' && dueDate.value !== '') {
    let amt = Number(amount.value);
    let dueDateVal = new Date(dueDate.value);
    let todayVal = new Date(document.getElementById("today").value);
    let timeDiff = todayVal - dueDateVal;
    daysVal = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (dueDateVal.getDay() === 5 && todayVal.getDay() === 1 && daysVal === 3) {
      // Due date is Friday and receipt date is Monday, count as one day delay
      daysVal = 1;
    } else if (dueDateVal.getDay() === 6 && todayVal.getDay() === 0) {
      // Due date is Saturday and receipt date is Sunday, display a warning
      totalResult.textContent = 'Off days?';
      return;
    }

    primaryLateFee = (amt * 12 / 100) * (daysVal / 365);   // core logic
    secondaryFee = primaryLateFee * 18 / 100;
    finalResults = primaryLateFee + secondaryFee;

    lateFee.textContent = `Late : ${primaryLateFee.toFixed(2)}`;
    GST.textContent = `GST : ${secondaryFee.toFixed(2)}`;
    totalResult.textContent = `Total : ${finalResults.toFixed(2)}`;
  }
}


document.getElementById("today").style.animation = "flashing 2s infinite";

todayInput.addEventListener('input', function() {
    this.style.animation = "none";
    calc();
});

dueDate.addEventListener('input', calc);
todayInput.addEventListener('input', calc);
clearBtn.addEventListener('click', clearFields);
amount.addEventListener('input', calc);

toggleClearSwitch.addEventListener('change', () => {
  if(toggleClearSwitch.checked) {
    clearBtn.style.height = '0';
    clearBtn.style.margin = '0';
    clearBtn.style.overflow = 'hidden';
    clearBtn.style.padding = '0';
  } else {
    clearBtn.style.height = 'auto';
    clearBtn.style.margin = '10px 0';
    clearBtn.style.padding = '35px';
  }
});

toggleBtn.addEventListener('click', () => {
  if(formula.style.maxHeight){
    formula.style.maxHeight = null;
    arrow.style.transform = 'rotate(0deg)';
  } else {
    formula.style.maxHeight = formula.scrollHeight + 'px';
    arrow.style.transform = 'rotate(180deg)';
  }
});

window.addEventListener('keydown', function(e) {
  if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
    if (e.target.nodeName == 'INPUT' && e.target.type == 'text') {
      e.preventDefault();
      return false;
    }
  }
}, true);

//print button

printBtn.addEventListener('click', function() {
  let printWindow = window.open('', '_blank');
  printWindow.document.write('<html><head><title>Print</title>');
  printWindow.document.write('</head><body>');
  printWindow.document.write('<h1>Merchant Invoice Delay Interest Calculation</h1>');
  printWindow.document.write(`<p>Invoice Number: ${invoiceNumber.value}</p>`);
  printWindow.document.write(`<p>Days Delayed: ${daysVal}</p>`);
  printWindow.document.write(`<p>Fee on Delay: ${primaryLateFee.toFixed(2)}</p>`);
  printWindow.document.write(`<p>GST on Late Fee: ${secondaryFee.toFixed(2)}</p>`);
  printWindow.document.write(`<p>Total: ${Math.round(finalResults)} (${finalResults.toFixed(2)})</p>`);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
});