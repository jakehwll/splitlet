import { Button } from "../base/buttons/button";
import { Dialog, DialogTrigger, Drawer, DrawerOverlay } from "../application/drawer/Drawer";
import { FeaturedIcon } from "../foundations/featured-icon/featured-icon";
import { Receipt } from "@untitledui/icons";
import { authClient } from "../../utils/auth";
import { FormAddExpense } from "../forms/form-add-expense";

export const DrawerAddExpense = () => {
  const { data } = authClient.useSession();

  if (!data) {
    return null;
  }

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
            <FormAddExpense user={data.user} />
          </Dialog>
        </Drawer>
      </DrawerOverlay>
    </DialogTrigger>
  );
};
