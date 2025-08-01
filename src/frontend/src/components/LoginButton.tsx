import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import ThemeSwitch from './ThemeSwitch';
import { Card, Flex, Heading, Text, Button, Spinner } from '@radix-ui/themes';
import { isNfidLoginEnabled, isIiLoginEnabled, isDevLoginEnabled, loginLogoUrl } from '../config/features';
import { Fingerprint, Infinity, Wrench } from 'lucide-react';

const LoginButton: React.FC = () => {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const { loginWithNfid, loginWithIi, bypassLogin } = useAuth();
  const { t } = useTranslation();

  // --- REFACTOR: Handlers are now asynchronous ---
  const handleLogin = async (provider: 'nfid' | 'ii') => {
    setLoadingProvider(provider);
    try {
      if (provider === 'nfid') {
        await loginWithNfid();
      } else {
        await loginWithIi();
      }
      // If the login is successful, the page will change and this component will unmount.
      // We don't need to do anything here.
    } catch (error) {
      console.error('Login process was cancelled or failed:', error);
      // The error is already handled in the context, here we just make sure
      // that the UI is reset in the 'finally' block.
    } finally {
      // This block ALWAYS executes, on success, failure, or cancellation.
      setLoadingProvider(null);
    }
  };

  return (
    <Card style={{ maxWidth: 400, width: '100%' }}>
      <Flex direction="column" gap="4" align="center" p="4">
        <div className="login-logo-container">
          <img src={loginLogoUrl} alt={t('login.logo_alt')} className="login-logo"/>
        </div>
        
        <Flex gap="3" align="center">
          <LanguageSelector />
          <ThemeSwitch />
        </Flex>
        
        <Heading align="center">{t('login.welcome')}</Heading>
        <Text color="gray" align="center">{t('login.prompt')}</Text>

        <Flex direction="column" gap="3" width="100%">
          {isNfidLoginEnabled && (
            <Button size="3" onClick={() => handleLogin('nfid')} disabled={!!loadingProvider}>
              <Fingerprint size={16} />
              {loadingProvider === 'nfid' ? <Spinner /> : t('login.button')}
            </Button>
          )}

          {isIiLoginEnabled && (
            <Button size="3" onClick={() => handleLogin('ii')} disabled={!!loadingProvider}>
              <Infinity size={16} />
              {loadingProvider === 'ii' ? <Spinner /> : t('login.ii_button')}
            </Button>
          )}

          {isDevLoginEnabled && (
            <>
              <Text color="gray" size="1" align="center" mt="2">
                {t('login.dev_mode_prompt')}
              </Text>
              <Button size="3" variant="soft" onClick={bypassLogin} disabled={!!loadingProvider}>
                <Wrench size={16} />
                {t('login.dev_mode_button')}
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

export default LoginButton;