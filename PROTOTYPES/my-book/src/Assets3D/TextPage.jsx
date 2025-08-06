import React from 'react'
import { 
    Float32BufferAttribute,
    Uint16BufferAttribute,
    MeshStandardMaterial,
    CanvasTexture,
    BoxGeometry,
    SkinnedMesh,
    Skeleton,
    Vector3,
    Color,
    Bone
} from 'three'

// ==================== Pages Configuration ==================== //
const PAGE_WIDTH     = 0.853
const PAGE_HEIGHT    = 1.14
const PAGE_THICKNESS = 0.003
const PAGE_SEGMENTS  = 50
const SEGMENT_WIDTH  = PAGE_WIDTH / PAGE_SEGMENTS

// Create geometry for the text page
const createTextPageGeometry = () => {
    const geometry = new BoxGeometry(
        PAGE_WIDTH,
        PAGE_HEIGHT,
        PAGE_THICKNESS,
        PAGE_SEGMENTS,
        2
    )
    
    geometry.translate(PAGE_WIDTH / 2, 0, 0)
    
    const position    = geometry.attributes.position
    const vertex      = new Vector3()
    const skinIndexes = []
    const skinWeights = []
    
    // Calculate skinIndex and skinWeight for each vertex
    for (let i = 0; i < position.count; i++) {
        // ALL VERTICES
        vertex.fromBufferAttribute(position, i) // Get the vertex position
        const x = vertex.x // Get the x position of the vertex
        
        // Calculate the skin index based on the x position
        const skinIndex  = Math.max(0, Math.floor(x / SEGMENT_WIDTH))
        // Calculate the skin weight based on the x position
        let   skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH
        
        skinIndexes.push(skinIndex, skinIndex + 1, 0, 0)
        skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
    }
    
    // Set the skinIndex and skinWeight attributes for the geometry.
    // This is used for skeletal animation...
    geometry.setAttribute(
        'skinIndex',
        new Uint16BufferAttribute(skinIndexes, 4)
    )
    geometry.setAttribute(
        'skinWeight',
        new Float32BufferAttribute(skinWeights, 4)
    )
    
    return geometry;
}

// Function to extract text content from React elements
const extractTextFromReactElement = (element) => {
    if (typeof element === 'string') return element;
    if (typeof element === 'number') return element.toString();
    if (!element || !element.props)  return '';
    
    let text = ''
    
    // Handle different element types
    if (element.type === 'h1' || element.type === 'h2' || element.type === 'h3' || element.type === 'h4')
        text += '\n' + extractTextFromChildren(element.props.children).toUpperCase() + '\n'
    else if (element.type === 'p')
        text += '\n' + extractTextFromChildren(element.props.children) + '\n'
    else if (element.type === 'ul' || element.type === 'ol') {
        text += '\n'
        if (element.props.children) {
            const items = Array.isArray(element.props.children) ? element.props.children : [element.props.children]
            items.forEach((item, index) => {
                if (item && item.type === 'li')
                    text += `• ${extractTextFromChildren(item.props.children)}\n`
            })
        }
        text += '\n'
    }
    else if (element.type === 'blockquote')
        text += '\n"' + extractTextFromChildren(element.props.children) + '"\n'
    else if (element.type === 'code')
        text += '\nCODE: ' + extractTextFromChildren(element.props.children) + '\n'
    else if (element.type === 'pre')
        text += '\nCODE BLOCK:\n' + extractTextFromChildren(element.props.children) + '\n'
    else if (element.type === 'strong')
        text += extractTextFromChildren(element.props.children).toUpperCase()
    else if (element.type === 'a')
        text += extractTextFromChildren(element.props.children) + ` (${element.props.href || 'link'})`
    else if (element.type === 'table')
        text += '\nTABLE:\n' + extractTableText(element) + '\n'
    else
        text += extractTextFromChildren(element.props.children)
    
    return text;
}

// Helper function to extract text from children
const extractTextFromChildren = (children) => {
    if (!children) return '';
    
    if (typeof children === 'string') return children;
    
    if (typeof children === 'number') return children.toString();
    
    if (Array.isArray(children))
        return children.map(child => extractTextFromReactElement(child)).join('');
    
    return extractTextFromReactElement(children);
}

// Helper function to extract table text
const extractTableText = (tableElement) => {
    let tableText = ''
    
    if (tableElement.props.children) {
        const rows = Array.isArray(tableElement.props.children) ? tableElement.props.children : [tableElement.props.children]
        rows.forEach(row => {
            if (row && row.type === 'tr' && row.props.children) {
                const cells     = Array.isArray(row.props.children) ? row.props.children : [row.props.children]
                const cellTexts = cells.map(cell => extractTextFromChildren(cell.props.children))
                tableText      += cellTexts.join(' | ') + '\n'
            }
        })
    }
    
    return tableText;
}

