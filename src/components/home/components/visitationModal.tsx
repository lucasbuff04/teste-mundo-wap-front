import moment from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
	VisitationContext,
	type VisitationsType,
} from "../../../context/visitations";
import generateId from "../../../hooks/generateId";
import { CepService } from "../../../services/endpoints/Cep";
import { AppInput } from "../../global/form/appInput/input";

interface ModalProps {
	setIsModalOpen: (isOpen: boolean) => void;
	open: boolean;
	editContent?: VisitationsType;
}

export const VisitationFormModal: React.FC<ModalProps> = ({
	setIsModalOpen,
	open,
	editContent,
}) => {
	const dialogId = generateId(5);
	const { getCep } = useMemo(() => new CepService(), []);
	const { addVisitation, editVisitation } = useContext(VisitationContext);
	const [cepDisabled, setCepDisabled] = useState(true);
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isValid },
	} = useForm<VisitationsType>({
		defaultValues: editContent
			? editContent
			: {
					id: "",
					status: false,
					data_visitation: "",
					form_quantity: 0,
					product_quantity: 0,
					cep: "",
					uf: "",
					city: "",
					neighborhood: "",
					street: "",
					number: "",
				},
		mode: "onSubmit",
	});

	useEffect(() => {
		const dialog = document.getElementById(dialogId) as HTMLDialogElement;
		if (!dialog) return;

		if (open) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}, [open, dialogId]);

	const onSubmit: SubmitHandler<VisitationsType> = (data) => {
		if (editContent) {
			editVisitation(data)
				.then(() => {
					alert("Editado com sucesso!");
					setIsModalOpen(false);
				})
				.catch((err) => {
					alert(err);
				});
		} else {
			addVisitation(data)
				.then(() => {
					alert("Salvo com sucesso!");
					setIsModalOpen(false);
				})
				.catch((err) => {
					alert(err);
				});
		}
	};

	/**
	 * Function to validate and autofill address form fields based on CEP (Brazilian postal code)
	 */
	const checkCep = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Get the CEP value from the input
		const cep = e.target.value;
		// Return early if CEP is not complete (less than 8 digits)
		if (cep.length < 8) return;

		// Call the CEP service to fetch address information
		getCep(cep)
			.then(({ data }) => {
				if (data.erro === "true") {
					// If CEP is not found, show alert and clear form fields
					alert("Cep não encontrado");
					setValue("uf", "");
					setValue("city", "");
					setValue("neighborhood", "");
					setValue("street", "");
					// Enable manual input for address fields
					setCepDisabled(false);
				} else {
					// If CEP is found, populate form fields with returned data
					setValue("uf", data.uf);
					setValue("city", data.localidade);
					setValue("neighborhood", data.bairro);
					setValue("street", data.logradouro);
					// Disable manual input for auto-filled fields
					setCepDisabled(true);
				}
			})
			.catch((err) => {
				// On API error, clear form fields and enable manual input
				setValue("uf", "");
				setValue("city", "");
				setValue("neighborhood", "");
				setValue("street", "");
				setCepDisabled(false);
			});
	};

	return ReactDOM.createPortal(
		<dialog id={dialogId} style={{ maxWidth: "50ch" }}>
			<button
				type="button"
				onClick={() => setIsModalOpen(false)}
				data-modal-close
			>
				X
			</button>
			<div>
				<h2>Agendar uma Visita</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<AppInput
						{...register("data_visitation", { required: true })}
						errors={errors.data_visitation}
						type="date"
						min={moment().format("YYYY-MM-DD")}
						label="Data da Visita"
					/>

					<AppInput
						{...register("form_quantity", { required: true })}
						errors={errors.form_quantity}
						type="number"
						min={0}
						label="Quantidade de formularios"
					/>

					<AppInput
						{...register("product_quantity", { required: true })}
						errors={errors.product_quantity}
						type="number"
						min={0}
						label="Quantidade de produtos"
					/>

					<AppInput
						{...register("cep", { required: true })}
						errors={errors.cep}
						onChange={checkCep}
						maxLength={8}
						label="CEP"
					/>

					<AppInput
						{...register("uf", { required: !cepDisabled })}
						errors={errors.uf}
						disabled={cepDisabled}
						label="UF"
					/>

					<AppInput
						{...register("city", { required: !cepDisabled })}
						errors={errors.city}
						disabled={cepDisabled}
						label="Cidade"
					/>

					<AppInput
						{...register("neighborhood", { required: !cepDisabled })}
						errors={errors.neighborhood}
						disabled={cepDisabled}
						label="Bairro"
					/>

					<AppInput
						{...register("street", { required: !cepDisabled })}
						disabled={cepDisabled}
						errors={errors.street}
						min={0}
						label="Logradouro"
					/>
					<AppInput
						{...register("number", { required: true })}
						errors={errors.number}
						type="number"
						min={0}
						label="Número"
					/>
					<div className="action">
						{editContent ? (
							<button type="submit" disabled={!isValid}>
								Editar{" "}
							</button>
						) : (
							<button type="submit" disabled={!isValid}>
								Salvar{" "}
							</button>
						)}
					</div>
				</form>
			</div>
		</dialog>,
		document.getElementById("modal-root") as HTMLElement,
	);
};
