import moment from "moment";
import { useContext, useState } from "react";
import {
	VisitationContext,
	type VisitationsListType,
	type VisitationsType,
} from "../../../../context/visitations";
import { Switch } from "../../../global/form/switch";
import { VisitationFormModal } from "../visitationModal";
import { AccordionDetails, AccordionWrapper } from "./styles";

export const VisitationsAccordion = () => {
	const { visitationsList, finalizeDay } = useContext(VisitationContext);

	return (
		<AccordionWrapper>
			{visitationsList.map((item: VisitationsListType) => (
				<AccordionDetails
					id={`accordion-${item.key}`}
					key={item.key}
					percentage={CalcPercentageOfMinutes(item.minutes)}
				>
					<SummaryContent item={item} />
					<div className="details-content-wrapper">
						{item.value.map((visit: VisitationsType) => (
							<AccordionContent key={visit.id} visit={visit} />
						))}
					</div>
					<button
						data-bg-attention
						className="finalize-date"
						type="button"
						onClick={() => finalizeDay(item)}
					>
						Finalizar Data
					</button>
				</AccordionDetails>
			))}
		</AccordionWrapper>
	);
};

const SummaryContent = ({ item }: { item: VisitationsListType }) => {
	const date = moment(item.key, "YYYY-MM-DD").format("DD/MM/YYYY");
	const hours = (item.minutes ? Number.parseInt(item.minutes) / 60 : 0)
		.toFixed(2)
		.replaceAll(".", ":");

	return (
		<summary>
			<span>{date}</span>
			<span>
				{hours} horas / {CalcPercentageOfMinutes(item.minutes)}%
			</span>
		</summary>
	);
};

const CalcPercentageOfMinutes = (minutes: string): number => {
	const eigth_hours_in_minutes = 480;
	return Number.parseFloat(
		((Number.parseInt(minutes) * 100) / eigth_hours_in_minutes).toFixed(2),
	);
};

const AccordionContent = ({ visit }: { visit: VisitationsType }) => {
	const {
		deleteItem,
		changingStatusVisitation,
		minutes_visit_form,
		minutes_visit_product,
	} = useContext(VisitationContext);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const calcVisitDuration = (): string => {
		const value =
			(visit.form_quantity * minutes_visit_form +
				visit.product_quantity * minutes_visit_product) /
			60;

		return value.toFixed(2).replaceAll(".", ":");
	};

	return (
		<ul>
			<li>Duração da Visita: {calcVisitDuration()} horas</li>
			<li>Quantidade de Formularios: {visit.form_quantity}</li>
			<li>Quantidade de Produtos: {visit.product_quantity}</li>
			<li>
				<p>
					{visit.street}, Número {visit.number} - {visit.cep}
				</p>
				<p>
					{visit.neighborhood}, {visit.city} - {visit.uf}
				</p>
			</li>
			<div className="status-div">
				<span>{visit.status ? "Concluído" : "Pendente"}</span>
				{!visit.status && (
					<Switch
						checked={visit.status}
						onChange={() => changingStatusVisitation(visit)}
					/>
				)}
			</div>
			{!visit.status && (
				<div className="actions">
					<button
						type="button"
						data-bg-attention
						onClick={() => setIsModalOpen(true)}
					>
						Editar
					</button>
					<button
						type="button"
						data-bg-danger
						onClick={() => deleteItem(visit.id)}
					>
						Deletar
					</button>
				</div>
			)}

			{isModalOpen && (
				<VisitationFormModal
					open={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					editContent={visit}
				/>
			)}
		</ul>
	);
};
