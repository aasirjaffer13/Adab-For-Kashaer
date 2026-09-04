import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight, BookOpen, Check, Heart, MessageCircle, Shield, PenSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Adab — Dignity in how we see, speak, and scroll" },
      { name: "description", content: "A calm, Islamic-corrective guide to online behavior: the gaze, the comment, and the adab we owe one another." },
      { property: "og:title", content: "Adab — Dignity in how we see, speak, and scroll" },
      { property: "og:description", content: "A calm, Islamic-corrective guide to online behavior: the gaze, the comment, and the adab we owe one another." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Adab",
          description: "A calm, Islamic-corrective guide to online behavior.",
          url: "/",
        }),
      },
    ],
  }),
});

const SECTIONS = [
  { id: "problem", label: "The problem" },
  { id: "islam-says", label: "What Islam says" },
  { id: "reframe", label: "Reframe the excuse" },
  { id: "for-sisters", label: "For sisters" },
  { id: "for-brothers", label: "For brothers" },
  { id: "resources", label: "Resources" },
];

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled ? "border-b border-border bg-background/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            Adab
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="transition-colors hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
            <Link
              to="/blog"
              className="font-semibold text-foreground transition-colors hover:text-primary"
            >
              Reflections
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/blog/new"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <PenSquare className="h-3.5 w-3.5" />
              <span>Write</span>
            </Link>
            <Link
              to="/dashboard"
              className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-card-foreground shadow-sm transition-colors hover:bg-muted"
            >
              Open Inspo
            </Link>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              An Islamic-corrective reflection
            </p>
            <h1 className="font-serif text-[clamp(2.5rem,7vw,5rem)] font-medium leading-[0.95] tracking-tight text-foreground">
              Lower the gaze.
              <br />
              Raise the adab.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              A Muslim man&apos;s gaze is his responsibility. A Muslim woman's dignity is not up for debate.
              This is a calm reminder of what our religion actually asks of us online.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#problem"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Read the reflection
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#resources"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-card-foreground transition-colors hover:bg-muted"
              >
                <BookOpen className="h-4 w-4" />
                Resources
              </a>
            </div>
          </div>
        </section>

        {/* The Problem — magazine feature */}
        <section id="problem" className="border-t border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="grid gap-12 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-4">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  The problem
                </p>
                <h2 className="mt-3 font-serif text-3xl font-medium leading-tight text-foreground md:text-4xl">
                  Comments have become a public audition for piety.
                </h2>
              </div>
              <div className="space-y-6 md:col-span-8 md:pl-8">
                <p className="text-lg leading-relaxed text-foreground">
                  On social media, women are scrutinized no matter what they do. If she covers fully, she is accused of seeking male attention. If she does not, she is harassed and blamed for the gaze of others. If she speaks up, she is told to be patient. If she stays silent, the behavior continues.
                </p>
                <p className="text-lg leading-relaxed text-foreground">
                  The most painful part is when this is done in the name of Islam. Verse 24:30 is weaponized to police women, while the same verse begins with a command to men: <em>"Tell the believing men to lower their gaze..."</em>
                </p>
                <p className="text-lg leading-relaxed text-foreground">
                  This site is not about any one person, post, or comment. It is about a pattern — and a better Islamic response.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Islam says */}
        <section id="islam-says" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mb-12 text-center">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              What Islam actually says
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium md:text-4xl">
              The gaze, the tongue, and the heart
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <QuoteCard
              source="Qur'an 24:30"
              text="Tell the believing men to lower their gaze and guard their private parts. That is purer for them. Indeed, Allah is Acquainted with what they do."
              note="The command begins with the believer's own gaze, not with what someone else is wearing."
            />
            <QuoteCard
              source="Qur'an 49:11-12"
              text="O you who have believed, let not a people ridicule another people; perhaps they may be better than them. And do not insult one another and do not call each other by offensive nicknames."
              note="Public mockery, name-calling, and shame are forbidden — online comments included."
            />
            <QuoteCard
              source="Hadith — Muslim"
              text="The Messenger of Allah ﷺ said: 'The Muslim is the one from whose tongue and hand the Muslims are safe.'"
              note="Safety includes emotional safety. A comment section is not exempt from this hadith."
            />
          </div>
        </section>

        {/* Reframe the excuse */}
        <section id="reframe" className="bg-secondary/30">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-12 text-center">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Reframe the excuse
              </p>
              <h2 className="mt-3 font-serif text-3xl font-medium md:text-4xl">
                Common justifications, answered with adab
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <ReframeCard
                excuse="She was asking for attention."
                response="Attention is not an invitation to harm. The Prophet ﷺ warned against following the gaze and the heart's whispers. Your self-control is the test; her post is not."
              />
              <ReframeCard
                excuse="I was just giving Islamic advice."
                response="Advice without gentleness, privacy, and sincerity is not nasihah. The Prophet ﷺ said: 'Religion is sincere goodwill.' Public shaming is the opposite of sincere advice."
              />
              <ReframeCard
                excuse="What was she expecting by posting that?"
                response="The question to ask is: what did you expect by responding with harm? Accountability is not a one-way street, and victim-blaming is not Islamic justice."
              />
              <ReframeCard
                excuse="She isn't even wearing hijab."
                response="Hijab is between her and Allah. Your duty is to lower your gaze and guard your tongue, not to appoint yourself as her judge in a comment thread."
              />
              <ReframeCard
                excuse="Men will be men."
                response="Muslim men are expected to be better than their impulses. The Prophet ﷺ was the best of men, and he taught self-restraint, respect, and protection of women — not excuses."
              />
              <ReframeCard
                excuse="At least I am defending Islam."
                response="Islam does not need defenders who violate its adab. Harassment, ridicule, and public shaming make people flee from the religion, not toward it."
              />
            </div>
          </div>
        </section>

        {/* For Sisters / For Brothers */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-2">
            <GuidanceBlock
              id="for-sisters"
              icon={<Heart className="h-5 w-5" />}
              title="For sisters"
              items={[
                "Your dignity is not determined by a comment section.",
                "You do not owe strangers explanations about your dress, your choices, or your faith.",
                "Block, report, and protect your peace. Digital boundaries are Islamic boundaries.",
                "Find sisters and teachers who correct with care, not contempt.",
              ]}
            />
            <GuidanceBlock
              id="for-brothers"
              icon={<Shield className="h-5 w-5" />}
              title="For brothers"
              items={[
                "Lower the gaze online exactly as you would offline.",
                "If you cannot say something with kindness and privacy, do not say it at all.",
                "Call out harmful comments among men. Silence is complicity.",
                "Learn the adab of disagreement before debating anyone, especially women you do not know.",
              ]}
            />
          </div>
        </section>

        {/* Resources */}
        <section id="resources" className="border-t border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mb-12 text-center">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Resources
              </p>
              <h2 className="mt-3 font-serif text-3xl font-medium md:text-4xl">
                Go deeper with knowledge
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <ResourceCard
                title="Yaqeen Institute"
                description="Research-backed articles on Islamic ethics, gender, and community."
                href="https://yaqeeninstitute.org"
              />
              <ResourceCard
                title="Islamicity"
                description="Quran, Hadith, and articles on adab and character."
                href="https://www.islamicity.org"
              />
              <ResourceCard
                title="Crash Override Network"
                description="Digital safety resources and guides for online harassment."
                href="https://www.crashoverridenetwork.com"
              />
            </div>
            <p className="mt-10 text-center text-sm text-muted-foreground">
              These links are offered as general learning and support resources. They do not replace a local scholar or mental-health professional.
            </p>
          </div>
        </section>

        {/* Community Reflections Showcase */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm md:p-14">
            <div className="grid gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-7">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Open Community Blog</span>
                </div>
                <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                  Reflections & Essays from the Community
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                  Explore open reflections written by everyday Muslims on digital mindfulness,
                  lowering the gaze in algorithmic feeds, and reviving gentle speech. Everyone is welcome to contribute.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                  >
                    Read all reflections
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/blog/new"
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    <PenSquare className="h-4 w-4" />
                    Write your reflection
                  </Link>
                </div>
              </div>

              <div className="space-y-4 md:col-span-5">
                <Link
                  to="/blog"
                  className="block rounded-xl border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/60"
                >
                  <span className="text-xs font-semibold text-muted-foreground">The Digital Gaze</span>
                  <p className="mt-1 font-serif text-base font-medium text-foreground">
                    Guarding the Gaze When the Algorithm Feeds Desire
                  </p>
                </Link>
                <Link
                  to="/blog"
                  className="block rounded-xl border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/60"
                >
                  <span className="text-xs font-semibold text-muted-foreground">Adab & Etiquette</span>
                  <p className="mt-1 font-serif text-base font-medium text-foreground">
                    The Death of Gentle Advice: How Call-Out Culture Hijacked Nasihah
                  </p>
                </Link>
                <Link
                  to="/blog"
                  className="block rounded-xl border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/60"
                >
                  <span className="text-xs font-semibold text-muted-foreground">Youth & Culture</span>
                  <p className="mt-1 font-serif text-base font-medium text-foreground">
                    The Sisterhood We Owe Each Other Online
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            Built with the hope that Kashmir — and every community — chooses adab.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <Link to="/blog" className="transition-colors hover:text-foreground">
              Reflections
            </Link>
            <Link to="/blog/new" className="transition-colors hover:text-foreground">
              Write a reflection
            </Link>
            <a href="/dashboard" className="transition-colors hover:text-foreground">
              Open Inspo
            </a>
            <a href="/login" className="transition-colors hover:text-foreground">
              Sign in
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function QuoteCard({ source, text, note }: { source: string; text: string; note: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
      <p className="font-serif text-lg italic leading-relaxed text-card-foreground">&ldquo;{text}&rdquo;</p>
      <div className="mt-auto pt-6">
        <p className="text-sm font-semibold text-foreground">{source}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}

function ReframeCard({ excuse, response }: { excuse: string; response: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        <div>
          <p className="font-semibold text-card-foreground">{excuse}</p>
          <p className="mt-2 leading-relaxed text-muted-foreground">{response}</p>
        </div>
      </div>
    </div>
  );
}

function GuidanceBlock({
  id,
  icon,
  title,
  items,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div id={id} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
        {icon}
      </div>
      <h3 className="font-serif text-2xl font-medium text-card-foreground">{title}</h3>
      <ul className="mt-6 space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-muted-foreground">
            <Check className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/60" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResourceCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted"
    >
      <h4 className="font-serif text-lg font-medium text-card-foreground group-hover:text-foreground">{title}</h4>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-foreground">
        Visit
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}
