import Link from 'next/link'
import Image from 'next/image'

// Services data from intelligentspm
const services = [
  {
    icon: '🤖',
    title: 'AI-Powered SPM',
    tagline: 'The future is here',
    description: 'AI is changing how companies run comp. I help you identify high-impact use cases, avoid the hype, and actually implement.',
    contexts: 'Plan diagnostics, forecasting, document analysis',
    href: '/services#ai',
    featured: true,
  },
  {
    icon: '📊',
    title: 'Strategy & Transformation',
    tagline: 'Big-picture work',
    description: 'Sales transformation programs, SPM roadmaps, governance design, and sales planning methodology.',
    contexts: 'M&A integration, GTM realignment, PE portfolio',
    href: '/services#strategy',
  },
  {
    icon: '✓',
    title: 'Vendor Selection',
    tagline: 'Pick the right platform',
    description: 'SPM vendor evaluation, RFP development, implementation oversight, and AI integration.',
    contexts: 'ICM selection, implementation QA',
    href: '/services#vendor',
  },
  {
    icon: '⚖️',
    title: 'Expert Witness',
    tagline: 'Courtroom-ready',
    description: 'When comp disputes go to court, lawyers call me. Expert testimony that holds up under cross-examination.',
    contexts: 'Wrongful termination, commission disputes',
    href: '/services#expert',
  },
]

const testimonials = [
  {
    quote: "Todd doesn't just understand comp—he understands the business. He helped us redesign our entire SPM program during a major acquisition.",
    role: 'Chief Revenue Officer',
    company: 'Enterprise SaaS',
  },
  {
    quote: "We hired Todd as an expert witness. He explained complex commission structures to a jury in a way that made sense. We won.",
    role: 'Partner',
    company: 'Employment Litigation Firm',
  },
  {
    quote: "Most consultants give you a deck. Todd gave us a working comp plan and governance model. Three years later, it's still working.",
    role: 'VP Sales Operations',
    company: 'Global MedTech',
  },
]

const aiFeatures = [
  {
    icon: '🧠',
    title: 'Plan Intelligence',
    description: 'AI-powered analysis finds loopholes, complexity bombs, and behavior misalignments in minutes—not weeks.',
  },
  {
    icon: '📄',
    title: 'Document Processing',
    description: 'Extract structure from comp plans, policies, and contracts. Turn PDFs into actionable data.',
  },
  {
    icon: '📈',
    title: 'Predictive Analytics',
    description: 'Model payout scenarios, forecast attainment, and identify risks before they become disputes.',
  },
  {
    icon: '⚡',
    title: 'Workflow Automation',
    description: 'Automate exception handling, approval routing, and dispute resolution with AI-assisted workflows.',
  },
]

