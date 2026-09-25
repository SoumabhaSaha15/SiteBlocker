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

const Apps = {
  Home, Rules, ExtraConfig, Redirect, ActiveHours, BlockByKeys, Sync, AboutUs, Password
}




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

export const MENU_LIST = [
  { name: 'Blocked Sites', icon: <NotInterestedIcon />, appKey: AppList.HOME },
  { name: 'Rules', icon: <BulletedIcon />, appKey: AppList.RULES },
  { name: 'Settings', icon: <SettingsIcon />, appKey: AppList.EXTRA_CONFIG },
  { name: 'Redirect', icon: <RepeatIcon />, appKey: AppList.REDIRECT },
  // { name: 'Active Hours', icon: <AccessTimeIcon />, appKey: AppList.ACTIVE_HOURS },
  { name: 'Block keys', icon: <AbcIcon />, appKey: AppList.BLOCK_KEYS },
  { name: 'Sync', icon: <SyncIcon />, appKey: AppList.SYNC },
  { name: 'Password', icon: <LockIcon />, appKey: AppList.PASSWORD },
  { name: 'About us', icon: <Avatar alt="Soumabha Saha" src="/picture.png" className='size-6' />, appKey: AppList.ABOUT_US },
];


export const APP_MAP: Record<AppList, React.JSX.Element> = {
  0: <Apps.Home />,
  1: <Apps.Rules />,
  2: <Apps.ExtraConfig />,
  3: <Apps.Redirect />,
  4: <Apps.ActiveHours />,
  5: <Apps.BlockByKeys />,
  6: <Apps.Sync />,
  7: <Apps.Password />,
  8: <Apps.AboutUs />,
  9: <Apps.Home />
}
