import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Text, Button, Badge } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import * as Slider from '@radix-ui/react-slider';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import TimeZoneModal from '../modals/TimeZoneModal';
import { ChevronDown } from 'lucide-react';
import { salaryRange, workplaceTags, maxWorkplaceTags } from '../../config/features';
import { saveUserAccount, loadUserAccount } from '../../api/mockApi';
import toast from 'react-hot-toast';

interface TagSelectorProps {
  selectedTags: string[];
  onTagChange: (newTags: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagChange }) => {
    const { t } = useTranslation();
  
    const handleTagClick = (tagKey: string): void => {
      const isSelected = selectedTags.includes(tagKey);
      if (isSelected) {
        onTagChange(selectedTags.filter(t => t !== tagKey));
      } else if (selectedTags.length < maxWorkplaceTags) {
        onTagChange([...selectedTags, tagKey]);
      }
    };
  
    return (
      <div className="tag-selector">
        {workplaceTags.map(key => (
          <button
            key={key}
            type="button"
            className={`tag-button ${selectedTags.includes(key) ? 'selected' : ''}`}
            onClick={() => handleTagClick(key)}
          >
            {t(`settings.tags.${key}`)}
          </button>
        ))}
      </div>
    );
};

interface JobFormData {
  locations: string[];
  salaryRange: [number, number];
  tags: string[];
  preferredTimezone: string;
}

const JobPreferencesTab: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isTimezoneModalOpen, setIsTimezoneModalOpen] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<JobFormData>({
    locations: [],
    salaryRange: [salaryRange.min, salaryRange.max],
    tags: [],
    preferredTimezone: ''
  });

  useEffect(() => {
    const loadData = async () => {
      const account = await loadUserAccount();
      if (account?.job) {
        setFormData(account.job);
      }
    };
    loadData();
  }, []);

  const handleLocationChange = (newLocations: string[]): void => {
    setFormData(prev => ({ ...prev, locations: newLocations }));
  };

  const handleSalaryChange = (newRange: [number, number]): void => {
    setFormData(prev => ({ ...prev, salaryRange: newRange }));
  };
  
  const handleTagsChange = (newTags: string[]): void => {
    setFormData(prev => ({...prev, tags: newTags }));
  };

  const handleTimezoneChange = (value: string): void => {
    setFormData(prev => ({ ...prev, preferredTimezone: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await saveUserAccount({ job: formData });
      toast.success(t('settings.api_success.message'));
    } catch (error) {
      toast.error(t('settings.api_error.message'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TimeZoneModal 
        isOpen={isTimezoneModalOpen}
        onClose={() => setIsTimezoneModalOpen(false)}
        currentValue={formData.preferredTimezone}
        onValueChange={handleTimezoneChange}
      />

      <Form.Root onSubmit={handleSubmit}>
        <Flex direction="column" gap="4" width="100%">
          <Form.Field name="locations" asChild>
            <Flex direction="column" gap="1">
              <Form.Label asChild><Text size="2" weight="bold">{t('settings.job_form.location')}</Text></Form.Label>
              <ToggleGroup.Root 
                type="multiple" 
                className="tag-selector" 
                value={formData.locations} 
                onValueChange={handleLocationChange}
              >
                {['onsite', 'hybrid', 'remote'].map(locKey => (
                  <ToggleGroup.Item
                    key={locKey}
                    value={locKey}
                    className={`tag-button ${formData.locations.includes(locKey) ? 'selected' : ''}`}
                  >
                    {t(`settings.job_form.location_${locKey}`)}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            </Flex>
          </Form.Field>

          <Form.Field name="salary" asChild>
            <Flex direction="column" gap="1">
              <Form.Label asChild><Text size="2" weight="bold">{t('settings.job_form.salary')}</Text></Form.Label>
              <Slider.Root className="slider-root" min={salaryRange.min} max={salaryRange.max} step={1000} value={formData.salaryRange} onValueChange={handleSalaryChange}>
                <Slider.Track className="slider-track"><Slider.Range className="slider-range" /></Slider.Track>
                <Slider.Thumb className="slider-thumb" /><Slider.Thumb className="slider-thumb" />
              </Slider.Root>
              <Flex justify="between" mt="1">
                <Text size="1" color="gray">${formData.salaryRange[0].toLocaleString()}</Text>
                <Text size="1" color="gray">${formData.salaryRange[1].toLocaleString()}</Text>
              </Flex>
            </Flex>
          </Form.Field>

          <Form.Field name="tags" asChild>
            <Flex direction="column" gap="1">
                <Flex justify="between" align="center">
                  <Form.Label asChild><Text size="2" weight="bold">{t('settings.job_form.workplace_tags')}</Text></Form.Label>
                  <Badge color="gray" radius="full" size="2">
                    {formData.tags.length} / {maxWorkplaceTags}
                  </Badge>
                </Flex>
                <TagSelector selectedTags={formData.tags} onTagChange={handleTagsChange} />
            </Flex>
          </Form.Field>

          <Form.Field name="timezone" asChild>
            <label>
              <Flex direction="column" gap="1">
                <Form.Label asChild><Text size="2" weight="bold">{t('settings.job_form.timezone')}</Text></Form.Label>
                <Button variant="soft" onClick={() => setIsTimezoneModalOpen(true)} type="button">
                    <Text>
                      {formData.preferredTimezone || t('settings.job_form.timezone_placeholder')}
                    </Text>
                    <ChevronDown />
                </Button>
              </Flex>
            </label>
          </Form.Field>

          <Flex mt="4" justify="end">
            <Form.Submit asChild>
              <Button disabled={isLoading}>
                {isLoading ? t('settings.personal_form.saving_button') : t('settings.personal_form.save_button')}
              </Button>
            </Form.Submit>
          </Flex>
        </Flex>
      </Form.Root>
    </>
  );
};

export default JobPreferencesTab;