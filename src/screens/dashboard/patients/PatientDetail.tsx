import { A, useNavigate, useParams } from "@solidjs/router";
import {
  For,
  Show,
  createMemo,
  createRenderEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import PatientI from "../../../types/patient";
import SiteHead from "../../../states/siteHead";
import reqGetPatientDetail from "../../../api/patient/reqGetPatientDetail";
import SitePath from "../../../data/path";
import reqDeletePatient from "../../../api/patient/reqDeletePatient";
import IconArrow from "../../../components/icon/Arrow";
import { formatDate, formatDatetime } from "../../../utils/formatDatetime";
import formatGender from "../../../utils/formatGender";
import DistrictI, { districtDefault } from "../../../types/district";
import reqGetDistrictDetail from "../../../api/district/reqGetDistrictDetail";
import PatientExaminationI from "../../../types/patientExamination";
import reqGetPatientExaminationList from "../../../api/patientExamination/reqGetPatientExaminationList";
import styles from "../../../styles/markdown.module.css";
import DOMPurify from "dompurify";
import { marked } from "marked";
import reqDeletePatientExamination from "../../../api/patientExamination/reqDeletePatientExamination";
import NoData from "../../../components/nodata/NoData";
import reqGetPatientList from "../../../api/patient/reqGetPatientList";
import formatRelationshipInFamily from "../../../utils/formatRelationshipInFamily";
import Loading from "../../../components/loading/Loading";
import toast from "solid-toast";
import formatSalutation from "../../../utils/formatSalutation";
import { PaginationI, paginationDefault } from "../../../types/api";

export default function PatientDetailScreen() {
  let bottomItemPatientExaminationsElRef: HTMLDivElement | undefined;

  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = createSignal(false);
  const [isLoadingPatientExaminations, setIsLoadingPatientExaminations] =
    createSignal(false);
  const [patient, setPatient] = createSignal<PatientI>();
  const [family, setFamily] = createSignal<PatientI[]>([]);
  const [patientExaminations, setPatientExaminations] = createSignal<
    PatientExaminationI[]
  >([]);
  const [district, setDistrict] = createSignal<DistrictI>(districtDefault);

  const [lastPatientExaminationsId, setLastPatientExaminationsId] =
    createSignal<string>();
  const [paginationPatientExaminations, setPaginationPatientExaminations] =
    createSignal<PaginationI>(paginationDefault);
  const isAllPatientExaminationsFetched = createMemo(() => {
    if (
      !isLoading() &&
      patientExaminations().length >= paginationPatientExaminations().total
    ) {
      return true;
    }
    return false;
  });

  createRenderEffect(() => {
    SiteHead.title = "Detail Pasien";
  });

  createRenderEffect(async () => {
    try {
      setIsLoading(true);

      const resPatient = await reqGetPatientDetail({ id: params.id });
      const [resFamily, resDistrict] = await Promise.all([
        reqGetPatientList({
          searchByMedicalRecordNumber: (() => {
            const rm = resPatient.json.data.medicalRecordNumber.split(".");
            const familyRm = rm.slice(0, rm.length - 1);
            return familyRm.join(".");
          })(),
          limit: 100,
        }),
        reqGetDistrictDetail({
          id: resPatient.json.data.districtId,
        }),
      ]);

      if (!resPatient.status.toString().startsWith("2")) {
        navigate(SitePath.dashboardPatientList, { replace: true });
      }

      setPatient(resPatient.json.data);
      setFamily(resFamily.json.data);
      setDistrict(resDistrict.json.data);
    } catch (err) {
      console.error(err);
      toast.error(err as string);
      navigate(SitePath.dashboardPatientList, { replace: true });
    } finally {
      setIsLoading(false);
    }
  });

  createRenderEffect(async () => {
    try {
      setIsLoadingPatientExaminations(true);

      const res = await reqGetPatientExaminationList({
        patientId: params.id,
        lastId: lastPatientExaminationsId(),
      });

      setPatientExaminations((data) => [...data, ...res.json.data]);
      setPaginationPatientExaminations(res.json.pagination);
    } catch (err) {
      console.error(err);
      toast.error(err as string);
    } finally {
      setIsLoadingPatientExaminations(false);

      nextPageIfBottomItemPatientExaminationsElInViewport();
    }
  });

  onMount(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (isAllPatientExaminationsFetched()) {
          if (bottomItemPatientExaminationsElRef)
            observer.unobserve(bottomItemPatientExaminationsElRef);
          return;
        }
        nextPageIfBottomItemPatientExaminationsElInViewport();
      }
    });

    if (bottomItemPatientExaminationsElRef)
      observer.observe(bottomItemPatientExaminationsElRef);

    onCleanup(() => {
      if (bottomItemPatientExaminationsElRef)
        observer.unobserve(bottomItemPatientExaminationsElRef);
    });
  });

  function nextPagePatientExaminations() {
    if (isLoadingPatientExaminations() || isAllPatientExaminationsFetched())
      return;
    const id = patientExaminations().at(-1)?.id;
    if (!id) return;
    setLastPatientExaminationsId(id);
  }

  function nextPageIfBottomItemPatientExaminationsElInViewport() {
    const rect = bottomItemPatientExaminationsElRef?.getBoundingClientRect();
    if (!rect) return;
    if (rect.top <= document.documentElement.clientHeight) {
      nextPagePatientExaminations();
    }
  }

  function navigateBack() {
    navigate(SitePath.dashboardPatientList, { replace: true });
  }

  async function deletePatient() {
    try {
      setIsLoading(true);

      await reqDeletePatient({ id: params.id });

      navigate(SitePath.dashboardPatientList, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err as string);
    } finally {
      setIsLoading(false);
    }
  }

  async function deletePatientExamination(id: string) {
    try {
      await reqDeletePatientExamination({ id });

      setPatientExaminations((prev) => [...prev.filter((p) => p.id !== id)]);
    } catch (err) {
      console.error(err);
      toast.error(err as string);
    }
  }

  return (
    <>
      <div class="px-6 py-4 flex items-center gap-x-2">
        <button onclick={navigateBack}>
          <IconArrow class="w-6 h-6" direction="back" />
        </button>
        <h1 class="font-medium text-2xl">Detail Pasien</h1>
      </div>
      <div class="mx-6 flex gap-x-2">
        <A
          href={SitePath.dashboardPatientEdit.replace(":id", params.id)}
          class="block w-fit px-4 py-2 bg-light_sea_green text-white rounded-lg text-sm"
        >
          Ubah
        </A>
        <button
          type="button"
          onclick={deletePatient}
          class="block w-fit px-4 py-2 bg-candy_apple_red text-white rounded-lg text-sm"
        >
          Hapus
        </button>
      </div>
      <div class="mt-8 px-6">
        <Show when={patient() && !isLoading()}>
          <div class="flex flex-col xl:flex-row gap-x-4 space-y-4 xl:space-y-0">
            <div class="w-full max-w-[40rem] space-y-4">
              <TextItem
                title="Nomor Rekam Medis (No. RM)"
                value={patient()!.medicalRecordNumber}
              />
              <TextItem
                title="Nomor Induk Kependudukan (No. NIK)"
                value={patient()!.populationIdentificationNumber}
              />
              <TextItem
                title="Nama Lengkap Pasien"
                value={
                  patient()!.salutation
                    ? `${formatSalutation(patient()!.salutation)} ${
                        patient()!.name
                      }`
                    : patient()!.name
                }
              />
              <div class="w-full max-w-[40rem] flex gap-x-2">
                <div class="flex-1">
                  <TextItem
                    title="Tempat Lahir"
                    value={patient()!.placeOfBirth}
                  />
                </div>
                <div class="flex-1">
                  <TextItem
                    title="Tanggal Lahir"
                    value={formatDate(patient()!.dateOfBirth)}
                  />
                </div>
              </div>
              <TextItem
                title="Jenis Kelamin"
                value={formatGender(patient()!.gender)}
              />
              <TextItem title="Asuransi" value={patient()!.insurence} />
              <TextItem title="Pekerjaan" value={patient()!.job} />
              <TextItem title="Nomor Telepon" value={patient()!.phone} />
            </div>
            <div class="w-full max-w-[40rem] space-y-4">
              <TextItem title="Wilayah" value={district()!.name} />
              <TextItem
                title="Nomor Kartu Keluarga (No. KK)"
                value={patient()!.familyCardNumber}
              />
              <TextItem
                title="Status Hubungan Dalam Keluarga"
                value={formatRelationshipInFamily(
                  patient()!.relationshipInFamily
                )}
              />
              <TextItem title="Alamat" value={patient()!.address} />
              <TextItem title="Golongan Darah" value={patient()!.bloodGroup} />
              <TextItem
                title="Nomor Asuransi"
                value={patient()!.insurenceNumber}
              />
              <TextItem title="Agama" value={patient()!.religion} />
            </div>
          </div>
        </Show>
        <Show when={isLoading()}>
          <Loading />
        </Show>
      </div>
      <div class="mt-8 px-6 py-4">
        <h2 class="font-medium text-2xl">Anggota Keluarga</h2>
      </div>
      <div class="px-6">
        <Show when={family().length && !isLoading()}>
          <table class="w-full table-auto border-collapse border border-slate-500 text-sm">
            <thead>
              <tr>
                <th class="p-2 border border-slate-600">No. RM</th>
                <th class="p-2 border border-slate-600">Nama Lengkap</th>
                <th class="p-2 border border-slate-600">
                  Status Hubungan Dalam Keluarga
                </th>
              </tr>
            </thead>
            <tbody>
              <For each={family()}>
                {(f) => (
                  <tr>
                    <td class="p-2 border border-slate-700">
                      <A
                        href={SitePath.dashboardPatientDetail.replace(
                          ":id",
                          f.id
                        )}
                        class="underline"
                      >
                        {f.medicalRecordNumber}
                      </A>
                    </td>
                    <td class="p-2 border border-slate-700">
                      <A
                        href={SitePath.dashboardPatientDetail.replace(
                          ":id",
                          f.id
                        )}
                        class="underline"
                      >
                        {f.name}
                      </A>
                    </td>
                    <td class="p-2 border border-slate-700">
                      {formatRelationshipInFamily(f.relationshipInFamily)}
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </Show>
        <Show when={isLoading()}>
          <Loading />
        </Show>
      </div>
      <div class="mt-8 px-6 py-4">
        <h2 class="font-medium text-2xl">Riwayat Pemeriksaan</h2>
      </div>
      <div class="mx-6">
        <A
          href={SitePath.dashboardPatientExaminationCreate.replace(
            ":id",
            params.id
          )}
          class="block w-fit px-4 py-2 bg-light_sea_green text-white rounded-lg text-sm"
        >
          Tambah data
        </A>
      </div>
      <div class="mt-8 px-6">
        <Show when={patientExaminations().length}>
          <table class="w-full table-auto border-collapse border border-slate-500 text-sm">
            <thead>
              <tr>
                <th class="p-2 border border-slate-600">Tanggal Pemeriksaan</th>
                <th class="p-2 border border-slate-600">
                  Pemeriksaan/Diagnosis
                </th>
                <th class="p-2 border border-slate-600">Tindakan/Terapi</th>
                <th class="min-w-[12rem] p-2 border border-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <For each={patientExaminations()}>
                {(p) => (
                  <tr>
                    <td class="p-2 border border-slate-700">
                      {formatDatetime(p.examinationTime)}
                    </td>
                    <td class="p-2 border border-slate-700">
                      <p
                        innerHTML={DOMPurify.sanitize(
                          marked.parse(p.examination)
                        )}
                        class={`text-justify break-words ${styles.content}`}
                      />
                    </td>
                    <td class="p-2 border border-slate-700">
                      <p
                        innerHTML={DOMPurify.sanitize(
                          marked.parse(p.treatment)
                        )}
                        class={`text-justify break-words ${styles.content}`}
                      />
                    </td>
                    <td class="p-2 border border-slate-700 space-x-2">
                      <A
                        href={SitePath.dashboardPatientExaminationEdit
                          .replace(":id", params.id)
                          .replace(":examId", p.id)}
                        class="px-4 py-1 border border-black/50 rounded-lg"
                      >
                        Edit
                      </A>
                      <button
                        type="button"
                        onclick={() => deletePatientExamination(p.id)}
                        class="px-4 py-1 border border-black/50 rounded-lg"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </Show>
        <Show when={isLoadingPatientExaminations()}>
          <Loading />
        </Show>
        <Show
          when={
            !isLoadingPatientExaminations() && !patientExaminations().length
          }
        >
          <NoData />
        </Show>
        <div ref={bottomItemPatientExaminationsElRef} />
      </div>
    </>
  );
}

interface TextItemProps {
  title: string;
  value: string;
}

function TextItem(props: TextItemProps) {
  return (
    <div>
      <div>
        <span>{props.title}</span>
      </div>
      <div class="mt-1 w-full max-w-[40rem]">
        <div class="w-full py-2 px-4 bg-black/5 border border-black/30 rounded-lg">
          <span class="block h-6">{props.value}</span>
        </div>
      </div>
    </div>
  );
}
