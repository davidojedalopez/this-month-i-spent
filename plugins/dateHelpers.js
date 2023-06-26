export default ({}, inject) => {
    inject('getPreviousMonth', (inputDate) => {
      if (!inputDate) {
        inputDate = new Date();
      }
  
      let date = new Date(inputDate);
      let year = date.getFullYear();
      let month = date.getMonth();
  
      if (month === 0) {
        month = 11;
        year--;
      } else {
        month--;
      }
  
      return new Date(year, month);
    });
  };
  