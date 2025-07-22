import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Text, TextField, TextArea, Switch, Button, Avatar, Card, Box } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Paperclip, FileText } from 'lucide-react';
import { maxProfilePicSize, maxResumeSize } from '../../config/features';
import { saveUserAccount, loadUserAccount } from '../../api/mockApi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface PersonalFormData {
  profilePic: File | null;
  fullName: string;
  email: string;
  bio: string;
  cv: File | null;
  isSearching: boolean;
  shareContactInfo: boolean;
}

const PersonalInfoTab: React.FC = () => {
  const { t } = useTranslation();
  const { updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PersonalFormData>({
    profilePic: null,
    fullName: '',
    email: '',
    bio: '',
    cv: null,
    isSearching: false,
    shareContactInfo: true,
  });

  useEffect(() => {
    const loadData = async () => {
      const account = await loadUserAccount();
      if (account?.personal) {
        setFormData(prev => ({
          ...prev,
          ...account.personal,
        }));
      }
    };
    loadData();
  }, []);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean, name: 'isSearching' | 'shareContactInfo') => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'profilePic' | 'cv') => {
    const file = e.target.files?.[0];
    if (!file) {
      if (fileType === 'profilePic') setProfilePreview(null);
      setFormData(prev => ({ ...prev, [fileType]: null }));
      return;
    }

    let isValid = false;
    let maxSize: number;

    if (fileType === 'profilePic') {
      maxSize = maxProfilePicSize;
      if (file.type.startsWith('image/') && file.size <= maxSize) {
        setProfilePreview(URL.createObjectURL(file));
        isValid = true;
      } else {
        alert(`Error: La foto de perfil debe ser una imagen de menos de ${maxSize / 1024}KB.`);
      }
    } else if (fileType === 'cv') {
      maxSize = maxResumeSize;
      if (file.type === 'application/pdf' && file.size <= maxSize) {
        isValid = true;
      } else {
        alert(`Error: El CV debe ser un archivo PDF de menos de ${maxSize / 1024}KB.`);
      }
    }

    if (isValid) {
      setFormData(prev => ({ ...prev, [fileType]: file }));
    } else {
      if (e.target) e.target.value = '';
      if (fileType === 'profilePic') setProfilePreview(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await saveUserAccount({ personal: formData });
      updateUserProfile({
        fullName: formData.fullName,
        email: formData.email
      });
      toast.success(t('settings.api_success.message'));
    } catch (error) {
      toast.error(t('settings.api_error.message'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form.Root onSubmit={handleSubmit}>
      <Flex direction="column" gap="4" width="100%">
        <Form.Field name="fullName" asChild>
          <label>
            <Flex direction="column" gap="1">
              <Form.Label asChild><Text size="2" weight="bold">{t('settings.personal_form.full_name')}</Text></Form.Label>
              <Form.Control asChild><TextField.Root name="fullName" value={formData.fullName} onChange={handleChange} required /></Form.Control>
              {/* --- AVISO RESTAURADO --- */}
              <Form.Message className="form-message" match="valueMissing">
                {t('form_validation.value_missing')}
              </Form.Message>
            </Flex>
          </label>
        </Form.Field>
        
        <Form.Field name="email" asChild>
          <label>
            <Flex direction="column" gap="1">
              <Form.Label asChild><Text size="2" weight="bold">{t('settings.personal_form.email')}</Text></Form.Label>
              <Form.Control asChild><TextField.Root name="email" type="email" value={formData.email} onChange={handleChange} required /></Form.Control>
              {/* --- AVISOS RESTAURADOS --- */}
              <Form.Message className="form-message" match="valueMissing">
                {t('form_validation.value_missing')}
              </Form.Message>
              <Form.Message className="form-message" match="typeMismatch">
                {t('form_validation.type_mismatch_email')}
              </Form.Message>
            </Flex>
          </label>
        </Form.Field>

        <Form.Field name="profilePic" className="form-group">
          <Form.Label asChild><Text size="2" weight="bold">{t('settings.personal_form.profile_pic')}</Text></Form.Label>
          <Flex align="center" gap="4" mt="1">
            <Avatar size="8" radius="full" fallback="?" src={profilePreview || (formData.profilePic ? URL.createObjectURL(formData.profilePic) : undefined)} />
            <Button asChild variant="soft">
              <label htmlFor="profile-pic-input">Seleccionar Imagen</label>
            </Button>
            <Form.Control asChild>
              <input ref={profileInputRef} id="profile-pic-input" type="file" className="visually-hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profilePic')} />
            </Form.Control>
          </Flex>
          <Text size="1" color="gray" mt="1">Máximo {maxProfilePicSize / 1024}kb. Solo imágenes.</Text>
        </Form.Field>

        <Form.Field name="cv" className="form-group">
          <Form.Label asChild><Text size="2" weight="bold">{t('settings.personal_form.cv_label')}</Text></Form.Label>
            <Button asChild variant="soft" mt="1" style={{ width: 'fit-content' }}>
              <label htmlFor="cv-input">
                <Flex align="center" gap="2">
                    <Paperclip size={14}/>
                    {formData.cv ? 'Cambiar PDF' : 'Subir PDF'}
                </Flex>
              </label>
            </Button>
            <Form.Control asChild>
                <input ref={resumeInputRef} id="cv-input" type="file" className="visually-hidden" accept="application/pdf" onChange={(e) => handleFileChange(e, 'cv')} />
            </Form.Control>
            
            {formData.cv && (
              <Card mt="2" size="1">
                <Flex align="center" gap="3">
                  <FileText size={24} color="var(--accent-9)" />
                  <Box>
                    <Text as="div" size="2" weight="bold" trim="start">{formData.cv.name}</Text>
                    <Text as="div" size="1" color="gray">
                      {(formData.cv.size / 1024).toFixed(1)} KB
                    </Text>
                  </Box>
                </Flex>
              </Card>
            )}

            <Text size="1" color="gray" mt="1">Máximo {maxResumeSize / 1024}kb. Solo PDF.</Text>
        </Form.Field>
        
        <Form.Field name="bio" asChild>
          <label>
            <Flex direction="column" gap="1">
              <Form.Label asChild><Text size="2" weight="bold">{t('settings.personal_form.bio')}</Text></Form.Label>
              <Form.Control asChild><TextArea name="bio" value={formData.bio} onChange={handleChange} style={{height: 100}}/></Form.Control>
            </Flex>
          </label>
        </Form.Field>
        
        <Text as="label" size="2">
          <Flex gap="2" align="center">
            <Switch checked={formData.isSearching} onCheckedChange={(checked) => handleSwitchChange(checked, 'isSearching')} /> 
            {t('settings.personal_form.searching')}
          </Flex>
        </Text>

        <Text as="label" size="2">
          <Flex gap="2" align="center">
            <Switch checked={formData.shareContactInfo} onCheckedChange={(checked) => handleSwitchChange(checked, 'shareContactInfo')} /> 
            {t('settings.personal_form.share_contact')}
          </Flex>
        </Text>

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
export default PersonalInfoTab;