// Function to render text content to canvas texture with image support
const createTextureFromContent = async (content, width = 1200, height = 1500) => {
    const canvas  = document.createElement('canvas')
    canvas.width  = width
    canvas.height = height
    const ctx     = canvas.getContext('2d')
    
    // Enable better text rendering
    ctx.textAlign             = 'left'
    ctx.textBaseline          = 'top'
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    // Create bright white background for maximum contrast!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    
    // Add very subtle paper texture...
    ctx.fillStyle = '#fbfbfb'
    for (let i = 0; i < 200; i++) 
        ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1)
    
    // Extract both text & images from React content
    let textContent    = ''
    let images         = []
    let clickableAreas = [] // Track clickable areas
    
    if (typeof content === 'string')
        textContent = content
    else if (React.isValidElement(content)) {
        const result = extractContentWithImages(content)
        textContent  = result.text
        images       = result.images
    }
    else textContent = 'Page Content'
    
    // Set up text rendering with high contrast
    ctx.fillStyle = '#000000' // Pure black for maximum contrast
    ctx.font      = 'bold 38px "Times New Roman", serif'
    
    // Split text into lines and render
    const lines      = textContent.split('\n')
    const lineHeight = 48
    const margin     = 120
    let y            = margin + 150
    
    // Render text first and track links!
    lines.forEach((line, _) => {
        if (line.trim()) {
            // Check if it's a header (all caps)
            if (line === line.toUpperCase() && line.length > 3) {
                ctx.font      = 'bold 55px "Times New Roman", serif'
                ctx.fillStyle = '#000000'
            }
            else if (line.startsWith('•')) {
                ctx.font      = 'bold 45px "Times New Roman", serif'
                ctx.fillStyle = '#000000'
            }
            else if (line.startsWith('CODE')) {
                ctx.font      = 'bold 45px "Courier New", monospace'
                ctx.fillStyle = '#000000'
            }
            else {
                ctx.font      = 'bold 45px "Times New Roman", serif'
                ctx.fillStyle = '#000000'
            }
            
            // Check for links in the line
            const linkMatch = line.match(/(.+?)\s*\((.+?)\)$/)
            if (linkMatch && linkMatch[2].startsWith('http')) {
                // This is a link - render with underline and track area
                const linkText = linkMatch[1].trim()
                const linkUrl  = linkMatch[2]
                
                ctx.fillStyle = '#0c155c' // Blue color for links
                ctx.fillText(linkText, margin, y)
                
                // Add underline
                const textWidth = ctx.measureText(linkText).width
                ctx.strokeStyle = '#0c155c'
                ctx.lineWidth   = 2
                ctx.beginPath()
                ctx.moveTo(margin, y + 50)
                ctx.lineTo(margin + textWidth, y + 50)
                ctx.stroke()
                
                // Track clickable area
                clickableAreas.push({
                    type: 'link',
                    url:  linkUrl,
                    x: margin,
                    y: y,
                    width:  textWidth,
                    height: 60
                })
                
                ctx.fillStyle = '#000000' // Reset color
            } else {
                // Regular text - word wrap
                const words     = line.split(' ')
                let currentLine = ''
                
                words.forEach(word => {
                    const testLine = currentLine + word + ' '
                    const metrics  = ctx.measureText(testLine)
                    
                    if (metrics.width > width - (margin * 2) && currentLine !== '') {
                        ctx.fillText(currentLine, margin, y)
                        currentLine = word + ' '
                        y          += lineHeight
                    }
                    else currentLine = testLine
                })
                
                if (currentLine) ctx.fillText(currentLine, margin, y)
            }
            
            y += lineHeight
        }
        else y += lineHeight / 2 // Smaller gap for empty lines
        
        // Prevent overflow
        if (y > height - margin) {
            ctx.fillText('...', margin, y)

            return;
        }
    })
    
    // Load and draw images
    for (const imageInfo of images) {
        try {
            const img       = new Image()
            img.crossOrigin = 'anonymous'
            
            // Try loading the image with a timeout
            await Promise.race([
                new Promise((resolve, reject) => {
                    img.onload  = resolve
                    img.onerror = reject
                    img.src     = imageInfo.src
                }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Image load timeout')), 5000)
                )
            ])
            
            // Calculate image position and size
            const maxWidth    = width - (margin * 2)
            const maxHeight   = 600
            const aspectRatio = img.width / img.height
            
            let drawWidth  = Math.min(maxWidth, img.width)
            let drawHeight = drawWidth / aspectRatio
            
            if (drawHeight > maxHeight) {
                drawHeight = maxHeight
                drawWidth  = drawHeight * aspectRatio
            }
            
            const x = margin + (maxWidth - drawWidth) / 2
            
            // Draw image at current y position
            ctx.drawImage(img, x, y, drawWidth, drawHeight)
            
            // Track clickable area for image
            clickableAreas.push({
                type: 'image',
                src:  imageInfo.src,
                alt:  imageInfo.alt,
                x: x,
                y: y,
                width:  drawWidth,
                height: drawHeight
            })
            
            y += drawHeight + 20 // Add some spacing after image
        }
        catch (error) {
            console.warn('Failed to load image:', imageInfo.src, error.message)
        }
    }
    
    // Create texture with better filtering
    const texture           = new CanvasTexture(canvas)
    texture.generateMipmaps = false
    texture.minFilter       = texture.magFilter = 1006 // LinearFilter
    
    return { texture, clickableAreas };
}

