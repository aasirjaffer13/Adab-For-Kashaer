-- Demo content for the community blog.
-- Loaded by `supabase db reset` (registered in supabase/config.toml).
-- Posts are inserted directly as 'approved' so the moderation flow is not
-- bypassed for anything users submit through the app.

insert into public.blogs (id, title, slug, excerpt, content, author_name, category, tags, read_time_minutes, likes_count, status, created_at, updated_at)
  values ('digital-gaze-in-algorithmic-age', 'Guarding the Gaze When the Algorithm Feeds Desire', 'guarding-the-gaze-when-the-algorithm-feeds-desire', 'Lowering the gaze was revealed for bustling streets and desert crossroads. How does a believer practice it when the marketplace is in their palm, engineered to capture their eyes?', '## The Modern Marketplace of the Eyes

In classical Islamic ethics, the gaze (*an-nazar*) was described as an arrow from the quiver of Iblis. The scholars of the heart—Al-Ghazali, Ibn Qayyim, and Ibn al-Jawzi—wrote volumes warning of the first casual look that lingers into a second deliberate gaze.

Yet when those treaties were penned, a person had to physically step into the town market or walk down an alleyway to face such tests. If you remained in your study or within the sanctuary of your home, the world could not force its images upon you.

Today, the market has moved into our bedroom. Worse still, the marketplace is powered by multi-billion-dollar recommendation algorithms that reward provocation, sensuality, and dopamine triggers. The algorithm does not merely reflect what we search for; it amplifies our fleeting weaknesses.

> *"Tell the believing men to lower their gaze and guard their modesty. That is purer for them. Indeed, Allah is Acquainted with what they do."* (Surah An-Nur 24:30)

Notice the divine wisdom in the sequencing: Allah subhanahu wa ta''ala addresses the men before the women, and addresses their eyes before their limbs. Purity of heart begins at the threshold of vision.

### Practical Steps for the Digital Gaze

1. **Resetting the Feed Aggressively**: Use the "Not Interested" or "Mute" feature ruthlessly. Do not linger for even two seconds on content that compromises your soul, as the feed registers your dwell-time.
2. **The 3-Second Rule**: When an unsolicited image appears, train your thumb to immediately scroll past. The first glance is forgiven; the lingering gaze is counted.
3. **Physical Boundaries**: Ban phones from the bedroom after nightfall. Spiritual discipline is often won or lost in the quiet hours when fatigue lowers cognitive restraint.
4. **Cultivating Al-Muraqabah**: Remember that Allah''s sight upon you is faster than your screen''s refresh rate. True dignity is what we do when only the angels are recording.', 'Tariq Al-Andalusi', 'The Digital Gaze', array['adab', 'gaze', 'algorithms', 'mindfulness']::text[], 5, 34, 'approved', '2026-08-28T14:00:00.000Z', '2026-08-28T14:00:00.000Z')
  on conflict (id) do nothing;

insert into public.blogs (id, title, slug, excerpt, content, author_name, category, tags, read_time_minutes, likes_count, status, created_at, updated_at)
  values ('the-death-of-gentle-advice', 'The Death of Gentle Advice: How Call-Out Culture Hijacked Nasihah', 'the-death-of-gentle-advice-how-call-out-culture-hijacked-nasihah', 'When did correcting a fellow Muslim transform from a quiet, tearful embrace into a public spectator sport designed to harvest retweets and likes?', '## When Sincerity Becomes Spectacle

Imam ash-Shafi''i famously wrote:

> *"Counsel me in private, and spare me advice in the assembly. For advice given before people is a type of scolding that I do not love to hear."*

Today, if a young Muslim woman posts a reflection or photo where a strand of hair shows, or where a brother makes a grammatical mistake in Arabic, the comment section explodes. Men who have not prayed Tahajjud in months suddenly assume the robes of the Grand Mufti, typing paragraphs of condemnation punctuated with harsh emojis.

We must ask ourselves with utter honesty: **Who is this comment for?**

Is it genuinely intended to guide the soul back to Allah? Or is it a performative badge of piety meant to demonstrate to other onlookers that we are righteous while this person is deficient?

### The Conditions of True Nasihah

Classical scholars outlined three non-negotiable criteria for advice to be considered *Nasihah* rather than *Fadheehah* (public humilation):

1. **Ikhlas (Purity of Intention)**: You desire nothing except good for your brother or sister. If there is even an atom of pride or desire for superiority, your speech is poisoned.
2. **Sirriyyah (Privacy)**: Send a direct message, speak privately, or pray for them in your sujud. Public rebukes harden hearts and push people away from Islam.
3. **Lutf (Gentleness)**: Allah commanded Musa and Harun to speak with gentle speech (*qawlan layyina*) even to Pharaoh, the greatest tyrant of his time. Is your sister in faith more rebellious than Pharaoh?

If we cannot deliver our advice with tears of concern and quiet dignity, the most Islamic action we can take is silence.', 'Maryam K.', 'Adab & Etiquette', array['nasihah', 'discourse', 'social-media', 'character']::text[], 6, 52, 'approved', '2026-08-30T10:30:00.000Z', '2026-08-30T10:30:00.000Z')
  on conflict (id) do nothing;

insert into public.blogs (id, title, slug, excerpt, content, author_name, category, tags, read_time_minutes, likes_count, status, created_at, updated_at)
  values ('social-media-humility-in-era-of-ego', 'Kibr in 280 Characters: Social Media and the Vanity of the Self', 'kibr-in-280-characters-social-media-and-the-vanity-of-the-self', 'The Prophet ﷺ warned that no one enters Paradise who has an atom''s weight of pride. How do we navigate platforms whose very architecture is built to feed the ego?', '## The Economy of Self-Promotion

Every metric on modern social networks—follower counts, impression metrics, retweet velocity—is a numeric valuation of the self. Without realizing it, we begin asking: *Did they see me? Did they agree with me? How many people validated my insight today?*

The Prophet Muhammad ﷺ warned:

> *"Pride is refusing the truth and looking down upon people."* (Sahih Muslim)

In online debates, how often do we refuse to concede a valid point made by someone else simply because our pride cannot tolerate losing an argument publicly? How often do we sneer at someone''s question or lack of knowledge?

### Cultivating Khushu'' in Digital Spaces

- **Take intentional pauses before hitting ''Post''**: Ask: *Am I posting this to serve truth, or to elevate my own status?*
- **Practice hidden good deeds**: For every public reflection or post you share, perform two silent acts of charity or worship that nobody on Earth knows about.
- **Normalize saying ''I do not know''**: When discussions exceed your knowledge, resist the urge to weigh in. Adab is knowing the limits of one''s own speech.', 'Zayd Bilal', 'Contemporary Discourse', array['kibr', 'humility', 'ego', 'spirituality']::text[], 4, 27, 'approved', '2026-09-01T18:15:00.000Z', '2026-09-01T18:15:00.000Z')
  on conflict (id) do nothing;

insert into public.blogs (id, title, slug, excerpt, content, author_name, category, tags, read_time_minutes, likes_count, status, created_at, updated_at)
  values ('sanctuary-of-sisters', 'The Sisterhood We Owe Each Other Online', 'the-sisterhood-we-owe-each-other-online', 'Navigating social spaces as a Muslim woman requires emotional resilience. Here is how we build spaces of genuine refuge, gentle accountability, and mutual honor.', '## Building Safe Harbors

Being visible online carries a unique toll for Muslim women. We find ourselves caught between commercial pressures to commodify our identity on one hand, and vicious, judgmental scrutiny on the other.

Every sister is at a different station on her spiritual journey. Some are wearing the hijab for the first time; some are struggling with doubts; others are seeking knowledge in hostile environments.

When a sister reaches out online, she should find warmth, wisdom, and an oasis of calm.

> *"The believers, men and women, are protectors one of another: they enjoin what is just, and forbid what is evil: they observe regular prayers, practice regular charity, and obey Allah and His Messenger."* (Surah At-Tawbah 9:71)

### Ways to Support Your Sisters Online

1. **Defend without escalating**: When you see a sister being unfairly targeted or piled upon in comment sections, step in with dignified firmness or report the harassment.
2. **Private encouragement**: Send a short, sincere message of support to sisters doing good work or struggling with public pressure. A kind word (*kalimah tayyibah*) is charity.
3. **Model digital rest**: Do not feel obligated to be perpetually accessible. Disconnecting from screens to reconnect with your Creator is an act of spiritual preservation.', 'Fatima Noor', 'Youth & Culture', array['sisters', 'community', 'support', 'boundaries']::text[], 5, 45, 'approved', '2026-09-03T09:00:00.000Z', '2026-09-03T09:00:00.000Z')
  on conflict (id) do nothing;

