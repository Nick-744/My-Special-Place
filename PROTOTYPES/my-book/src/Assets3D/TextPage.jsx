import {
    Float32BufferAttribute,
    Uint16BufferAttribute,
    DefaultLoadingManager,
    MeshStandardMaterial,
    CanvasTexture,
    TextureLoader,
    BoxGeometry,
    SkinnedMesh,
    Skeleton,
    Vector3,
    Color,
    Bone
} from 'three'
import React from 'react'

// ==================== Pages Configuration ==================== //
const PAGE_WIDTH     = 1.28
const PAGE_HEIGHT    = 1.71 // 4:3 aspect ratio
const PAGE_THICKNESS = 0.001
const PAGE_SEGMENTS  = 50
const SEGMENT_WIDTH  = PAGE_WIDTH / PAGE_SEGMENTS

// --- Add margin configuration --- //
const MARGIN_TOP    = 0
const MARGIN_BOTTOM = 60
const MARGIN_LEFT   = 130
const MARGIN_RIGHT  = 130

// --- Papyrus opacity --- //
const PAPYRUS_OPACITY = 1.0

const FONT_TYPE = '"GFS Didot", cursive'

const createTextPageGeometry = () => {
    const g = new BoxGeometry(PAGE_WIDTH, PAGE_HEIGHT, PAGE_THICKNESS, PAGE_SEGMENTS, 2)
    g.translate(PAGE_WIDTH / 2, 0, 0)

    const pos = g.attributes.position
    const v   = new Vector3()
    const si  = []
    const sw  = []

    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i)

        const x      = Math.max(0, v.x)
        const idx    = Math.floor(x / SEGMENT_WIDTH)
        const weight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH

        si.push(idx, idx + 1, 0, 0)
        sw.push(1 - weight, weight, 0, 0)
    }

    g.setAttribute('skinIndex',  new Uint16BufferAttribute(si,  4))
    g.setAttribute('skinWeight', new Float32BufferAttribute(sw, 4))

    return g;
}

// Unified traversal that extracts text + images!
const extractContentWithImages = (el) => {
    const res     = { text: '', images: [], bottomH2: [] }
    const addText = (t) => { res.text += (t == null ? '' : String(t)) }

    const trav = (node) => {
        if (node == null) return;
        if (typeof node === 'string' || typeof node === 'number') {
            addText(node)

            return;
        }
        if (!node.props) return;

        const type = node.type
        if (type === 'img') {
            res.images.push({
                src:   node.props.src,
                alt:   node.props.alt   || '',
                style: node.props.style || {}
            })

            return;
        }

        if (type === 'h2') { // Capture h2 separately for bottom placement
            const txt = extractChildrenText(node.props.children).trim()
            if (txt) res.bottomH2.push(txt)

            return; // Do NOT add to flowing text!
        }

        if (type === 'h1') {
            addText('\n' + extractChildrenText(node.props.children) + '\n')
            
            return;
        }
        if (type === 'p') {
            addText('\n')
            travChildren(node.props.children)
            addText('\n')

            return;
        }
        travChildren(node.props.children)
    }

    const travChildren = (children) => {
        if (!children)               return;
        if (Array.isArray(children)) children.forEach(trav)
        else                         trav(children)
    }

    // Helper function to extract text from children
    const extractChildrenText = (children) => {
        if (!children)
            return '';
        if (typeof children === 'string' || typeof children === 'number')
            return String(children);
        if (Array.isArray(children))
            return children.map(
                c => extractContentWithImages(c).text || extractChildrenText(c)
            ).join('');

        return extractContentWithImages(children).text || '';
    }

    trav(el) // Traverse the element

    return res;
}

