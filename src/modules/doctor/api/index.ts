import { instance } from "../../config/axios";
import { City, DoctorInfo, Speciality } from "../types";

const DoctorApI = {
  async getCities() {
    const res = await instance.get<City[]>(`9fcb58ca-d3dd-424b-873b-dd3c76f000f4`);
    return res.data;
  },
  async getSpecialities() {
    const res = await instance.get<Speciality[]>(`e8897b19-46a0-4124-8454-0938225ee9ca`);
    return res.data;
  },
  async getDoctors() {
    const res = await instance.get<DoctorInfo[]>(`3d1c993c-cd8e-44c3-b1cb-585222859c21`);
    return res.data;
  },
}

export default DoctorApI;
