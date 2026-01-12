import Link from 'next/link'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata = {
  title: 'Contact | IntelligentSPM',
  description: 'Get in touch for SPM consulting, expert witness, speaking, or AI advisory. Todd responds within 24 hours.',
}

export default function ContactPage() {
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
                  <li><Link className="color-gray-500" href="/toddfather">The Toddfather</Link></li>
                  <li><Link className="color-gray-500" href="/counsel">Counsel</Link></li>
                  <li><Link className="color-gray-500" href="/episodes">Episodes</Link></li>
                  <li><Link className="color-gray-500 active" href="/contact">Contact</Link></li>
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
        <div className="cover-home1">
          <div className="container">
            <div className="row">
              <div className="col-xl-1"></div>
              <div className="col-xl-10 col-lg-12">
                {/* Hero */}
                <div className="pt-100 pb-50">
                  <span className="text-sm-bold color-gray-600 wow animate__animated animate__fadeInUp">
                    Contact
                  </span>
                  <h1 className="color-gray-50 mt-20 mb-20 wow animate__animated animate__fadeInUp">
                    Let's <span className="color-linear">Talk</span>
                  </h1>
                  <p className="text-lg color-gray-500 wow animate__animated animate__fadeInUp" style={{ maxWidth: '600px' }}>
                    SPM strategy. Expert witness. AI advisory. Speaking. Whatever's on your mind—I respond within 24 hours.
                  </p>
                </div>

                {/* Form & Sidebar */}
                <div className="row mb-50">
                  {/* Form */}
                  <div className="col-lg-8 mb-30">
                    <div className="bg-gray-850 border-gray-800 p-8 rounded-lg">
                      <h2 className="color-white mb-6">How can I help?</h2>
                      <ContactForm />
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="col-lg-4">
                    {/* Direct Contact */}
                    <div className="bg-gray-850 border-gray-800 p-6 rounded-lg mb-20">
                      <h3 className="color-white mb-4">Or reach out directly</h3>
                      <a
                        href="mailto:todd@intelligentspm.com"
                        className="d-flex align-items-center gap-3 color-linear hover:underline"
                      >
                        <span className="text-2xl">✉️</span>
                        todd@intelligentspm.com
                      </a>
                      <p className="mt-3 text-sm color-gray-600">
                        I read everything personally. Expect a response within 24 hours.
                      </p>
                    </div>

                    {/* What to Expect */}
                    <div className="bg-gray-850 border-gray-800 p-6 rounded-lg mb-20">
                      <h3 className="color-white mb-4">What to expect</h3>
                      <ol className="space-y-4 text-sm color-gray-500">
                        <li className="d-flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 color-linear d-flex align-items-center justify-content-center text-xs font-bold">
                            1
                          </span>
                          <span>I read your message within 24 hours.</span>
                        </li>
                        <li className="d-flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 color-linear d-flex align-items-center justify-content-center text-xs font-bold">
                            2
                          </span>
                          <span>If it sounds like a fit, I'll reply with questions or suggest a call.</span>
                        </li>
                        <li className="d-flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-900/50 color-linear d-flex align-items-center justify-content-center text-xs font-bold">
                            3
                          </span>
                          <span>We'll have an initial conversation (free, 30 minutes) to explore if and how I can help.</span>
                        </li>
                      </ol>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-gray-850 border-gray-800 p-6 rounded-lg">
                      <h3 className="color-white mb-4">Looking for something specific?</h3>
                      <ul className="space-y-3">
                        <li>
                          <Link
                            href="/services#expert"
                            className="d-flex align-items-center gap-2 color-gray-500 hover:color-linear transition-colors"
                          >
                            <span>→</span>
                            <span>Expert witness inquiries</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/services#ai"
                            className="d-flex align-items-center gap-2 color-gray-500 hover:color-linear transition-colors"
                          >
                            <span>→</span>
                            <span>AI advisory services</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/services"
                            className="d-flex align-items-center gap-2 color-gray-500 hover:color-linear transition-colors"
                          >
                            <span>→</span>
                            <span>View all services</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div className="mb-50">
                  <h2 className="color-linear d-inline-block mb-10 text-center w-100 wow animate__animated animate__fadeInUp">
                    Common Questions
                  </h2>
                  <div className="row mt-30">
                    <div className="col-lg-4 mb-20">
                      <div className="bg-gray-850 border-gray-800 p-6 rounded-lg h-100">
                        <h3 className="color-linear mb-3">Do you do free consultations?</h3>
                        <p className="color-gray-500 text-sm">
                          I don't do "discovery calls" where we dance around pricing. Tell me what you need, I'll tell you if I can help and what it costs. Simple.
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-4 mb-20">
                      <div className="bg-gray-850 border-gray-800 p-6 rounded-lg h-100">
                        <h3 className="color-linear mb-3">Can you recommend a vendor?</h3>
                        <p className="color-gray-500 text-sm">
                          Yes, but I'll also tell you what that vendor is bad at. I'm vendor-neutral—no kickbacks, no preferred partners. Just honest assessments.
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-4 mb-20">
                      <div className="bg-gray-850 border-gray-800 p-6 rounded-lg h-100">
                        <h3 className="color-linear mb-3">What's your availability?</h3>
                        <p className="color-gray-500 text-sm">
                          It varies. Big projects need advance booking. Quick reviews and assessments can usually happen within a week. Just reach out and we'll figure it out.
                        </p>
                      </div>
                    </div>
                  </div>
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
