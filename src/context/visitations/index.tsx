import moment from "moment";
import { createContext, useEffect, useState } from "react";
import generateId from "../../hooks/generateId";
import useLocalStorage from "../../hooks/useLocalStorage";

export type VisitationsType = {
	id: string;
	status: boolean;
	data_visitation: string;
	form_quantity: number;
	product_quantity: number;
	cep: string;
	uf: string;
	city: string;
	neighborhood: string;
	street: string;
	number: string;
	limitTime?: number;
};

export type VisitationsListType = {
	key: string;
	minutes: string;
	value: VisitationsType[];
};

type FilterType = {
	search?: string;
	status?: boolean | null;
};

interface VisitationProps {
	visitations: VisitationsType[];
	setVisitations: React.Dispatch<React.SetStateAction<VisitationsType[]>>;
	visitationsList: VisitationsListType[];
	setVisitationsList: React.Dispatch<
		React.SetStateAction<VisitationsListType[]>
	>;
	deleteItem: (id: string) => Promise<void>;
	addVisitation: (data: VisitationsType) => Promise<void>;
	editVisitation: (data: VisitationsType) => Promise<void>;
	changingStatusVisitation: (data: VisitationsType) => Promise<void>;
	finalizeDay: (data: VisitationsListType) => Promise<void>;
	minutes_visit_form: number;
	minutes_visit_product: number;
	filter: FilterType | null;
	setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
}

const defaultContextValue: VisitationProps = {
	visitations: [],
	setVisitations: () => {},
	visitationsList: [],
	setVisitationsList: () => {},
	deleteItem: () => Promise.resolve(),
	addVisitation: () => Promise.resolve(),
	editVisitation: () => Promise.resolve(),
	changingStatusVisitation: () => Promise.resolve(),
	finalizeDay: () => Promise.resolve(),
	filter: { search: "", status: null },
	setFilter: () => {},
	minutes_visit_form: 15,
	minutes_visit_product: 5,
};

interface IProps {
	children: React.ReactNode;
}
export const VisitationContext =
	createContext<VisitationProps>(defaultContextValue);

