import Link from "next/link";
import Topbar from "@/app/_components/Topbar";
import { ABOUT, CTA, PROFILE, SEO, SERVICES, STATS } from "@/lib/profile";

export const metadata = {
  title: SEO.title,
  description: SEO.description,
  keywords: [...SEO.keywords]
};

function ContactRow({ symbol, value, href }: { symbol: string; value: string; href?: string }) {
  const content = (
    <>
      <span className="contact-symbol" aria-hidden="true">{symbol}</span>
      <span>{value}</span>
    </>
  );
  return href ? (
    <a className="contact-row" href={href}>{content}</a>
  ) : (
    <div className="contact-row">{content}</div>
  );
}

export default function CardPage() {
  return (
    <div className="site-shell">
      <Topbar />
      <main className="card-page">
        <article className="business-card">
          <div className="card-cover">{PROFILE.title} · {PROFILE.name}</div>

          <div className="card-copy">
            <h1>{PROFILE.headline}</h1>
            <p className="card-slogan">{PROFILE.subheadline}</p>
          </div>

          <div className="card-actions">
            <Link className="button" href="/card/booking">預約一對一諮詢</Link>
            <a className="button line-button" href={PROFILE.social.line} target="_blank" rel="noreferrer">
              {CTA.lineLabel}
            </a>
          </div>

          <section className="card-block">
            <h2 className="block-heading">{ABOUT.heading}</h2>
            <p className="block-body">{ABOUT.body}</p>
            <div className="area-tags">
              <span>善化房仲</span>
              <span>新市不動產</span>
              <span>安定區買房</span>
              <span>台南房產投資</span>
            </div>
          </section>

          <section className="card-block">
            <h2 className="block-heading">實績數據</h2>
            <div className="card-stat-grid">
              {STATS.map((stat) => (
                <div className="card-stat-item" key={stat.label}>
                  <div className="card-stat-value">
                    {stat.value}<span className="card-stat-unit">{stat.unit}</span>
                  </div>
                  <div className="card-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="card-block">
            <h2 className="block-heading">服務項目</h2>
            <ul className="service-list">
              {SERVICES.map((service) => (
                <li key={service.title}>
                  <strong>{service.title}</strong>
                  <span>{service.description}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card-cta">
            <h2>{CTA.heading}</h2>
            <p>{CTA.body}</p>
            <a className="button line-button" href={PROFILE.social.line} target="_blank" rel="noreferrer">
              {CTA.lineLabel}
            </a>
            <a className="cta-phone" href={`tel:${PROFILE.phoneRaw}`}>電話：{PROFILE.phone}</a>
          </section>

          <div className="contact-list">
            <ContactRow symbol="T" value={PROFILE.phone} href={`tel:${PROFILE.phoneRaw}`} />
            <ContactRow symbol="@" value={PROFILE.email} href={`mailto:${PROFILE.email}`} />
            <ContactRow symbol="P" value={PROFILE.serviceArea} />
          </div>
        </article>
      </main>
    </div>
  );
}
