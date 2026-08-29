import { Helmet } from "react-helmet-async";

type Props = {
  title: string;
  description?: string;
  /** Set on private/in-app pages so search engines don't index them. */
  noIndex?: boolean;
};

/** Per-route <title>/<meta> tags. */
const Seo = ({ title, description, noIndex }: Props) => (
  <Helmet>
    <title>{`${title} · FriendBook`}</title>
    {description && <meta name="description" content={description} />}
    {noIndex && <meta name="robots" content="noindex, nofollow" />}
  </Helmet>
);

export default Seo;
