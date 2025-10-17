import { SwitchToggle } from "./styles";

export const Switch = ({
	checked,
	onChange,
}: { checked: boolean; onChange: () => void }) => {
	return (
		<SwitchToggle>
			<input type="checkbox" checked={checked} onChange={onChange} />
			<span className="slider round" />
		</SwitchToggle>
	);
};
