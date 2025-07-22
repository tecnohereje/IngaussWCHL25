import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Text, TextField, TextArea, Switch, Button, Avatar, Card, Box } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Paperclip, FileText } from 'lucide-react';
import { maxProfilePicSize, maxResumeSize } from '../../config/features';
import { saveUserAccount, loadUserAccount, UserAccount } from '../../api/mockApi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

interface PersonalInfoTabProps {
  formData: Partial<UserAccount>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<UserAccount>>>;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ formData, setFormData }) => {
  const { t } = useTranslation();
  const { updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const personalData = formData.personal || { fullName: '', email: '', bio: '', isSearching: false, shareContactInfo: true, profilePic: null, cv: null };

  // --- CORRECCIÓN: Lógica de actualización de estado explícita y segura ---
  const updateField = <K extends keyof typeof personalData>(
    field: K,
    value: (typeof personalData)[K]
  ) => {
    setFormData(prev => {
      // 1. Aseguramos tener una base completa del objeto 'personal'
      const basePersonal = prev.personal || {
        profilePic: null, fullName: '', email: '', bio: '', cv: null,
        isSearching: false, shareContactInfo: true,
      };
      // 2. Aplicamos el cambio
      const updatedPersonal = { ...basePersonal, [field]: value };
      // 3. Devolvemos el estado completo y actualizado
      return { ...prev, personal: updatedPersonal };
    });
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField(e.target.name as keyof typeof personalData, e.target.value);
  };

  const handleSwitchChange = (checked: boolean, name: 'isSearching' | 'shareContactInfo') => {
    updateField(name, checked);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'profilePic' | 'cv') => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const maxSize = fileType === 'profilePic' ? maxProfilePicSize : maxResumeSize;
      const isValidType = fileType === 'profilePic' ? file.type.startsWith('image/') : file.type === 'application/pdf';
      
      if (isValidType && file.size <= maxSize) {
        if (fileType === 'profilePic') setProfilePreview(URL.createObjectURL(file));
        updateField(fileType, file);
      } else {
        alert(`Error: Archivo inválido. Revisa el tipo y el tamaño (max ${maxSize / 1024}KB).`);
        e.target.value = '';
      }
    } else {
       if (fileType === 'profilePic') setProfilePreview(null);
       updateField(fileType, null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await saveUserAccount({ personal: personalData });
      updateUserProfile({
        fullName: personalData.fullName,
        email: personalData.email
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
              <Form.Control asChild><TextField.Root name="fullName" value={personalData.fullName} onChange={handleChange} required /></Form.Control>
              <Form.Message className="form-message" match="valueMissing">{t('form_validation.value_missing')}</Form.Message>
            </Flex>
          </label>
        </Form.Field>
        
        <Form.Field name="email" asChild>
          <label>
            <Flex direction="column" gap="1">
              <Form.Label asChild><Text size="2" weight="bold">{t('settings.personal_form.email')}</Text></Form.Label>
              <Form.Control asChild><TextField.Root name="email" type="email" value={personalData.email} onChange={handleChange} required /></Form.Control>
              <Form.Message className="form-message" match="valueMissing">{t('form_validation.value_missing')}</Form.Message>
              <Form.Message className="form-message" match="typeMismatch">{t('form_validation.type_mismatch_email')}</Form.Message>
            </Flex>
          </label>
        </Form.Field>

        <Form.Field name="profilePic" className="form-group">
          <Form.Label asChild><Text size="2" weight="bold">{t('settings.personal_form.profile_pic')}</Text></Form.Label>
          <Flex align="center" gap="4" mt="1">
            <Avatar size="8" radius="full" fallback="?" src={profilePreview || (personalData.profilePic ? URL.createObjectURL(personalData.profilePic) : undefined)} />
            <Button asChild variant="soft">
              <label htmlFor="profile-pic-input">Seleccionar Imagen</label>
            </Button>
            <Form.Control asChild>
              <input id="profile-pic-input" type="file" className="visually-hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profilePic')} />
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
                    {personalData.cv ? 'Cambiar PDF' : 'Subir PDF'}
                </Flex>
              </label>
            </Button>
            <Form.Control asChild>
                <input id="cv-input" type="file" className="visually-hidden" accept="application/pdf" onChange={(e) => handleFileChange(e, 'cv')} />
            </Form.Control>
            
            {personalData.cv && (
              <Card mt="2" size="1">
                <Flex align="center" gap="3">
                  <FileText size={24} color="var(--accent-9)" />
                  <Box>
                    <Text as="div" size="2" weight="bold" trim="start">{personalData.cv.name}</Text>
                    <Text as="div" size="1" color="gray">
                      {(personalData.cv.size / 1024).toFixed(1)} KB
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
              <Form.Control asChild><TextArea name="bio" value={personalData.bio} onChange={handleChange} style={{height: 100}}/></Form.Control>
            </Flex>
          </label>
        </Form.Field>
        
        <Text as="label" size="2">
          <Flex gap="2" align="center">
            <Switch checked={personalData.isSearching} onCheckedChange={(checked) => handleSwitchChange(checked, 'isSearching')} /> 
            {t('settings.personal_form.searching')}
          </Flex>
        </Text>

        <Text as="label" size="2">
          <Flex gap="2" align="center">
            <Switch checked={personalData.shareContactInfo} onCheckedChange={(checked) => handleSwitchChange(checked, 'shareContactInfo')} /> 
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