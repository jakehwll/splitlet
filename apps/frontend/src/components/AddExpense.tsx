import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { z } from "zod";
import { gql, useMutation } from "@apollo/client";

const ADD_EXPENSE_MUTATION = gql`
  mutation AddExpense($input: AddExpenseInput!) {
    addExpense(input: $input) {
      id
      total
      description
      date
    }
  }
`;

const formSchema = z.object({
  description: z.string().min(1),
  total: z
    .number()
    .refine(
      (val) => {
        return Number.isFinite(val) && Math.round(val * 100) === val * 100;
      },
      {
        message: "Must be a multiple of 0.01",
      }
    )
    .min(0.01),
  date: z.date(),
  splits: z.array(
    z.object({
      userId: z.string().min(1, "User is required"),
      amount: z.number().min(0.01, "Amount must be greater than 0"),
    })
  ),
});

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <div>
          {field.state.meta.errors.map((error) => (
            <div key={error.path}>{error.message}</div>
          ))}
        </div>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

const AddExpense = () => {
  const [addExpense, { loading }] = useMutation(ADD_EXPENSE_MUTATION);

  const form = useForm({
    defaultValues: {
      description: "",
      total: 0,
      date: new Date(),
      splits: [{ userId: "", amount: 0 }],
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: async (values) => {
      try {
        await addExpense({
          variables: {
            input: {
              description: values.value.description,
              total: values.value.total,
              date: values.value.date,
              splits: values.value.splits,
            },
          },
        });
        // Reset form on success
        form.reset();
        // You might want to add a success toast/notification here
      } catch (error) {
        console.error(error);
        // You might want to add an error toast/notification here
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-2"
    >
      <div className="w-full">
        <form.Field
          name="description"
          children={(field) => (
            <>
              <input
                className="border w-full p-2 rounded"
                type="text"
                placeholder="Description"
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          )}
        />
      </div>
      <div className="w-full">
        <form.Field
          name="total"
          children={(field) => (
            <>
              <input
                className="border w-full p-2 rounded"
                type="number"
                step="0.01"
                placeholder="Amount"
                value={field.state.value as number}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(parseFloat(e.target.value))}
              />
              <FieldInfo field={field} />
            </>
          )}
        />
      </div>
      <div className="w-full">
        <form.Field
          name="date"
          children={(field) => (
            <>
              <input
                className="border w-full p-2 rounded"
                type="date"
                value={field.state.value?.toISOString().split("T")[0]}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(new Date(e.target.value))}
              />
              <FieldInfo field={field} />
            </>
          )}
        />
      </div>
      <div className="w-full">
        <form.Field
          name="splits"
          children={(field) => (
            <div className="space-y-2">
              <h3 className="font-medium">Split Expense</h3>
              {field.state.value.map((split, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    className="border rounded p-2 flex-1"
                    value={split.userId}
                    onChange={(e) => {
                      const newSplits = [...field.state.value];
                      newSplits[index].userId = e.target.value;
                      field.handleChange(newSplits);
                    }}
                  >
                    <option value="">Select User</option>
                    {/* Add your user options here */}
                    <option value="user1">User 1</option>
                    <option value="user2">User 2</option>
                  </select>
                  <input
                    className="border rounded p-2 w-32"
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    value={split.amount}
                    onChange={(e) => {
                      const newSplits = [...field.state.value];
                      newSplits[index].amount = parseFloat(e.target.value);
                      field.handleChange(newSplits);
                    }}
                  />
                  <button
                    type="button"
                    className="px-3 py-2 bg-red-500 text-white rounded"
                    onClick={() => {
                      const newSplits = field.state.value.filter((_, i) => i !== index);
                      field.handleChange(newSplits);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="px-3 py-2 bg-blue-500 text-white rounded"
                onClick={() => {
                  field.handleChange([...field.state.value, { userId: "", amount: 0 }]);
                }}
              >
                Add Split
              </button>
              <FieldInfo field={field} />
            </div>
          )}
        />
      </div>
      <div className="w-full mt-4">
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 bg-green-500 rounded-md text-white font-medium w-full disabled:bg-green-300"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default AddExpense;
