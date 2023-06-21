
export type City = {
  id: string;
  name: string;
};

type SpecialityParams = {
  maxAge?: number | null;
  minAge?: number | null;
  gender?: 'Male' | 'Female' | null,
};

export type Speciality = {
  id: string;
  name: string;
  params?: SpecialityParams
};

export type DoctorDefaultInfo = {
  cityId: string;
  id: string;
  isPediatrician: boolean;
  name: string;
  surname: string;
  specialityId: string;
}

export type DoctorFullInfo = SpecialityParams & {
  id: string;
  name: string;
  isPediatrician: boolean;
  specialityName: string | undefined;
  cityName: string | undefined;
}

