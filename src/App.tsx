import { Nav } from './components/Nav'
import { HeroBento } from './components/HeroBento'
import { Projects } from './components/Projects'
import { Experience } from './components/Experience'
import { Contact } from './components/Contact'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <HeroBento />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
