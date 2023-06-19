import { useEffect, useState } from "react";
import DoctorForm from "../../components/DoctorForm";
import DoctorApI from "../../api";
import { City, DoctorInfo, Speciality } from "../../types";
import { Spin } from "antd";

const Doctor = () => {
  const [cities, setCities] = useState<City[] | null>(null);
  const [specialities, setSpecialities] = useState<Speciality[] | null>(null);
  const [doctors, setDoctors] = useState<DoctorInfo[] | null>(null);

  useEffect(() => {
    (async () => {
      const [doctors, cities, specialities] = await Promise.all(
        [DoctorApI.getDoctors(), DoctorApI.getCities(), DoctorApI.getSpecialities()]
      );
      setCities(cities);
      setSpecialities(specialities);
      setDoctors(doctors);
    })();
  }, []);

  if (!cities && !specialities && !doctors) {
    return <Spin />
  }

  return (
    <DoctorForm doctors={doctors} cities={cities} specialities={specialities} />
  )
}

export default Doctor;
