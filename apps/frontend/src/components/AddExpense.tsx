import { Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { Input } from "./base/input/input";
import { Select } from "./base/select/select";
import { Button } from "./base/buttons/button";
import { Plus, Trash01 } from "@untitledui/icons";
import { ButtonUtility } from "./base/buttons/button-utility";
import { gql } from "@repo/graphql";

const ADD_EXPENSE_MUTATION = gql(`
  mutation AddExpense($input: AddExpenseInput!) {
    addExpense(input: $input) {
      id
      total
      description
      date
    }
  }
`);

const formSchema = z.object({
  description: z
    .string({
      error: "Description is required",
    })
    .min(1, {
      error: "Description must be at least 1 character",
    }),
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
    .min(0.01, {
      message: "Total must be greater than 0.",
    }),
  date: z.date(),
  splits: z.array(
    z.object({
      userId: z.string().min(1, "User is required"),
      amount: z.number().min(0.01, "Amount must be greater than 0"),
    })
  ),
});

const AddExpense = () => {
  const [addExpense, { loading }] = useMutation(ADD_EXPENSE_MUTATION);

  const form = useForm({
    defaultValues: {
      description: "",
      total: 0,
      date: new Date(),
      splits: [{ userId: "", amount: 0 }],
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
        form.reset();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <DialogTrigger>
      <Button>Add Expense</Button>
      <ModalOverlay isDismissable className={"fixed inset-0 bg-gradient-to-b from-black/50 to-black/70 z-100"}>
        <Modal>
          <Dialog className="absolute right-2 top-2 bg-gray-900 max-w-xl w-full p-6 h-[calc(100svh_-_calc(var(--spacing)_*_4))] border border-gray-800 rounded-lg overflow-y-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="flex flex-col gap-8"
            >
              <div className="w-full">
                <form.Field
                  name="description"
                  validators={{
                    onBlur: formSchema.shape.description,
                  }}
                  children={(field) => (
                    <>
                      <Input
                        label={"Description"}
                        type="text"
                        placeholder="Description"
                        value={field.state.value as string}
                        onBlur={field.handleBlur}
                        onChange={(value) => field.handleChange(value)}
                        isInvalid={field.state.meta.errors.length > 0}
                        hint={
                          field.state.meta.errors.length > 0 && field.state.meta.errors[0]
                            ? field.state.meta.errors[0].message
                            : undefined
                        }
                      />
                    </>
                  )}
                />
              </div>
              <div className="w-full">
                <form.Field
                  name="total"
                  validators={{
                    onBlur: formSchema.shape.total,
                  }}
                  children={(field) => (
                    <>
                      <Input
                        label={"Total"}
                        type="number"
                        placeholder="Amount"
                        value={field.state.value.toString()}
                        onBlur={field.handleBlur}
                        onChange={(value) => field.handleChange(parseFloat(value))}
                        isInvalid={field.state.meta.errors.length > 0}
                        hint={
                          field.state.meta.errors.length > 0 && field.state.meta.errors[0]
                            ? field.state.meta.errors[0].message
                            : undefined
                        }
                      />
                    </>
                  )}
                />
              </div>
              <div className="w-full">
                <form.Field
                  name="date"
                  validators={{
                    onBlur: formSchema.shape.date,
                  }}
                  children={(field) => (
                    <>
                      <Input
                        label={"Date"}
                        type="date"
                        value={field.state.value?.toISOString().split("T")[0]}
                        onBlur={field.handleBlur}
                        onChange={(value) => field.handleChange(new Date(value))}
                        isInvalid={field.state.meta.errors.length > 0}
                        hint={
                          field.state.meta.errors.length > 0 && field.state.meta.errors[0]
                            ? field.state.meta.errors[0].message
                            : undefined
                        }
                      />
                    </>
                  )}
                />
              </div>
              <div className="w-full">
                <form.Field
                  name="splits"
                  children={(field) => (
                    <div className="space-y-2">
                      {field.state.value.map((split, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Select.ComboBox
                            className={"w-full"}
                            placeholder="Select User"
                            shortcut={false}
                            selectedKey={split.userId}
                            label={"Participants"}
                            onSelectionChange={(value) => {
                              if (!value) return;
                              const newSplits = [...field.state.value];
                              newSplits[index].userId = value as string;
                              field.handleChange(newSplits);
                            }}
                          >
                            <Select.Item id="user1" onClick={() => {}}>
                              User 1
                            </Select.Item>
                            <Select.Item id="user2" onClick={() => {}}>
                              User 2
                            </Select.Item>
                          </Select.ComboBox>
                          <Input
                            className="w-32"
                            type="number"
                            placeholder="Amount"
                            value={split.amount.toString()}
                            label={"Share"}
                            onChange={(value) => {
                              const newSplits = [...field.state.value];
                              newSplits[index].amount = parseFloat(value);
                              field.handleChange(newSplits);
                            }}
                          />
                          <div className="mt-6.5">
                            <ButtonUtility
                              type="button"
                              color={"tertiary"}
                              size={"sm"}
                              icon={Trash01}
                              onClick={() => {
                                const newSplits = field.state.value.filter((_, i) => i !== index);
                                field.handleChange(newSplits);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        className="w-full"
                        color={"tertiary"}
                        onClick={() => field.handleChange([...field.state.value, { userId: "", amount: 0 }])}
                        iconLeading={<Plus size={14} />}
                      >
                        Add Split
                      </Button>
                    </div>
                  )}
                />
              </div>
              <div className="w-full mt-4">
                <Button type="submit" disabled={loading} className="w-full">
                  Submit
                </Button>
              </div>
            </form>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
};

export default AddExpense;
