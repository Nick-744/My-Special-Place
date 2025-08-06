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
const PAGE_WIDTH     = 1.28
const PAGE_HEIGHT    = 1.71
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

// Function to render text content to canvas texture
const createTextureFromContent = (content, width = 1200, height = 1500) => {
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
    
    // Extract text from React content
    let textContent = ''
    if (typeof content === 'string')
        textContent = content
    else if (React.isValidElement(content)) 
        textContent = extractTextFromReactElement(content)
    else 
        textContent = 'Page Content'
    
    // Set up text rendering with high contrast
    ctx.fillStyle = '#000000' // Pure black for maximum contrast
    ctx.font      = 'bold 38px "Times New Roman", serif'
    
    // Split text into lines and render
    const lines      = textContent.split('\n')
    const lineHeight = 48
    const margin     = 120
    let y            = margin + 150
    
    lines.forEach((line, _) => {
        if (line.trim()) {
            // Check if it's a header (all caps)
            if (line === line.toUpperCase() && line.length > 3) {
                ctx.font      = 'bold 48px "Times New Roman", serif'
                ctx.fillStyle = '#000000'
            }
            else if (line.startsWith('•')) {
                ctx.font      = 'bold 32px "Times New Roman", serif'
                ctx.fillStyle = '#000000'
            }
            else if (line.startsWith('CODE')) {
                ctx.font      = 'bold 32px "Courier New", monospace'
                ctx.fillStyle = '#000000'
            }
            else {
                ctx.font      = 'bold 32px "Times New Roman", serif'
                ctx.fillStyle = '#000000'
            }
            
            // Word wrap
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
            
            y += lineHeight
        }
        else y += lineHeight / 2 // Smaller gap for empty lines
        
        // Prevent overflow
        if (y > height - margin) {
            ctx.fillText('...', margin, y)

            return;
        }
    })
    
    // Create texture with better filtering
    const texture           = new CanvasTexture(canvas)
    texture.generateMipmaps = false
    texture.minFilter       = texture.magFilter = 1006 // LinearFilter
    
    return texture;
}

// Pure function to create the complete text page (no hooks)
export const createTextPageMesh = (frontContent, backContent) => {
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
    
    // Create textures from content
    const frontTexture = createTextureFromContent(frontContent)
    const backTexture  = createTextureFromContent(backContent)
    
    const whiteColor = new Color('#ffffff')
    
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
            map:   frontTexture,
            color: whiteColor,
            roughness: 0.8,
            metalness: 0.0,
            emissive: new Color(0x000000),
            emissiveIntensity: 0
        }), // Front
        new MeshStandardMaterial({ 
            map:   backTexture,
            color: whiteColor,
            roughness: 0.8,
            metalness: 0.0,
            emissive: new Color(0x000000),
            emissiveIntensity: 0
        }) // Back
    ]
    
    const mesh         = new SkinnedMesh(geometry, materials)
    mesh.castShadow    = true // Disable shadow casting for text pages
    mesh.receiveShadow = false // Disable shadow receiving for text pages
    mesh.frustumCulled = false
    mesh.add(skeleton.bones[0])
    mesh.bind(skeleton)
    
    return { mesh, skeleton };
}
