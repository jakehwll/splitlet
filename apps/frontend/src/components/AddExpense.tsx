import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useMutation } from "@apollo/client";
import { Input, InputBase } from "./base/input/input";
import { InputGroup } from "./base/input/input-group";
import { NativeSelect } from "./base/select/select-native";
import { Button } from "./base/buttons/button";
import { gql } from "@repo/graphql";
import { Dialog, DialogTrigger, Drawer, DrawerOverlay } from "./application/drawer/Drawer";
import { MultiSelect } from "./base/select/multi-select";
import { useListData } from "react-stately";
import { FeaturedIcon } from "./foundations/featured-icon/featured-icon";
import { CurrencyDollar, Receipt } from "@untitledui/icons";

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

  const selectedItems = useListData({
    initialItems: [],
  });

  const users = [
    { label: "User 1", id: "user1" },
    { label: "User 2", id: "user2" },
  ];

  const defaultValues: z.infer<typeof formSchema> = {
    description: "",
    total: 0,
    date: new Date(),
    splits: [],
  };

  const form = useForm({
    defaultValues,
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
      <DrawerOverlay isDismissable>
        <Drawer>
          <Dialog className="flex flex-col gap-6 flex-1">
            <header className="flex flex-col gap-4 pt-6 px-6">
              <FeaturedIcon color={"brand"} icon={Receipt} size={"lg"} />
              <div className="flex flex-col gap-0.5">
                <h2 className="text-md font-semibold text-white">Add an expense</h2>
                <p className="text-sm">Let us know whos involved and how much was spent today.</p>
              </div>
            </header>

            <div className="px-6">
              <MultiSelect
                selectedItems={selectedItems}
                label="Participants"
                placeholder="Select User"
                items={users}
                onItemInserted={(key) =>
                  form.setFieldValue("splits", [...form.getFieldValue("splits"), { userId: key as string, amount: 0 }])
                }
                onItemCleared={(key) =>
                  form.setFieldValue(
                    "splits",
                    form.getFieldValue("splits").filter((split) => split.userId !== key)
                  )
                }
              >
                <MultiSelect.Item id="user1" onClick={() => {}}>
                  User 1
                </MultiSelect.Item>
                <MultiSelect.Item id="user2" onClick={() => {}}>
                  User 2
                </MultiSelect.Item>
              </MultiSelect>
            </div>

            {form.getFieldValue("splits").length ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="flex flex-col gap-8 flex-1 justify-between"
              >
                <div className="flex flex-col gap-6 px-6">
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
                            type="number"
                            label={"Amount"}
                            icon={CurrencyDollar}
                            value={field.state.value?.toString() || ""}
                            onChange={(value) => {
                              if (value === "") {
                                field.handleChange(0);
                              } else {
                                const numberValue = parseFloat(value);
                                !isNaN(numberValue) ? field.handleChange(numberValue) : field.handleChange(0);
                              }
                            }}
                            onBlur={field.handleBlur}
                            isInvalid={field.state.meta.errors.length > 0}
                            hint={field.state.meta.errors.length > 0 && field.state.meta.errors[0]?.message}
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
                            <div key={index} className="flex gap-2">
                              <div className="flex items-center flex-1 gap-2 mt-6 flex-1">
                                <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
                                <span className="text-white font-medium">{split.userId}</span>
                              </div>
                              <div className="">
                                <Input
                                  className="w-32"
                                  type="number"
                                  placeholder="Amount"
                                  label={"Share"}
                                  icon={CurrencyDollar}
                                  value={split.amount.toString()}
                                  onChange={(value) =>
                                    field.handleChange(
                                      field.state.value.map((s) =>
                                        s.userId === split.userId ? { ...s, amount: parseFloat(value) } : s
                                      )
                                    )
                                  }
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                  </div>
                </div>
                <footer className="flex items-center justify-between gap-4 mt-4 p-6">
                  <form.Field
                    name="date"
                    validators={{
                      onBlur: formSchema.shape.date,
                    }}
                    children={(field) => (
                      <>
                        <Input
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
                  <div className="flex items-center gap-4">
                    <Button size={"lg"} type={"submit"} disabled={loading}>
                      Save
                    </Button>
                  </div>
                </footer>
              </form>
            ) : (
              <></>
            )}
          </Dialog>
        </Drawer>
      </DrawerOverlay>
    </DialogTrigger>
  );
};

export default AddExpense;
