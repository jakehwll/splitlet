import { useForm } from "@tanstack/react-form";
import z from "zod";
import { gql } from "@repo/graphql";
import { useMutation } from "@apollo/client";
import { SelectItemType } from "../base/select/select";
import { Avatar } from "../base/avatar/avatar";
import { Coins04, CurrencyDollar, Equal, Percent01, User01 } from "@untitledui/icons";
import { MultiSelect } from "../base/select/multi-select";
import { useListData } from "react-stately";
import { Input } from "../base/input/input";
import { Button } from "../base/buttons/button";
import { ButtonGroup, ButtonGroupItem } from "../base/button-group/button-group";
import { useState } from "react";
import Decimal from "decimal.js";

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
      name: z.string().min(1, "Name is required"),
      amount: z.number().min(0.01, "Amount must be greater than 0"),
    })
  ),
});

export const FormAddExpense = ({ user }: { user: { id: string; name: string } }) => {
  const [addExpense, { loading }] = useMutation(ADD_EXPENSE_MUTATION);
  const [splitType, setSplitType] = useState<"equal" | "exact" | "percent">("equal");

  const selectedItems = useListData({
    initialItems: [],
  });

  const users: SelectItemType[] = [
    { label: "User 1", id: "user1" },
    { label: "User 2", id: "user2" },
    { label: "User 3", id: "user3" },
    { label: "User 4", id: "user4" },
  ];

  const defaultValues: z.infer<typeof formSchema> = {
    description: "",
    total: 0,
    date: new Date(),
    splits: [
      {
        userId: user.id,
        name: user.name,
        amount: 0,
      },
    ],
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

  const recalculateTotal = (amount: number, people: number) => {
    switch (splitType) {
      case "equal":
        const totalCents = new Decimal(amount).times(100);
        const baseShare = totalCents.div(people).floor();
        const remainder = totalCents.mod(people);
        const result = Array.from({ length: people }, (_, i) =>
          baseShare
            .plus(i < remainder.toNumber() ? 1 : 0)
            .div(100)
            .toNumber()
        );
        return result;
      case "exact":
        // We can let the user manually enter the total amount
        break;
      case "percent":
        break;
    }
  };

  return (
    <>
      <div className="px-6">
        <MultiSelect
          selectedItems={selectedItems}
          label="Participants"
          placeholder="Enter name or email address"
          leadingText="With you and:"
          placeholderIcon={User01}
          items={users}
          onItemInserted={(key) =>
            form.setFieldValue("splits", [
              ...form.getFieldValue("splits"),
              { userId: key as string, name: users[key]?.name ?? key, amount: 0 },
            ])
          }
          onItemCleared={(key) =>
            form.setFieldValue(
              "splits",
              form.getFieldValue("splits").filter((split) => split.userId !== key)
            )
          }
        >
          {users.map((user) => (
            <MultiSelect.Item key={user.id} id={user.id}>
              {user.label}
            </MultiSelect.Item>
          ))}
        </MultiSelect>
      </div>

      {form.getFieldValue("splits").length > 1 ? (
        <>
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
                <ButtonGroup selectedKeys={[splitType]}>
                  <ButtonGroupItem onClick={() => setSplitType("equal")} id={"equal"} iconLeading={Equal} />
                  <ButtonGroupItem onClick={() => setSplitType("exact")} id={"exact"} iconLeading={Coins04} />
                  <ButtonGroupItem onClick={() => setSplitType("percent")} id={"percent"} iconLeading={Percent01} />
                </ButtonGroup>
              </div>
              <div className="w-full">
                <div className="space-y-6">
                  <form.Field
                    name="splits"
                    children={(field) => (
                      <>
                        {field.state.value.map((split, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="flex items-center flex-1 gap-4 flex-1 min-w-0">
                              <Avatar size={"xs"} />
                              <div className="text-white font-medium truncate">{split.name}</div>
                            </div>
                            <div className="min-w-0">
                              <Input
                                className="w-32"
                                type="number"
                                placeholder="Amount"
                                icon={splitType === "percent" ? Percent01 : CurrencyDollar}
                                value={split.amount.toString()}
                                isDisabled={splitType === "equal"}
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
                      </>
                    )}
                  />
                  <div className="flex flex-col items-end">
                    <div className="text-lg font-semibold text-white">$0.00</div>
                    <div className="text-sm font-medium text-fg-secondary">$0.00 left</div>
                  </div>
                </div>
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
        </>
      ) : (
        <></>
      )}
    </>
  );
};
