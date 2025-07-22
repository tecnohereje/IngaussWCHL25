import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Heading, Tabs } from '@radix-ui/themes';
import PersonalInfoTab from '../components/tabs/PersonalInfoTab';
import SocialMediaTab from '../components/tabs/SocialMediaTab';
import JobPreferencesTab from '../components/tabs/JobPreferencesTab';
import { loadUserAccount, UserAccount } from '../api/mockApi';
import Skeleton from '../components/ui/Skeleton';

interface TabComponentProps {
  formData: Partial<UserAccount>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<UserAccount>>>;
}

type TabComponent = React.FC<TabComponentProps>;

interface TabInfo {
  value: string;
  label: string;
  Component: TabComponent;
}

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<Partial<UserAccount>>({});
  const [isLoading, setIsLoading] = useState(true);

  // useEffect ahora carga TODOS los datos una sola vez al montar la página.
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const account = await loadUserAccount();
      if (account) {
        setFormData(account);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

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
              {isLoading ? (
                // Mostramos un esqueleto mientras se cargan los datos iniciales.
                <Skeleton style={{ height: '300px', width: '100%' }} />
              ) : (
                // Pasamos los datos ya cargados a cada pestaña.
                <tab.Component formData={formData} setFormData={setFormData} />
              )}
            </Tabs.Content>
          ))}
        </Box>
      </Tabs.Root>
    </Box>
  );
};

export default SettingsPage;