<template>
    <h1>Random reports</h1>
    
    <Calendar :transactionsByDay="transactionsByDay" />
           
</template>

<script>
import Calendar from './Calendar.vue';

export default {
  data () {
    return {
    }
  },
  props: ['transactionsByDay', 'transactions'],
  inject: ['spendingColor', 'incomeColor', 'iconSize'],
  components: {
    Calendar
  }
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
