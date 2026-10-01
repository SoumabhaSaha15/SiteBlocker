import Sync from './Sync';
import React from "react";
import Rules from './Rules';
import AboutUs from './AboutUs';
import Password from './Password';
import Home from './BlockedSites';
import Redirect from './Redirect';
import ExtraConfig from './Settings';
import ActiveHours from './ActiveHours';
import BlockByKeys from './BlockByKeys';
import Avatar from "@mui/material/Avatar";
import AbcIcon from '@mui/icons-material/Abc';
import SyncIcon from '@mui/icons-material/Sync';
import LockIcon from '@mui/icons-material/Lock';
import RepeatIcon from '@mui/icons-material/Repeat';
import SettingsIcon from '@mui/icons-material/Settings';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import BulletedIcon from '@mui/icons-material/FormatListBulleted';

export enum AppList {
  HOME,
  RULES,
  EXTRA_CONFIG,
  REDIRECT,
  ACTIVE_HOURS,
  BLOCK_KEYS,
  SYNC,
  PASSWORD,
  ABOUT_US,
  DEFAULT,
};

export const MenuList = [
  { name: 'Blocked Sites', icon: <NotInterestedIcon />, appKey: AppList.HOME },
  { name: 'Settings', icon: <SettingsIcon />, appKey: AppList.EXTRA_CONFIG },
  { name: 'Rules', icon: <BulletedIcon />, appKey: AppList.RULES },
  { name: 'Redirect', icon: <RepeatIcon />, appKey: AppList.REDIRECT },
  // { name: 'Active Hours', icon: <AccessTimeIcon />, appKey: AppList.ACTIVE_HOURS },
  { name: 'Block keys', icon: <AbcIcon />, appKey: AppList.BLOCK_KEYS },
  { name: 'Sync', icon: <SyncIcon />, appKey: AppList.SYNC },
  { name: 'Password', icon: <LockIcon />, appKey: AppList.PASSWORD },
  { name: 'About us', icon: <Avatar alt="Soumabha Saha" src="/icon/icon.svg" className='size-6' />, appKey: AppList.ABOUT_US },
];


export const AppMap: Record<AppList, React.JSX.Element> = {
  0: <Home />,
  1: <Rules />,
  2: <ExtraConfig />,
  3: <Redirect />,
  4: <ActiveHours />,
  5: <BlockByKeys />,
  6: <Sync />,
  7: <Password />,
  8: <AboutUs />,
  9: <Home />
}
