import type { AxiosPromise } from "axios";
import { axiosViaCep } from "../configs/axios";

export class CepService {
	getCep = (cep: string): AxiosPromise => {
		return axiosViaCep.get(`/${cep}/json/`);
	};
}
