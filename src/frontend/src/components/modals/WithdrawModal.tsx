import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Heading, Flex, Button, Text } from '@radix-ui/themes';
import { Landmark, Repeat, ArrowUpRight } from 'lucide-react';

// --- We define the type for each exchange object ---
interface Exchange {
  name: string;
  icon: React.ReactNode;
}

const exchanges: Exchange[] = [
  { name: 'Binance', icon: <Landmark /> },
  { name: 'Coinbase', icon: <Landmark /> },
  { name: 'Kraken', icon: <Landmark /> },
];

// --- We define the component's props ---
interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title align="center" size="6" mb="4">
          {t('user_profile_modal.withdraw_title')}
        </Dialog.Title>

        <Flex direction="column" gap="3">
          {exchanges.map(exchange => (
            <Button key={exchange.name} size="3" variant="soft">
              {exchange.icon}
              <Text ml="2" mr="auto">{exchange.name}</Text>
              <ArrowUpRight size={16} />
            </Button>
          ))}
          <Button size="3" variant="solid" mt="2">
            <Repeat />
            <Text ml="2">{t('user_profile_modal.withdraw_p2p')}</Text>
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default WithdrawModal;