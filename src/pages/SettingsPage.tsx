import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Heading, Tabs } from '@radix-ui/themes';
import PersonalInfoTab from '../components/tabs/PersonalInfoTab';
import SocialMediaTab from '../components/tabs/SocialMediaTab';
import JobPreferencesTab from '../components/tabs/JobPreferencesTab';

type TabComponent = React.FC;

interface TabInfo {
  value: string;
  label: string;
  Component: TabComponent;
}

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const tabContent: TabInfo[] = [
    { value: 'personal', label: t('settings.tab_personal'), Component: PersonalInfoTab },
    { value: 'social', label: t('settings.tab_social'), Component: SocialMediaTab },
    { value: 'job', label: t('settings.tab_job'), Component: JobPreferencesTab },
  ];

  return (
    <Box className="settings-page" width="100%">
      <Flex justify="between" align="center" mb="5">
        <Heading>{t('settings.title')}</Heading>
      </Flex>

      <Tabs.Root defaultValue="personal" className="radix-tabs-root">
        <Tabs.List className="radix-tabs-list">
          {tabContent.map(tab => (
            <Tabs.Trigger key={tab.value} value={tab.value} className="radix-tabs-trigger">
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Box pt="3">
          {tabContent.map(tab => (
            <Tabs.Content key={tab.value} value={tab.value} className="radix-tabs-content">
              <tab.Component />
            </Tabs.Content>
          ))}
        </Box>
      </Tabs.Root>
    </Box>
  );
};

export default SettingsPage;