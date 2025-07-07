const schema = `#graphql
  scalar DateTime

  type User {
    id: String!
  }

  type Expense {
    id: String!
    groupId: String
    payeeId: String!
    payee: User!
    amount: Float!
    date: DateTime!
    description: String
    participants: [ExpenseParticipant]
  }

  type ExpenseParticipant {
    id: String!
    userId: String!
    user: User!
    amount: Float!
  }

  type Balance {
    groupId: String
    payeeId: String!
    payee: User!
    recipientId: String!
    recipient: User!
    amount: Float!
  }

  type Query {
    expenses: [Expense]
    expenseParticipants: [ExpenseParticipant]
    balances: [Balance]
  }
`;

export default schema;
