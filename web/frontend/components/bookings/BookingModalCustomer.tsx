import { Link, Modal, TextContainer } from '@shopify/polaris';

export default ({ info }: BookingModalChildProps) => {
  const url =
    'https://testeriphone.myshopify.com/admin/customers/' + info.customerId;

  return (
    <>
      <Modal.Section>
        <TextContainer>
          <strong>Fuldenavn:</strong>{' '}
          <Link url={url} external>
            {info.customer.firstName} {info.customer.lastName}
          </Link>
        </TextContainer>
      </Modal.Section>
      <Modal.Section>
        <TextContainer>
          <strong>email:</strong> {info.customer.email || '-'}
        </TextContainer>
      </Modal.Section>
      <Modal.Section>
        <TextContainer>
          <strong>mobil:</strong> {info.customer.phone || '-'}
        </TextContainer>
      </Modal.Section>
    </>
  );
};