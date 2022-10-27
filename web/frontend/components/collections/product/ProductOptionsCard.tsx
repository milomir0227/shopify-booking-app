import {
  Button,
  ButtonGroup,
  Card,
  Form,
  FormLayout,
  Icon,
  Select,
  Stack,
  TextStyle,
} from "@shopify/polaris";
import { ClockMajor } from "@shopify/polaris-icons";
import { useCallback, useState } from "react";
import { useAuthenticatedFetch } from "../../../hooks";

export default ({
  productId,
  product,
}: {
  productId: string;
  product: Product;
}) => {
  const [duration, setDuration] = useState<string>(
    String(product.duration) || "0"
  );
  const [buffertime, setBuffertime] = useState<string>(
    String(product.buffertime) || "0"
  );

  const handleSelectChange = useCallback((value) => setBuffertime(value), []);

  const options = [
    { label: "0 min", value: "0" },
    { label: "5 min", value: "5" },
    { label: "10 min", value: "10" },
    { label: "15 min", value: "15" },
    { label: "20 min", value: "20" },
    { label: "25 min", value: "25" },
    { label: "30 min", value: "30" },
  ];

  const fetch = useAuthenticatedFetch();
  const handleSubmit = useCallback(async () => {
    return await fetch(`/api/admin/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify({
        buffertime: parseInt(buffertime),
        duration: parseInt(duration),
      }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  }, [duration, buffertime]);

  const selectLabel = (
    <Stack spacing="tight">
      <Stack.Item>
        <Icon source={ClockMajor} />
      </Stack.Item>
      <Stack.Item>Buffertime</Stack.Item>
    </Stack>
  );

  return (
    <Card
      title="Produkt indstillinger"
      secondaryFooterActions={[{ content: "Annullere" }]}
      primaryFooterAction={{ content: "Gem", onAction: handleSubmit }}
    >
      <Card.Section>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <TextStyle>Meeting duration</TextStyle>
            <ButtonGroup segmented>
              <Button
                pressed={duration === "30"}
                onClick={() => setDuration("30")}
              >
                30 min
              </Button>
              <Button
                pressed={duration === "45"}
                onClick={() => setDuration("45")}
              >
                45 min
              </Button>
              <Button
                pressed={duration === "60"}
                onClick={() => setDuration("60")}
              >
                60 min
              </Button>
            </ButtonGroup>
            <TextStyle variation="subdued">
              How long should your meeting last?(minutes)
            </TextStyle>
            <Select
              label={selectLabel}
              options={options}
              onChange={handleSelectChange}
              value={buffertime}
              helpText="Free time between meetings"
            />
          </FormLayout>
        </Form>
      </Card.Section>
    </Card>
  );
};
