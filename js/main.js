document.addEventListener('DOMContentLoaded', function () {
  const days = 1000 * 60 * 60 * 24; // мс * сек * хв * год
  const hours = 1000 * 60 * 60;
  const minutes = 1000 * 60;
  const seconds = 1000;
  let period // Значення за замовчуванням

  const startInput = document.getElementById('start');
  const endInput = document.getElementById('end');

  const choosePeriod = document.querySelector('.choose_period');
  const chooseOptions = document.querySelector('.choose_days_type');

  const resultOutput = document.querySelector('.result');
  const lastDatesList = document.querySelector('.ListOf ol');

  const inputValues = {
    first_date: '',
    second_date: '',
  };

  startInput.addEventListener('change', changeInput);
  endInput.addEventListener('change', changeInput);

  function changeInput() {
    const startDate = new Date(startInput.value);
    const endDate = new Date(endInput.value);

    inputValues.first_date = startDate;
    inputValues.second_date = endDate;
  }

  choosePeriod.addEventListener('change', function (ev) {
    const periodValue = ev.target.value;

    if (periodValue === 'days') {
      period = days;
    } else if (periodValue === 'hours') {
      period = hours;
    } else if (periodValue === 'minutes') {
      period = minutes;
    } else if (periodValue === 'seconds') {
      period = seconds;
    }
  });

  chooseOptions.addEventListener('change', calculate);

  const calculateButton = document.querySelector('.result_btn');
  calculateButton.addEventListener('click', calculate);

  const weekPresetButton = document.querySelector('.week_preset');
  const monthPresetButton = document.querySelector('.month_preset');

  weekPresetButton.addEventListener('click', addWeekPreset);
  monthPresetButton.addEventListener('click', addMonthPreset);


    function calculate() {
      const startDate = new Date(startInput.value);
      const endDate = new Date(endInput.value);
  
      const optionValue = chooseOptions.value;
  
      let result;
      if (optionValue === 'all_days') {
        result = calculateAllDays(startDate, endDate, period);
      } else if (optionValue === 'work_days') {
        result = calculateWorkDays(startDate, endDate, period);
      } else if (optionValue === 'days_off') {
        result = calculateDaysOff(startDate, endDate, period);
      }
  

    resultOutput.textContent = result;
    saveLastResult(startDate, endDate, result);
    updateLastResultsList();
  }

  function addWeekPreset() {
    const today = new Date();
    const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    startInput.value = today.toISOString().slice(0, 10);
    endInput.value = nextWeek.toISOString().slice(0, 10);
  }

  function addMonthPreset() {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    startInput.value = today.toISOString().slice(0, 10);
    endInput.value = nextMonth.toISOString().slice(0, 10);
  }

  function calculateAllDays(startDate, endDate, period) {
    const diff = endDate.getTime() - startDate.getTime();

    let result;
    if (period === days) {
      result = Math.ceil(diff / period) + ' days';
    } else if (period === hours) {
      result = Math.ceil(diff / period) + ' hours';
    } else if (period === minutes) {
      result = Math.ceil(diff / period) + ' minutes';
    } else if (period === seconds) {
      result = Math.ceil(diff / period) + '  seconds';
    }

    return result;
  }

  function calculateWorkDays(startDate, endDate, period) {
    let count = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    let result;
    if (period === days) {
      result = count + ' days';
    } else if (period === hours) {
      result = count * 24 + ' hours';
    } else if (period === minutes) {
      result = count * 24 * 60 + ' minutes';
    } else if (period === seconds) {
      result = count * 24 * 60 * 60 + ' seconds';
    }

    return result;
  }

  function calculateDaysOff(startDate, endDate, period) {
    let count = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
      const day = current.getDay();
      if (day === 0 || day === 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    let result;
    if (period === days) {
      result = count + ' days';
    } else if (period === hours) {
      result = count * 24 + ' hours';
    } else if (period === minutes) {
      result = count * 24 * 60 + ' minutes';
    } else if (period === seconds) {
      result = count * 24 * 60 * 60 + ' seconds';
    }

    return result;
  }

  function saveLastResult(startDate, endDate, result) {
    const lastDates = JSON.parse(localStorage.getItem('lastDates')) || [];

    lastDates.push({ startDate: startDate.toString(), endDate: endDate.toString(), result });

    if (lastDates.length > 10) {
      lastDates.shift();
    }

    localStorage.setItem('lastDates', JSON.stringify(lastDates));
  }

  function updateLastResultsList() {
    const lastDates = JSON.parse(localStorage.getItem('lastDates')) || [];

    const newArr = lastDates.map(
      (item) =>
        `<li>${new Date(item.startDate).toLocaleDateString()} ${new Date(
          item.endDate
        ).toLocaleDateString()} ${item.result}</li>`
    );

    const list = newArr.join('');
    lastDatesList.innerHTML = list;
  }

  // Оновлення списку останніх результатів при завантаженні сторінки
  updateLastResultsList();
});
