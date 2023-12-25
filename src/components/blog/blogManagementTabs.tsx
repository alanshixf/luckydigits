"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import BlogManagementList from "./blogManagementList";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ width: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ p: 3, width: "100%" }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface BlogManagementListProps {
  userId: string;
  limits: number;
  allBlogsInitData: BlogListItemWithUser[];
  unpublishedBlogsInitData: BlogListItemWithUser[];
  publishedBlogsInitData: BlogListItemWithUser[];
}
export default function BlogManagementTabs({
  userId,
  limits,
  allBlogsInitData,
  unpublishedBlogsInitData,
  publishedBlogsInitData,
}: BlogManagementListProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "960px",
        margin: 1,
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="blogs management tabs"
          centered
          sx={{ width: "100%", flexGrow: 1 }}
        >
          <Tab label="All" {...a11yProps(0)} />
          <Tab label="UnPublished" {...a11yProps(1)} />
          <Tab label="Published" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <BlogManagementList
          tabs={"All"}
          userId={userId}
          initData={allBlogsInitData}
          limits={limits}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <BlogManagementList
          tabs={"Unpublished"}
          userId={userId}
          initData={unpublishedBlogsInitData}
          limits={limits}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <BlogManagementList
          tabs={"Published"}
          userId={userId}
          initData={publishedBlogsInitData}
          limits={limits}
        />
      </CustomTabPanel>
    </Box>
  );
}
