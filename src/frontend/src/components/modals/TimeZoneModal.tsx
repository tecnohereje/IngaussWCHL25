import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Flex, Button, Text, Grid, Box, ScrollArea, TextField } from '@radix-ui/themes';
import { Search } from 'lucide-react';

// --- Definimos una interfaz para las props ---
interface TimeZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentValue: string;
  onValueChange: (value: string) => void;
}

// Type for the object that will group timezones
type TimeZoneGroups = {
  [key: string]: string[];
}

const TimeZoneModal: React.FC<TimeZoneModalProps> = ({ isOpen, onClose, currentValue, onValueChange }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>('');

  const timeZoneGroups = useMemo((): TimeZoneGroups => {
    try {
      const allTimezones = Intl.supportedValuesOf('timeZone');
      
      const filteredTimezones = allTimezones.filter((tz: string) => 
        tz.toLowerCase().replace(/_/g, ' ').includes(filter.toLowerCase())
      );

      const groups = filteredTimezones.reduce((acc: TimeZoneGroups, tz: string) => {
        const region = tz.split('/')[0];
        if (['Etc', 'SystemV', 'US'].includes(region)) return acc; // Filter out obscure regions
        
        if (acc[region]) {
          acc[region].push(tz);
        } else {
          acc[region] = [tz];
        }
        return acc;
      }, {});
      
      // Sort groups alphabetically
      return Object.keys(groups).sort().reduce(
        (obj: TimeZoneGroups, key) => { 
          obj[key] = groups[key]; 
          return obj;
        }, 
        {}
      );
    } catch (e) {
      // Fallback for older environments that do not support the API
      return { "UTC": ["UTC"] };
    }
  }, [filter]);

  const handleSelect = (value: string): void => {
    onValueChange(value);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 800 }}>
        <Dialog.Title align="center" size="6" mb="3">
          {t('settings.job_form.timezone')}
        </Dialog.Title>
        
        <Box mb="5">
          <TextField.Root 
            placeholder={t('forms.filter_placeholder')}
            value={filter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
          >
            <TextField.Slot>
              <Search size={16} />
            </TextField.Slot>
          </TextField.Root>
        </Box>
        
        <ScrollArea type="auto" scrollbars="vertical" style={{ height: '50vh' }}>
          <Flex direction="column" gap="4" pr="4">
            {Object.keys(timeZoneGroups).length > 0 ? (
              Object.entries(timeZoneGroups).map(([region, zones]) => (
                <Flex key={region} direction="column" gap="2">
                  <Text size="2" weight="bold" color="gray">{region}</Text>
                  <Grid columns={{initial: '1', sm: '2', md: '3'}} gap="2">
                    {zones.map(zone => (
                      <Button
                        key={zone}
                        variant={currentValue === zone ? 'solid' : 'soft'}
                        onClick={() => handleSelect(zone)}
                        size="1"
                        style={{ justifyContent: 'flex-start' }}
                      >
                        {zone.replace(/_/g, ' ')}
                      </Button>
                    ))}
                  </Grid>
                </Flex>
              ))
            ) : (
              <Text align="center" color="gray">{t('forms.no_results_found')}</Text>
            )}
          </Flex>
        </ScrollArea>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default TimeZoneModal;