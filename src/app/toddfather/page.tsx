import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'The Toddfather | IntelligentSPM',
  description: 'Meet The Toddfather - the voice behind Intelligent SPM. Podcast, speaking, and the reality of sales compensation.',
}

const contentTypes = [
  {
    icon: '📹',
    title: 'Todd Takes',
    description: 'Weekly short-form video insights. Avatar + your voice. Surgical SPM takes: why accelerators break forecasting, what governance actually prevents, how AI exposes bad comp design.',
    href: '/toddfather/todd-takes',
    cta: 'Watch Todd Takes',
  },
  {
    icon: '🎙️',
    title: 'Ask Todd Live',
    description: 'Monthly live Q&A with The Toddfather. Ask about comp design, governance, AI applications, or how to fix a broken plan. Unfiltered. Real answers. 45–60 minutes.',
    href: '/toddfather/ask-todd-live',
    cta: 'Register for Ask Todd',
  },
  {
    icon: '⚡',
    title: 'Shorts',
    description: '30–45 second clips from Todd Takes and Ask Todd Live. Punchline first. One sharp idea. Built for social, built for learning.',
    href: '/toddfather/shorts',
    cta: 'Browse Shorts',
  },
  {
    icon: '🎧',
    title: 'The Podcast',
    description: 'Weekly episodes breaking down SPM reality: vendor scorecards, implementation gotchas, comp design patterns that work (and the ones that fail).',
    href: '/toddfather/podcast',
    cta: 'Listen Now',
  },
  {
    icon: '🎤',
    title: 'Speaking',
    description: 'Keynotes, workshops, and executive sessions on SPM governance, comp strategy, and implementation reality. No slides. No buzzwords. Just truth.',
    href: '/toddfather/speaking',
    cta: 'Book Speaking',
  },
  {
    icon: '🎬',
    title: 'The Studio',
    description: 'Where The Toddfather creates: video production, script generation, and the SPM content engine powered by AI + two decades of domain expertise.',
    href: '/studio',
    cta: 'Enter Studio',
  },
]

