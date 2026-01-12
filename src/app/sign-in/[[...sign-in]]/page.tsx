import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-400">
            Sign in to The Syndicate Studio
          </p>
        </div>
        <SignIn
          fallbackRedirectUrl="/studio"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-[#1A1A2F] border border-[#2A2A3A]',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton: 'bg-[#2A2A3A] border-[#3A3A4A] text-white hover:bg-[#3A3A4A]',
              formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500',
              footerActionLink: 'text-purple-400 hover:text-purple-300',
              formFieldInput: 'bg-[#2A2A3A] border-[#3A3A4A] text-white',
              formFieldLabel: 'text-gray-300',
              identityPreviewText: 'text-white',
              identityPreviewEditButton: 'text-purple-400',
            },
          }}
        />
      </div>
    </div>
  )
}
