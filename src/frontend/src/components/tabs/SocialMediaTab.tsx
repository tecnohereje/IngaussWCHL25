import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Text, TextField, Button, IconButton, Spinner } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Plus, Trash2, Linkedin, Github, Instagram, Twitter, Link as LinkIcon } from 'lucide-react';
import { updateSocialLinks } from '../../api/backend';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { TabComponentProps } from '../../pages/SettingsPage';
import type { SocialLinksType } from '../../../../common/types';

// Type for the additional links, including a temporary client-side ID
type AdditionalLink = { id: number; url: string };

const SocialMediaTab: React.FC<TabComponentProps> = ({ formData }) => {
  const { t } = useTranslation();
  const { identity, userProfile, updateUserProfile } = useAuth();
  
  // Flattened local state
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [instagram, setInstagram] = useState('');
  const [x, setX] = useState('');
  const [additional, setAdditional] = useState<AdditionalLink[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  // Sync local state with parent data
  useEffect(() => {
    const socialData = formData.profile?.social;
    if (socialData) {
      setLinkedin(socialData.linkedin || '');
      setGithub(socialData.github || '');
      setInstagram(socialData.instagram || '');
      setX(socialData.x || '');
      // Add client-side IDs to additional links for key prop and manipulation
      setAdditional((socialData.additional || []).map((url: string, index: number) => ({ id: Date.now() + index, url })));
    }
  }, [formData]);

  const handleAdditionalChange = (id: number, value: string) => {
    setAdditional(current => current.map(item => (item.id === id ? { ...item, url: value } : item)));
  };

  const addSocialField = (): void => {
    setAdditional(current => [...current, { id: Date.now(), url: '' }]);
  };

  const removeSocialField = (id: number): void => {
    setAdditional(current => current.filter(item => item.id !== id));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!identity) {
      toast.error(t('toasts.user_not_identified'));
      return;
    }

    const socialDataToSave: SocialLinksType = {
      linkedin,
      github,
      instagram,
      x,
      // Strip client-side IDs before sending to backend
      additional: additional.map(item => item.url).filter(Boolean),
    };

    setIsLoading(true);
    try {
      await updateSocialLinks(identity, socialDataToSave);
      // Optimistically update the global state
      if (userProfile) {
        updateUserProfile({ 
          ...userProfile,
          profile: { ...userProfile.profile, social: socialDataToSave }
        });
      }
      toast.success(t('settings.api_success.message'));
    } catch (error) {
      console.error("Failed to save social links:", error);
      toast.error(t('settings.api_error.message'));
    } finally {
      setIsLoading(false);
    }
  };

  const staticFields = [
    { name: 'linkedin', icon: <Linkedin size={16} />, value: linkedin, setter: setLinkedin },
    { name: 'github', icon: <Github size={16} />, value: github, setter: setGithub },
    { name: 'instagram', icon: <Instagram size={16} />, value: instagram, setter: setInstagram },
    { name: 'x', icon: <Twitter size={16} />, value: x, setter: setX },
  ] as const;

  return (
    <Form.Root onSubmit={handleSubmit}>
      <Flex direction="column" gap="4" width="100%">
        {staticFields.map(field => (
          <Form.Field key={field.name} name={field.name} asChild>
            <label>
              <Flex direction="column" gap="1">
                <Form.Label asChild><Text size="2" weight="bold">{field.name.charAt(0).toUpperCase() + field.name.slice(1)}</Text></Form.Label>
                <Form.Control asChild>
                  <TextField.Root name={field.name} type="url" value={field.value} onChange={(e) => field.setter(e.target.value)}>
                    <TextField.Slot>{field.icon}</TextField.Slot>
                  </TextField.Root>
                </Form.Control>
                <Form.Message className="form-message" match="typeMismatch">{t('form_validation.type_mismatch_url')}</Form.Message>
              </Flex>
            </label>
          </Form.Field>
        ))}
        
        {additional.map((item, index) => (
          <Flex key={item.id} gap="2" align="end">
            <Form.Field name={`additional-url-${item.id}`} asChild style={{ flexGrow: 1 }}>
              <label>
                <Flex direction="column" gap="1">
                  <Form.Label asChild><Text size="2" weight="bold">{`${t('settings.social_form.url')} #${index + 1}`}</Text></Form.Label>
                  <Form.Control asChild>
                    <TextField.Root type="url" value={item.url} onChange={(e) => handleAdditionalChange(item.id, e.target.value)} placeholder={t('settings.social_form.generic_url_placeholder')}>
                      <TextField.Slot><LinkIcon size={16} /></TextField.Slot>
                    </TextField.Root>
                  </Form.Control>
                  <Form.Message className="form-message" match="typeMismatch">{t('form_validation.type_mismatch_url')}</Form.Message>
                </Flex>
              </label>
            </Form.Field>
            <IconButton color="red" variant="soft" onClick={() => removeSocialField(item.id)} type="button">
              <Trash2 size={16} />
            </IconButton>
          </Flex>
        ))}

        <Button variant="outline" onClick={addSocialField} style={{ width: 'fit-content', marginTop: '1rem' }} type="button">
          <Plus size={16} /> {t('settings.social_form.add_social')}
        </Button>

        <Flex mt="4" justify="end">
          <Form.Submit asChild>
            <Button disabled={isLoading}>
              {isLoading ? <Spinner /> : t('settings.personal_form.save_button')}
            </Button>
          </Form.Submit>
        </Flex>
      </Flex>
    </Form.Root>
  );
};
export default SocialMediaTab;
