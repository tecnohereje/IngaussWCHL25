import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Text, TextField, TextArea, Switch, Button, Avatar, Card, Box, Spinner } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { Paperclip, FileText } from 'lucide-react';
import { maxProfilePicSize, maxResumeSize } from '../../config/features';
import { updatePersonalInfo } from '../../api/backend';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { TabComponentProps } from '../../pages/SettingsPage';
import type { PersonalInfoType } from '../../../../common/types';

const PersonalInfoTab: React.FC<TabComponentProps> = ({ formData }) => {
  const { t } = useTranslation();
  const { identity, userProfile, updateUserProfile } = useAuth();

  // 1. Flattened local state for each form field
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [shareContactInfo, setShareContactInfo] = useState(true);
  const [profilePic, setProfilePic] = useState<File | undefined>(undefined);
  const [cv, setCv] = useState<File | undefined>(undefined);
  
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. useEffect to synchronize local state with props from parent
  useEffect(() => {
    const personalData = formData.profile?.personal;
    if (personalData) {
      setFullName(personalData.fullName || '');
      setEmail(personalData.email || '');
      setBio(personalData.bio || '');
      setIsSearching(personalData.isSearching || false);
      setShareContactInfo(personalData.shareContactInfo || true);
      // Note: We don't set file objects from the backend data directly
    }
  }, [formData]);

  // 3. Simplified file change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'profilePic' | 'cv') => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = fileType === 'profilePic' ? maxProfilePicSize : maxResumeSize;
      const isValidType = fileType === 'profilePic' ? file.type.startsWith('image/') : file.type === 'application/pdf';
      
      if (isValidType && file.size <= maxSize) {
        if (fileType === 'profilePic') {
          setProfilePic(file);
          setProfilePreview(URL.createObjectURL(file));
        } else {
          setCv(file);
        }
      } else {
        toast.error(t('toasts.invalid_file'));
        e.target.value = '';
      }
    } else {
      if (fileType === 'profilePic') {
        setProfilePic(undefined);
        setProfilePreview(null);
      }
      else {
        setCv(undefined);
      }
    }
  };
  
  // 4. Re-assemble the object on submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!identity) {
      toast.error(t('toasts.user_not_identified'));
      return;
    }

    const personalDataToSave: PersonalInfoType = {
      fullName,
      email,
      bio,
      isSearching,
      shareContactInfo,
      profilePic,
      cv,
    };

    setIsLoading(true);
    try {
      await updatePersonalInfo(identity, personalDataToSave);
      
      // Optimistically update the global state
      if (userProfile) {
        updateUserProfile({ 
          ...userProfile,
          profile: { ...userProfile.profile, personal: personalDataToSave }
        });
      }
      toast.success(t('settings.api_success.message'));
    } catch (error) {
      console.error("Failed to save personal info:", error);
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
              <Form.Control asChild><TextField.Root name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required /></Form.Control>
              <Form.Message className="form-message" match="valueMissing">{t('form_validation.value_missing')}</Form.Message>
            </Flex>
          </label>
        </Form.Field>
        
        <Form.Field name="email" asChild>
          <label>
            <Flex direction="column" gap="1">
              <Form.Label asChild><Text size="2" weight="bold">{t('settings.personal_form.email')}</Text></Form.Label>
              <Form.Control asChild><TextField.Root name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Form.Control>
              <Form.Message className="form-message" match="valueMissing">{t('form_validation.value_missing')}</Form.Message>
              <Form.Message className="form-message" match="typeMismatch">{t('form_validation.type_mismatch_email')}</Form.Message>
            </Flex>
          </label>
        </Form.Field>

        <Form.Field name="profilePic" className="form-group">
          <Form.Label asChild><Text size="2" weight="bold">{t('settings.personal_form.profile_pic')}</Text></Form.Label>
          <Flex align="center" gap="4" mt="1">
            <Avatar size="8" radius="full" fallback="?" src={profilePreview || undefined} />
            <Button asChild variant="soft">
              <label htmlFor="profile-pic-input">{t('forms.select_image')}</label>
            </Button>
            <Form.Control asChild>
              <input id="profile-pic-input" type="file" className="visually-hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'profilePic')} />
            </Form.Control>
          </Flex>
          <Text size="1" color="gray" mt="1">{t('forms.max_image_size', { size: maxProfilePicSize / 1024 })}</Text>
        </Form.Field>

        <Form.Field name="cv" className="form-group">
          <Form.Label asChild><Text size="2" weight="bold">{t('settings.personal_form.cv_label')}</Text></Form.Label>
            <Button asChild variant="soft" mt="1" style={{ width: 'fit-content' }}>
              <label htmlFor="cv-input">
                <Flex align="center" gap="2">
                    <Paperclip size={14}/>
                    {cv ? t('forms.change_pdf') : t('forms.upload_pdf')}
                </Flex>
              </label>
            </Button>
            <Form.Control asChild>
                <input id="cv-input" type="file" className="visually-hidden" accept="application/pdf" onChange={(e) => handleFileChange(e, 'cv')} />
            </Form.Control>
            {cv && (
              <Card mt="2" size="1">
                <Flex align="center" gap="3">
                  <FileText size={24} color="var(--accent-9)" />
                  <Box>
                    <Text as="div" size="2" weight="bold" trim="start">{cv.name}</Text>
                    <Text as="div" size="1" color="gray">{(cv.size / 1024).toFixed(1)} KB</Text>
                  </Box>
                </Flex>
              </Card>
            )}
            <Text size="1" color="gray" mt="1">{t('forms.max_pdf_size', { size: maxResumeSize / 1024 })}</Text>
        </Form.Field>
        
        <Form.Field name="bio" asChild>
          <label>
            <Flex direction="column" gap="1">
              <Form.Label asChild><Text size="2" weight="bold">{t('settings.personal_form.bio')}</Text></Form.Label>
              <Form.Control asChild><TextArea name="bio" value={bio} onChange={(e) => setBio(e.target.value)} style={{height: 100}}/></Form.Control>
            </Flex>
          </label>
        </Form.Field>
        
        <Text as="label" size="2">
          <Flex gap="2" align="center">
            <Switch checked={isSearching} onCheckedChange={setIsSearching} /> 
            {t('settings.personal_form.searching')}
          </Flex>
        </Text>

        <Text as="label" size="2">
          <Flex gap="2" align="center">
            <Switch checked={shareContactInfo} onCheckedChange={setShareContactInfo} /> 
            {t('settings.personal_form.share_contact')}
          </Flex>
        </Text>

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
export default PersonalInfoTab;
