import TagOptions from '@components/TagOptions';
import useTagOptions from '@components/useTagOptions';
import { useCollectionProductStaff } from '@services/product/staff';
import { Modal, OptionList, Spinner } from '@shopify/polaris';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormContext from './FormContext';

interface StaffModalProps {
  productId: string;
  show: boolean;
  close: () => void;
}

export default ({ productId, show, close }: StaffModalProps) => {
  const { t } = useTranslation('collections', {
    keyPrefix: 'product.staff.modal',
  });
  const { data } = useCollectionProductStaff({ productId });
  const { value, fields, addItem, removeItems } = useContext(FormContext);
  const [selected, setSelected] = useState<Array<StaffTag>>([]);

  const toggle = useCallback(
    (value: StaffTag) => {
      // first we remove the selected Staff
      const newSelected = selected.filter((s) => s._id !== value._id);
      // then if tag is NOT null, we the selected staff
      if (value.tag) {
        newSelected.push(value);
      }
      setSelected(() => newSelected);
    },
    [selected]
  );

  const didChange = useMemo(
    () => JSON.stringify(value) !== JSON.stringify(selected),
    [value, selected]
  );

  const submit = () => {
    if (didChange) {
      removeItems(fields.map((_, index) => index));
      selected.forEach((s) => addItem(s));
    }
    close();
  };

  // onOpen update selected to correspond to the useForm
  useEffect(() => {
    setSelected(() => [...value]);
  }, [value]);

  const choices = data
    ?.sort((a, b) => (a.fullname > b.fullname ? 1 : -1))
    .map((staff) => (
      <ChoiceStaff
        key={staff._id}
        staff={staff}
        toggle={toggle}
        selected={selected}
      />
    ));

  return (
    <Modal
      open={show}
      onClose={close}
      title={t('title')}
      primaryAction={{
        content: t('done'),
        onAction: submit,
        disabled: !didChange,
      }}
      secondaryActions={[
        {
          content: t('close'),
          onAction: close,
        },
      ]}>
      {!choices && (
        <Modal.Section>
          <div style={{ textAlign: 'center' }}>
            <Spinner accessibilityLabel="Spinner example" size="large" />
          </div>
        </Modal.Section>
      )}
      {choices?.map((c, index) => c)}
    </Modal>
  );
};

interface ChoiceStaffProps {
  staff: ProductStaffToAdd;
  selected: Array<StaffTag>;
  toggle: (value: StaffTag) => void;
}

const ChoiceStaff = ({ staff, selected, toggle }: ChoiceStaffProps) => {
  const tagOptions = useTagOptions();

  const choices = useMemo(
    () =>
      staff.tags.sort().map((t) => {
        return {
          value: t,
          label: tagOptions.find((o) => o.value === t).label,
        };
      }),
    [staff.tags]
  );

  const handleChange = useCallback(
    (value: string[]) => {
      const { tags, ...spreadStaff } = staff;
      toggle({ ...spreadStaff, tag: value[0] });
    },
    [toggle]
  );

  const choiceSelected = selected
    .filter((s) => s._id === staff._id)
    .map((s) => s.tag);

  return (
    <OptionList
      title={staff.fullname}
      options={choices}
      selected={choiceSelected}
      onChange={handleChange}
      allowMultiple
    />
  );
};