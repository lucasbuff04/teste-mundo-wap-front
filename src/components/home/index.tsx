import { useContext, useState } from "react";
import { VisitationContext } from "../../context/visitations";
import { AppInput } from "../global/form/appInput/input";
import { VisitationFormModal } from "./components/visitationModal";
import { VisitationsAccordion } from "./components/visitationsAccordion";
import { HomeWrapper, SearchWrapper } from "./styles";

export const HomePage = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	return (
		<HomeWrapper>
			<FilterSection />
			<VisitationsAccordion />
			{isModalOpen && (
				<VisitationFormModal
					open={isModalOpen}
					setIsModalOpen={setIsModalOpen}
				/>
			)}
			<div>
				<button
					type="button"
					onClick={() => setIsModalOpen(!isModalOpen)}
					data-bg-default
					style={{
						backgroundColor: "#000",
						color: "#fff",
						padding: "1rem 2.5rem",
						border: "none",
						borderRadius: "8px",
						fontWeight: "bold",
						fontSize: "1rem",
						cursor: "pointer",
						maxWidth: "100%",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					Cadastrar Visita
				</button>
			</div>
		</HomeWrapper>
	);
};

const FilterSection = () => {
	const { filter, setFilter } = useContext(VisitationContext);

	const updateFilter = (
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLSelectElement>,
	) => {
		const name = e.target.name;
		let value: string | boolean | null = e.target.value;

		if (name === "status") {
			if (value === "null") value = null;
			if (value === "true") value = true;
			if (value === "false") value = false;
		}

		setFilter({ ...filter, [name]: value });
	};

	return (
		<SearchWrapper>
			<AppInput
				label="Busca Geral"
				type="text"
				name="search"
				value={filter?.search}
				onChange={updateFilter}
			/>
		</SearchWrapper>
	);
};
