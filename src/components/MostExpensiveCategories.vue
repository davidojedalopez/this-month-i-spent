<template>
    <div>
      <h2>Most expensive categories</h2>
        <ul>
            <li v-for="(amount, category) in sortedExpenses" :key="category">
                {{ category }}: {{ $formatCurrency(amount / 1000) }}
            </li>
        </ul>
    </div>
  </template>
  
<script>
export default {
    props: ['transactions'],
    computed: {
        sortedExpenses() {
            // Flattening the transactions array to include subtransactions
            const allTransactions = this.transactions.reduce((acc, transaction) => {
                if (transaction.subtransactions && transaction.subtransactions.length > 0) {
                    // Use subtransactions instead of the parent transaction                    
                    acc.push(...transaction.subtransactions.map(subtransaction => subtransaction));
                } else {
                    acc.push(transaction);
                }
                return acc;
            }, []);

            // Summing the spending per category
            
            const expensesByCategory = allTransactions
                .filter(transaction => {
                    console.info(transaction.payee_name)
                    if(!transaction.payee_name) {
                        console.info({transaction})
                    }
                    return transaction.amount < 0 && !transaction.payee_name?.includes('Transfer')
                })
                .reduce((acc, transaction) => {
                    if (!acc[transaction.category_name]) {
                        acc[transaction.category_name] = 0;
                    }
                    acc[transaction.category_name] += Math.abs(transaction.amount);
                    return acc;
                }, {});
                
            // Sorting the categories by spending and returning the top 5
            return Object.entries(expensesByCategory)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .reduce((acc, [category, amount]) => {
                    acc[category] = amount;
                    return acc;
                }, {});
         
        }
    }
};
</script>
  
  
  
  
  
  
  