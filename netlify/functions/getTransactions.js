const ynab = require("ynab");

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const data = JSON.parse(event.body);

    const budgetId = data.budget_id;
    const startDate = data.start_date;
    const token = data.token;

    const ynabAPI = new ynab.API(token);
    const response = await ynabAPI.transactions.getTransactions(budgetId, startDate);
    
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.info({error})
    return { statusCode: 500, body: error.toString() };
  }
};