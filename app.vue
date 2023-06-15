<template>
  <div id="app">

    <div class="container">

      <!-- Display a loading message if loading -->
      <h1 v-if="loading" class="display-4">Loading...</h1>

      <!-- Display an error if we got one -->
      <div v-if="error">
        <h1 class="display-4">Oops!</h1>
        <p class="lead">{{error}}</p>
        <button class="btn btn-primary" @click="resetToken">Try Again &gt;</button>
      </div>

      <!-- Otherwise show our app contents -->
      <div v-else>

        <!-- If we dont have a token ask the user to authorize with YNAB -->
        <form v-if="!ynab.token">
          <h1 class="display-4">Income and spending calendar view</h1>
          <p class="lead">Your outflows and inflows in a calendar-like view.</p>
          <p>The bigger the icon, the bigger the amount.</p>            
                
          <div class="form-group">
            <br>         
            <button @click="authorizeWithYNAB" class="cool-button">Authorize this app with YNAB 👈</button>
            <p class="small-text">I don't store anything in any server. The authorization lasts 2 hours, and it has read-only permissions.</p>
          </div>
        </form>

        <!-- Otherwise if we have a token, show the budget select -->
        <!-- <Budgets v-else-if="!budgetId" :budgets="budgets" :selectBudget="selectBudget" /> -->

        <!-- If a budget has been selected, display transactions from that budget -->
        <div v-else>          
          <TransactionsByDay :transactionsByDay="transactionsByDay" />
          <!-- <button class="btn btn-info" @click="budgetId = null">&lt; Select Another Budget</button> -->
        </div>

      </div>

    </div>
  </div>
</template>

<script>
// Hooray! Here comes YNAB!
/* import * as ynab from 'ynab'; */

// Import our config for YNAB
import config from './config.json';

// Import Our Components to Compose Our App
import Budgets from './src/components/Budgets.vue';
import TransactionsByDay from './src/components/TransactionsByDay.vue';


