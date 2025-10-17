import { useContext, useState } from "react";
import { VisitationContext } from "../../context/visitations";
import { ColorScheme } from "../global/colorScheme";
import { AppInput } from "../global/form/appInput/input";
import { AppSelect } from "../global/form/appSelect/input";
import { VisitationFormModal } from "./components/visitationModal";
import { VisitationsAccordion } from "./components/visitationsAccordion";
import { HomeWrapper, SearchWrapper } from "./styles";

export const HomePage = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	return (
		<HomeWrapper>
			<div className="title">
				<h1>Teste React</h1>
				<div>
					<ColorScheme />
					<button
						type="button"
						onClick={() => setIsModalOpen(!isModalOpen)}
						data-bg-default
					>
						Criar Visita
					</button>
				</div>
			</div>
			<FilterSection />
			<VisitationsAccordion />
			{isModalOpen && (
				<VisitationFormModal
					open={isModalOpen}
					setIsModalOpen={setIsModalOpen}
				/>
			)}
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
				label="Pesquise"
				type="text"
				name="search"
				value={filter?.search}
				onChange={updateFilter}
			/>
			<AppSelect
				label="Status"
				name="status"
				value={filter?.status?.toString() || "null"}
				onChange={updateFilter}
			>
				<option value="null">Escolha uma opçao</option>
				<option value="true">Concluido</option>
				<option value="false">Pendente</option>
			</AppSelect>
		</SearchWrapper>
	);
};
