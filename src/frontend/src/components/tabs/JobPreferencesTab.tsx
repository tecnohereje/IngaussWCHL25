import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Text, Button, Badge, Spinner } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import * as Slider from '@radix-ui/react-slider';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import TimeZoneModal from '../modals/TimeZoneModal';
import { ChevronDown } from 'lucide-react';
import { salaryRange, workplaceTags, maxWorkplaceTags } from '../../config/features';
import { updateJobPreferences } from '../../api/backend';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { TabComponentProps } from '../../pages/SettingsPage';
import type { JobPreferencesType } from '../../../../common/types';

const TagSelector: React.FC<{ selectedTags: string[]; onTagChange: (newTags: string[]) => void; }> = ({ selectedTags, onTagChange }) => {
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

const JobPreferencesTab: React.FC<TabComponentProps> = ({ formData }) => {
  const { t } = useTranslation();
  const { identity, userProfile, updateUserProfile } = useAuth();
  
  // Flattened local state
  const [locations, setLocations] = useState<string[]>([]);
  const [currentSalaryRange, setCurrentSalaryRange] = useState<number[]>([salaryRange.min, salaryRange.max]);
  const [tags, setTags] = useState<string[]>([]);
  const [preferredTimezone, setPreferredTimezone] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [isTimezoneModalOpen, setIsTimezoneModalOpen] = useState<boolean>(false);

  // Sync local state with parent data
  useEffect(() => {
    const jobData = formData.profile?.job;
    if (jobData) {
      setLocations(jobData.locations || []);
      setCurrentSalaryRange(jobData.salaryRange || [salaryRange.min, salaryRange.max]);
      setTags(jobData.workplaceTags || []);
      setPreferredTimezone(jobData.preferredTimezone || '');
    }
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!identity) {
      toast.error(t('toasts.user_not_identified'));
      return;
    }

    const jobDataToSave: JobPreferencesType = {
        locations,
        salaryRange: currentSalaryRange,
        workplaceTags: tags,
        preferredTimezone,
    };

    setIsLoading(true);
    try {
      await updateJobPreferences(identity, jobDataToSave);
      // Optimistically update the global state
      if (userProfile) {
        updateUserProfile({ 
          ...userProfile,
          profile: { ...userProfile.profile, job: jobDataToSave }
        });
      }
      toast.success(t('settings.api_success.message'));
    } catch (error) {
      console.error("Failed to save job preferences:", error);
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
        currentValue={preferredTimezone}
        onValueChange={setPreferredTimezone}
      />

      <Form.Root onSubmit={handleSubmit}>
        <Flex direction="column" gap="4" width="100%">
          <Form.Field name="locations" asChild>
            <Flex direction="column" gap="1">
              <Form.Label asChild><Text size="2" weight="bold">{t('settings.job_form.location')}</Text></Form.Label>
              <ToggleGroup.Root type="multiple" className="tag-selector" value={locations} onValueChange={setLocations}>
                {['onsite', 'hybrid', 'remote'].map(locKey => (
                  <ToggleGroup.Item key={locKey} value={locKey} className={`tag-button ${locations.includes(locKey) ? 'selected' : ''}`}>
                    {t(`settings.job_form.location_${locKey}`)}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            </Flex>
          </Form.Field>

          <Form.Field name="salary" asChild>
            <Flex direction="column" gap="1">
              <Form.Label asChild><Text size="2" weight="bold">{t('settings.job_form.salary')}</Text></Form.Label>
              <Slider.Root className="slider-root" min={salaryRange.min} max={salaryRange.max} step={1000} value={currentSalaryRange} onValueChange={setCurrentSalaryRange}>
                <Slider.Track className="slider-track"><Slider.Range className="slider-range" /></Slider.Track>
                <Slider.Thumb className="slider-thumb" /><Slider.Thumb className="slider-thumb" />
              </Slider.Root>
              <Flex justify="between" mt="1">
                <Text size="1" color="gray">${currentSalaryRange[0].toLocaleString()}</Text>
                <Text size="1" color="gray">${currentSalaryRange[1].toLocaleString()}</Text>
              </Flex>
            </Flex>
          </Form.Field>

          <Form.Field name="tags" asChild>
            <Flex direction="column" gap="1">
                <Flex justify="between" align="center">
                  <Form.Label asChild><Text size="2" weight="bold">{t('settings.job_form.workplace_tags')}</Text></Form.Label>
                  <Badge color="gray" radius="full" size="2">{tags.length} / {maxWorkplaceTags}</Badge>
                </Flex>
                <TagSelector selectedTags={tags} onTagChange={setTags} />
            </Flex>
          </Form.Field>

          <Form.Field name="timezone" asChild>
            <label>
              <Flex direction="column" gap="1">
                <Form.Label asChild><Text size="2" weight="bold">{t('settings.job_form.timezone')}</Text></Form.Label>
                <Button variant="soft" onClick={() => setIsTimezoneModalOpen(true)} type="button">
                    <Text>{preferredTimezone || t('settings.job_form.timezone_placeholder')}</Text>
                    <ChevronDown />
                </Button>
              </Flex>
            </label>
          </Form.Field>

          <Flex mt="4" justify="end">
            <Form.Submit asChild>
              <Button disabled={isLoading}>
                {isLoading ? <Spinner /> : t('settings.personal_form.save_button')}
              </Button>
            </Form.Submit>
          </Flex>
        </Flex>
      </Form.Root>
    </>
  );
};
export default JobPreferencesTab;
