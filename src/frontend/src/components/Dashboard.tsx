import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import { SlidersHorizontal, FlaskConical } from 'lucide-react';
import { isSettingsZoneEnabled, isTestingZoneEnabled } from '../config/features';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Flex direction={{ initial: 'column', sm: 'row' }} gap="9">
      
      {isSettingsZoneEnabled && (
        <Link to="/settings" className="dashboard-card-link">
          <Card className="dashboard-card">
            <Flex direction="column" align="center" gap="3">
              <SlidersHorizontal size={48} className="dashboard-card-icon" />
              <Heading size="5">{t('dashboard.settings_button')}</Heading> 
              <Text as="p" size="2" color="gray" align="center" mt="2">
                {t('dashboard.settings_card_description')}
              </Text>
            </Flex>
          </Card>
        </Link>
      )}

      {isTestingZoneEnabled && (
        <div className="dashboard-card-link">
          <Card className="dashboard-card">
            <Flex direction="column" align="center" gap="3">
              <FlaskConical size={48} className="dashboard-card-icon" />
              <Heading size="5">{t('dashboard.testing_button')}</Heading> 
              <Text as="p" size="2" color="gray" align="center" mt="2">
                {t('dashboard.testing_card_description')}
              </Text>
            </Flex>
          </Card>
        </div>
      )}

    </Flex>
  );
};

export default Dashboard;