// --- Function to extract both text & images --- //
const extractContentWithImages = (element) => {
    const result = { text: '', images: [] }
    
    const traverse = (el) => {
        if (typeof el === 'string') {
            result.text += el

            return;
        }
        if (typeof el === 'number') {
            result.text += el.toString()

            return;
        }
        if (!el || !el.props) return;
        
        // Handle images
        if (el.type === 'img') {
            result.images.push({
                src: el.props.src,
                alt: el.props.alt || ''
            })

            return;
        }
        
        // Handle other elements
        if (el.type === 'h1' || el.type === 'h2' || el.type === 'h3' || el.type === 'h4')
            result.text += '\n' + extractTextFromChildren(el.props.children).toUpperCase() + '\n'
        else if (el.type === 'p') {
            result.text += '\n'
            traverseChildren(el.props.children)
            result.text += '\n'
        }
        else if (el.type === 'ul' || el.type === 'ol') {
            result.text += '\n'
            if (el.props.children) {
                const items = Array.isArray(el.props.children) ? el.props.children : [el.props.children]
                items.forEach((item) => {
                    if (item && item.type === 'li') {
                        result.text += '• '
                        traverseChildren(item.props.children)
                        result.text += '\n'
                    }
                })
            }
            result.text += '\n'
        }
        else if (el.type === 'blockquote') {
            result.text += '\n"'
            traverseChildren(el.props.children)
            result.text += '"\n'
        }
        else traverseChildren(el.props.children)
    }
    
    const traverseChildren = (children) => {
        if (!children) return;
        
        if (Array.isArray(children))
            children.forEach(child => traverse(child))
        else
            traverse(children)
    }
    
    traverse(element)

    return result;
}

// Update the createTextPageMesh function to handle async texture creation
export const createTextPageMesh = async (frontContent, backContent) => {
    const geometry = createTextPageGeometry()
    
    /* Skeletal animation system for rendering realistic
    book pages that can bend and curve naturally */
    const bones = []
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
        const bone = new Bone()
        bones.push(bone)
        
        if (i === 0) bone.position.x = 0
        else         bone.position.x = SEGMENT_WIDTH
        
        if (i > 0) bones[i - 1].add(bone) // Attach the new bone to the previous one!
    }
    
    const skeleton = new Skeleton(bones)
    
    // Create textures from content (async)
    const frontResult = await createTextureFromContent(frontContent)
    const backResult  = await createTextureFromContent(backContent)
    
    const whiteColor  = new Color('#ffffff')
    const orangeColor = new Color('orange')
    
    const materials = [
        new MeshStandardMaterial({ 
            color:     whiteColor, 
            roughness: 0.9,
            metalness: 0.0
        }), // Right
        new MeshStandardMaterial({ 
            color:     '#111', 
            roughness: 0.9,
            metalness: 0.0
        }), // Left
        new MeshStandardMaterial({ 
            color:     whiteColor, 
            roughness: 0.9,
            metalness: 0.0
        }), // Top
        new MeshStandardMaterial({ 
            color:     whiteColor, 
            roughness: 0.9,
            metalness: 0.0
        }), // Bottom
        new MeshStandardMaterial({ 
            map:   frontResult.texture,
            color: whiteColor,
            roughness: 0.8,
            metalness: 0.0,
            emissive: orangeColor,
            emissiveIntensity: 0
        }), // Front
        new MeshStandardMaterial({ 
            map:   backResult.texture,
            color: whiteColor,
            roughness: 0.8,
            metalness: 0.0,
            emissive: orangeColor,
            emissiveIntensity: 0
        }) // Back
    ]
    
    const mesh         = new SkinnedMesh(geometry, materials)
    mesh.castShadow    = true  // Disable shadow casting for text pages
    mesh.receiveShadow = false // Disable shadow receiving for text pages
    mesh.frustumCulled = false
    mesh.add(skeleton.bones[0])
    mesh.bind(skeleton)
    
    return { 
        mesh, 
        skeleton, 
        frontClickableAreas: frontResult.clickableAreas,
        backClickableAreas:  backResult.clickableAreas
    };
}
