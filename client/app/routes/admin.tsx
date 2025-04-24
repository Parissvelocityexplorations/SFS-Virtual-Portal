import { useEffect, useMemo, useState } from "react";
import { ISfAppointment } from "~/routes/admin/models/iSfAppointment";
import { SfStatus } from "~/routes/admin/models/enums/sfStatus";
import { SfAppointmentsConnector } from "~/routes/admin/connectors/sfAppointmentsConnector";
import { useNavigate } from "@remix-run/react";

export default function Admin() {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState<ISfAppointment[]>([]);
  const connector: SfAppointmentsConnector = new SfAppointmentsConnector();

  const checkedInItems = useMemo(() => {
    console.log("checkedInItems...");
    return allItems.filter(x => x.status == SfStatus.CheckedIn);
  }, [allItems]);

  const servingItems = useMemo(() => {
    console.log("servingItems...");
    return allItems.filter(x => x.status == SfStatus.Serving);
  }, [allItems]);
  const scheduledItems = useMemo(() => {
    console.log("scheduledItems...");
    return allItems.filter(x => x.status == SfStatus.Scheduled);
  }, [allItems]);


  const getItemsAsync = async (): Promise<void> => {
    console.log("getItemsAsync...");
    //Get today's date
    const now: Date = new Date();
    now.setHours(0, 0, 0, 0);
    const tmr = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    tmr.setHours(0, 0, 0, 0);
    console.log("now:", now);
    console.log("tmr:", tmr);
    const [resultStatus, resultContent] = await connector.getByDateRangeAndStatusAsync(now.toISOString(),
      tmr.toISOString(),
      ["0", "1", "3"]);
    if (!resultStatus) {
      console.log(`Failed to retrieve items.  Details: ${resultContent}`);
      return;
    }
    console.log("resultContent:", resultContent);
    setAllItems(resultContent);
  };

  const moveToServing = async (item: ISfAppointment): Promise<void> => {
    //const [resultStatus,resultContent] = await connector.updateStatusAsync(item.id,SfStatus[SfStatus.Serving]);
  };

  //On Component mount
  useEffect(() => {
    console.log("admin.tsx");
    (async (): Promise<void> => {
      await getItemsAsync();
    })();
  }, []);
  return (
    <div className={"sf-admin"}>
      <div>All ITems</div>
      {allItems.map((item) => {
        <div key={item.id}>{item}</div>;
      })}
      <div>Now Serving</div>
      {servingItems.map((item) => {
         <div key={item.id}>{item}</div>;
      })}
      <div>Checked-In</div>
      {checkedInItems.map(item => {
         <div key={item.id}>{item}</div>;
      })}
      <div>Scheduled</div>
      {scheduledItems.map(item => {
         <div key={item.id}>{item}</div>;
      })}
      {/*Now Serving*/}
      {/*{items.map((item) => (*/}
      {/*  <li key={item.id}>{item.name}</li>*/}
      {/*))}*/}
      {/*Checked in*/}
      {/*Scheduled*/}
    </div>);
}