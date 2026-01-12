import { prisma } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Episodes | IntelligentSPM',
  description: 'Intelligent SPM video episodes from The Toddfather. Watch and learn.',
}

export default async function EpisodesPage() {
  const episodes = await prisma.episode.findMany({
    where: {
      status: 'PUBLISHED',
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      series: true,
      title: true,
      premise: true,
      youtubeVideoId: true,
      publishDateTarget: true,
      createdAt: true,
      counselRefs: true,
    },
  })

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
                  <li><Link className="color-gray-500 active" href="/episodes">Episodes</Link></li>
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
                    Episodes
                  </span>
                  <h1 className="color-gray-50 mt-20 mb-20 wow animate__animated animate__fadeInUp">
                    Video <span className="color-linear">Library</span>
                  </h1>
                  <p className="text-lg color-gray-500 wow animate__animated animate__fadeInUp" style={{ maxWidth: '600px' }}>
                    Intelligent SPM videos from The Toddfather. Watch, learn, and level up your comp knowledge.
                  </p>
                </div>

                {/* Episodes Grid */}
                {episodes.length === 0 ? (
                  <div className="text-center py-12 mb-50">
                    <div className="bg-gray-850 border-gray-800 p-8 rounded-lg">
                      <p className="color-gray-500">
                        No published episodes yet. Check back soon for new content from The Toddfather.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="row mb-50">
                    {episodes.map((episode) => (
                      <div key={episode.id} className="col-lg-4 col-md-6 mb-30">
                        <Link href={`/episodes/${episode.id}`} className="d-block h-100">
                          <div className="bg-gray-850 border-gray-800 rounded-lg overflow-hidden h-100 hover-up">
                            {/* Thumbnail */}
                            <div className="position-relative" style={{ aspectRatio: '16/9' }}>
                              {episode.youtubeVideoId ? (
                                <Image
                                  src={`https://img.youtube.com/vi/${episode.youtubeVideoId}/maxresdefault.jpg`}
                                  alt={episode.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-100 h-100 bg-gradient-to-br from-purple-600 to-gray-900 d-flex align-items-center justify-content-center">
                                  <span className="color-gray-500 text-sm">Video coming soon</span>
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              <div className="text-xs text-uppercase color-gray-600 mb-2" style={{ letterSpacing: '0.1em' }}>
                                {episode.series}
                              </div>
                              <h3 className="font-semibold color-white mb-2">
                                {episode.title}
                              </h3>
                              <p className="text-sm color-gray-500 mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {episode.premise}
                              </p>

                              {episode.counselRefs && episode.counselRefs.length > 0 && (
                                <div className="d-flex align-items-center gap-2 text-xs color-linear">
                                  <span>📄</span>
                                  <span>{episode.counselRefs.length} Counsel items</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <div className="text-center mb-50 p-10 bg-gray-850 border-gray-800 rounded-lg">
                  <h3 className="color-white mb-4">
                    Want to create your own <span className="color-linear">SPM episodes</span>?
                  </h3>
                  <p className="color-gray-500 mb-6">
                    Access the studio to create videos with AI-powered script generation and production tools.
                  </p>
                  <Link href="/studio" className="btn btn-linear hover-up">
                    Enter The Studio
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