export default {
  // The data to feed our templates
  data () {
    return {
      ynab: {
        clientId: config.clientId,
        redirectUri: config.redirectUri,
        token: null,
        api: null,
      },
      loading: false,
      error: null,
      budgetId: "default",
      budgets: [],
      transactions: [],
      transactionsMaximumAmount: null,
      transactionsMinimumAmount: null,
      transactionsByDay: []
    }
  },
  // When this component is created, check whether we need to get a token,
  // budgets or display the transactions
  mounted() {
    this.ynab.token = this.findYNABToken();
    if (this.ynab.token) {
      /* this.api = new ynab.api(this.ynab.token); */
      this.selectBudget(this.budgetId);
    }
  },
  methods: {        
    // This selects a budget and gets all the transactions in that budget
    selectBudget(id) {
      this.loading = true;
      this.error = null;
      this.budgetId = id;
      this.transactions = [];

      const startDate = new Date(); 
      let formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-01`;

      console.info("Calling Netlify function...");
      fetch("/.netlify/functions/getTransactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          budget_id: id, 
          start_date: formattedStartDate, 
          token: this.ynab.token
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      }).then((data) => {
        this.transactions = data.transactions;
        // Assuming 'transactions' is the array of transaction objects
        let transactions = this.transactions.filter(transaction => transaction.category_id !== null);

        if (transactions && transactions.length > 0) {
          let minTransaction = Math.min(...transactions.map(t => t.amount / 1000));
          let maxTransaction = Math.max(...transactions.map(t => t.amount / 1000));

          this.transactionsMaximumAmount = maxTransaction;
          this.transactionsMinimumAmount = minTransaction;
        } else {
          console.log('No transactions found');
        }

        let groupedTransactions = transactions.reduce((groups, transaction) => {
          let transactionDay = Number(transaction.date.split('-')[2]) // get the day of the month
          let transactionAmount = transaction.amount / 1000; // convert to decimal

          if (!groups[transactionDay]) {
            groups[transactionDay] = { income: 0, spending: 0, transactions: [] }; // if no object exists for this day, create one
          }

          groups[transactionDay].transactions.push(transaction); // add the transaction to the transactions array for this day

          if (transactionAmount > 0) {
            groups[transactionDay].income += transactionAmount; // if the transaction represents an income, add it to the income sum
          } else {
            groups[transactionDay].spending += transactionAmount; // if the transaction represents a spending, add it to the spending sum
          }

          return groups;
        }, {});

      this.transactionsByDay = groupedTransactions;

      }).catch((err) => {
        this.error = "Error fetching transaction data: " + error;
      }).finally(() => {
        this.loading = false;
      });
    },
    // This builds a URI to get an access token from YNAB
    // https://api.youneedabudget.com/#outh-applications
    authorizeWithYNAB(e) {
      e.preventDefault();
      const uri = `https://app.youneedabudget.com/oauth/authorize?client_id=${this.ynab.clientId}&redirect_uri=${this.ynab.redirectUri}&response_type=token&scope=read-only`;
      location.replace(uri);
    },
    // Method to find a YNAB token
    // First it looks in the location.hash and then sessionStorage
    findYNABToken() {
      let token = null;
      const search = window.location.hash.substring(1).replace(/&/g, '","').replace(/=/g,'":"');
      if (search && search !== '') {
        // Try to get access_token from the hash returned by OAuth
        const params = JSON.parse('{"' + search + '"}', function(key, value) {
          return key === '' ? value : decodeURIComponent(value);
        });
        token = params.access_token;
        sessionStorage.setItem('ynab_access_token', token);
        window.location.hash = '';
      } else {
        // Otherwise try sessionStorage
        token = sessionStorage.getItem('ynab_access_token');
      }
      return token;
    },
    // Clear the token and start authorization over
    resetToken() {
      sessionStorage.removeItem('ynab_access_token');
      this.ynab.token = null;
      this.error = null;
    }    
  },
  computed: {
    spendingColorMap() {
      return (group) => {
        const baseRedness = 80; // This value sets the minimum redness
        let spendingPercentage = Math.abs(group.spending / this.transactionsMinimumAmount);
        spendingPercentage = Math.max(0, Math.min(1, spendingPercentage));
        let redness = baseRedness + Math.round(spendingPercentage * (255 - baseRedness)); // Subtract the base redness from the maximum possible value
        return `rgb(${redness}, 0, 0)`;
      }
    },
    incomeColorMap() {
      return (group) => {
        const baseGreenness = 80;
        let incomePercentage = Math.abs(group.income / this.transactionsMaximumAmount);
        incomePercentage = Math.max(0, Math.min(1, incomePercentage));
        let greenness = baseGreenness + Math.round(incomePercentage * (255 - baseGreenness));
        return `rgb(0, ${greenness}, 0)`;
      }
    },
    iconSize() {
      return (amount) => {        
        const baseSize = 28; // You can adjust this base size
        const maxSize = 64;
        const scale = 0.002; // Scale factor, adjust based on your preference
        return `${Math.min(baseSize + (amount * scale), maxSize)}px`;
      }
    },
  },
  provide() {
    return {
      spendingColor: this.spendingColorMap,
      incomeColor: this.incomeColorMap,
      iconSize: this.iconSize
    }
  },
  // Specify which components we want to make available to our templates
  components: {
    Budgets,
    TransactionsByDay
  }
}
</script>

<style scopped>
body {
  font-size: 1.5rem;
}

.cool-button {
  display: inline-block;
  font-weight: 700;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  padding: 0.5em 1em;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.375em;
  background-color: #3b82f6;
  color: white;
  border: none;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.cool-button:hover {
  background-color: #2563eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cool-button:active {
  background-color: #1d4ed8;
}

.small-text {
  font-size: 0.75em;
}
</style>