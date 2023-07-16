import { useNavigate, useParams } from "@solidjs/router";
import {
  Match,
  Show,
  Switch,
  createMemo,
  createRenderEffect,
  createSignal,
} from "solid-js";
import PatientExaminationI, {
  patientExaminationDefault,
} from "../../../types/patientExamination";
import SiteHead from "../../../states/siteHead";
import reqGetPatientExaminationDetail from "../../../api/patientExamination/reqGetPatientExaminationDetail";
import SitePath from "../../../data/path";
import reqAddPatientExamination from "../../../api/patientExamination/reqAddPatientExamination";
import toast from "solid-toast";
import reqUpdatePatientExamination from "../../../api/patientExamination/reqUpdatePatientExamination";
import IconArrow from "../../../components/icon/Arrow";
import InputDatetime from "../../../components/form/InputDateTime";
import MarkdownEditor from "../../../components/markdown/MarkdownEditor";
import Loading from "../../../components/loading/Loading";

export default function PatientExaminationUpsertScreen() {
  let formRef: HTMLFormElement | undefined;

  const params = useParams<{ id: string; examId?: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = createSignal(false);
  const [patientExamination, setPatientExamination] =
    createSignal<PatientExaminationI>(patientExaminationDefault);

  const mode = createMemo(() => {
    if (params.examId) {
      return "edit";
    } else {
      return "create";
    }
  });

  createRenderEffect(() => {
    if (mode() === "create") SiteHead.title = "Tambah Data Riwayat Pemeriksaan";
    else if (mode() === "edit")
      SiteHead.title = "Ubah Data Riwayat Pemeriksaan";
  });

  createRenderEffect(async () => {
    if (!params.examId) return;

    try {
      setIsLoading(true);

      const res = await reqGetPatientExaminationDetail({ id: params.examId });

      setPatientExamination(res.json.data);
    } catch (err) {
      console.error(err);
      toast.error(err as string);
    } finally {
      setIsLoading(false);
    }
  });

  function navigateBack() {
    navigate(SitePath.dashboardPatientDetail.replace(":id", params.id!), {
      replace: true,
    });
  }

  async function onSave() {
    if (!formRef || isLoading()) return;

    if (!params.examId) {
      await saveAddPatientExamination();
    } else {
      await saveEditPatientExamination();
    }
  }

  async function saveAddPatientExamination() {
    try {
      setIsLoading(true);

      const data = {
        patientId: params.id,
        examinationTime: (
          formRef as typeof formRef & { examination_time: { value: string } }
        ).examination_time.value,
        examination: (
          formRef as typeof formRef & { examination: { value: string } }
        ).examination.value,
        treatment: (
          formRef as typeof formRef & { treatment: { value: string } }
        ).treatment.value,
      };

      data.examinationTime = new Date(data.examinationTime).toISOString();

      await reqAddPatientExamination(data);

      toast.success("Data berhasil disimpan");

      navigate(SitePath.dashboardPatientDetail.replace(":id", params.id), {
        replace: true,
      });
    } catch (err) {
      console.error(err);
      toast.error(err as string);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveEditPatientExamination() {
    if (!params.examId) return;

    try {
      setIsLoading(true);

      const data = {
        id: params.examId,
        patientId: params.id,
        examinationTime: (
          formRef as typeof formRef & { examination_time: { value: string } }
        ).examination_time.value,
        examination: (
          formRef as typeof formRef & { examination: { value: string } }
        ).examination.value,
        treatment: (
          formRef as typeof formRef & { treatment: { value: string } }
        ).treatment.value,
      };

      data.examinationTime = new Date(data.examinationTime).toISOString();

      await reqUpdatePatientExamination(data);

      toast.success("Data berhasil disimpan");

      navigate(SitePath.dashboardPatientDetail.replace(":id", params.id), {
        replace: true,
      });
    } catch (err) {
      console.error(err);
      toast.error(err as string);
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
            <Match when={mode() === "create"}>
              Tambah Data Riwayat Pemeriksaan
            </Match>
            <Match when={mode() === "edit"}>
              Ubah Data Riwayat Pemeriksaan
            </Match>
          </Switch>
        </h1>
      </div>
      <Show when={mode() === "create" || (mode() === "edit" && !isLoading())}>
        <div class="mt-2 px-6">
          <form ref={formRef} class="space-y-4">
            <InputDatetimeItem
              title="Waktu Pemeriksaan"
              name="examination_time"
              value={patientExamination().examinationTime}
              onChangeValue={(val) =>
                setPatientExamination((prev) => ({
                  ...prev,
                  examinationTime: val,
                }))
              }
              inputClass="mt-1 w-full max-w-[40rem]"
              isRequired={mode() === "create"}
            />
            <MarkdownItem
              title="Pemeriksaan/Diagnosis"
              name="examination"
              value={patientExamination().examination}
              onChangeValue={(val) =>
                setPatientExamination((prev) => ({ ...prev, examination: val }))
              }
              inputClass="mt-1"
              isRequired={mode() === "create"}
            />
            <MarkdownItem
              title="Tindakan/Terapi"
              name="treatment"
              value={patientExamination().treatment}
              onChangeValue={(val) =>
                setPatientExamination((prev) => ({ ...prev, treatment: val }))
              }
              inputClass="mt-1"
              isRequired={mode() === "create"}
            />
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
      </Show>
      <Show when={isLoading()}>
        <div class="mt-6 px-6">
          <Loading />
        </div>
      </Show>
    </>
  );
}

interface InputDatetimeItemProps {
  title: string;
  name: string;
  value?: string;
  onChangeValue: (text: string) => void;
  outerClass?: string;
  inputClass?: string;
  isRequired?: boolean;
}

function InputDatetimeItem(props: InputDatetimeItemProps) {
  return (
    <div class={props.outerClass}>
      <div>
        <span>{props.title}</span>
        <Show when={props.isRequired}>
          <span class="text-candy_apple_red">*</span>
        </Show>
      </div>
      <div class={props.inputClass}>
        <InputDatetime
          name={props.name}
          value={props.value}
          onChangeValue={props.onChangeValue}
        />
      </div>
    </div>
  );
}

interface MarkdownItemProps {
  title: string;
  name: string;
  inputClass?: string;
  value: string;
  onChangeValue: (text: string) => void;
  isRequired?: boolean;
}

function MarkdownItem(props: MarkdownItemProps) {
  return (
    <div>
      <div>
        <span>{props.title}</span>
        <Show when={props.isRequired}>
          <span class="text-candy_apple_red">*</span>
        </Show>
      </div>
      <div class={props.inputClass}>
        <MarkdownEditor
          name={props.name}
          value={props.value}
          setEditorVal={props.onChangeValue}
        />
      </div>
    </div>
  );
}
