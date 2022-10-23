import { useNavigate } from "@shopify/app-bridge-react";
import { Tabs } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
export default ({ children }) => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState<number>(null);

  const tabs = [
    {
      id: "appointments",
      content: "Appointments",
      panelID: "Appointments",
    },
    {
      id: "collections",
      content: "Collections",
      panelID: "collections",
    },
    {
      id: "staff",
      content: "Staff",
      panelID: "staff",
    },
  ];

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelected(selectedTabIndex);
    navigate(`/${tabs[selectedTabIndex].content}`);
  }, []);

  useEffect(() => {
    handleTabChange(1);
  }, []);

  return (
    <>
      <div style={{ backgroundColor: "#fff" }}>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}></Tabs>
      </div>
      {children}
    </>
  );
};
