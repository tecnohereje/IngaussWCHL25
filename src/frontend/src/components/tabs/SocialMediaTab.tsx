import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Text, TextField, Button, IconButton, Spinner } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Plus, Trash2, Linkedin, Github, Instagram, Twitter, Link as LinkIcon } from 'lucide-react';
import { saveUserAccount } from '../../api/mockApi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { TabComponentProps } from '../../pages/SettingsPage';

const SocialMediaTab: React.FC<TabComponentProps> = ({ formData, setFormData }) => {
  const { t } = useTranslation();
  const { principal } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const socialData = formData.social || { linkedin: '', github: '', instagram: '', x: '', additional: [] };

  const updateSocialData = (updateFn: (currentSocial: typeof socialData) => typeof socialData) => {
    setFormData(prev => ({
      ...prev,
      social: updateFn(prev.social || socialData),
    }));
  };

  const handleStaticChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateSocialData(currentSocial => ({ ...currentSocial, [name]: value }));
  };

  const handleAdditionalChange = (id: number, value: string) => {
    updateSocialData(currentSocial => ({
      ...currentSocial,
      additional: (currentSocial.additional || []).map(item =>
        item.id === id ? { ...item, url: value } : item
      ),
    }));
  };

  const addSocialField = (): void => {
    const newId = Date.now();
    updateSocialData(currentSocial => ({
      ...currentSocial,
      additional: [...(currentSocial.additional || []), { id: newId, url: '' }],
    }));
  };

  const removeSocialField = (id: number): void => {
    updateSocialData(currentSocial => ({
      ...currentSocial,
      additional: (currentSocial.additional || []).filter(item => item.id !== id),
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!principal) {
      toast.error(t('toasts.user_not_identified'));
      return;
    }
    setIsLoading(true);
    try {
      await saveUserAccount(principal, { social: socialData });
      toast.success(t('settings.api_success.message'));
    } catch (error) {
      toast.error(t('settings.api_error.message'));
    } finally {
      setIsLoading(false);
    }
  };

  const staticFields = [
    { name: 'linkedin', icon: <Linkedin size={16} /> },
    { name: 'github', icon: <Github size={16} /> },
    { name: 'instagram', icon: <Instagram size={16} /> },
    { name: 'x', icon: <Twitter size={16} /> },
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
                  <TextField.Root name={field.name} type="url" value={socialData[field.name]} onChange={handleStaticChange}>
                    <TextField.Slot>{field.icon}</TextField.Slot>
                  </TextField.Root>
                </Form.Control>
                <Form.Message className="form-message" match="typeMismatch">{t('form_validation.type_mismatch_url')}</Form.Message>
              </Flex>
            </label>
          </Form.Field>
        ))}
        
        {socialData.additional.map((item, index) => (
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