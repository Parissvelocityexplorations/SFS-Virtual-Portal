import { ISfAppointment } from "~/routes/admin/models/iSfAppointment";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { SfStatus } from "~/routes/admin/models/enums/sfStatus";

export class SfAppointmentsConnector {
  private baseUrl: string = "http://localhost:5288/appointments";

  private isResponseValid = (resp: AxiosResponse<any>): boolean => {
    return resp.status >= 200 && resp.status <= 299;
  };

  public addAsync = async (userId: string, date: string): Promise<[boolean, ISfAppointment | undefined]> => {
    const resp: AxiosResponse<ISfAppointment> = await axios.post(`${this.baseUrl}/userid/${userId}/date/${date}`);
    if (this.isResponseValid(resp)) {
      return [true, resp.data];
    }
    return [false, undefined];
    //"userid/{userId}/date/{date}"
  };
  //[HttpGet("filter/startDate/{startDate}/endDate/{endDate}")]
  public getByDateRangeAndStatusAsync = async (startDate: string, endDate: string, statuses: string[]): Promise<[boolean, ISfAppointment[]]> => {
    console.log("statuses",statuses);
    const params:URLSearchParams = new URLSearchParams();

    for(const status of statuses){
      params.append("statuses",status);
    }

    const config: AxiosRequestConfig<any> = {
      params: params
    };

    console.log(config);
    const resp: AxiosResponse<ISfAppointment[]> = await axios.get(`${this.baseUrl}/filter/startDate/${startDate}/endDate/${endDate}`, config);
    if (this.isResponseValid(resp)) {
      return [true, resp.data];
    }
    return [false, []];
  };

  public updateStatusAsync = async (appointmentId: string, status: string): Promise<boolean> => {
    const resp: AxiosResponse<any> = await axios.post(`${this.baseUrl}/${appointmentId}/statuses/${status}`);
    return this.isResponseValid(resp);
  };
}