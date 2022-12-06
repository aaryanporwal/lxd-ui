import React, { FC, ReactNode, useState } from "react";
import BaseLayout from "./components/BaseLayout";
import { Row, Tabs } from "@canonical/react-components";
import InstanceOverview from "./InstanceOverview";
import InstanceTerminal from "./InstanceTerminal";
import { Link, useNavigate, useParams } from "react-router-dom";
import InstanceVga from "./InstanceVga";

const TABS: string[] = ["Overview", "Terminal", "VGA"];
const getTab = (activeTab?: string) => {
  switch (activeTab) {
    case "terminal":
      return 1;
    case "vga":
      return 2;
    default:
      return 0;
  }
};

const InstanceDetail: FC = () => {
  const navigate = useNavigate();
  const { name, activeTab } = useParams<{
    name: string;
    activeTab?: string;
  }>();
  const [controls, setControls] = useState<ReactNode | null>(null);
  const [currentTab, setCurrentTab] = useState(getTab(activeTab));

  if (!name) {
    return <>Missing name</>;
  }

  const handleTabChange = (newTab: number) => {
    setControls(null);
    setCurrentTab(newTab);
    switch (newTab) {
      case 1:
        navigate(`/instances/${name}/terminal`);
        break;
      case 2:
        navigate(`/instances/${name}/vga`);
        break;
      default:
        navigate(`/instances/${name}`);
    }
  };

  return (
    <BaseLayout
      title={`Instance details for ${name}`}
      controls={
        <>
          {controls}
          <Link className="p-button u-no-margin--bottom" to="/instances">
            Back
          </Link>
        </>
      }
    >
      <Row>
        <Tabs
          links={TABS.map((tab, index) => ({
            label: tab,
            active: index === currentTab,
            onClick: () => handleTabChange(index),
          }))}
        />

        {currentTab === 0 && (
          <div tabIndex={0} role="tabpanel" aria-labelledby="overview">
            <InstanceOverview instanceName={name} />
          </div>
        )}

        {currentTab === 1 && (
          <div tabIndex={1} role="tabpanel" aria-labelledby="terminal">
            <InstanceTerminal />
          </div>
        )}

        {currentTab === 2 && (
          <div tabIndex={1} role="tabpanel" aria-labelledby="vga">
            <InstanceVga setControls={setControls} />
          </div>
        )}
      </Row>
    </BaseLayout>
  );
};

export default InstanceDetail;