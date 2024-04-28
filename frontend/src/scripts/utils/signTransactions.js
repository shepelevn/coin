export default signTransactions;

function signTransactions(data) {
  const transactions = data.transactions;

  for (const transaction of transactions) {
    if (transaction.from === data.account) {
      transaction.amount *= -1;
    }
  }
}
