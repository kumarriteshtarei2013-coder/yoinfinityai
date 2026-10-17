import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import { WelcomeScreen } from '../src/components/WelcomeScreen'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
}

console.log('--- Testing WelcomeScreen & Greeting Formatting ---')

const html = renderToStaticMarkup(React.createElement(WelcomeScreen, { onSelectIdea: () => {} }))

// 1. Verify all greeting text elements are present
assert(html.includes('Sup!'), 'Greeting must contain "Sup!"')
assert(html.includes('YoInfinity AI here!'), 'Greeting must contain "YoInfinity AI here!"')
assert(html.includes('How can I help you today?'), 'Greeting must contain "How can I help you today?"')
console.log('✓ Greeting text components all present')

// 2. Verify "Sup!" is not cut off onto its own block line
assert(!html.includes('class="block mb-1">Sup!</span>'), '"Sup!" must not be an isolated block element cutting it off')
assert(html.includes('inline-block py-0.5">Sup!</span>') || html.includes('inline-block') && html.includes('Sup!</span>'), '"Sup!" should be inline-block with adequate padding to avoid clipping')
console.log('✓ "Sup!" is rendered inline with "YoInfinity AI here!" without line-breaking block cuts')

// 3. Verify safe layout container prevents top-clipping bug
assert(!html.includes('justify-center px-4 py-8 max-w-4xl mx-auto w-full min-h-[70vh]'), 'Must not have unsafe justify-center with min-h-[70vh] that pushes top content into negative scroll coordinates')
assert(html.includes('my-auto'), 'Should use safe my-auto for responsive flex centering')
console.log('✓ WelcomeScreen uses safe vertical centering without scroll container top clipping')

// 4. Verify line-height and typography prevents ascender/descender font clipping
assert(!html.includes('leading-tight'), 'Must not use leading-tight on the main greeting to avoid clipping font ascenders/descenders')
console.log('✓ Heading uses non-clipping line height')

console.log('All WelcomeScreen tests passed successfully!')
