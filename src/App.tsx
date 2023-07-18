import { Navigate, RouteDefinition, useRoutes } from "@solidjs/router";
import { lazy, type Component, createRenderEffect } from "solid-js";
import SitePath from "./data/path";
import getLastScreenPath from "./utils/getLastScreenPath";
import SiteHead from "./states/siteHead";
import Head from "./components/head/Head";
import { Toaster } from "solid-toast";
import AccountAuth from "./states/accountAuth";
import { marked } from "marked";
import { mangle } from "marked-mangle";
import { gfmHeadingId } from "marked-gfm-heading-id";

const routes: RouteDefinition[] = [
  {
    path: SitePath.base,
    component: lazy(() => import("./screens/MainWrapper")),
    children: [
      {
        path: "/",
        component: lazy(() => import("./screens/HomeScreen")),
      },
      {
        path: getLastScreenPath(SitePath.signin),
        component: lazy(() => import("./screens/SigninScreen")),
      },
      {
        path: getLastScreenPath(SitePath.dashboard),
        component: lazy(() => import("./screens/dashboard/DashboardWrapper")),
        children: [
          {
            path: "/",
            component: lazy(() => import("./screens/dashboard/HomeScreen")),
          },
          {
            path: getLastScreenPath(SitePath.dashboardPatientCreate),
            component: lazy(
              () => import("./screens/dashboard/patients/PatientUpsert")
            ),
          },
          {
            path: getLastScreenPath(SitePath.dashboardPatientList),
            children: [
              {
                path: "/",
                component: lazy(
                  () => import("./screens/dashboard/patients/PatientList")
                ),
              },
              {
                path: getLastScreenPath(SitePath.dashboardPatientDetail),
                children: [
                  {
                    path: "/",
                    component: lazy(
                      () => import("./screens/dashboard/patients/PatientDetail")
                    ),
                  },
                  {
                    path: getLastScreenPath(SitePath.dashboardPatientEdit),
                    component: lazy(
                      () => import("./screens/dashboard/patients/PatientUpsert")
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: getLastScreenPath(SitePath.dashboardAccountCreate),
            component: lazy(
              () => import("./screens/dashboard/accounts/AccountUpsert")
            ),
          },
          {
            path: getLastScreenPath(SitePath.dashboardAccountList),
            children: [
              {
                path: "/",
                component: lazy(
                  () => import("./screens/dashboard/accounts/AccountList")
                ),
              },
              {
                path: getLastScreenPath(SitePath.dashboardAccountDetail),
                children: [
                  {
                    path: "/",
                    component: lazy(
                      () => import("./screens/dashboard/accounts/AccountDetail")
                    ),
                  },
                  {
                    path: getLastScreenPath(SitePath.dashboardAccountEdit),
                    component: lazy(
                      () => import("./screens/dashboard/accounts/AccountUpsert")
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: getLastScreenPath(SitePath.dashboardDistrictCreate),
            component: lazy(
              () => import("./screens/dashboard/districts/DistrictUpsert")
            ),
          },
          {
            path: getLastScreenPath(SitePath.dashboardDistrictList),
            children: [
              {
                path: "/",
                component: lazy(
                  () => import("./screens/dashboard/districts/DistrictList")
                ),
              },
              {
                path: getLastScreenPath(SitePath.dashboardDistrictDetail),
                children: [
                  {
                    path: "/",
                    component: lazy(
                      () =>
                        import("./screens/dashboard/districts/DistrictDetail")
                    ),
                  },
                  {
                    path: getLastScreenPath(SitePath.dashboardDistrictEdit),
                    component: lazy(
                      () =>
                        import("./screens/dashboard/districts/DistrictUpsert")
                    ),
                  },
                  {
                    path: getLastScreenPath(
                      SitePath.dashboardPatientExaminationCreate
                    ),
                    component: lazy(
                      () =>
                        import(
                          "./screens/dashboard/patients/PatientExaminationUpsert"
                        )
                    ),
                  },
                  {
                    path: getLastScreenPath(
                      SitePath.dashboardPatientExaminationList
                    ),
                    children: [
                      {
                        path: "/",
                        component: lazy(
                          () =>
                            import(
                              "./screens/dashboard/patients/patientExaminationList"
                            )
                        ),
                      },
                      {
                        path: getLastScreenPath(
                          SitePath.dashboardPatientExaminationEdit
                        ),
                        component: lazy(
                          () =>
                            import(
                              "./screens/dashboard/patients/PatientExaminationUpsert"
                            )
                        ),
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: getLastScreenPath(SitePath.dashboardSetting),
            children: [
              {
                path: "/",
                component: lazy(
                  () => import("./screens/dashboard/setting/Setting")
                ),
              },
              {
                path: getLastScreenPath(SitePath.dashboardSettingEdit),
                component: lazy(
                  () => import("./screens/dashboard/setting/SettingEdit")
                ),
              },
            ],
          },
        ],
      },
    ],
  },
];

const App: Component = () => {
  const Routes = useRoutes(routes);

  createRenderEffect(() => {
    SiteHead.init();
    AccountAuth.init();
    marked.use(mangle(), gfmHeadingId());
  });

  return (
    <>
      <Head />
      <Routes />
      <Toaster />
    </>
  );
};

export default App;
