import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Dialog, Heading, Flex, Text, Avatar, Grid, Button, Badge, Card } from '@radix-ui/themes';
import { Linkedin, Mail, Wallet, Award } from 'lucide-react';
import Skeleton from '../ui/Skeleton';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdrawClick: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, onWithdrawClick }) => {
  const { t } = useTranslation();
  const { principal, userProfile, isProfileLoading } = useAuth();
  
  const notAvailable: string = "n/a";
  const displayName: string = userProfile?.profile?.personal?.fullName || t('common.anonymous');
  const avatarFallback: string = displayName.charAt(0).toUpperCase();
  
  // TODO: Re-evaluate the withdraw logic based on real data later.
  const isWithdrawDisabled = true; // Disabled for now as balances are not part of the real data model.

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 500 }}>
        {isProfileLoading ? (
          <UserProfileSkeleton />
        ) : (
          <>
            <Flex direction="column" align="center" gap="2">
              <Avatar radius="full" size="7" fallback={avatarFallback} color="indigo" className="user-profile-avatar"/>
              <Dialog.Title size="6">{displayName}</Dialog.Title>
              {!userProfile?.profile?.personal?.fullName && <Badge color="gray">{t('common.wallet_identified')}</Badge>}
            </Flex>

            <Flex direction="column" gap="3" mt="5">
              <Flex align="center" gap="3"><Mail size={16} /><Text size="2">{userProfile?.profile?.personal?.email || notAvailable}</Text></Flex>
              <Flex align="center" gap="3"><Linkedin size={16} /><Text size="2">{userProfile?.profile?.social?.linkedin || notAvailable}</Text></Flex>
              <Flex align="center" gap="3"><Wallet size={16} /><Text size="2" style={{ fontFamily: 'monospace' }}>{principal?.toText()}</Text></Flex>
            </Flex>

            <Card mt="5">
                <Flex direction="column" align="center" gap="1">
                    <Text size="1" color="gray">{t('user_profile_modal.level')}</Text>
                    <Flex align="center" gap="1"><Award size={16}/><Heading size="4">{userProfile?.stats?.level?.toString() ?? notAvailable}</Heading></Flex>
                </Flex>
            </Card>

            <Card mt="4">
              <Heading size="3" mb="2">{t('user_profile_modal.stats_title')}</Heading>
              <Grid columns={{initial: '1', sm: '2'}} gap="2">
                <Text size="2">{t('user_profile_modal.experience')}: <strong>{userProfile?.stats?.experiencePoints?.toString() ?? notAvailable} XP</strong></Text>
                {/* Add other real stats as they become available in the data model */}
              </Grid>
            </Card>
            
            <Button size="3" mt="5" style={{ width: '100%' }} onClick={onWithdrawClick} disabled={isWithdrawDisabled}>
              {t('user_profile_modal.withdraw_button')}
            </Button>
          </>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};


const UserProfileSkeleton = () => (
  <Flex direction="column" gap="4">
    <Flex direction="column" align="center" gap="2">
      <Skeleton style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
      <Skeleton style={{ width: '150px', height: '24px' }} />
    </Flex>
    <Flex direction="column" gap="3" mt="5">
      <Skeleton style={{ width: '100%', height: '20px' }} />
      <Skeleton style={{ width: '100%', height: '20px' }} />
      <Skeleton style={{ width: '100%', height: '20px' }} />
    </Flex>
    <Card mt="5">
      <Flex direction="column" align="center" gap="1">
        <Skeleton style={{ width: '50px', height: '16px' }} />
        <Skeleton style={{ width: '80px', height: '28px', marginTop: '4px' }} />
      </Flex>
    </Card>
    <Grid columns="3" gap="3" mt="3" width="100%">
      <Skeleton style={{ height: '70px' }} />
      <Skeleton style={{ height: '70px' }} />
      <Skeleton style={{ height: '70px' }} />
    </Grid>
    <Skeleton style={{ width: '100%', height: '40px', marginTop: '1rem' }} />
  </Flex>
);

export default UserProfileModal;