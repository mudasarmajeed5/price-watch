const sharp = require('sharp')
const path = require('path')

const publicDir = path.join(__dirname, 'public')
const svgPath = path.join(publicDir, 'app_logo.svg')

const sizes = [192, 512]

async function generateIcons() {
  try {
    for (const size of sizes) {
      const outputPath = path.join(publicDir, `icon-${size}x${size}.png`)
      await sharp(svgPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath)
      console.log(`✓ Generated ${size}x${size} icon`)
    }
    console.log('✓ All icons generated successfully!')
  } catch (error) {
    console.error('Error generating icons:', error)
    process.exit(1)
  }
}

generateIcons()
