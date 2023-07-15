import { useNavigate, useParams } from "@solidjs/router";
import {
  Match,
  Show,
  Switch,
  createMemo,
  createRenderEffect,
  createSignal,
} from "solid-js";
import SiteHead from "../../../states/siteHead";
import PatientI, {
  PatientGenderE,
  patientDefault,
} from "../../../types/patient";
import reqGetPatientDetail from "../../../api/patient/reqGetPatientDetail";
import SitePath from "../../../data/path";
import reqAddPatient from "../../../api/patient/reqAddPatient";
import toast from "solid-toast";
import reqUpdatePatient from "../../../api/patient/reqUpdatePatient";
import InputText from "../../../components/form/InputText";
import InputDropdown from "../../../components/form/InputDropdown";
import InputDate from "../../../components/form/InputDate";
import formatPatientGender from "../../../utils/formatPatientGender";
import IconArrow from "../../../components/icon/Arrow";
import DistrictI from "../../../types/district";
import reqGetDistrictList from "../../../api/district/reqGetDistrictList";

export default function PatientUpsertScreen() {
  let formRef: HTMLFormElement | undefined;

  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = createSignal(false);
  const [patient, setPatient] = createSignal<PatientI>(patientDefault);
  const [districts, setDistricts] = createSignal<DistrictI[]>([]);

  const mode = createMemo(() => {
    if (params.id) {
      return "edit";
    } else {
      return "create";
    }
  });

  createRenderEffect(() => {
    if (mode() === "create") SiteHead.title = "Tambah Data Pasien";
    else if (mode() === "edit") SiteHead.title = "Ubah Data Pasien";
  });

  createRenderEffect(async () => {
    try {
      const res = await reqGetDistrictList();

      setDistricts(res.json.data);
    } catch (err) {
      console.error(err);
    }
  });

  createRenderEffect(async () => {
    if (!params.id) return;

    try {
      setIsLoading(true);

      const res = await reqGetPatientDetail({ id: params.id });

      setPatient(res.json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  });

  function navigateBack() {
    if (mode() === "create") {
      navigate(SitePath.dashboardPatientList, { replace: true });
    } else if (mode() === "edit") {
      navigate(SitePath.dashboardPatientDetail.replace(":id", params.id!), {
        replace: true,
      });
    }
  }

  async function onSave() {
    if (!formRef || isLoading()) return;

    if (!params.id) {
      await saveAddPatient();
    } else {
      await saveEditPatient();
    }
  }

  async function saveAddPatient() {
    try {
      setIsLoading(true);

      const data = {
        medicalRecordNumber: (
          formRef as typeof formRef & {
            medical_record_number: { value: string };
          }
        ).medical_record_number.value,
        familyCardNumber: (
          formRef as typeof formRef & {
            family_card_number: { value: string };
          }
        ).family_card_number.value,
        populationIdentificationNumber: (
          formRef as typeof formRef & {
            population_identification_number: { value: string };
          }
        ).population_identification_number.value,
        name: (
          formRef as typeof formRef & {
            name: { value: string };
          }
        ).name.value,
        gender: (
          formRef as typeof formRef & {
            gender: { value: PatientGenderE };
          }
        ).gender.value,
        placeOfBirth: (
          formRef as typeof formRef & {
            place_of_birth: { value: string };
          }
        ).place_of_birth.value,
        dateOfBirth: (
          formRef as typeof formRef & {
            date_of_birth: { value: string };
          }
        ).date_of_birth.value,
        address: (
          formRef as typeof formRef & {
            address: { value: string };
          }
        ).address.value,
        districtId: (
          formRef as typeof formRef & {
            district_id: { value: string };
          }
        ).district_id.value,
        job: (
          formRef as typeof formRef & {
            job: { value: string };
          }
        ).job.value,
        religion: (
          formRef as typeof formRef & {
            religion: { value: string };
          }
        ).religion.value,
        bloodGroup: (
          formRef as typeof formRef & {
            blood_group: { value: string };
          }
        ).blood_group.value,
        insurence: (
          formRef as typeof formRef & {
            insurence: { value: string };
          }
        ).insurence.value,
        insurenceNumber: (
          formRef as typeof formRef & {
            insurence_number: { value: string };
          }
        ).insurence_number.value,
        phone: (
          formRef as typeof formRef & {
            phone: { value: string };
          }
        ).phone.value,
      };

      if (data.dateOfBirth.split("T").length < 2) {
        data.dateOfBirth += "T00:00:00.000Z";
      }

      const res = await reqAddPatient(data);

      toast.success("Data berhasil disimpan");

      navigate(
        SitePath.dashboardPatientDetail.replace(":id", res.json.data.id),
        { replace: true }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveEditPatient() {
    if (!params.id) return;

    try {
      setIsLoading(true);

      const data = {
        id: params.id,
        medicalRecordNumber: (
          formRef as typeof formRef & {
            medical_record_number: { value: string };
          }
        ).medical_record_number.value,
        familyCardNumber: (
          formRef as typeof formRef & {
            family_card_number: { value: string };
          }
        ).family_card_number.value,
        populationIdentificationNumber: (
          formRef as typeof formRef & {
            population_identification_number: { value: string };
          }
        ).population_identification_number.value,
        name: (
          formRef as typeof formRef & {
            name: { value: string };
          }
        ).name.value,
        gender: (
          formRef as typeof formRef & {
            gender: { value: PatientGenderE };
          }
        ).gender.value,
        placeOfBirth: (
          formRef as typeof formRef & {
            place_of_birth: { value: string };
          }
        ).place_of_birth.value,
        dateOfBirth: (
          formRef as typeof formRef & {
            date_of_birth: { value: string };
          }
        ).date_of_birth.value,
        address: (
          formRef as typeof formRef & {
            address: { value: string };
          }
        ).address.value,
        districtId: (
          formRef as typeof formRef & {
            district_id: { value: string };
          }
        ).district_id.value,
        job: (
          formRef as typeof formRef & {
            job: { value: string };
          }
        ).job.value,
        religion: (
          formRef as typeof formRef & {
            religion: { value: string };
          }
        ).religion.value,
        bloodGroup: (
          formRef as typeof formRef & {
            blood_group: { value: string };
          }
        ).blood_group.value,
        insurence: (
          formRef as typeof formRef & {
            insurence: { value: string };
          }
        ).insurence.value,
        insurenceNumber: (
          formRef as typeof formRef & {
            insurence_number: { value: string };
          }
        ).insurence_number.value,
        phone: (
          formRef as typeof formRef & {
            phone: { value: string };
          }
        ).phone.value,
      };

      if (data.dateOfBirth.split("T").length < 2) {
        data.dateOfBirth += "T00:00:00.000Z";
      }

      const res = await reqUpdatePatient(data);

      toast.success("Data berhasil disimpan");

      navigate(
        SitePath.dashboardPatientDetail.replace(":id", res.json.data.id),
        {
          replace: true,
        }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div class="px-6 py-4 flex items-center gap-x-2">
        <button onclick={navigateBack}>
          <IconArrow class="w-6 h-6" direction="back" />
        </button>
        <h1 class="font-medium text-2xl">
          <Switch>
            <Match when={mode() === "create"}>Tambah Data Pasien</Match>
            <Match when={mode() === "edit"}>Ubah Data Pasien</Match>
          </Switch>
        </h1>
      </div>
      <div class="mt-2 px-6">
        <form
          ref={formRef}
          class="flex flex-col xl:flex-row gap-x-4 space-y-4 xl:space-y-0"
        >
          <div class="w-full max-w-[40rem] space-y-4">
            <InputTextItem
              title="Nomor Rekam Medis"
              name="medical_record_number"
              value={patient()?.medicalRecordNumber}
              onChangeValue={(text) =>
                setPatient((prev) => ({ ...prev, medicalRecordNumber: text }))
              }
              inputClass="mt-1 w-full max-w-[40rem]"
              isRequired={mode() === "create"}
            />
            <InputTextItem
              title="Nomor Kartu Keluarga"
              name="family_card_number"
              value={patient()?.familyCardNumber}
              onChangeValue={(text) =>
                setPatient((prev) => ({ ...prev, familyCardNumber: text }))
              }
              inputClass="mt-1 w-full max-w-[40rem]"
              isRequired={mode() === "create"}
            />
            <InputTextItem
              title="Nomor Induk Kependudukan"
              name="population_identification_number"
              value={patient()?.populationIdentificationNumber}
              onChangeValue={(text) =>
                setPatient((prev) => ({
                  ...prev,
                  populationIdentificationNumber: text,
                }))
              }
              inputClass="mt-1 w-full max-w-[40rem]"
              isRequired={mode() === "create"}
            />
            <InputTextItem
              title="Nama Lengkap Pasien"
              name="name"
              value={patient()?.name}
              onChangeValue={(text) =>
                setPatient((prev) => ({ ...prev, name: text }))
              }
              inputClass="mt-1 w-full max-w-[40rem]"
              isRequired={mode() === "create"}
            />
            <InputDropdownItem
              title="Jenis Kelamin"
              name="gender"
              value={{
                title: formatPatientGender(patient()!.gender),
                value: patient().gender,
              }}
              onChangeValue={(text) =>
                setPatient((prev) => ({
                  ...prev,
                  gender: text as PatientGenderE,
                }))
              }
              options={[
                {
                  title: formatPatientGender(PatientGenderE.Male),
                  value: PatientGenderE.Male,
                },
                {
                  title: formatPatientGender(PatientGenderE.Female),
                  value: PatientGenderE.Female,
                },
              ]}
              isRequired={mode() === "create"}
            />
            <div class="w-full max-w-[40rem] flex gap-x-2">
              <InputTextItem
                title="Tempat Lahir"
                name="place_of_birth"
                value={patient()?.placeOfBirth}
                onChangeValue={(text) =>
                  setPatient((prev) => ({ ...prev, placeOfBirth: text }))
                }
                outerClass="flex-1"
                inputClass="mt-1 w-full"
                isRequired={mode() === "create"}
              />
              <InputDateItem
                title="Tanggal Lahir"
                name="date_of_birth"
                value={patient()?.dateOfBirth}
                onChangeValue={(text) =>
                  setPatient((prev) => ({ ...prev, dateOfBirth: text }))
                }
                outerClass="flex-1"
                inputClass="mt-1 w-full"
                isRequired={mode() === "create"}
              />
            </div>
            <InputTextItem
              title="Alamat"
              name="address"
              value={patient()?.address}
              onChangeValue={(text) =>
                setPatient((prev) => ({ ...prev, address: text }))
              }
              inputClass="mt-1 w-full max-w-[40rem]"
              isRequired={mode() === "create"}
            />
          </div>
          <div class="w-full max-w-[40rem] space-y-4">
            <InputDropdownItem
              title="Wilayah"
              name="district_id"
              value={{
                title:
                  districts().find((d) => d.id === patient().districtId)
                    ?.name ?? "-",
                value: patient().districtId ?? "-",
              }}
              onChangeValue={(val) =>
                setPatient((prev) => ({ ...prev, districtId: val }))
              }
              options={districts().map((d) => ({ title: d.name, value: d.id }))}
              isRequired={mode() === "create"}
            />
            <InputTextItem
              title="Pekerjaan"
              name="job"
              value={patient()?.job}
              onChangeValue={(text) =>
                setPatient((prev) => ({ ...prev, job: text }))
              }
              inputClass="mt-1 w-full max-w-[40rem]"
              isRequired={mode() === "create"}
            />
            <InputTextItem
              title="Agama"
              name="religion"
              value={patient()?.religion}
              onChangeValue={(text) =>
                setPatient((prev) => ({ ...prev, religion: text }))
              }
              inputClass="mt-1 w-full max-w-[40rem]"
              isRequired={mode() === "create"}
            />
            <InputTextItem
              title="Golongan Darah"
              name="blood_group"
              value={patient()?.bloodGroup}
              onChangeValue={(text) =>
                setPatient((prev) => ({ ...prev, bloodGroup: text }))
              }
              inputClass="mt-1 w-full max-w-[40rem]"
              isRequired={mode() === "create"}
            />
            <InputTextItem
              title="Asuransi"
              name="insurence"
              value={patient()?.insurence}
              onChangeValue={(text) =>
                setPatient((prev) => ({ ...prev, insurence: text }))
              }
              inputClass="mt-1 w-full max-w-[40rem]"
              isRequired={mode() === "create"}
            />
            <InputTextItem
              title="Nomor Asuransi"
              name="insurence_number"
              value={patient()?.insurenceNumber}
              onChangeValue={(text) =>
                setPatient((prev) => ({ ...prev, insurenceNumber: text }))
              }
              inputClass="mt-1 w-full max-w-[40rem]"
              isRequired={mode() === "create"}
            />
            <InputTextItem
              title="Nomor Telepon"
              name="phone"
              value={patient()?.phone}
              onChangeValue={(text) =>
                setPatient((prev) => ({ ...prev, phone: text }))
              }
              inputClass="mt-1 w-full max-w-[40rem]"
              isRequired={mode() === "create"}
            />
          </div>
        </form>
      </div>
      <div class="mt-6 mx-6">
        <button
          type="button"
          onclick={onSave}
          class="block px-4 py-2 bg-light_sea_green text-white rounded-lg text-sm"
        >
          Simpan
        </button>
      </div>
    </>
  );
}

interface InputTextItemProps {
  title: string;
  name: string;
  value?: string;
  onChangeValue: (text: string) => void;
  outerClass?: string;
  inputClass?: string;
  isRequired?: boolean;
}

function InputTextItem(props: InputTextItemProps) {
  return (
    <div class={props.outerClass}>
      <div>
        <span>{props.title}</span>
        <Show when={props.isRequired}>
          <span class="text-candy_apple_red">*</span>
        </Show>
      </div>
      <div class={props.inputClass}>
        <InputText
          name={props.name}
          value={props.value}
          onChangeValue={props.onChangeValue}
        />
      </div>
    </div>
  );
}

interface InputDropdownItemProps {
  title: string;
  name: string;
  value?: { title: string; value: string };
  onChangeValue: (text: string) => void;
  placeholder?: string;
  options: { title: string; value: string }[];
  isRequired?: boolean;
}

function InputDropdownItem(props: InputDropdownItemProps) {
  return (
    <div>
      <div>
        <span>{props.title}</span>
        <Show when={props.isRequired}>
          <span class="text-candy_apple_red">*</span>
        </Show>
      </div>
      <div class="mt-1 w-full max-w-[40rem]">
        <InputDropdown
          name={props.name}
          value={props.value}
          onChangeValue={props.onChangeValue}
          options={props.options}
        />
      </div>
    </div>
  );
}

interface InputDateItemProps {
  title: string;
  name: string;
  value?: string;
  onChangeValue: (text: string) => void;
  outerClass?: string;
  inputClass?: string;
  isRequired?: boolean;
}

function InputDateItem(props: InputDateItemProps) {
  return (
    <div class={props.outerClass}>
      <div>
        <span>{props.title}</span>
        <Show when={props.isRequired}>
          <span class="text-candy_apple_red">*</span>
        </Show>
      </div>
      <div class={props.inputClass}>
        <InputDate
          name={props.name}
          value={props.value}
          onChangeValue={props.onChangeValue}
        />
      </div>
    </div>
  );
}
