'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('ai')

  const tabs = [
    { id: 'ai', label: 'AI-Powered', icon: '🤖' },
    { id: 'strategy', label: 'Strategy', icon: '📊' },
    { id: 'vendor', label: 'Vendor Selection', icon: '✓' },
    { id: 'expert', label: 'Expert Witness', icon: '⚖️' },
  ]

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
                  <li><Link className="color-gray-500 active" href="/services">Services</Link></li>
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

      <main className="main">
        <div className="cover-home1">
          <div className="container">
            <div className="row">
              <div className="col-xl-1"></div>
              <div className="col-xl-10 col-lg-12">
                {/* Hero */}
                <div className="pt-100 pb-50">
                  <span className="text-sm-bold color-gray-600 wow animate__animated animate__fadeInUp">
                    Services
                  </span>
                  <h1 className="color-gray-50 mt-20 mb-20 wow animate__animated animate__fadeInUp">
                    How I <span className="color-linear">Help</span>
                  </h1>
                  <p className="text-lg color-gray-500 wow animate__animated animate__fadeInUp" style={{ maxWidth: '700px' }}>
                    From AI-powered diagnostics to courtroom testimony. I work across the full spectrum of SPM—wherever you need deep expertise and honest answers.
                  </p>
                </div>

                {/* Approach Card */}
                <div className="mb-50">
                  <div className="bg-gray-850 border-gray-800 p-8 rounded-lg wow animate__animated animate__fadeInUp">
                    <h3 className="color-white mb-3">My Approach</h3>
                    <p className="text-lg color-linear font-semibold mb-3">I don't sell hours. I solve problems.</p>
                    <p className="color-gray-500 mb-3">
                      Every engagement is scoped around outcomes, not activities. I'll tell you what I think—even if it's not what you want to hear. And I'll make sure you can actually execute after I leave.
                    </p>
                    <p className="color-gray-500">
                      I'm vendor-neutral, which means I don't get paid to recommend any platform. My only incentive is getting your program right.
                    </p>
                  </div>
                </div>

                {/* Service Tabs */}
                <div className="mb-50">
                  <h2 className="color-linear d-inline-block mb-10 wow animate__animated animate__fadeInUp">
                    What I Offer
                  </h2>
                  <p className="text-lg color-gray-500 mb-30 wow animate__animated animate__fadeInUp">
                    Select a service area to learn more about how I can help your organization.
                  </p>

                  {/* Tab Navigation */}
                  <div className="d-flex flex-wrap gap-3 mb-30">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-750 hover:text-white'
                        }`}
                      >
                        <span className="me-2">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="bg-gray-850 border-gray-800 p-8 rounded-lg">
                    {activeTab === 'ai' && (
                      <div className="row">
                        <div className="col-lg-4 mb-30">
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 d-flex align-items-center justify-content-center text-3xl mb-4">
                            🤖
                          </div>
                          <h3 className="color-white mb-3">AI-Powered SPM</h3>
                          <p className="color-linear font-medium mb-3">AI changes everything. Expertise tells it where to look.</p>
                          <p className="color-gray-500 text-sm">
                            I'm building an AI-powered SPM platform and advising companies on practical AI applications. AI amplifies expertise—it doesn't replace it.
                          </p>
                        </div>
                        <div className="col-lg-8">
                          <ul className="space-y-4">
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">AI Readiness Assessment</span>
                                <span className="color-gray-500"> — Evaluate your SPM maturity and identify the highest-impact AI opportunities.</span>
                              </div>
                            </li>
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">AI Strategy Development</span>
                                <span className="color-gray-500"> — Build a practical roadmap for AI adoption that aligns with your business goals.</span>
                              </div>
                            </li>
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">Plan Intelligence & Diagnostics</span>
                                <span className="color-gray-500"> — AI-powered analysis: loophole detection, complexity scoring, behavior alignment.</span>
                              </div>
                            </li>
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">AI Integration Advisory</span>
                                <span className="color-gray-500"> — How to prepare your SPM program for AI—data, process, vendor evaluation.</span>
                              </div>
                            </li>
                          </ul>
                          <div className="mt-20 p-4 rounded-lg bg-purple-900/20 border border-purple-500/30">
                            <p className="color-linear font-medium d-flex align-items-center gap-2">
                              <span>✨</span>
                              Coming soon: AI-powered SPM tools with plan analysis, diagnostics, and automation.
                            </p>
                          </div>
                          <div className="mt-20">
                            <Link href="/contact?service=ai" className="btn btn-linear hover-up">
                              Discuss AI Services
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'strategy' && (
                      <div className="row">
                        <div className="col-lg-4 mb-30">
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 d-flex align-items-center justify-content-center text-3xl mb-4">
                            📊
                          </div>
                          <h3 className="color-white mb-3">Strategy & Transformation</h3>
                          <p className="color-linear font-medium mb-3">The big-picture work that sets the foundation.</p>
                          <p className="color-gray-500 text-sm">
                            When SPM needs fundamental change—new GTM motion, M&A integration, restructuring—you need someone who sees the whole system.
                          </p>
                        </div>
                        <div className="col-lg-8">
                          <ul className="space-y-4">
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">Sales Transformation Programs</span>
                                <span className="color-gray-500"> — Full-scope SPM redesign as part of broader go-to-market transformation.</span>
                              </div>
                            </li>
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">SPM Strategy & Roadmaps</span>
                                <span className="color-gray-500"> — Multi-year SPM vision and phased execution plan.</span>
                              </div>
                            </li>
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">Current State / Future State Assessments</span>
                                <span className="color-gray-500"> — Diagnostic deep-dive with prioritized action plan.</span>
                              </div>
                            </li>
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">SPM Governance Design</span>
                                <span className="color-gray-500"> — Operating model for how comp gets planned, executed, and governed.</span>
                              </div>
                            </li>
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">Sales Planning & Quota Methodology</span>
                                <span className="color-gray-500"> — Quota-setting frameworks, territory design, capacity planning.</span>
                              </div>
                            </li>
                          </ul>
                          <p className="mt-20 text-sm color-gray-600">
                            Typical engagements: M&A comp integration (60-90 days), GTM realignment (8-12 weeks), PE portfolio assessment (2-4 weeks)
                          </p>
                          <div className="mt-20">
                            <Link href="/contact?service=strategy" className="btn btn-linear hover-up">
                              Discuss Strategy Work
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'vendor' && (
                      <div className="row">
                        <div className="col-lg-4 mb-30">
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 d-flex align-items-center justify-content-center text-3xl mb-4">
                            ✓
                          </div>
                          <h3 className="color-white mb-3">Vendor Selection</h3>
                          <p className="color-linear font-medium mb-3">Pick the right platform. Make sure it works.</p>
                          <p className="color-gray-500 text-sm">
                            Most companies get vendor selection wrong—not because vendors are bad, but because the evaluation process is broken.
                          </p>
                        </div>
                        <div className="col-lg-8">
                          <ul className="space-y-4">
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">SPM Vendor Selection</span>
                                <span className="color-gray-500"> — Structured evaluation framework, RFP development, demo facilitation.</span>
                              </div>
                            </li>
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">RFP Development & Management</span>
                                <span className="color-gray-500"> — Requirements documentation, scoring methodology, vendor communication.</span>
                              </div>
                            </li>
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">Implementation Oversight & QA</span>
                                <span className="color-gray-500"> — Independent review of progress, configuration decisions, and UAT.</span>
                              </div>
                            </li>
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">Platform Optimization</span>
                                <span className="color-gray-500"> — Getting more from your existing ICM investment.</span>
                              </div>
                            </li>
                          </ul>
                          <p className="mt-20 text-sm color-gray-600">
                            Typical engagements: Full vendor selection (6-10 weeks), RFP development (2-4 weeks), Implementation QA (ongoing)
                          </p>
                          <div className="mt-20">
                            <Link href="/contact?service=vendor" className="btn btn-linear hover-up">
                              Talk Vendor Selection
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'expert' && (
                      <div className="row">
                        <div className="col-lg-4 mb-30">
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 d-flex align-items-center justify-content-center text-3xl mb-4">
                            ⚖️
                          </div>
                          <h3 className="color-white mb-3">Expert Witness</h3>
                          <p className="color-linear font-medium mb-3">When comp disputes go to court.</p>
                          <p className="color-gray-500 text-sm">
                            I've testified in wrongful termination cases, commission disputes, and class actions. I make technical concepts clear under cross-examination.
                          </p>
                        </div>
                        <div className="col-lg-8">
                          <ul className="space-y-4">
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">Expert Witness Testimony</span>
                                <span className="color-gray-500"> — Deposition and trial testimony. Clear, credible, and defensible.</span>
                              </div>
                            </li>
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">Expert Reports</span>
                                <span className="color-gray-500"> — Written analysis and opinion on compensation-related matters.</span>
                              </div>
                            </li>
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">Litigation Support</span>
                                <span className="color-gray-500"> — Case analysis, document review, and strategic input.</span>
                              </div>
                            </li>
                            <li className="d-flex gap-3">
                              <span className="text-purple-400 mt-1">✓</span>
                              <div>
                                <span className="font-semibold color-white">Executive Testimony Preparation</span>
                                <span className="color-gray-500"> — Coaching executives who need to testify on compensation matters.</span>
                              </div>
                            </li>
                          </ul>
                          <p className="mt-20 text-sm color-gray-600">
                            Case types: Wrongful termination, commission disputes, class action wage claims, breach of contract
                          </p>
                          <div className="mt-20">
                            <Link href="/contact?service=expert" className="btn btn-linear hover-up">
                              Contact for Legal Matters
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Speaking Section */}
                <div className="mb-50">
                  <div className="row align-items-center">
                    <div className="col-lg-6 mb-30">
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 d-flex align-items-center justify-content-center text-3xl mb-4">
                        🎤
                      </div>
                      <h2 className="color-white mb-3">Speaking & Workshops</h2>
                      <p className="color-linear font-medium mb-3">Keynotes that don't suck.</p>
                      <p className="color-gray-500 mb-20">
                        I speak at conferences, corporate events, and executive offsites. No death by PowerPoint. No inspirational fluff. Just practical frameworks and uncomfortable truths about sales compensation.
                      </p>
                      <Link href="/contact?service=speaking" className="btn btn-linear hover-up">
                        Book a Speaking Engagement
                      </Link>
                    </div>
                    <div className="col-lg-6">
                      <div className="bg-gray-850 border-gray-800 p-6 rounded-lg">
                        <h4 className="color-white mb-4">Formats</h4>
                        <ul className="space-y-3 color-gray-500">
                          <li className="d-flex align-items-center gap-3">
                            <span className="text-yellow-500">✓</span>
                            Conference Keynotes (45-60 min)
                          </li>
                          <li className="d-flex align-items-center gap-3">
                            <span className="text-yellow-500">✓</span>
                            Executive Briefings (60-90 min)
                          </li>
                          <li className="d-flex align-items-center gap-3">
                            <span className="text-yellow-500">✓</span>
                            Corporate Workshops (half or full-day)
                          </li>
                          <li className="d-flex align-items-center gap-3">
                            <span className="text-yellow-500">✓</span>
                            Podcast Appearances
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Working Together */}
                <div className="mb-50">
                  <h2 className="color-linear d-inline-block mb-10 text-center w-100 wow animate__animated animate__fadeInUp">
                    Working Together
                  </h2>
                  <p className="text-lg color-gray-500 text-center mb-30 wow animate__animated animate__fadeInUp">
                    A straightforward process designed to get you results, not pad my hours.
                  </p>
                  <div className="row">
                    {[
                      { step: '1', title: 'Initial Conversation', desc: "Free 30-minute call to discuss your situation. No sales pitch—just honest assessment." },
                      { step: '2', title: 'Scoping', desc: "Proposal with clear scope and approach. Fixed-price for projects, retainer for advisory." },
                      { step: '3', title: 'Engagement', desc: "We work together. I deliver. You execute. I'm available for questions throughout." },
                      { step: '4', title: 'Handoff', desc: "Clear deliverables, documented recommendations, and a path forward." },
                    ].map((item) => (
                      <div key={item.step} className="col-lg-3 col-md-6 mb-20">
                        <div className="bg-gray-850 border-gray-800 p-6 rounded-lg text-center h-100">
                          <div className="w-12 h-12 rounded-full bg-purple-900/50 d-flex align-items-center justify-content-center mx-auto mb-4">
                            <span className="text-xl font-bold color-linear">{item.step}</span>
                          </div>
                          <h4 className="color-white mb-2">{item.title}</h4>
                          <p className="text-sm color-gray-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final CTA */}
                <div className="text-center mb-50 p-10 bg-gray-850 border-gray-800 rounded-lg">
                  <h3 className="color-white mb-4 wow animate__animated animate__fadeInUp">
                    Let's Talk About Your <span className="color-linear">SPM Challenges</span>
                  </h3>
                  <p className="color-gray-500 mb-6 wow animate__animated animate__fadeInUp">
                    Book a call or send a message. I read everything and respond within 24 hours.
                  </p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Link href="/contact" className="btn btn-linear hover-up">
                      Book a Call
                    </Link>
                    <Link href="/contact" className="btn btn-gray-800 hover-up">
                      Send a Message
                    </Link>
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
