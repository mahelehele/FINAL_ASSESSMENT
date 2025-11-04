import React from 'react';
import AppStack from './AppStack';

const RootNavigator = ({ firstLaunch, isLoggedIn }) => {
  return <AppStack firstLaunch={firstLaunch} isLoggedIn={isLoggedIn} />;
};

export default RootNavigator;