import { readFileSync } from 'fs'
import { resolve } from 'path'
import { renderToStaticMarkup } from 'react-dom/server'
import { SparkleLogo, InfinityLogo } from '../src/components/SparkleLogo'
import { InfinityLogo as ReExportedLogo } from '../src/components/InfinityLogo'

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
}

console.log('--- Testing Red-Black Gradient Infinity Symbol Logo ---')

// 1. Test React component rendering with default props
const defaultHtml = renderToStaticMarkup(<SparkleLogo />)
assert(defaultHtml.includes('svg'), 'Should render an SVG element')
assert(defaultHtml.includes('viewBox="0 0 100 100"'), 'Should have 100x100 viewBox')
assert(defaultHtml.includes('width="32"'), 'Default width should be 32')
assert(defaultHtml.includes('height="32"'), 'Default height should be 32')
assert(defaultHtml.includes('M 50 50 C 35 22 12 22 12 50'), 'Should contain the infinity lemniscate curve')
assert(defaultHtml.includes('stop-color="#ff1a40"') || defaultHtml.includes('stopColor="#ff1a40"'), 'Should contain red gradient stop')
assert(defaultHtml.includes('stop-color="#0d0204"') || defaultHtml.includes('stopColor="#0d0204"'), 'Should contain black/dark gradient stop')
assert(defaultHtml.includes('stop-color="#000000"') || defaultHtml.includes('stopColor="#000000"'), 'Should contain black gradient stop')
console.log('✓ Default SparkleLogo renders correctly with infinity paths & red-black gradients')

// 2. Test re-export alias InfinityLogo
const infinityHtml = renderToStaticMarkup(<InfinityLogo size={48} />)
assert(infinityHtml.includes('width="48"'), 'InfinityLogo should accept size 48')
assert(infinityHtml.includes('M 50 50 C 35 22 12 22 12 50'), 'InfinityLogo should render infinity curve')

const reExportedHtml = renderToStaticMarkup(<ReExportedLogo size={64} />)
assert(reExportedHtml.includes('width="64"'), 'Re-exported InfinityLogo should accept size 64')
assert(reExportedHtml.includes('M 50 50 C 35 22 12 22 12 50'), 'Re-exported InfinityLogo should render infinity curve')
console.log('✓ InfinityLogo aliases render identical markup and handle props')

// 3. Test glow prop
const noGlowHtml = renderToStaticMarkup(<SparkleLogo glow={false} />)
const withGlowHtml = renderToStaticMarkup(<SparkleLogo glow={true} />)
assert(withGlowHtml.length > noGlowHtml.length, 'glow=true should render additional ambient glow circles')
console.log('✓ glow prop toggles ambient glow elements correctly')

// 4. Test animated prop
const animatedHtml = renderToStaticMarkup(<SparkleLogo animated={true} />)
assert(animatedHtml.includes('animate-pulse-subtle'), 'animated=true should apply animate-pulse-subtle class')
const staticHtml = renderToStaticMarkup(<SparkleLogo animated={false} />)
assert(!staticHtml.includes('animate-pulse-subtle'), 'animated=false should not apply pulse class')
console.log('✓ animated prop toggles pulse animation class correctly')

// 5. Test custom size and className
const customHtml = renderToStaticMarkup(<SparkleLogo size={68} className="my-custom-class" />)
assert(customHtml.includes('width="68"'), 'Custom size 68 applied to SVG')
assert(customHtml.includes('height="68"'), 'Custom size 68 applied to SVG')
assert(customHtml.includes('my-custom-class'), 'Custom className applied to container')
console.log('✓ Custom size and className applied correctly')

// 6. Test public/favicon.svg
const faviconPath = resolve(process.cwd(), 'public/favicon.svg')
const faviconSvg = readFileSync(faviconPath, 'utf-8')
assert(faviconSvg.includes('<svg'), 'Favicon should be valid SVG')
assert(faviconSvg.includes('viewBox="0 0 100 100"'), 'Favicon should have 100x100 viewBox')
assert(faviconSvg.includes('M 50 50 C 35 22 12 22 12 50'), 'Favicon should have the infinity lemniscate curve')
assert(faviconSvg.includes('stop-color="#ff1a40"'), 'Favicon should have red gradient stops')
assert(faviconSvg.includes('stop-color="#0d0204"'), 'Favicon should have black gradient stops')
console.log('✓ public/favicon.svg contains matching red-black infinity symbol SVG')

console.log('All 6 verification checks passed successfully!')
