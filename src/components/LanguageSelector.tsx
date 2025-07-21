import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, IconButton, Heading, Grid, Flex, Text } from '@radix-ui/themes';
import { Languages } from 'lucide-react';

// 1. Definimos una interfaz para la estructura de nuestros datos de idioma
interface LanguageInfo {
  code: string;
  name: string;
  flag: string;
  speakers: number;
}

const languageData: LanguageInfo[] = [
  { code: 'en', name: 'English', flag: '/img/flags/en.png', speakers: 1500 },
  { code: 'zh', name: '中文', flag: '/img/flags/zh.png', speakers: 1100 },
  { code: 'hi', name: 'हिन्दी', flag: '/img/flags/in.png', speakers: 600 },
  { code: 'es', name: 'Español', flag: '/img/flags/es.png', speakers: 590 },
  { code: 'ar', name: 'العربية', flag: '/img/flags/ar.png', speakers: 420 },
  { code: 'pt', name: 'Português', flag: '/img/flags/pt.png', speakers: 280 },
  { code: 'fr', name: 'Français', flag: '/img/flags/fr.png', speakers: 270 },
  { code: 'ru', name: 'Русский', flag: '/img/flags/ru.png', speakers: 260 },
  { code: 'de', name: 'Deutsch', flag: '/img/flags/de.png', speakers: 135 },
  { code: 'ja', name: '日本語', flag: '/img/flags/ja.png', speakers: 125 },
  { code: 'ko', name: '한국어', flag: '/img/flags/ko.png', speakers: 80 },
  { code: 'it', name: 'Italiano', flag: '/img/flags/it.png', speakers: 68 },
];

const sortedLanguages: LanguageInfo[] = [...languageData].sort((a, b) => b.speakers - a.speakers);

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLanguageChange = (langCode: string): void => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <IconButton variant="soft" aria-label="Change Language">
          <Languages />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 600 }}>
        <Dialog.Title align="center" size="6" mb="5">
          {t('language_modal.title')}
        </Dialog.Title>

        <Dialog.Description align="center" size="2" color="gray" mt="-2" mb="5">
          {t('language_modal.description')}
        </Dialog.Description>

        <Grid columns={{ initial: '2', sm: '3' }} gap="4">
          {sortedLanguages.map((langInfo) => (
            <button
              key={langInfo.code}
              className="language-grid-item"
              onClick={() => handleLanguageChange(langInfo.code)}
            >
              <Flex direction="column" gap="2" align="center">
                <div className="language-flag-container">
                  <img src={langInfo.flag} alt={`${langInfo.name} flag`} className="language-grid-flag" />
                </div>
                <Text size="2">{langInfo.name}</Text>
              </Flex>
            </button>
          ))}
        </Grid>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default LanguageSelector;