import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './global.css'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">

      {/* HERO */}
      <section className="flex flex-col items-center text-center gap-6">

        <div className="relative flex items-center justify-center">
          <img src={heroImg} className="w-40 opacity-80" alt="" />
          <img src={reactLogo} className="w-16 absolute -left-10 animate-spin-slow" alt="React logo" />
          <img src={viteLogo} className="w-16 absolute -right-10" alt="Vite logo" />
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-2">Get started</h1>
          <p className="text-gray-400">
            Edit <code className="bg-gray-800 px-1 rounded">src/App.jsx</code> and save to test{" "}
            <code className="bg-gray-800 px-1 rounded">HMR</code>
          </p>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-600 transition px-6 py-2 rounded-xl font-semibold shadow-lg"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      {/* SEPARADOR */}
      <div className="w-full max-w-4xl h-px bg-gray-700 my-10"></div>

      {/* NEXT STEPS */}
      <section className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">

        {/* DOCS */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
          <h2 className="text-2xl font-bold mb-2">📄 Documentation</h2>
          <p className="text-gray-400 mb-4">Your questions, answered</p>

          <ul className="space-y-3">
            <li>
              <a href="https://vite.dev/" target="_blank" className="flex items-center gap-2 hover:text-blue-400">
                <img className="w-5" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" className="flex items-center gap-2 hover:text-blue-400">
                <img className="w-5" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
          <h2 className="text-2xl font-bold mb-2">🌐 Connect</h2>
          <p className="text-gray-400 mb-4">Join the community</p>

          <ul className="space-y-3">
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank" className="hover:text-blue-400">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank" className="hover:text-blue-400">
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" className="hover:text-blue-400">
                X
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank" className="hover:text-blue-400">
                Bluesky
              </a>
            </li>
          </ul>
        </div>

      </section>

    </div>
  )
}

export default App
