const amount = document.querySelector('#amount');
const days = document.querySelector('#days');
const result = document.querySelector('#result');
const clearBtn = document.querySelector('#clear');
const toggleBtn = document.querySelector('#toggleBtn');
const formula = document.querySelector('#formula');
const arrow = document.querySelector('#arrow');
const toggleClearSwitch = document.querySelector('#toggleClear');

function clearFields(){
  amount.value = '';
  days.value = '';
  result.textContent = 'Result';
}

function calc(event){
  if(amount.value !== '' && days.value !== '') {
    let amt = Number(amount.value);
    let daysVal = Number(days.value);
    let midResults = (amt*12/100)*(daysVal/365);
    let finalResults = midResults + (midResults*18/100);
    result.textContent = `${Math.round(finalResults)} (${finalResults.toFixed(2)})`;
  } else if(days.value === '' || amount.value === '') {
    result.textContent = 'Result';
  }
}

clearBtn.addEventListener('click', clearFields);
amount.addEventListener('input', calc);
days.addEventListener('input', calc);

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
  if (e.key === 'Delete') {
    clearFields();
  }
});
