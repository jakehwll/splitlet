export const schema = `#graphql
  scalar DateTime

  type User {
    id: String!
  }

  type Expense {
    id: String!
    payerId: String!
    payer: User!
    total: Float!
    date: DateTime!
    description: String
    expenseSplits: [ExpenseSplit!]!
  }

  type ExpenseSplit {
    id: String!
    userId: String!
    user: User!
    amount: Float!
  }

  type LedgerBalance {
    debtorId: String!
    creditorId: String!
    balance: Float!
    debtor: User!
    creditor: User!
  }

  type NetDebtSummary {
    userId: String!
    totalYouOwe: Float!
    totalOwedToYou: Float!
  }

  type LedgerBalancesSummary {
    owedToYou: [LedgerBalance!]!
    youOwe: [LedgerBalance!]!
  }

  input ExpenseSplitInput {
    userId: String!
    amount: Float!
  }

  input AddExpenseInput {
    description: String
    total: Float!
    date: DateTime!
    splits: [ExpenseSplitInput!]!
  }

  type Query {
    me: NetDebtSummary
    ledgerBalances: LedgerBalancesSummary!
  }

  type Mutation {
    addExpense(input: AddExpenseInput!): Expense!
    recalculateNetDebtSummary: NetDebtSummary!
  }
`;
