import { A, Outlet, useLocation, useNavigate } from "@solidjs/router";
import SitePath from "../../data/path";
import HorizontalSeparator from "../../components/separator/HorizontalSeparator";
import IconLogOut from "../../components/icon/LogOut";
import IconPeople from "../../components/icon/People";
import IconPersonAdd from "../../components/icon/PersonAdd";
import IconHome from "../../components/icon/Home";
import { JSXElement, Show } from "solid-js";
import checkIsEqualPath from "../../utils/checkIsEqualPath";
import IconLocation from "../../components/icon/Location";
import AccountAuth from "../../states/accountAuth";
import getBgProfilePicture from "../../utils/getBgProfilePicture";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { AccountRoleE } from "../../types/account";
import IconSettings from "../../components/icon/Settings";

export default function DashboardWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  function signOut() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <>
      <div class="fixed z-10 top-0 left-0 w-60 h-full flex flex-col bg-light_sea_green">
        <div class="w-fit max-w-full mt-8 px-4 mx-auto">
          <div
            class="w-32 h-32 mx-auto flex items-center justify-center text-white text-7xl rounded-full overflow-hidden"
            style={{
              "background-color": AccountAuth.data().name
                ? getBgProfilePicture(AccountAuth.data().name[0].toUpperCase())
                : "transparent",
            }}
          >
            <Show
              when={AccountAuth.data().name}
              fallback={<LoadingSkeleton width="100%" height="100%" />}
            >
              {AccountAuth.data().name[0].toUpperCase()}
            </Show>
          </div>
          <div class="mt-2">
            <Show
              when={AccountAuth.data().name}
              fallback={<LoadingSkeleton width="100%" height="1.5rem" />}
            >
              <span class="block text-white text-center truncate">
                {AccountAuth.data().name}
              </span>
            </Show>
          </div>
        </div>
        <div class="py-4">
          <HorizontalSeparator height={1} />
        </div>
        <nav class="flex-1 px-2 space-y-2 overflow-y-auto">
          <NavItem
            href={SitePath.dashboard}
            icon={<IconHome type="filled" class="w-5 h-5 text-white" />}
            title="Beranda"
            isActive={checkIsEqualPath(SitePath.dashboard, location.pathname)}
          />
          <NavItem
            href={SitePath.dashboardPatientList}
            icon={<IconPersonAdd type="filled" class="w-5 h-5 text-white" />}
            title="Pasien"
            isActive={
              checkIsEqualPath(
                SitePath.dashboardPatientList,
                location.pathname
              ) ||
              checkIsEqualPath(
                SitePath.dashboardPatientDetail,
                location.pathname
              ) ||
              checkIsEqualPath(
                SitePath.dashboardPatientCreate,
                location.pathname
              ) ||
              checkIsEqualPath(
                SitePath.dashboardPatientEdit,
                location.pathname
              ) ||
              checkIsEqualPath(
                SitePath.dashboardPatientExaminationCreate,
                location.pathname
              ) ||
              checkIsEqualPath(
                SitePath.dashboardPatientExaminationEdit,
                location.pathname
              ) ||
              checkIsEqualPath(
                SitePath.dashboardPatientExaminationList,
                location.pathname
              )
            }
          />
          <NavItem
            href={SitePath.dashboardDistrictList}
            icon={<IconLocation type="filled" class="w-5 h-5 text-white" />}
            title="Wilayah"
            isActive={
              checkIsEqualPath(
                SitePath.dashboardDistrictList,
                location.pathname
              ) ||
              checkIsEqualPath(
                SitePath.dashboardDistrictDetail,
                location.pathname
              ) ||
              checkIsEqualPath(
                SitePath.dashboardDistrictCreate,
                location.pathname
              ) ||
              checkIsEqualPath(
                SitePath.dashboardDistrictEdit,
                location.pathname
              )
            }
          />
          <Show when={AccountAuth.data().role === AccountRoleE.SuperAdmin}>
            <NavItem
              href={SitePath.dashboardSetting}
              icon={<IconSettings type="filled" class="w-5 h-5 text-white" />}
              title="Pengaturan"
              isActive={
                checkIsEqualPath(
                  SitePath.dashboardSetting,
                  location.pathname
                ) ||
                checkIsEqualPath(
                  SitePath.dashboardSettingEdit,
                  location.pathname
                )
              }
            />
            <NavItem
              href={SitePath.dashboardAccountList}
              icon={<IconPeople type="filled" class="w-5 h-5 text-white" />}
              title="Akun"
              isActive={
                checkIsEqualPath(
                  SitePath.dashboardAccountList,
                  location.pathname
                ) ||
                checkIsEqualPath(
                  SitePath.dashboardAccountDetail,
                  location.pathname
                ) ||
                checkIsEqualPath(
                  SitePath.dashboardAccountCreate,
                  location.pathname
                ) ||
                checkIsEqualPath(
                  SitePath.dashboardAccountEdit,
                  location.pathname
                )
              }
            />
          </Show>
        </nav>
        <div class="px-2">
          <button
            type="button"
            onclick={signOut}
            class="block w-full py-2 px-4 flex items-center gap-x-2"
          >
            <span>
              <IconLogOut type="filled" class="w-5 h-5 text-white" />
            </span>
            <span class=" text-white">Keluar</span>
          </button>
        </div>
      </div>
      <div class="flex-1 ml-60 flex flex-col">
        <Outlet />
      </div>
    </>
  );
}

interface NavItemProps {
  href: string;
  icon: JSXElement;
  title: string;
  isActive?: boolean;
}

function NavItem(props: NavItemProps) {
  return (
    <div>
      <A
        href={props.href}
        class="block py-2 px-4 flex items-center gap-x-2 rounded-lg"
        classList={{ "bg-white/20": props.isActive }}
      >
        <span>{props.icon}</span>
        <span class="text-white">{props.title}</span>
      </A>
    </div>
  );
}
