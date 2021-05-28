import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import { stripe } from "../../services/stripe";

import Home, { getStaticProps } from "../../pages";

jest.mock("next/router");
jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false],
  };
});
jest.mock("../../services/stripe");

describe("Home page", () => {
  it("shound renders correctly", () => {
    render(<Home product={{ amount: "R$ 10,00" }} />);

    expect(screen.getByText(/R\$ 10,00/i)).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const retriveStripePricesMocked = mocked(stripe.prices.retrieve);

    retriveStripePricesMocked.mockResolvedValueOnce({
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            amount: "$10.00",
          },
        },
      })
    );
  });
});