const createTextureFromContent = async (content, width = 1200, height = 1500) => {
    const canvas  = document.createElement('canvas')
    canvas.width  = width
    canvas.height = height

    try { // Wait for GFS Didot!
        await document.fonts.load(`700 55px "GFS Didot"`)
        await document.fonts.load(`700 45px "GFS Didot"`)
        await document.fonts.load(`700 38px "GFS Didot"`)
        await document.fonts.ready
    }
    catch (e) { console.warn('Font load warning', e?.message) }

    const ctx = canvas.getContext('2d')
    
    ctx.textAlign             = 'left'
    ctx.textBaseline          = 'top'
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.fillStyle             = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < 120; i++)
        ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1)

    let text     = ''
    let images   = []
    let bottomH2 = []
    if (typeof content === 'string') text = content
    else if (React.isValidElement(content)) {
        const r  = extractContentWithImages(content)
        text     = r.text
        images   = r.images
        bottomH2 = r.bottomH2 || []
    }
    else text = 'Page Content'

    const availableWidth = width - MARGIN_LEFT - MARGIN_RIGHT
    const lineHeight     = 55
    let   y              = MARGIN_TOP + 150

    const loader         = new TextureLoader(DefaultLoadingManager)
    const clickableAreas = []

    ctx.fillStyle = '#000'
    ctx.font      = `bold 45px ${FONT_TYPE}`

    const lines = text.split('\n')
    for (let li = 0; li < lines.length; li++) {
        const line = String(lines[li] ?? '').trimEnd()
        if (!line) {
            y += lineHeight / 2

            continue;
        }

        const isHeader    = (line === line.toUpperCase() && line.length > 3)
        const nextLine    = lines[li + 1]
        const isParagraph = !isHeader && (nextLine === '' || typeof nextLine === 'undefined')
        const extra       = (isHeader || isParagraph) ? lineHeight * 0.6 : 0

        if (isHeader) {
            ctx.font      = `bold 55px ${FONT_TYPE}`
            ctx.fillStyle = '#000'
            const w       = ctx.measureText(line).width
            ctx.fillText(line, MARGIN_LEFT + (availableWidth - w) / 2, y)
        }
        else {
            ctx.font        = `bold 45px ${FONT_TYPE}`
            ctx.fillStyle   = '#000'
            const linkMatch = line.match(/(.+?)\s*\((https?:\/\/[^\s)]+)\)$/)
            if (linkMatch) {
                const linkText = linkMatch[1].trim()
                const linkUrl  = linkMatch[2]

                ctx.fillStyle   = '#0c155c'
                ctx.strokeStyle = '#0c155c'
                ctx.lineWidth   = 5
                ctx.fillText(linkText, MARGIN_LEFT, y)

                const textW = ctx.measureText(linkText).width
                ctx.beginPath()
                ctx.moveTo(MARGIN_LEFT,         y + 50)
                ctx.lineTo(MARGIN_LEFT + textW, y + 50)
                ctx.stroke()

                clickableAreas.push({
                    type: 'link', url: linkUrl, x: MARGIN_LEFT, y, width: textW, height: 60
                })
                ctx.fillStyle = '#000'
            }
            else {
                // Simple word wrap
                const words = line.split(' ')
                let cur     = ''
                for (const w of words) {
                    const test = cur + w + ' '
                    if (ctx.measureText(test).width > availableWidth && cur) {
                        ctx.fillText(cur, MARGIN_LEFT, y)
                        cur = w + ' '
                        y  += lineHeight
                    }
                    else cur = test
                }
                if (cur) ctx.fillText(cur, MARGIN_LEFT, y)
            }
        }

        y += lineHeight + extra
        if (y > height - MARGIN_BOTTOM) {
            ctx.fillText('...', MARGIN_LEFT, y)

            break;
        }
    }

    let lastImageBottomY = null
    for (const imgInfo of images) {
        try {
            const tex   = await new Promise(
                (res, rej) => loader.load(imgInfo.src, res, undefined, rej)
            )
            const img   = tex.image
            const style = imgInfo.style || {}
            const maxW  = style.maxWidth ?? availableWidth
            const maxH  = style.maxHeight ?? 1000
            let   drawW
            let   drawH
            if (typeof style.width === 'number') {
                drawW = style.width
                drawH = drawW / (img.width / img.height)
            }
            else if (typeof style.height === 'number') {
                drawH = style.height
                drawW = drawH * (img.width / img.height)
            }
            else {
                const ar = img.width / img.height
                drawW    = Math.min(maxW, img.width)
                drawH    = drawW / ar
                if (drawH > maxH) {
                    drawH = maxH
                    drawW = drawH * ar
                }
            }
            const cx = (width - drawW) / 2
            const cy = (height - drawH) / 2
            ctx.drawImage(img, cx, cy, drawW, drawH)

            lastImageBottomY = cy + drawH

            clickableAreas.push({
                type: 'image',
                src:  imgInfo.src,
                alt:  imgInfo.alt,
                x: cx,
                y: cy,
                width:  drawW,
                height: drawH
            })
        }
        catch (e) { console.warn('Failed to load image', imgInfo.src, e?.message) }
    }

    // --- IMAGE SOURCE = Draw h2 headings just below the (last) image --- //
    if (bottomH2.length) {
        const headingFontSize = 35
        const lineH           = 35
        ctx.font              = `bold ${headingFontSize}px ${FONT_TYPE}`
        ctx.fillStyle         = '#000'

        // Determine starting Y: below last image if any, else after main text 'y'!
        let startY = (lastImageBottomY != null ? lastImageBottomY + 30 : y + 30)

        // Prevent overflow at bottom: if not enough space, shift upward!
        const needed = bottomH2.length * lineH
        if (startY + needed > height - MARGIN_BOTTOM)
            startY = Math.max(MARGIN_TOP + 150, height - MARGIN_BOTTOM - needed)

        let curY = startY
        bottomH2.forEach(h => {
            const w = ctx.measureText(h).width
            const x = MARGIN_LEFT + ((width - MARGIN_LEFT - MARGIN_RIGHT) - w) / 2
            ctx.fillText(h, x, curY)
            curY   += lineH
        })
    }

    const texture           = new CanvasTexture(canvas)
    texture.generateMipmaps = false
    texture.minFilter       = texture.magFilter = 1006

    return { texture, clickableAreas };
}

