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
  public getByDateRangsAndStatusAsync = async (startDate: string, endDate: string, statuses: string[]): Promise<[boolean, ISfAppointment[]]> => {//{params:statuses.map(status=> {statuses:status})
    const config: AxiosRequestConfig<any> = {
      params: statuses.map(x => {
        status:x;
      })
    };
    const resp: AxiosResponse<ISfAppointment[]> = await axios.get(`${this.baseUrl}/filter/startDate/${startDate}/endDate/${endDate}`, config);
    if (this.isResponseValid(resp)) {
      return [true, resp.data];
    }
    return [false, []];
  };

  public updateStatusAsync = async (appointmentId: string, status: SfStatus): Promise<boolean> => {
    const resp: AxiosResponse<any> = await axios.post(`${this.baseUrl}/${appointmentId}/status/${status}`);
    return this.isResponseValid(resp);
  };
}