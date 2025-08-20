import type { DialogProps as AriaDialogProps, ModalOverlayProps as AriaModalOverlayProps } from "react-aria-components";
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from "react-aria-components";
import { cx } from "../../../utils/cx";

export const DialogTrigger = AriaDialogTrigger;

export const DrawerOverlay = (props: AriaModalOverlayProps) => {
  return (
    <AriaModalOverlay
      {...props}
      className={(state) =>
        cx(
          "fixed inset-0 bg-gradient-to-b from-black/50 to-black/70 z-100",
          state.isEntering && "duration-300 ease-out animate-in fade-in",
          state.isExiting && "duration-200 ease-in animate-out fade-out",
          typeof props.className === "function" ? props.className(state) : props.className
        )
      }
    />
  );
};

export const Drawer = (props: AriaModalOverlayProps) => {
  return (
    <AriaModal
      {...props}
      className={(state) =>
        cx(
          "absolute right-2 top-2 bg-gray-950 overflow-y-auto",
          "max-w-lg w-full border border-gray-800 rounded-lg",
          "flex flex-col",
          "h-[calc(100svh_-_calc(var(--spacing)_*_4))]",
          state.isEntering && "duration-300 ease-out animate-drawerShow",
          state.isExiting && "duration-200 ease-in animate-drawerHide",
          typeof props.className === "function" ? props.className(state) : props.className
        )
      }
    />
  );
};

export const Dialog = (props: AriaDialogProps) => {
  return <AriaDialog {...props} className={cx(props.className)} />;
};
