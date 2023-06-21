import { useEffect, useState } from "react";
import DoctorForm from "../../components/DoctorForm";
import DoctorApI from "../../api";
import { City, DoctorDefaultInfo, DoctorFullInfo, Speciality } from "../../types";
import { Spin } from "antd";
import Spinner from "../../../common/components/Spinner";

const Doctor = () => {
  const [cities, setCities] = useState<City[] | null>(null);
  const [specialities, setSpecialities] = useState<Speciality[] | null>(null);
  const [doctors, setDoctors] = useState<DoctorFullInfo[] | null>(null);

  useEffect(() => {
    (async () => {
      const [doctors, cities, specialities] = await Promise.all(
        [DoctorApI.getDoctors(), DoctorApI.getCities(), DoctorApI.getSpecialities()]
      );
      setCities(cities);
      setSpecialities(specialities);
      const mapDoctors = doctors.map((doctor: DoctorDefaultInfo) => {
        const speciality = specialities.find((speciality: Speciality) => speciality.id === doctor.specialityId);
        const city = cities.find((city: City) => city.id === doctor.cityId);
        return {
          id: doctor.id,
          name: `${doctor.name} ${doctor.surname}`,
          specialityName: speciality?.name,
          maxAge: speciality?.params?.maxAge || null,
          minAge: speciality?.params?.minAge || null,
          gender: speciality?.params?.gender || null,
          cityName: city?.name,
          isPediatrician: doctor.isPediatrician
        }
      })
      setDoctors(mapDoctors);
    })();
  }, []);

  if (!cities && !specialities && !doctors) {
    return <Spinner />
  }

  return (
    <DoctorForm doctors={doctors} cities={cities} specialities={specialities} />
  )
}

export default Doctor;
