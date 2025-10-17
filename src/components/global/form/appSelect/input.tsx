import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";
import { AppSelectWrapper } from "../appSelect/styles";

type Props = React.InputHTMLAttributes<HTMLSelectElement> & {
	label?: string;
	errors?: FieldError | undefined;
};

export const AppSelect = forwardRef<HTMLSelectElement, Props>(
	({ label, errors, children, ...props }, ref) => {
		return (
			<AppSelectWrapper>
				{label && <label htmlFor={props.name}>{label}</label>}
				<select {...props} ref={ref}>
					{children}
				</select>
				{errors && <span data-danger>Field required</span>}
			</AppSelectWrapper>
		);
	},
);

AppSelect.displayName = "AppSelect";
