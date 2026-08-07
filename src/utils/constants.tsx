import { JSX } from "react";
import Apps from "@/pages/apps/index";
import Avatar from "@mui/material/Avatar";
import HomeIcon from '@mui/icons-material/Home';
import SyncIcon from '@mui/icons-material/Sync';
import LockIcon from '@mui/icons-material/Lock';
import RepeatIcon from '@mui/icons-material/Repeat';
import KeyOffIcon from '@mui/icons-material/KeyOff';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExtraSettingsIcon from '@mui/icons-material/SettingsSuggest';

export enum AppList {
  HOME,
  RULES,
  EXTRA_CONFIG,
  REDIRECT,
  TIME_CONFIG,
  BLOCK_KEYS,
  SYNC,
  PASSWORD,
  ABOUT_US,
  DEFAULT,
};

export const MENU_LIST = [
  { name: 'Home', icon: <HomeIcon />, appKey: AppList.HOME },
  { name: 'Rules', icon: <SettingsIcon />, appKey: AppList.RULES },
  { name: 'Extra config', icon: <ExtraSettingsIcon />, appKey: AppList.EXTRA_CONFIG },
  { name: 'Redirect', icon: <RepeatIcon />, appKey: AppList.REDIRECT },
  { name: 'Time Config', icon: <AccessTimeIcon />, appKey: AppList.TIME_CONFIG },
  { name: 'Block keys', icon: <KeyOffIcon />, appKey: AppList.BLOCK_KEYS },
  { name: 'Sync', icon: <SyncIcon />, appKey: AppList.SYNC },
  { name: 'Password', icon: <LockIcon />, appKey: AppList.PASSWORD },
  { name: 'About us', icon: <Avatar alt="Soumabha Saha" src="/picture.png" className='size-6' />, appKey: AppList.ABOUT_US },
];


export const APP_MAP: Record<AppList, JSX.Element> = {
  0: <Apps.Home />,
  1: <Apps.Rules />,
  2: <Apps.ExtraConfig />,
  3: <Apps.Redirect />,
  4: <Apps.TimeConfig />,
  5: <Apps.BlockByKeys />,
  6: <Apps.Sync />,
  7: <Apps.Password />,
  8: <Apps.AboutUs />,
  9: <Apps.Home />
}