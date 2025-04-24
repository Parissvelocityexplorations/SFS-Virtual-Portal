import { useEffect, useMemo, useState } from "react";
import { ISfAppointment } from "~/routes/admin/models/iSfAppointment";
import { SfStatus } from "~/routes/admin/models/enums/sfStatus";
import { SfAppointmentsConnector } from "~/routes/admin/connectors/sfAppointmentsConnector";
import { SfPassType } from "~/routes/admin/models/enums/sfPassType";
import "./admin/admin.scss";
export default function Admin() {
  const [allItems, setAllItems] = useState<ISfAppointment[]>([]);
  const connector: SfAppointmentsConnector = new SfAppointmentsConnector();
  const getStatusLabel = (value: SfStatus): string => {
    switch (value) {
      case SfStatus.Scheduled:
        return "Scheduled";
      case SfStatus.CheckedIn:
        return "Checked-In";
      case SfStatus.Serving:
        return "Serving";
      case SfStatus.Served:
        return "Served";
      case SfStatus.Cancelled:
        return "Cancelled";
      default:
        return "No Status";
    }
  };

  const getPassTypeLabel = (value: SfPassType): { label: string, icon: string } => {
    switch (value) {
      case SfPassType.GolfPass:
        return { label: "Golf Pass", icon: "⛳" };
      case SfPassType.VisitorPass:
        return { label: "Visitor Pass", icon: "🏙️" };
      case SfPassType.VetCard:
        return { label: "VEHIC", icon: "🏥" };
      case SfPassType.Contractor:
        return { label: "Contractor", icon: "🪪" };
      default:
        return { label: "Not Set", icon: "❓" };
    }
  };

  const allItemNodes = useMemo(() => {
    return allItems.map((item: ISfAppointment) => {
      return <li key={item.id}>
        <div>
          <i>{getPassTypeLabel(item.passType).icon} </i>
          <span>{getPassTypeLabel(item.passType).label}</span>
        </div>
        <div>
          {item.user.firstName} {item.user.lastName}
          <div>{getStatusLabel(item.status)}</div>
        </div>
        <div>
          <button>Serve</button>
        </div>
      </li>;
      // <li className={"sf-admin-item"} key={item.id}>
      //   <div>
      //     {item.user.firstName} {item.user.lastName}
      //     <div className={"status"}>{getStatusLabel(item.status)}</div>
      //   </div>
      // </li>;
    });
  }, [allItems]);

  const checkedInItemNodes = useMemo(() => {
    console.log("checkedInItems...");
    return allItems.filter(x => x.status == SfStatus.CheckedIn);
  }, [allItems]);

  const servingItemNodes = useMemo(() => {
    console.log("servingItems...");
    return allItems.filter(x => x.status == SfStatus.Serving);
  }, [allItems]);

  const scheduledItemNodes = useMemo(() => {
    console.log("scheduledItems...");
    allItems.map((item: ISfAppointment) => {
      return <li key={item.id}>
        <div>
          <img src={getPassTypeLabel(item.passType).icon} />
          <span>{getPassTypeLabel(item.passType).label}</span>
        </div>
        <div>
          {item.user.firstName} {item.user.lastName}
          <div>{getStatusLabel(item.status)}</div>
        </div>
        <div>
          <button>Serve</button>
        </div>
      </li>;
    });

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

  const moveToServed = async (item: ISfAppointment): Promise<void> => {
    //
  };

  //On Component mount
  useEffect(() => {
    console.log("admin.tsx");
    (async (): Promise<void> => {
      await getItemsAsync();
    })();
  }, []);
  useEffect(() => {
    console.log("allItemsChanged...", allItems);
  }, [allItems]);
  return (
    <ul className={"sf-admin"}>
      {allItemNodes}
      <div>Now Serving</div>
      {/*{servingItems.map((item) => {*/}
      {/*   <div key={item.id}>{item}</div>;*/}
      {/*})}*/}
      {/*<div>Checked-In</div>*/}
      {/*{checkedInItems.map(item => {*/}
      {/*   <div key={item.id}>{item}</div>;*/}
      {/*})}*/}
      {/*<div>Scheduled</div>*/}
      {/*{scheduledItems.map(item => {*/}
      {/*   <div key={item.id}>{item}</div>;*/}
      {/*})}*/}
      {/*Now Serving*/}
      {/*{items.map((item) => (*/}
      {/*  <li key={item.id}>{item.name}</li>*/}
      {/*))}*/}
      Checked in
      Scheduled
    </ul>);
}