export const createTextPageMesh = async (frontContent, backContent) => {
    const geometry = createTextPageGeometry()

    // create bones first, link them in a separate
    // pass to avoid referencing 'bones' during creation!
    const bones = Array.from({ length: PAGE_SEGMENTS + 1 }, (_, i) => {
        const b = new Bone()
        if (i > 0) b.position.x = SEGMENT_WIDTH

        return b;
    })
    for (let i = 1; i < bones.length; i++) bones[i - 1].add(bones[i])

    const skeleton = new Skeleton(bones)

    const [frontResult, backResult] = await Promise.all([
        createTextureFromContent(frontContent),
        createTextureFromContent(backContent)
    ])

    const white  = new Color('#ffffff')

    // --- Compose the papyrus texture under the generated page canvases --- //
    const loader = new TextureLoader(DefaultLoadingManager)

    const composeWithPapyrus = async (pageTex) => {
        try {
            // Load papyrus image from public/textures
            const papyrusTex = await new Promise((res, rej) =>
                loader.load('/textures/papyrus_texture.png', res, undefined, rej)
            )
            const papyrusImg = papyrusTex.image
            const srcCanvas  = pageTex.image // Canvas from createTextureFromContent

            const w   = srcCanvas.width
            const h   = srcCanvas.height
            const c   = document.createElement('canvas')
            c.width   = w
            c.height  = h
            const ctx = c.getContext('2d')

            // Save canvas state so the random flips/rotations applied to the papyrus
            // texture remain local — we will restore afterwards so the page overlay
            // and subsequent drawing are not affected!
            ctx.save()

            // Randomize orientation to reduce visible tiling/repetition:
            // mode: 0 -> 3
            const mode = Math.floor(Math.random() * 4)
            if      (mode === 1) { // flip horizontal
                ctx.translate(w, 0)
                ctx.scale(-1, 1)
            }
            else if (mode === 2) { // flip vertical
                ctx.translate(0, h)
                ctx.scale(1, -1)
            }
            else if (mode === 3) { // rotate 180
                ctx.translate(w, h)
                ctx.rotate(Math.PI)
            }

            // Draw papyrus to fill canvas with controllable opacity
            ctx.globalAlpha = PAPYRUS_OPACITY
            ctx.drawImage(papyrusImg, 0, 0, w, h)

            ctx.restore()
            ctx.globalAlpha = 1 // Safety guard...

            // Multiply the generated page canvas over the papyrus so whitespace shows papyrus,
            // while text remains dark (multiply: white preserves, black becomes black)
            ctx.globalCompositeOperation = 'multiply'
            ctx.drawImage(srcCanvas, 0, 0, w, h)
            ctx.globalCompositeOperation = 'source-over'

            const combined           = new CanvasTexture(c)
            combined.generateMipmaps = false
            combined.minFilter       = combined.magFilter = 1006

            return combined;
        }
        catch (e) {
            console.warn('Papyrus texture load failed, using page canvas directly', e?.message)

            return pageTex;
        }
    }

    const [frontCombined, backCombined] = await Promise.all([
        composeWithPapyrus(frontResult.texture),
        composeWithPapyrus(backResult.texture)
    ])

    const materials = [
        new MeshStandardMaterial({ color: white,       roughness: 0.9, metalness: 0 }),
        new MeshStandardMaterial({ color: '#ffa500', roughness: 0.9, metalness: 0 }),
        new MeshStandardMaterial({ color: white,       roughness: 0.9, metalness: 0 }),
        new MeshStandardMaterial({ color: white,       roughness: 0.9, metalness: 0 }),

        // Use the composed textures (papyrus + page canvas)
        new MeshStandardMaterial({
            map: frontCombined, color: white, roughness: 0.8, metalness: 0
        }),
        new MeshStandardMaterial({
            map: backCombined,  color: white, roughness: 0.8, metalness: 0
        })
    ]

    const mesh         = new SkinnedMesh(geometry, materials)
    mesh.castShadow    = true
    mesh.receiveShadow = false
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
