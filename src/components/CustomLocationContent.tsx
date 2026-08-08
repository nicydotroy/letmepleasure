import type { ResolvedLocationContent } from '@/lib/location-content'
import { generateFAQPageSchema } from '@/lib/schema-markup'

interface Props {
  content: ResolvedLocationContent
}

// Renders admin-edited content + FAQs (with FAQPage JSON-LD) for a city/area
// page. Caller should only render this when content.hasAny is true.
export default function CustomLocationContent({ content }: Props) {
  const paragraphs = content.body ? content.body.split(/\n\s*\n/).filter((p) => p.trim()) : []

  return (
    <section className="bg-white rounded-3xl p-8 sm:p-10 border border-pink-50 shadow-sm">
      {content.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateFAQPageSchema(content.faqs.map((f) => ({ question: f.q, answer: f.a }))),
          }}
        />
      )}

      <div className="max-w-4xl mx-auto">
        {content.heading && (
          <h2 className="text-2xl sm:text-3xl font-black text-[#2A0618] mb-4">{content.heading}</h2>
        )}
        {content.intro && (
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">{content.intro}</p>
        )}
        {paragraphs.length > 0 && (
          <div className="text-slate-600 leading-relaxed space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        {content.faqs.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-black text-[#2A0618] mb-5">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {content.faqs.map((f, i) => (
                <details
                  key={i}
                  className="group bg-[#FFF1F7] rounded-xl border border-pink-100 p-4 open:shadow-sm transition-shadow"
                >
                  <summary className="flex items-center justify-between gap-3 cursor-pointer list-none font-bold text-[#2A0618] text-sm sm:text-base">
                    {f.q}
                    <span className="shrink-0 w-6 h-6 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-lg leading-none transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="text-slate-600 text-sm leading-relaxed mt-3">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
