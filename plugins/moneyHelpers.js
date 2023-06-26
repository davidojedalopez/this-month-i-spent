export default ({ app }, inject) => {
  // Define your helper function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Inject your helper function into the Vue instance
  inject('formatCurrency', formatCurrency);
}; 