<template>
  <div>
    <h2>Transactions by Day</h2>
    <div class="calendar-grid">
      <div 
        class="calendar-day" 
        v-for="day in 31" 
        :key="day" 
        :class="{ 'empty-day': !transactionsByDay[day] }"
      >
        <h3>{{ day }}</h3>
        <div v-if="transactionsByDay[day]" class="flex-container">

          <div v-if="transactionsByDay[day].income > 0" class="tooltip">
            <svg fill="rgb(0, 124, 0)" :width="iconSize(transactionsByDay[day].income)" :height="iconSize(transactionsByDay[day])" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
              <path fill-rule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clip-rule="evenodd" />
              <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
            </svg>
            <span class="tooltiptext">{{  `Income: $${transactionsByDay[day].income}` }}</span>
          </div>
          <div v-else class="placeholder"></div>

                  
          <div v-if="Math.abs(transactionsByDay[day].spending) > 0" class="tooltip">
            <svg fill="rgb(180, 0, 0)" :width="iconSize(Math.abs(transactionsByDay[day].spending))" :height="iconSize(transactionsByDay[day])" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clip-rule="evenodd" />
            </svg>
            <span class="tooltiptext">{{  `Spending: $${Math.abs(transactionsByDay[day].spending)}` }}</span>
          </div>
          <div v-else class="placeholder"></div>
                    
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['transactionsByDay'],
  inject: ['spendingColor', 'incomeColor', 'iconSize']
};
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* Adjust this value according to your layout preferences */
  grid-gap: 10px;
}

.calendar-day {
  border: 1px solid #ccc;
  padding: 10px;
  min-height: 100px; /* Adjust this based on your expected maximum icon size */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* This makes sure content is spaced vertically */
}

.empty-day {
  background-color: #f8f8f8;
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.placeholder {
  flex-grow: 1;
}
</style>
