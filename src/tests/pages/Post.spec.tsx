import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { getSession } from "next-auth/client";

import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "my-new-post",
  title: "My new post",
  content: "<p>Post excerpt<p>",
  updatedAt: "10 de Abril",
};

jest.mock("next-auth/client");
jest.mock("../../services/prismic");

describe("Post page", () => {
  it("shound renders correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const slug = "my-new-post";
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: `/posts/preview/${slug}`,
        }),
      })
    );
  });

  it("loads initial data", async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);
    const slug = "my-new-post";

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "My new post" }],
          content: [{ type: "paragraph", text: "post excerpt" }],
        },
        last_publication_date: "04-01-2021",
      }),
    } as any);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any);

    const response = await getServerSideProps({
      params: { slug },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My new post",
            content: "<p>post excerpt</p>",
            updatedAt: "01 de abril de 2021",
          },
        },
      })
    );
  });
});