export default function HomePage() {
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

      {/* Mobile Header */}
      <div className="mobile-header-active mobile-header-wrapper-style perfect-scrollbar bg-gray-900">
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-content-area">
            <div className="mobile-logo border-gray-800">
              <Link className="d-flex" href="/">
                <span className="text-xl font-bold text-white">IntelligentSPM</span>
              </Link>
            </div>
            <div className="perfect-scroll">
              <div className="mobile-menu-wrap mobile-header-border">
                <nav className="mt-15">
                  <ul className="mobile-menu font-heading">
                    <li><Link href="/services">Services</Link></li>
                    <li><Link href="/toddfather">The Toddfather</Link></li>
                    <li><Link href="/counsel">Counsel</Link></li>
                    <li><Link href="/episodes">Episodes</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                    <li><Link href="/sign-in">Sign In</Link></li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="main">
        <div className="cover-home1">
          <div className="container">
            <div className="row">
              <div className="col-xl-1"></div>
              <div className="col-xl-10 col-lg-12">
                {/* Hero Banner */}
                <div className="banner">
                  <div className="row align-items-end">
                    <div className="col-lg-7 pt-100">
                      <span className="text-sm-bold color-gray-600 wow animate__animated animate__fadeInUp">
                        30 Years of Sales Compensation Expertise
                      </span>
                      <h1 className="color-gray-50 mt-20 mb-20 wow animate__animated animate__fadeInUp">
                        <span className="color-linear">AI transforms SPM.</span>
                        <br />Finally, someone knows where to point it.
                      </h1>
                      <div className="row">
                        <div className="col-lg-10">
                          <p className="text-base color-gray-600 wow animate__animated animate__fadeInUp">
                            Whether you're selecting a vendor, fixing a broken plan, or figuring out how AI fits in, I've probably solved it before.
                          </p>
                        </div>
                      </div>
                      <div className="box-subscriber mt-40 mb-50 wow animate__animated animate__fadeInUp">
                        <div className="d-flex gap-3">
                          <Link href="/contact" className="btn btn-linear btn-arrow-right hover-up">
                            Let's Chat <i className="fi-rr-arrow-small-right"></i>
                          </Link>
                          <Link href="/services" className="btn btn-gray-800 hover-up">
                            Explore Services
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5 text-center">
                      <div className="banner-img position-relative wow animate__animated animate__fadeIn">
                        <Image
                          src="/images/noir/toddfather_noir_panel_2_middle.png"
                          alt="The Toddfather"
                          width={400}
                          height={500}
                          className="rounded-lg"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Topics */}
                <div className="mb-70">
                  <div className="box-topics border-gray-800 bg-gray-850">
                    <div className="row">
                      <div className="col-lg-3">
                        <h5 className="mb-15 color-white wow animate__animated animate__fadeInUp">What I Do</h5>
                        <p className="color-gray-500 mb-20 wow animate__animated animate__fadeInUp">
                          Sales compensation consulting, AI integration, and expert witness services.
                        </p>
                      </div>
                      <div className="col-lg-9">
                        <div className="row">
                          {services.map((service, index) => (
                            <div key={index} className="col-lg-3 col-md-6 mb-20">
                              <div className="card-style-1 hover-up">
                                <Link href={service.href}>
                                  <div className="card-image bg-gray-800 p-4 rounded-lg text-center">
                                    <span className="text-4xl">{service.icon}</span>
                                    <div className="mt-3">
                                      <h6 className="color-white mb-2">{service.title}</h6>
                                      <p className="text-xs color-gray-500">{service.tagline}</p>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Features Section */}
                <h2 className="color-linear d-inline-block mb-10 wow animate__animated animate__fadeInUp">
                  AI + SPM
                </h2>
                <p className="text-lg color-gray-500 wow animate__animated animate__fadeInUp">
                  AI changes everything. Here's where it actually matters.
                </p>
                <div className="row mt-50">
                  {aiFeatures.map((feature, index) => (
                    <div key={index} className="col-lg-3 col-md-6 mb-30 wow animate__animated animate__fadeIn">
                      <div className="card-blog-1 hover-up bg-gray-850 border-gray-800 p-4 rounded-lg h-100">
                        <div className="text-4xl mb-3">{feature.icon}</div>
                        <h5 className="color-white mb-3">{feature.title}</h5>
                        <p className="color-gray-500 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Testimonials */}
                <div className="mt-70 mb-50">
                  <h2 className="color-linear d-inline-block mb-10 wow animate__animated animate__fadeInUp">
                    What They Say
                  </h2>
                  <p className="text-lg color-gray-500 wow animate__animated animate__fadeInUp">
                    From CROs to courtrooms
                  </p>
                  <div className="row mt-50">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="col-lg-4 mb-30 wow animate__animated animate__fadeIn">
                        <div className="bg-gray-850 border-gray-800 p-5 rounded-lg h-100">
                          <p className="color-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                          <div className="border-t border-gray-700 pt-4">
                            <p className="color-white font-semibold">{testimonial.role}</p>
                            <p className="color-gray-500 text-sm">{testimonial.company}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mb-50 p-10 bg-gray-850 border-gray-800 rounded-lg">
                  <h3 className="color-white mb-4 wow animate__animated animate__fadeInUp">
                    Ready to talk comp?
                  </h3>
                  <p className="color-gray-500 mb-6 wow animate__animated animate__fadeInUp">
                    Let's figure out what you need.
                  </p>
                  <Link href="/contact" className="btn btn-linear btn-arrow-right hover-up wow animate__animated animate__zoomIn">
                    Get in Touch <i className="fi-rr-arrow-small-right"></i>
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

      {/* Progress Scroll */}
      <div className="progressCounter progressScroll hover-up hover-neon-2">
        <div className="progressScroll-border">
          <div className="progressScroll-circle">
            <span className="progressScroll-text"><i className="fi-rr-arrow-small-up"></i></span>
          </div>
        </div>
      </div>
    </>
  )
}
