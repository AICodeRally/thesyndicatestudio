import Link from "next/link"

interface AppNavProps {
  currentPath: string
  userEmail: string
}

export function AppNav({ currentPath, userEmail }: AppNavProps) {
  const navItems = [
    { href: "/vault", label: "Vault" },
    { href: "/studio", label: "Studio" },
    { href: "/episodes", label: "Episodes" },
    { href: "/counsel", label: "Counsel" },
    { href: "/models", label: "Models" },
  ]

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-8">
            <Link href="/start" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              The Toddfather
            </Link>
            <nav className="flex gap-6 text-sm">
              {navItems.map((item) => {
                const isActive = currentPath === item.href || currentPath.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      isActive
                        ? "font-medium text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/settings/billing"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Settings
            </Link>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {userEmail}
            </span>
            <Link
              href="/api/auth/signout"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