export default function ToddFatherPage() {
  return (
    <>
      {/* Header */}
      <header className="header sticky-bar bg-gray-900">
        <div className="container">
          <div className="main-header">
            <div className="header-logo">
              <Link className="d-flex" href="/">
                <span className="text-2xl font-bold text-white">Intelligent<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">SPM</span></span>
              </Link>
            </div>
            <div className="header-nav">
              <nav className="nav-main-menu d-none d-xl-block">
                <ul className="main-menu">
                  <li><Link className="color-gray-500" href="/services">Services</Link></li>
                  <li><Link className="color-gray-500 active" href="/toddfather">The Toddfather</Link></li>
                  <li><Link className="color-gray-500" href="/counsel">Counsel</Link></li>
                  <li><Link className="color-gray-500" href="/episodes">Episodes</Link></li>
                  <li><Link className="color-gray-500" href="/contact">Contact</Link></li>
                </ul>
              </nav>
              <div className="burger-icon burger-icon-white">
                <span className="burger-icon-top"></span>
                <span className="burger-icon-mid"></span>
                <span className="burger-icon-bottom"></span>
              </div>
            </div>
            <div className="header-right text-end">
              <Link className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="/sign-in">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/noir/toddfather_noir_panel_3_right.png"
              alt="The Toddfather"
              fill
              className="object-cover opacity-20"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-purple-900/30 to-gray-900/90" />
          </div>

          <div className="relative z-10 container">
            <div className="row">
              <div className="col-xl-1"></div>
              <div className="col-xl-10 col-lg-12">
                <div className="text-center">
                  <span className="text-sm-bold color-gray-600 wow animate__animated animate__fadeInUp">
                    The Voice Behind Intelligent SPM
                  </span>
                  <h1 className="color-gray-50 mt-20 mb-20 wow animate__animated animate__fadeInUp">
                    THE <span className="color-linear">TODDFATHER</span>
                  </h1>
                  <p className="text-xl color-gray-500 max-w-3xl mx-auto wow animate__animated animate__fadeInUp">
                    Twenty years of SPM reality. No fluff, no vendor spin, no consultant theater.
                    Just the truth about comp design, governance, and what actually works.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="cover-home1">
          <div className="container">
            <div className="row">
              <div className="col-xl-1"></div>
              <div className="col-xl-10 col-lg-12">

                {/* About Section */}
                <div className="mb-50">
                  <div className="bg-gray-850 border-gray-800 p-8 md:p-12 rounded-lg">
                    <h2 className="color-linear mb-6">Who Is The Toddfather?</h2>
                    <div className="space-y-4 text-lg color-gray-500">
                      <p>
                        The Toddfather is the authoritative voice on Sales Performance Management (SPM) -
                        cutting through vendor marketing, consultant frameworks, and implementation theater
                        to deliver the reality of what works and what breaks.
                      </p>
                      <p>
                        With two decades of experience across every SPM platform, comp structure, and
                        governance model, The Toddfather has seen it all: the rollout disasters, the
                        "best practice" failures, the vendor promises that vaporize post-contract.
                      </p>
                      <p>
                        This isn't another thought leadership brand. It's a clearing house for SPM truth -
                        where comp professionals, revenue leaders, and governance teams get the real story
                        before they make million-dollar mistakes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Types Grid */}
                <div className="mb-50">
                  <h2 className="color-linear d-inline-block mb-10 text-center w-100 wow animate__animated animate__fadeInUp">
                    What The Toddfather Delivers
                  </h2>

                  <div className="row mt-30">
                    {contentTypes.map((item) => (
                      <div key={item.title} className="col-lg-4 col-md-6 mb-30">
                        <div className="bg-gray-850 border-gray-800 p-6 rounded-lg h-100 hover-up">
                          <div className="text-4xl mb-4">{item.icon}</div>
                          <h3 className="color-white mb-3">{item.title}</h3>
                          <p className="color-gray-500 text-sm mb-4">{item.description}</p>
                          <Link href={item.href} className="color-linear hover:underline font-semibold">
                            {item.cta} →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* The Toddfather Promise */}
                <div className="mb-50">
                  <div className="bg-gray-850 border-gray-800 p-8 md:p-12 rounded-lg text-center">
                    <h2 className="color-linear mb-6">The Toddfather Promise</h2>
                    <div className="space-y-4 text-lg color-gray-500">
                      <p className="font-semibold color-white">No vendor spin.</p>
                      <p className="font-semibold color-white">No consultant theater.</p>
                      <p className="font-semibold color-white">No "best practice" bullshit.</p>
                      <p className="mt-8 text-xl color-linear">
                        Just the truth about what works, what breaks, and why.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center mb-50 p-10 bg-gray-850 border-gray-800 rounded-lg">
                  <h3 className="color-white mb-4 wow animate__animated animate__fadeInUp">
                    Join <span className="color-linear">The Syndicate</span>
                  </h3>
                  <p className="color-gray-500 mb-6 wow animate__animated animate__fadeInUp">
                    Get weekly SPM reality delivered: vendor scorecards, implementation gotchas,
                    and the comp patterns that actually work.
                  </p>
                  <Link href="/contact" className="btn btn-linear hover-up">
                    Subscribe to The Syndicate
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-1 bg-gray-850 border-gray-800">
            <div className="row">
              <div className="col-lg-4 mb-30">
                <Link className="wow animate__animated animate__fadeInUp" href="/">
                  <span className="text-2xl font-bold text-white">Intelligent<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">SPM</span></span>
                </Link>
                <p className="mb-20 mt-20 text-sm color-gray-500 wow animate__animated animate__fadeInUp">
                  30 years of sales compensation expertise. AI-powered insights. Real-world results.
                </p>
              </div>
              <div className="col-lg-4 mb-30">
                <h6 className="text-lg mb-30 color-white wow animate__animated animate__fadeInUp">Quick Links</h6>
                <div className="row">
                  <div className="col-6">
                    <ul className="menu-footer">
                      <li className="wow animate__animated animate__fadeInUp"><Link className="color-gray-500" href="/services">Services</Link></li>
                      <li className="wow animate__animated animate__fadeInUp"><Link className="color-gray-500" href="/toddfather">The Toddfather</Link></li>
                      <li className="wow animate__animated animate__fadeInUp"><Link className="color-gray-500" href="/counsel">Counsel</Link></li>
                    </ul>
                  </div>
                  <div className="col-6">
                    <ul className="menu-footer">
                      <li className="wow animate__animated animate__fadeInUp"><Link className="color-gray-500" href="/episodes">Episodes</Link></li>
                      <li className="wow animate__animated animate__fadeInUp"><Link className="color-gray-500" href="/contact">Contact</Link></li>
                      <li className="wow animate__animated animate__fadeInUp"><Link className="color-gray-500" href="/studio">Studio</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mb-30">
                <h4 className="text-lg mb-30 color-white wow animate__animated animate__fadeInUp">Get Started</h4>
                <p className="text-base color-gray-500 wow animate__animated animate__fadeInUp">
                  Sign in to access the studio, episodes, and exclusive content.
                </p>
                <div className="mt-20 wow animate__animated animate__fadeInUp">
                  <Link href="/sign-in" className="btn btn-linear hover-up">
                    Sign In <i className="fi-rr-arrow-small-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="footer-bottom border-gray-800">
              <div className="row">
                <div className="col-lg-6 text-center text-lg-start">
                  <p className="text-base color-white wow animate__animated animate__fadeIn">
                    © {new Date().getFullYear()} IntelligentSPM. All rights reserved.
                  </p>
                </div>
                <div className="col-lg-6 text-center text-lg-end">
                  <div className="d-flex justify-content-center justify-content-lg-end gap-4">
                    <Link className="color-gray-500 hover:color-white" href="/legal/privacy">Privacy</Link>
                    <Link className="color-gray-500 hover:color-white" href="/legal/terms">Terms</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
