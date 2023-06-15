const ynab = require("ynab");

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const data = JSON.parse(event.body);

    const budgetId = data.budgetId;
    const startDate = data.startDate;

    const ynabAPI = new ynab.API(process.env.YNAB_API_KEY);
    
    const response = await ynabAPI.transactions.getTransactions(budgetId, startDate);
    
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};