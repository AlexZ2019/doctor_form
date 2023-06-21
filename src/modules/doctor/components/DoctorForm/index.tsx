import { Button, DatePicker, Form, Input, Select } from "antd";
import { City, DoctorFullInfo, Speciality } from "../../types";
import { FC, useState } from "react";
import { Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from "dayjs";
import { mapSelectItem } from "../../helpers";
import { ONLY_LETTERS_REG, PHONE_REG } from "../../../common/constants";
import { getAge } from "../../../common/helpers";
import constants from "../../constants";
import styles from "./styles.module.css"

type Props = {
  cities: City[] | null;
  specialities: Speciality[] | null;
  doctors: DoctorFullInfo[] | null;
}

const schema = yup.object().shape({
  name: yup.string().min(3).required().matches(ONLY_LETTERS_REG, "Only alphabets are allowed for this field "),
  birthdayDate: yup.date().required(),
  sex: yup.string<'Male' | 'Female' | ''>().required(),
  city: yup.string().required(),
  speciality: yup.string(),
  doctor: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().matches(PHONE_REG, 'Phone number is not valid. Use only numbers')
});

const DoctorForm: FC<Props> = ({ cities, specialities, doctors}) => {
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorFullInfo[] | null>(doctors);
  const [filteredSpecialities, setFilteredSpecialities] = useState<Speciality[] | null>(specialities);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    getValues,
  } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });
  const filterSpecialityByGender = () => {
    const gender = getValues('sex');
    const filteredSpecialities = specialities?.filter((speciality) => {
      if (gender === constants.GENDER_MALE) {
        return speciality?.params?.gender !== constants.GENDER_FEMALE;
      }
      if (gender === constants.GENDER_FEMALE) {
        return speciality?.params?.gender !== constants.GENDER_MALE;
      }
      return speciality;
    });

    // @ts-ignore
    setFilteredSpecialities(filteredSpecialities);
  }
  const filterDoctors = () => {
    const age = getAge(getValues('birthdayDate'));
    const restOptions = {
      cityName: getValues('city'),
      specialityName: getValues('speciality')
    };
    const applicableOptions = Object.entries(restOptions).filter(
      ([_, value]) => {
       return value !== null && value !== undefined
      }
    );
    const availableDoctors = doctors?.filter((doctor) => {
      const otherOptionsFilter = applicableOptions.every(([optKey, optValue]) =>
        doctor[optKey as keyof DoctorFullInfo] === optValue);
      if (age) {
        if (doctor.maxAge) {
          return age <= doctor.maxAge && otherOptionsFilter;
        }
        if (doctor.minAge) {
          return age >= doctor.minAge && otherOptionsFilter
        }
        return age > (doctor.maxAge || constants.DEFAULT_MAX_AGE) && age < (doctor.minAge || constants.DEFAULT_MIN_AGE) && otherOptionsFilter;
      }
      return otherOptionsFilter;
    }
    );
    // @ts-ignore
    setFilteredDoctors(availableDoctors);
  }

  const selectDoctor = () => {
    const fieldValue = getValues('doctor');
    const selectedDoctor = filteredDoctors?.find((doctor) => doctor.name === fieldValue);
    setValue('city', selectedDoctor?.cityName || "");
    setValue('speciality', selectedDoctor?.specialityName || "");
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      reset();
    }, 4000);
  };

  return <Form className={`${styles.form} center`}>
    <div className={styles.item}>
      <Controller
        name="name"
        control={control}
        render={({ field }) =>
          <Input placeholder="Name" {...field} />}
      />
      <div className={styles.error}>{errors.name ? errors.name.message : ''}</div>
    </div>
    <div className={styles.item}>
      <Controller
        name="birthdayDate"
        control={control}
        render={({ field }) => <DatePicker
          format="DD-MM-YYYY"
          name={field.name}
          ref={field.ref}
          onBlur={field.onBlur}
          value={field.value ? dayjs(field.value) : null}
          onChange={(date) => {
            if (date) {
              setValue('birthdayDate', date.toDate());
              filterDoctors();
            }
          }}
        />}
      />
      <div className={styles.error}>{errors.birthdayDate ? errors.birthdayDate.message : ''}</div>
    </div>
    <div className={styles.item}>
      <Controller
        name="sex"
        control={control}
        render={({ field }) => <Select
          placeholder="sex"
          {...field}
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
          ]}
          onChange={(value) => {
            field.onChange(value);
            filterSpecialityByGender();
          }}
        />}
      />
      <div className={styles.error}>{errors.sex ? errors.sex.message : ''}</div>
    </div>
    <div className={styles.item}>
      <Controller
        name="city"
        control={control}
        render={({ field }) => <Select
          {...field}
          placeholder='City'
          options={cities?.map(mapSelectItem)}
          onChange={(value) => {
            field.onChange(value);
            filterDoctors();
          }}
        />}
      />
      <div className={styles.error}>{errors.city ? errors.city.message : ''}</div>
    </div>
    <Controller
      name="speciality"
      control={control}
      render={({ field }) => <Select
        className={`${styles.item} ${styles.speciality}`}
        {...field}
        placeholder='Speciality'
        options={filteredSpecialities?.map(mapSelectItem)}
        onChange={(value) => {
          field.onChange(value);
          filterDoctors();
        }}
      />}
    />
    <div className={styles.item}>
      <Controller
        name="doctor"
        control={control}
        render={({ field }) => <Select
          {...field}
          placeholder='Doctors'
          options={filteredDoctors?.map(mapSelectItem)}
          onChange={(value) => {
            field.onChange(value);
            selectDoctor();
          }}
        />}
      />
      <div className={styles.error}>{errors.doctor ? errors.doctor.message : ''}</div>
    </div>
    <div className={styles.item}>
      <Controller
        name="email"
        control={control}
        render={({ field }) =>
          <Input placeholder="Email" {...field} />}
      />
      <div className={styles.error}>{errors.email ? errors.email.message : ''}</div>
    </div>
    <Controller
      name="phone"
      control={control}
      render={({ field }) =>
        <Input className={styles.item} placeholder="Phone" {...field} />}
    />

    <Button type="primary" onClick={handleSubmit(onSubmit)} loading={isLoading} disabled={isLoading} className={styles.item}>
      Send
    </Button>
  </Form>
}

export default DoctorForm;
