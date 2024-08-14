// DOM Elements
const themeSelect = document.getElementById('theme-select');
const darkModeToggle = document.getElementById('toggle-dark-mode');
const settingsIcon = document.getElementById('settings-icon');
const settingsOptions = document.getElementById('settings-options');
const modeButtons = document.querySelectorAll('.mode-btn');
const calculatorPanel = document.getElementById('calculator');
const currencyConverterPanel = document.getElementById('currency-converter');
const calcButtons = document.querySelectorAll('.calc-btn');
const resultDisplay = document.getElementById('result');
const currencyFrom = document.getElementById('currency-from');
const currencyTo = document.getElementById('currency-to');
const convertBtn = document.getElementById('convert-btn');
const conversionResult = document.getElementById('conversion-result');


let currentTheme = 'default';

// Event Listeners
themeSelect.addEventListener('change', changeTheme);
darkModeToggle.addEventListener('click', toggleDarkMode);
settingsIcon.addEventListener('click', toggleSettings);
modeButtons.forEach(button => button.addEventListener('click', switchMode));
calcButtons.forEach(button => button.addEventListener('click', handleCalcButtonClick));
convertBtn.addEventListener('click', convertCurrency);

// Initialize
initializeCurrencyOptions();

function changeTheme() {
    currentTheme = themeSelect.value;
    document.body.className = currentTheme;
    applyThemeToButtons(currentTheme); // Apply theme to buttons
    closeSettings();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    closeSettings();
}

function toggleSettings() {
    settingsOptions.classList.toggle('hidden');
}

function switchMode(event) {
    const selectedMode = event.target.id;

    modeButtons.forEach(button => button.classList.remove('active'));
    event.target.classList.add('active');

    if (selectedMode === 'calculator-mode') {
        calculatorPanel.classList.add('active');
        currencyConverterPanel.classList.remove('active');
    } else {
        calculatorPanel.classList.remove('active');
        currencyConverterPanel.classList.add('active');
    }
}

function handleCalcButtonClick(event) {
    const value = event.target.getAttribute('data-value');

    if (value === '=') {
        try {
            resultDisplay.value = eval(resultDisplay.value);
        } catch {
            resultDisplay.value = 'Error';
        }
    } else if (value === 'AC') {
        resultDisplay.value = '';
        
    } else if (value === '⌫') {  // Handle the Erase button
        resultDisplay.value = resultDisplay.value.slice(0, -1);
    } else {
        resultDisplay.value += value;
    }
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('currency-input').value);
    const fromCurrency = currencyFrom.value;
    const toCurrency = currencyTo.value;

    if (isNaN(amount)) {
        conversionResult.textContent = 'Please enter a valid amount';
        return;
    }

    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then(response => response.json())
        .then(data => {
            const rate = data.rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(2);
            conversionResult.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        })
        .catch(() => {
            conversionResult.textContent = 'Error fetching exchange rate';
        });
}

function initializeCurrencyOptions() {
    const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD"];

    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency;
        option1.textContent = currency;
        currencyFrom.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = currency;
        option2.textContent = currency;
        currencyTo.appendChild(option2);
    });

    currencyFrom.value = 'USD';
    currencyTo.value = 'EUR';
}

function applyThemeToButtons(theme) {
    calcButtons.forEach(button => {
        button.className = `calc-btn ${theme}`;
    });

    modeButtons.forEach(button => {
        button.className = `mode-btn ${theme}`;
    });
}

function closeSettings() {
    settingsOptions.classList.add('hidden');
}
