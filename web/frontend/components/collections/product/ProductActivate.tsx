import { Layout, SettingToggle } from '@shopify/polaris';
import { FieldDictionary } from '@shopify/react-form';
import { useTranslation } from '@hooks';

interface FormFields extends FieldDictionary<Pick<Product, 'active'>> {
  staffLength: number;
}

export default ({ active, staffLength }: FormFields) => {
  const { t } = useTranslation('collections', { keyPrefix: 'product' });

  const contentStatus = active.value ? 'deactivate' : 'activate';
  const textStatus = active.value ? 'status_active' : 'status_deactive';

  return (
    <Layout.AnnotatedSection>
      <SettingToggle
        action={{
          content: t(contentStatus),
          onAction: () => active.onChange(!active.value),
          disabled: staffLength === 0,
        }}
        enabled={active.value}>
        {t(textStatus)}
      </SettingToggle>
    </Layout.AnnotatedSection>
  );
};
