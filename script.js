'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BAKING APP

// Data
const account1 = {
  owner: 'Akash Panwar',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-10-30T17:01:17.194Z',
    '2021-11-02T06:36:17.929Z',
    '2021-11-03T10:51:36.790Z',
  ],
  currency: 'INR', // Indian Rupee
  locale: 'hi-IN', // Hindi-India
};

const account2 = {
  owner: 'Prashant Patel',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'INR', // Indian Rupee
  locale: 'hi-IN', // Hindi-India
};

const account3 = {
  owner: 'Sumer Patel',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'GBP', // Great Britain Pound
  locale: 'en-GB', // English-Great Britain
};

const account4 = {
  owner: 'Adesh Sharma',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD', // US Dollar
  locale: 'en-US', // English - US
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// ----------- Computing Usernames
const computeUsernames = function(acc){
  acc.forEach(function(ac){
    ac.userName = ac.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};
computeUsernames(accounts);

// ----- Timer Function
const startLogOutTimer = function(){
  let t = 5*60;
  const tick = function(){
    const min = String(Math.trunc(t/60)).padStart(2, 0);
    const sec = String(t%60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    
    if(t === 0){
      clearInterval(timer);
      // Loging out user and Undisplay UI and Welcome Message
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Login to get started`;
    }
    t--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// --------- Dates Function
const formateMovementsDates = function(date, local='en-US'){
  
  const calcDaysPassed = (day1, day2)=>Math.round(Math.abs( (day1-day2) / (1000*60*60*24) ));
  const daysPassed = calcDaysPassed(new Date(), date);
  if(daysPassed == 0) return 'TODAY';
  if(daysPassed == 1) return 'YESTERDAY';
  if(daysPassed <= 7) return `${daysPassed} DAYS AGO`;

  // const day = date.getDate();
  // const month = date.getMonth() + 1;
  // const year = date.getFullYear();
  
  // return `${day}/${month}/${year}`;

  // Another way
  return new Intl.DateTimeFormat(local).format(date);
};

// function for formating currency
const formateCurrency = function (value, locale, currency){
  return new Intl.NumberFormat(locale, {style: 'currency',
                                        currency: currency,
                                      useGrouping: true}).format(value);
};
// ----------- Creating DOM Element
const displayMovements = function(acc, sort = false){
  const moves = sort ? acc.movements.slice().sort((a,b)=> a-b) : acc.movements;
  containerMovements.innerHTML = '';
  moves.forEach(function(value, i){
    const formatedMov = formateCurrency(value, currentAccount.locale, currentAccount.currency);
    const date = new Date(acc.movementsDates[i]);
    const dateDisplay = formateMovementsDates(date, currentAccount.locale);
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__date">${dateDisplay}</div>
      <div class="movements__value">${formatedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};



// ---------- Calculating and Displaying Account Balance
// acc -> account
const calcDisplayBalance = function(acc){
  // Display Balance Date
  const now = new Date(acc.movementsDates[acc.movementsDates.length-1]);
  // const day = String(now.getDate()).padStart(2, 0);
  // const month = String((now.getMonth() + 1)).padStart(2, 0);
  // const year = now.getFullYear();
  // const hour = String(now.getHours()).padStart(2,0);
  // const min = String(now.getMinutes()).padStart(2, 0);
  // const displayDate = `${day}/${month}/${year}, ${hour}:${min}`;

  // Another way
  const option = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: '2-digit', // numeric, 2-digit, long
    year: '2-digit',
    // weekday: 'long',
  };
  const displayDate = new Intl.DateTimeFormat(currentAccount.locale, option).format(now);
  labelDate.textContent = displayDate;

  // calculating balance
  acc.balance = acc.movements.reduce((sum, cur) => sum+cur, 0);
  // displaying balance
  const formatedBalance =formateCurrency(acc.balance, currentAccount.locale, currentAccount.currency);
  labelBalance.textContent = `${formatedBalance}`; 
};


// ----------Displaying Summary
const displaySummary = function(acc){
  // Calculating and Displaying the INs
  const incomes = acc.movements.filter(mov => mov>0).reduce((acc, mov)=> acc+mov,0);
  // labelSumIn.textContent = `${(incomes).toFixed(2)}€`;
  labelSumIn.textContent = formateCurrency(incomes, currentAccount.locale, currentAccount.currency);

  // Calculating and Displaying the OUTs
  const out = acc.movements.filter(mov=> mov<0).reduce((acc, mov)=> acc+mov, 0) * -1;
  // labelSumOut.textContent = `${(out).toFixed(2)}€`;
  labelSumOut.textContent = formateCurrency(out, currentAccount.locale, currentAccount.currency);

  // Calculating and Displaying the INTREST
  // Intrest is to be added if it is greater or equal to 1
  const rate = acc.interestRate;
  const intrest = acc.movements.filter(mov=> mov>0).map(mov=> (mov * rate)/100)
  .filter(mov=> mov>=1).reduce((acc,mov)=> acc+mov, 0).toFixed(2);

  // labelSumInterest.textContent = `${(intrest).toFixed(2)}€`;
  labelSumInterest.textContent = formateCurrency(intrest, currentAccount.locale, currentAccount.currency);
};

// ---- Display UI
const displayUI = function(acc){
  // Displaying Movements
  displayMovements(acc);

  // Displaying Balance
  calcDisplayBalance(acc);

  // Displaying Summary
  displaySummary(acc);
};

// -------- Handling Events

// Login Event
let currentAccount, timer;

btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  
  // Cradential check
  currentAccount = accounts.find(acc => inputLoginUsername.value === acc.userName);

  console.log(currentAccount);

  if( currentAccount?.pin === Number(inputLoginPin.value) ){
    // Display UI and Welcome Message
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Good Day, ${currentAccount.owner.split(' ')[0]}!`;

    // Emptying the login field
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    // Displaying UI
    displayUI(currentAccount);

    // checking if timer exist already
    // if exist we need to clear it
    if(timer){
      clearInterval(timer);
    }
    // seting out timer
    timer = startLogOutTimer();
  }

});

// Implementing Transfer Event
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);

  // checking if reciver Account exist or not
  const reciverAccount = accounts.find(acc=> acc.userName === inputTransferTo.value);
  console.log(reciverAccount);

  // clear the transfer form inputs
  inputTransferAmount.value = inputTransferTo.value = ""; 

  // Transfer the Amount if the below three condition are satisfied
  // 1. reciverAccount is valid 
  // 2. The Account should be greater or atlest equal to the transfer amount
  // 3. The currentAccount and the reciverAccount should not be same
  if(reciverAccount && transferAmount <= currentAccount.balance && currentAccount.userName !== reciverAccount.userName){
    // finally transer the amount
    reciverAccount.movements.push(transferAmount);
    reciverAccount.movementsDates.push(new Date());
    currentAccount.movements.push(-transferAmount);
    currentAccount.movementsDates.push(new Date());
    // after transfering update the UI
    displayUI(currentAccount);
    console.log('Transfer Valid');
  }

  // Reseting the timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

// Implementing close account or delete user Event
btnClose.addEventListener('click', function(e){
  e.preventDefault();

  const closeUserName = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);

  if(currentAccount.userName === closeUserName && currentAccount.pin === closePin){
    const index = accounts.findIndex(acc=> acc.userName === currentAccount.userName);
    console.log(index);
    accounts.splice(index, 1);
    console.log('deleted');

    // hiding the UI container
    containerApp.style.opacity = 0;
  }

  inputClosePin.value = inputCloseUsername.value = '';

});

// Request a Loan Event
// Condition for a Loan to be Pass
// The account that request the loan should once have the deposit of 10 Percent of requested amount
// The requested amount should be greater than Zero
btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const requestedAmount = Math.floor(inputLoanAmount.value);

  // checking if the account having 10 percent deposit of request or not
  const isHaving = currentAccount.movements.some(mov=> mov >= 0.1 * requestedAmount);

  // clearing loan form inputs
  inputLoanAmount.value = '';

  // if isHaving is true than deposit the loan into that account
  // and update the UI
  if(isHaving && requestedAmount > 0){
    currentAccount.movements.push(requestedAmount);
    currentAccount.movementsDates.push(new Date());
    setTimeout(()=> displayUI(currentAccount), 3 * 1000);
  }

  // Reseting the timer
  clearInterval(timer);
  timer = startLogOutTimer();
}); 

// Handling Sort Event
let state = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  state = !state;
  displayMovements(currentAccount, state);
});

// 

/////////////////////////////////////////////////
/////////////////////////////////////////////////