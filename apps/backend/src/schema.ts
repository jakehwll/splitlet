const schema = `#graphql
  scalar DateTime

  type Expense {
    id: String!
    groupId: String
    payeeId: String!
    amount: Float!
    date: DateTime!
    description: String
  }

  type ExpenseParticipant {
    id: String!
    userId: String!
    amount: Float!
  }

  type Balance {
    groupId: String
    payeeId: String!
    recipientId: String!
    amount: Float!
  }

  type Query {
    expenses: [Expense]
    expenseParticipants: [ExpenseParticipant]
    balances: [Balance]
  }
`;

export default schema;