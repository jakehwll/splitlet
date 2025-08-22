{
  /**
  
  `react-aria-components` also has a toast component, we could consider using that instead of `sonner`.
  It's currently in `alpha` and not yet stable, but we could consider using it in the future.

  https://react-spectrum.adobe.com/react-aria/Toast.html

*/
}

import { toast as sonnerToast } from "sonner";
import { FeaturedIcon, type FeaturedIconProps } from "../components/foundations/featured-icon/featured-icon";
import { AlertCircle, CheckCircle, InfoCircle, X } from "@untitledui/icons";
import { Button } from "../components/base/buttons/button";

interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  variant: "success" | "error" | "warning" | "info";
  button?: {
    label: string;
    onClick: () => void;
  };
}

export const toast = (toast: Omit<ToastProps, "id">) => {
  return sonnerToast.custom((id) => <Toast {...toast} id={id} />);
};

export const getToastIcon = ({ variant }: { variant: ToastProps["variant"] }): React.FC => {
  switch (variant) {
    case "success":
      return CheckCircle;
    case "error":
      return AlertCircle;
    case "warning":
      return AlertCircle;
    case "info":
      return InfoCircle;
    default:
      return CheckCircle;
  }
};

export const getToastColor = ({ variant }: { variant: ToastProps["variant"] }): FeaturedIconProps["color"] => {
  switch (variant) {
    case "success":
      return "success";
    case "error":
      return "error";
    case "warning":
      return "warning";
    case "info":
      return "brand";
    default:
      return "brand";
  }
};

export const Toast = (props: ToastProps) => {
  const { title, description, button, id } = props;

  return (
    <div className="border border-gray-800 bg-gray-900 rounded-xl shadow-lg min-w-100">
      <div className="flex flex-1 items-start p-4 gap-4">
        <FeaturedIcon
          color={getToastColor({ variant: props.variant })}
          icon={getToastIcon({ variant: props.variant })}
          theme="outline"
          size="lg"
        />
        <div className="flex flex-col gap-1 pr-8">
          <div className="w-full flex flex-col gap-1 py-1">
            <p className="text-sm font-semibold text-white">{title}</p>
            {description && <p className={"text-sm leading-relaxed"}>{description}</p>}
          </div>
          {button && (
            <div>
              <button
                className="text-sm font-semibold hover:text-gray-300 hover:underline underline-offset-4 transition-colors duration-200 cursor-pointer"
                onClick={() => button?.onClick()}
              >
                {button?.label}
              </button>
            </div>
          )}
        </div>
      </div>
      <Button
        color="tertiary"
        size="sm"
        iconLeading={<X data-icon />}
        className="absolute right-2 top-2"
        onClick={() => sonnerToast.dismiss(id)}
      />
    </div>
  );
};
