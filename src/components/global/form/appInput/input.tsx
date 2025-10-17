import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";
import { AppInputWrapper } from "./styles";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	errors?: FieldError | undefined;
};

export const AppInput = forwardRef<HTMLInputElement, Props>(
	({ label, errors, ...props }, ref) => {
		return (
			<AppInputWrapper>
				{label && <label htmlFor={props.name}>{label}</label>}
				<input {...props} ref={ref} />
				{errors && <span data-danger>Field required</span>}
			</AppInputWrapper>
		);
	},
);

AppInput.displayName = "AppInput";
