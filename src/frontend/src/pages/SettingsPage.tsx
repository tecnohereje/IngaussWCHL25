import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Heading, Tabs, Card, Text, Button } from '@radix-ui/themes';
import PersonalInfoTab from '../components/tabs/PersonalInfoTab';
import SocialMediaTab from '../components/tabs/SocialMediaTab';
import JobPreferencesTab from '../components/tabs/JobPreferencesTab';
import { getCompleteUserAccount } from '../api/backend';
import type { UserAccountType } from '../../../common/types';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

export interface TabComponentProps {
  formData: Partial<UserAccountType>;
  setFormData?: React.Dispatch<React.SetStateAction<Partial<UserAccountType>>>;
}

type TabComponent = React.FC<TabComponentProps>;

interface TabInfo {
  value: string;
  label: string;
  Component: TabComponent;
}

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { identity } = useAuth();
  
  const [formData, setFormData] = useState<Partial<UserAccountType>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!identity) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const account = await getCompleteUserAccount(identity);
      if (account) {
        setFormData(account);
      }
    } catch (err) {
      console.error("Failed to load user account:", err);
      const errorMessage = t('settings.load_error_message');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [identity, t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const tabContent: TabInfo[] = [
    { value: 'personal', label: t('settings.tab_personal'), Component: PersonalInfoTab },
    { value: 'social', label: t('settings.tab_social'), Component: SocialMediaTab },
    { value: 'job', label: t('settings.tab_job'), Component: JobPreferencesTab },
  ];

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton style={{ height: '300px', width: '100%' }} />;
    }

    if (error) {
      return (
        <Card mt="5">
          <Flex direction="column" gap="3" align="center">
            <Text color="red">{error}</Text>
            <Button onClick={loadData}>{t('common.retry_button')}</Button>
          </Flex>
        </Card>
      );
    }

    return (
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
              <tab.Component formData={formData} />
            </Tabs.Content>
          ))}
        </Box>
      </Tabs.Root>
    );
  };

  return (
    <Box className="settings-page" width="100%">
      <Flex justify="between" align="center" mb="5">
        <Heading>{t('settings.title')}</Heading>
      </Flex>
      {renderContent()}
    </Box>
  );
};

export default SettingsPage;