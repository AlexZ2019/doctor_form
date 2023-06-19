export type City = {
  id: string;
  name: string;
};

export type Speciality = {
  id: string;
  name: string;
};

export type DoctorInfo = {
  cityId: string;
  id: string;
  isPediatrician: boolean;
  name: string;
  surname: string;
  specialityId: string;
}

