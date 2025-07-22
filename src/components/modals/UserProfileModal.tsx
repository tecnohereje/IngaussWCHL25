import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Dialog, Heading, Flex, Text, Avatar, Grid, Button, Badge, Card } from '@radix-ui/themes';
import { Linkedin, Mail, Wallet, Award, Gem, Bitcoin, Layers3 } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import WithdrawModal from './WithdrawModal';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdrawClick: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, onWithdrawClick }) => {
  const { t } = useTranslation();
  const { principal, userProfile, isProfileLoading } = useAuth();
  
  const notAvailable: string = "n/a";
  const displayName: string = userProfile?.fullName || t('common.anonymous');
  const avatarFallback: string = displayName.charAt(0).toUpperCase();
  
  const balances = userProfile?.balances;
  const totalBalance = (balances?.icp || 0) + (balances?.rbtc || 0) + (balances?.eth || 0);
  const isWithdrawDisabled = isProfileLoading || totalBalance <= 0;

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
              {!userProfile?.fullName && <Badge color="gray">{t('common.wallet_identified')}</Badge>}
            </Flex>

            <Flex direction="column" gap="3" mt="5">
              <Flex align="center" gap="3"><Mail size={16} /><Text size="2">{userProfile?.email || notAvailable}</Text></Flex>
              <Flex align="center" gap="3"><Linkedin size={16} /><Text size="2">{userProfile?.linkedin || notAvailable}</Text></Flex>
              <Flex align="center" gap="3"><Wallet size={16} /><Text size="2" style={{ fontFamily: 'monospace' }}>{principal?.toText()}</Text></Flex>
            </Flex>

            <Card mt="5">
                <Flex direction="column" align="center" gap="1">
                    <Text size="1" color="gray">{t('user_profile_modal.level')}</Text>
                    <Flex align="center" gap="1"><Award size={16}/><Heading size="4">{userProfile?.level ?? notAvailable}</Heading></Flex>
                </Flex>
            </Card>

            <Grid columns="3" gap="3" mt="3" width="100%">
                <Flex direction="column" align="center" gap="1" className="stat-card"><Text size="1" color="gray">ICP</Text><Flex align="center" gap="1"><Gem size={16}/><Heading size="4">{userProfile?.balances?.icp ?? 0}</Heading></Flex></Flex>
                <Flex direction="column" align="center" gap="1" className="stat-card"><Text size="1" color="gray">rBTC</Text><Flex align="center" gap="1"><Bitcoin size={16}/><Heading size="4">{userProfile?.balances?.rbtc ?? 0}</Heading></Flex></Flex>
                <Flex direction="column" align="center" gap="1" className="stat-card"><Text size="1" color="gray">ETH</Text><Flex align="center" gap="1"><Layers3 size={16}/><Heading size="4">{userProfile?.balances?.eth ?? 0}</Heading></Flex></Flex>
            </Grid>

            <Card mt="4">
              <Heading size="3" mb="2">{t('user_profile_modal.stats_title')}</Heading>
              <Grid columns={{initial: '1', sm: '2'}} gap="2">
                <Text size="2">{t('user_profile_modal.score')}: <strong>{userProfile?.stats?.score ?? notAvailable}</strong></Text>
                <Text size="2">{t('user_profile_modal.experience')}: <strong>{userProfile?.stats?.experience ? `${userProfile.stats.experience}%` : notAvailable}</strong></Text>
                <Text size="2">{t('user_profile_modal.total_playtime')}: <strong>{userProfile?.stats?.totalPlaytime || notAvailable}</strong></Text>
                <Text size="2">{t('user_profile_modal.last_played')}: <strong>{userProfile?.stats?.lastPlayed || notAvailable}</strong></Text>
              </Grid>
            </Card>

            <Card mt="3">
              <Heading size="3" mb="2">{t('user_profile_modal.sponsors_title')}</Heading>
              <Flex gap="3" wrap="wrap" align="center">
                {userProfile?.sponsors && userProfile.sponsors.length > 0 ? (
                  userProfile.sponsors.map(s => <div key={s} className="sponsor-logo">{s}</div>)
                ) : (
                  <Text size="2" color="gray">{notAvailable}</Text>
                )}
              </Flex>
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