export const VisitationProvider: React.FC<IProps> = ({ children }) => {
	const [visitations, setVisitations] = useLocalStorage("visitations", []);
	const [visitationsList, setVisitationsList] = useState<VisitationsListType[]>(
		[],
	);
	const [filter, setFilter] = useState<FilterType>({
		search: "",
		status: null,
	});

	const minutes_visit_form = 15;
	const minutes_visit_product = 5;
	const eight_hours_in_minutes = 480;

	useEffect(() => {
		let filteredItems = visitations;

		// Filter items by search term if it exists
		if (filter.search) {
			const regexSearch = new RegExp(filter.search, "gi");
			// Match search term against any address field
			filteredItems = filteredItems.filter(
				(visit: VisitationsType) =>
					visit.city.match(regexSearch) ||
					visit.cep.match(regexSearch) ||
					visit.uf.match(regexSearch) ||
					visit.city.match(regexSearch) || // Note: city is duplicated in the original code
					visit.neighborhood.match(regexSearch) ||
					visit.number.match(regexSearch) ||
					visit.street.match(regexSearch),
			);
		}

		// Filter by status if a specific status is selected
		if (filter.status !== null) {
			filteredItems = filteredItems.filter(
				(visit: VisitationsType) => visit.status === filter.status,
			);
		}

		// Dividing the filtered array into groups by date
		// This creates an object where keys are dates and values are arrays of visitations
		const groupDates = filteredItems.reduce(
			(groups: Record<string, VisitationsType[]>, visit: VisitationsType) => {
				const key = visit.data_visitation;
				// Initialize array for this date if it doesn't exist
				if (!groups[key]) {
					groups[key] = [];
				}
				// Add the visitation to its date group
				groups[key].push(visit);
				return groups;
			},
			{} as Record<string, VisitationsType[]>,
		);

		// Mapping visitation groups into type VisitationsListType[]
		// This transforms the date-grouped object into our required format
		const list: VisitationsListType[] = Object.keys(groupDates).map((key) => {
			// Calculate total minutes for all visitations in this group
			const minutes = calcVisitationMinutes(groupDates[key]).toString();
			return {
				key: key,
				minutes: minutes,
				value: groupDates[key],
			};
		});

		// Sorting list by date (chronological order)
		list.sort(
			(item_one: VisitationsListType, item_two: VisitationsListType) => {
				// Convert string dates to moment objects for comparison
				const first_date = moment(item_one.key);
				const second_date = moment(item_two.key);

				return first_date.isBefore(second_date) ? -1 : 1;
			},
		);

		// Update state with the processed list
		setVisitationsList(list);
	}, [visitations, filter]);

	//Calculates the total minutes for all visitations in an array based on form and product quantities.
	const calcVisitationMinutes = (array: VisitationsType[]): number => {
		return array.reduce((acc: number, curr: VisitationsType) => {
			return (
				acc +
				curr.form_quantity * minutes_visit_form +
				curr.product_quantity * minutes_visit_product
			);
		}, 0);
	};

	/**
	 * Retrieves or initializes a visitation list for a specific date.
	 */
	const getVisitation = (data_visitation: string): VisitationsListType => {
		let dayLog = visitationsList.filter(
			(item) => item.key === data_visitation,
		)[0];

		// Initializes a new visitation list for the specified date if it doesn't exist.
		if (!dayLog) {
			dayLog = {
				key: data_visitation,
				minutes: "0",
				value: [],
			};
		}

		return dayLog;
	};

	const deleteItem = (id: string): Promise<void> => {
		return new Promise((resolve, reject) => {
			try {
				const items = visitations.filter(
					(item: VisitationsType) => item.id !== id,
				);
				setVisitations(items);
				resolve();
			} catch (error) {
				console.error(error);
				reject(error);
			}
		});
	};

	/**
	 * Adds a new visitation to the system
	 */
	const addVisitation = (data: VisitationsType): Promise<void> => {
		return new Promise((resolve, reject) => {
			try {
				//return if data_visitation is not valid
				if (
					moment(data.data_visitation, "YYYY-MM-DD").isBefore(
						moment({ hour: 0, minute: 0 }),
					)
				) {
					reject(new Error("Data invalida"));
					return;
				}

				// Get existing visitations for the specified date
				const dayLog = getVisitation(data.data_visitation);

				// Check if the day already has more than 8 hours scheduled
				if (dayLog.minutes > eight_hours_in_minutes.toString()) {
					reject(new Error("Limite alcançado"));
					return;
				}

				// Calculate new total minutes including the proposed visitation
				const newTotalMinutes =
					Number.parseInt(dayLog.minutes) +
					data.product_quantity * minutes_visit_product +
					data.form_quantity * minutes_visit_form;

				// Reject if adding this visitation would exceed 8 hours
				if (newTotalMinutes > eight_hours_in_minutes) {
					reject(new Error("Limite alcançado"));
					return;
				}

				// Prepare the form data by adding ID and setting status to false
				const form = data;
				form.id = generateId(10);
				form.status = false;

				// Add the new visitation to the state
				setVisitations([...visitations, form]);
				resolve();
			} catch (error) {
				// Log and propagate any errors
				console.error(error);
				reject(error);
			}
		});
	};

	/**
	 * Edits an existing visitation
	 */
	const editVisitation = (data: VisitationsType): Promise<void> => {
		return new Promise((resolve, reject) => {
			try {
				//return if data_visitation is not valid
				if (
					moment(data.data_visitation, "YYYY-MM-DD").isBefore(
						moment({ hour: 0, minute: 0 }),
					)
				) {
					reject(new Error("Data invalida"));
					return;
				}

				// Get existing visitations for the specified date
				const dayLog = getVisitation(data.data_visitation);

				// Remove the visitation being edited from the day's calculations
				dayLog.value = dayLog.value.filter((item) => item.id !== data.id);

				// Recalculate the day's total minutes without the visitation being edited
				dayLog.minutes = calcVisitationMinutes(dayLog.value).toString();

				// Check if the day already exceeds 8 hours
				if (dayLog.minutes > eight_hours_in_minutes.toString()) {
					reject(new Error("Limite alcançado"));
					return;
				}

				// Calculate new total minutes with the edited visitation
				const newTotalMinutes =
					Number.parseInt(dayLog.minutes) +
					data.product_quantity * minutes_visit_product +
					data.form_quantity * minutes_visit_form;

				// Reject if the edited visitation would cause the day to exceed 8 hours
				if (newTotalMinutes > eight_hours_in_minutes) {
					reject(new Error("Limite alcançado"));
					return;
				}

				// Update the visitation in the state
				setVisitations((prev: VisitationsType[]) => {
					return prev.map((item: VisitationsType) => {
						if (item.id === data.id) {
							return { ...item, ...data };
						}
						return item;
					});
				});
				resolve();
			} catch (error) {
				// Log and propagate any errors
				console.error(error);
				reject(error);
			}
		});
	};

	const changingStatusVisitation = (data: VisitationsType): Promise<void> => {
		return new Promise((resolve, reject) => {
			try {
				setVisitations((prev: VisitationsType[]) => {
					return prev.map((item: VisitationsType) => {
						if (item.id === data.id) {
							return { ...item, status: !data.status };
						}
						return item;
					});
				});
				resolve();
			} catch (error) {
				console.error(error);
				reject(error);
			}
		});
	};

	/**
	 * Processes pending visitations for a given day and moves them to the next day
	 */
	const finalizeDay = (data: VisitationsListType): Promise<void> => {
		return new Promise((resolve, reject) => {
			try {
				// Filter out visitations that haven't been completed yet
				const pendingVisitations = data.value.filter(
					(item: VisitationsType) => item.status === false,
				);

				// Create an object to track the next day's date
				const nextDay = {
					value: moment(data.key, "YYYY-MM-DD")
						.add(1, "days")
						.format("YYYY-MM-DD"),
				};

				// Check if the next day is before today
				if (moment(nextDay.value).isBefore(moment())) {
					nextDay.value = moment().add(1, "days").format("YYYY-MM-DD");
				}

				// Reschedule each pending visitation
				for (const visit of pendingVisitations) {
					saveItemsOnNextDay(nextDay, visit);
				}

				resolve();
			} catch (error) {
				console.error(error);
				reject(error);
			}
		});
	};

	/**
	 * Recursively attempts to schedule a visitation on a given date or future dates if needed
	 */
	const saveItemsOnNextDay = (
		date: { value: string },
		visit: VisitationsType,
	) => {
		// Get all visitations already scheduled for the target date
		const dayLog = visitations.filter(
			(item: VisitationsType) => item.data_visitation === date.value,
		);

		// Calculate the current total minutes of all visitations on the target date
		const currentTotalMinutes = calcVisitationMinutes(dayLog);

		// If the day is already at or over capacity (8 hours), move to the next day
		if (currentTotalMinutes >= eight_hours_in_minutes) {
			// Increment the date by one day
			date.value = moment(date.value, "YYYY-MM-DD")
				.add(1, "days")
				.format("YYYY-MM-DD");

			// Recursively try with the next day
			saveItemsOnNextDay(date, visit);
			return;
		}

		// Calculate the total minutes if we add this visitation to the target date
		const newTotalMinutes =
			currentTotalMinutes +
			visit.product_quantity * minutes_visit_product +
			visit.form_quantity * minutes_visit_form;

		// If adding this visitation would exceed the 8-hour limit, try the next day
		if (newTotalMinutes > eight_hours_in_minutes) {
			// Increment the date by one day
			date.value = moment(date.value, "YYYY-MM-DD")
				.add(1, "days")
				.format("YYYY-MM-DD");

			// Recursively try with the next day
			saveItemsOnNextDay(date, visit);
			return;
		}

		// Update the visitation date to the new date
		visit.data_visitation = date.value;

		// Update the visitation in the state
		setVisitations((prev: VisitationsType[]) =>
			prev.map((item: VisitationsType) =>
				item.id === visit.id ? { ...item, ...visit } : item,
			),
		);
	};

	const value = {
		visitations,
		setVisitations,
		visitationsList,
		setVisitationsList,
		deleteItem,
		addVisitation,
		editVisitation,
		changingStatusVisitation,
		finalizeDay,
		minutes_visit_form,
		minutes_visit_product,
		filter,
		setFilter,
	} as VisitationProps;

	return (
		<VisitationContext.Provider value={value}>
			{children}
		</VisitationContext.Provider>
	);
};
