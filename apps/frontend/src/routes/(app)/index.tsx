import { gql } from "@repo/graphql";
import { useQuery } from "@apollo/client";
import AddExpense from "../../components/add-expense";
import { Button } from "../../components/base/buttons/button";
import { toast } from "../../utils/toast";

const LIST_BALANCES_QUERY = gql(`
  query ListBalances {
    ledgerBalances {
      owedToYou {
        balance
        debtor {
          id
        }
      }
      youOwe {
        balance
        creditor {
          id
        }
      }
    }
  } 
`);

const Index = () => {
  const { data: balances } = useQuery(LIST_BALANCES_QUERY, {});

  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl text-white font-serif">Welcome back!</h1>
          <p>Here is a list of your current balances...</p>
        </div>
        <AddExpense />
      </header>
      <section>
        {balances && (
          <>
            <h2 className="text-lg text-white font-serif">Owed to you</h2>
            <pre>{JSON.stringify(balances.ledgerBalances.owedToYou, null, 2)}</pre>
            <h2 className="text-lg text-white font-serif">You owe</h2>
            <pre>{JSON.stringify(balances.ledgerBalances.youOwe, null, 2)}</pre>
          </>
        )}
      </section>
    </>
  );
};

export default Index;
