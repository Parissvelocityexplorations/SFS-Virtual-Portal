import { useMemo, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { date } from "valibot";
import { ISfAppointment } from "~/routes/admin/models/iSfAppointment";
import { SfStatus } from "~/routes/admin/models/enums/sfStatus";

export default function Admin() {
  const [allItems, setAllItems] = useState([]);

  const checkedInItems= useMemo(()=>{
    return allItems.filter(x=>x.status == SfStatus.CheckedIn)
  },[allItems]);

  const servingItems= useMemo(()=>{
    return allItems.filter(x=>x.status == SfStatus.Serving);
  },[allItems]);



  const getItemsAsync = async (): Promise<void> => {

    //Get today's date
    const now: Date = new Date();
    now.setHours(0, 0, 0, 0);
    const resp: AxiosResponse<any> = await axios.get("http://localhost:5288/appointments/");
    if (resp.status < 200 && resp.status > 299) {
      console.log(`Invalid response received from server.  Details: ${resp.data}`);
      return;
    }

    const appointments: ISfAppointment[] = resp.data as ISfAppointment[];
    setAllItems(appointments);
  };

  const moveToServing=(item:ISfAppointment):void=>{

  }
  return (<div className={"sf-admin"}>
    <!--Now Serving-->
    <!--Checked in-->
    <!--Scheduled-->
  </div>);
}