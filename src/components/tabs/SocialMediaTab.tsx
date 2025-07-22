import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Text, TextField, Button, IconButton } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Plus, Trash2, Linkedin, Github, Instagram, Twitter, Link as LinkIcon } from 'lucide-react';
import { saveUserAccount, loadUserAccount } from '../../api/mockApi';
import toast from 'react-hot-toast';

interface SocialLink {
  id: number;
  url: string;
}

interface SocialFormData {
  linkedin: string;
  github: string;
  instagram: string;
  x: string;
  additional: SocialLink[];
}

const SocialMediaTab: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<SocialFormData>({
    linkedin: '',
    github: '',
    instagram: '',
    x: '',
    additional: [],
  });
  
  useEffect(() => {
    const loadData = async () => {
      const account = await loadUserAccount();
      if (account?.social) {
        setFormData(account.social);
      }
    };
    loadData();
  }, []);

  const handleStaticChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdditionalChange = (id: number, value: string) => {
    const newAdditional = formData.additional.map(item =>
      item.id === id ? { ...item, url: value } : item
    );
    setFormData(prev => ({ ...prev, additional: newAdditional }));
  };

  const addSocialField = (): void => {
    const newId = Date.now();
    setFormData(prev => ({ ...prev, additional: [...prev.additional, { id: newId, url: '' }] }));
  };

  const removeSocialField = (id: number): void => {
    setFormData(prev => ({ ...prev, additional: prev.additional.filter(item => item.id !== id) }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await saveUserAccount({ social: formData });
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
                  <TextField.Root name={field.name} type="url" value={formData[field.name]} onChange={handleStaticChange}>
                    <TextField.Slot>{field.icon}</TextField.Slot>
                  </TextField.Root>
                </Form.Control>
              </Flex>
            </label>
          </Form.Field>
        ))}
        
        {formData.additional.map((item, index) => (
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
              {isLoading ? t('settings.personal_form.saving_button') : t('settings.personal_form.save_button')}
            </Button>
          </Form.Submit>
        </Flex>
      </Flex>
    </Form.Root>
  );
};

export default SocialMediaTab;