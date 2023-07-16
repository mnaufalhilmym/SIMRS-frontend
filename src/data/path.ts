import SiteInfo from "./info";

export default class SitePath {
  private static _base = SiteInfo.baseUrl;

  static base = this._base ?? "/";
  static root = this._base ? this._base : "/";
  static signin = this._base + "/signin";
  static dashboard = this._base + "/dashboard";

  static dashboardPatientCreate = this.dashboard + "/create-patient";
  static dashboardPatientList = this.dashboard + "/patients";
  static dashboardPatientDetail = this.dashboardPatientList + "/:id";
  static dashboardPatientEdit = this.dashboardPatientDetail + "/edit";

  static dashboardAccountCreate = this.dashboard + "/create-account";
  static dashboardAccountList = this.dashboard + "/accounts";
  static dashboardAccountDetail = this.dashboardAccountList + "/:id";
  static dashboardAccountEdit = this.dashboardAccountDetail + "/edit";

  static dashboardDistrictCreate = this.dashboard + "/create-district";
  static dashboardDistrictList = this.dashboard + "/districts";
  static dashboardDistrictDetail = this.dashboardDistrictList + "/:id";
  static dashboardDistrictEdit = this.dashboardDistrictDetail + "/edit";

  static dashboardPatientExaminationCreate =
    this.dashboardDistrictDetail + "/create-patient-examination";
  static dashboardPatientExaminationList =
    this.dashboardDistrictDetail + "/patient-examinations";
  static dashboardPatientExaminationEdit =
    this.dashboardPatientExaminationList + "/:examId";
}
