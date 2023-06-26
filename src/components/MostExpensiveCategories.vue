<template>
    <div>
        <h2>Most expensive categories by month</h2>

        <label for="month-picker">Select Month:</label>
        <select id="month-picker" v-model="selectedMonth">
            <option v-for="month in availableMonths" :value="month" :key="month">
                {{ month }}
            </option>
        </select>

        <div v-if="sortedExpenses[selectedMonth]">
        <h3>{{ selectedMonth }}</h3>
        <ul>
            <li v-for="(amount, category, index) in sortedExpenses[selectedMonth]" :key="category">                
                <div class="category-title"><span class="index">{{ index + 1 }}</span> {{ category }}</div> 
                <div>{{ $formatCurrency(amount / 1000) }}</div>
            </li>
        </ul>
        </div>
    </div>
</template>
  
  <script>
  export default {
    props: ["transactions"],
    data() {
        return {
            selectedMonth: "",
        };
    },
    computed: {
      sortedExpenses() {
        // Flattening the transactions array to include subtransactions
        const allTransactions = this.transactions.reduce((acc, transaction) => {
          if (transaction.subtransactions && transaction.subtransactions.length > 0) {
            for (const subtransaction of transaction.subtransactions) {
                subtransaction.date = transaction.date;
                acc.push(subtransaction);
            }            
          } else {
            acc.push(transaction);
          }
          return acc;
        }, []);
  
        // Summing the spending per category grouped by month
        const expensesByMonthAndCategory = allTransactions
          .filter(
            (transaction) =>
              transaction.amount < 0 &&
              !transaction.payee_name?.includes("Transfer")
          )
          .reduce((acc, transaction) => {             
            const month = transaction.date.slice(0, 7); // Extract YYYY-MM
            if (!acc[month]) {
              acc[month] = {};
            }
            let category = transaction.category_name;
            if (category === 'Uncategorized') {
                category = transaction.account_name;
            }
            if (!acc[month][category]) {
              acc[month][category] = 0;
            }
            acc[month][category] += Math.abs(transaction.amount);
            return acc;
          }, {});
  
        // Sorting the categories by spending for each month and returning the top 5
        return Object.entries(expensesByMonthAndCategory).reduce(
          (sortedExpenses, [month, categories]) => {
            sortedExpenses[month] = Object.entries(categories)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .reduce((acc, [category, amount]) => {
                acc[category] = amount;
                return acc;
              }, {});
            return sortedExpenses;
          },
          {}
        );
      },
      availableMonths() {
        return Object.keys(this.sortedExpenses).sort();
      },
    },
    watch: {
        availableMonths(newAvailableMonths) {
            if (newAvailableMonths.length > 0) {
                this.selectedMonth = newAvailableMonths[newAvailableMonths.length - 1];
            }
        }
    },
    mounted() {
        
    },
  };
  </script>


<style scoped>
    label {
        font-size: 1em;
        margin-right: 1em;
        color: #666;
    }

    select {
        margin-bottom: 1em;
        font-size: 1em;
        padding: 0.5em;
        border: 1px solid #ccc;
        border-radius: 4px;
        color: #333;
    }

    ul {
        list-style: none;
        padding-left: 0;
    }

    li {
        font-size: 0.9em;
        padding: 0.5em;        
        margin: 0.5em 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 350px;             
    }

    .index {
        font-weight: bold;
        font-size: 2em;
        padding-right: 0.5em;
    }
    .category-title {
        display: flex;
        align-items: center;
    }
</style>

  