import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import ThemeSwitch from './ThemeSwitch';
import UserProfileModal from './modals/UserProfileModal';
import WithdrawModal from './modals/WithdrawModal';
import Skeleton from './ui/Skeleton';
import Marquee from './ui/Marquee';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Box, Flex, Text, IconButton, Avatar } from '@radix-ui/themes';
import { 
  isLanguageSelectorEnabled, 
  isThemeSwitchEnabled, 
  isUserProfileEnabled,
  isMarqueeEnabled,
  headerLogoUrl,
  marqueeDefaultText
} from '../config/features';
import { fetchMarqueeTexts } from '../api/mockApi';

const Header: React.FC = () => {
  const { userProfile, isProfileLoading, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);
  const [marqueeTexts, setMarqueeTexts] = useState<string[]>([marqueeDefaultText]);

  useEffect(() => {
    if (isMarqueeEnabled) {
      fetchMarqueeTexts()
        .then(texts => {
          if (texts && texts.length > 0) {
            setMarqueeTexts(texts);
          }
        })
        .catch(console.error);
    }
  }, []);

  const showBackButton: boolean = location.pathname !== '/';
  const displayName: string = userProfile?.fullName || t('common.anonymous');
  const avatarFallback: string = displayName.charAt(0).toUpperCase();

  const handleWithdrawClick = () => {
    setIsProfileOpen(false);
    setIsWithdrawOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      {isUserProfileEnabled && (
        <>
          <UserProfileModal 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)} 
            onWithdrawClick={handleWithdrawClick}
          />
          <WithdrawModal 
            isOpen={isWithdrawOpen} 
            onClose={() => setIsWithdrawOpen(false)}
          />
        </>
      )}

      <Box asChild p="3" width="100%" style={{ backgroundColor: 'var(--gray-a2)' }}>
        <header>
          <Flex justify="between" align="center" maxWidth="1400px" mx="auto">
            <Flex align="center" gap="4">
              {showBackButton && (
                <IconButton variant="ghost" onClick={() => navigate(-1)} aria-label="Go back">
                  <ArrowLeft />
                </IconButton>
              )}
              <img src={headerLogoUrl} alt="App Logo" className="header-app-logo" />
            </Flex>

            {isMarqueeEnabled && (
              <Box style={{ flex: 1, overflow: 'hidden', margin: '0 1.5rem' }}>
                <Marquee texts={marqueeTexts} />
              </Box>
            )}

            <Flex align="center" gap={{initial: '1', sm: '3'}}>
              {isLanguageSelectorEnabled && <LanguageSelector />}
              {isThemeSwitchEnabled && <ThemeSwitch />}
              
              {isUserProfileEnabled && (
                <button className="user-menu-trigger" onClick={() => setIsProfileOpen(true)}>
                  <Flex align="center" gap="3">
                    <Avatar fallback={avatarFallback} size="2" color="indigo" radius='full' />
                    <Box className="user-text-details-header">
                      {isProfileLoading ? (
                        <Skeleton style={{ width: '80px', height: '16px' }} />
                      ) : (
                        <Text size="2" weight="bold">{displayName}</Text>
                      )}
                    </Box>
                  </Flex>
                </button>
              )}

              <IconButton variant="soft" color="red" onClick={handleLogout} title={t('profile.logout_button')}>
                <LogOut size={16} />
              </IconButton>
            </Flex>
          </Flex>
        </header>
      </Box>
    </>
  );
};

export default Header;