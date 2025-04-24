import { SfStatus } from "~/routes/admin/models/enums/sfStatus";
import { SfPassType } from "~/routes/admin/models/enums/sfPassType";
import { ISfUser } from "~/routes/admin/models/iSfUser";

export interface ISfAppointment {
  userId: string;
  date: string;
  status: SfStatus;
  passType: SfPassType;
  user: ISfUser;
}
