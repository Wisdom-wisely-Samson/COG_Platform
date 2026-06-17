import fs   from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import Task from '../models/Task.js';
import { UPLOADS_DIR } from '../middleware/upload.js';

// ── Department-specific evaluation prompts (used when real API key is present) ─
const DEPT_SYSTEM = {
  'PR & Media': `You are a senior PR and communications expert evaluating media content for Capital One Group, a leading Nigerian financial services company.

Assess the submitted file(s) across these 4 criteria (each scored 0–25):
1. Brand Voice & Tone — Does it reflect a professional, trustworthy, and authoritative financial brand?
2. Message Clarity — Is the key message clear, concise, and compelling for the intended audience?
3. Media Readiness — Is the content polished and ready for press or public distribution?
4. Compliance & Accuracy — Does it avoid misleading claims and align with financial communications standards?`,

  'Digital': `You are a digital marketing strategist evaluating social and digital content for Capital One Group, a leading Nigerian financial services company.

Assess the submitted file(s) across these 4 criteria (each scored 0–25):
1. Platform Suitability — Is the content properly formatted and optimised for its target digital platform?
2. Engagement Potential — Will it drive meaningful interactions (likes, shares, comments, clicks)?
3. Brand Consistency — Does it maintain Capital One Group's visual identity and brand personality?
4. Call to Action — Is there a clear, compelling CTA that drives the desired user behaviour?`,

  'Creative': `You are a creative director evaluating design and visual assets for Capital One Group, a leading Nigerian financial services company. The brand colours are red (#FF6600) and navy (#0D2B4F).

Assess the submitted file(s) across these 4 criteria (each scored 0–25):
1. Visual Impact — Is the design immediately eye-catching and memorable?
2. Brand Alignment — Does it correctly use the brand's colours, typography, and logo?
3. Technical Quality — Is the composition, resolution, and layout executed to a professional standard?
4. Creative Concept — Is the idea original, relevant, and effective in communicating the intended message?`,

  'Admin / Ops': `You are a senior operations manager evaluating documents and operational files for Capital One Group, a leading Nigerian financial services company.

Assess the submitted file(s) across these 4 criteria (each scored 0–25):
1. Completeness — Does the document contain all required sections and information?
2. Clarity & Structure — Is it well-organised, logically structured, and easy to follow?
3. Accuracy — Does the content appear factually correct and internally consistent?
4. Operational Standards — Does it meet the organisation's procedural and compliance requirements?`,
};

const DEFAULT_SYSTEM = `You are a professional content evaluator assessing work submitted for Capital One Group, a leading Nigerian financial services company.

Assess the submitted file(s) across these 4 criteria (each scored 0–25):
1. Relevance — Is the content relevant and appropriate for the organisation?
2. Quality — Is it produced to a professional standard?
3. Clarity — Is the content clear and easy to understand?
4. Completeness — Does it fully address the task requirements?`;

const JSON_INSTRUCTION = `

CRITICAL EVALUATION RULES — YOU MUST FOLLOW THESE EXACTLY:
- Every criterion "feedback" field MUST directly reference specific elements from THIS submission: the task title, file names, notes, or observable content/visual details you can see.
- FORBIDDEN generic phrases: "meets standards", "aligns with brand guidelines", "professional quality", "evaluated against standards", "satisfactory", "good level of quality". If you find yourself writing any of these without a specific reason tied to THIS file, rewrite the sentence.
- Each criterion "feedback" must be 2 sentences minimum: (1) what you specifically observed in this submission, (2) why it matters or how it affects quality.
- Strengths must cite concrete positives from THIS specific work — not generic praise.
- Improvements must be actionable, specific to THIS submission — not advice that could apply to any task.
- The summary must mention the task title and reference at least one specific detail from the files or content.

Respond ONLY with a valid JSON object — no markdown, no extra text — in this exact shape:
{
  "score": <integer 0-100>,
  "grade": "<A|B|C|D|F>",
  "summary": "<2-3 sentence overall assessment that names the task and references a specific detail>",
  "criteria": [
    { "name": "<criterion name>", "score": <integer 0-25>, "maxScore": 25, "feedback": "<2+ sentences referencing specific details from THIS submission>" },
    { "name": "<criterion name>", "score": <integer 0-25>, "maxScore": 25, "feedback": "<2+ sentences referencing specific details from THIS submission>" },
    { "name": "<criterion name>", "score": <integer 0-25>, "maxScore": 25, "feedback": "<2+ sentences referencing specific details from THIS submission>" },
    { "name": "<criterion name>", "score": <integer 0-25>, "maxScore": 25, "feedback": "<2+ sentences referencing specific details from THIS submission>" }
  ],
  "strengths": ["<specific positive observed in THIS submission>", "<specific positive>", "<specific positive>"],
  "improvements": ["<specific actionable improvement for THIS submission>", "<specific improvement>", "<specific improvement>"],
  "recommendation": "<Approved|Needs Revision|Not Recommended>"
}`;

// Supported image MIME types for Claude vision
const IMAGE_TYPES     = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB — stay under Claude's 5 MB limit

// ── Helpers for task-specific demo feedback ───────────────────────────────────

/**
 * Extract keywords from a task title to drive contextual feedback.
 * Returns an object of flags/terms used to tailor feedback strings.
 */
function analyseTask(task, deptName) {
  const title    = task.title || '';
  const notes    = task.notes || '';
  const lower    = (title + ' ' + notes).toLowerCase();
  const files    = task.attachments ?? [];
  const fileNames = files.map(f => f.originalName || f.filename || '').join(', ');
  const firstFile = files[0]?.originalName || files[0]?.filename || null;
  const hasFiles  = files.length > 0;
  const priority  = task.priority || 'Medium';
  const status    = task.status   || 'Pending';

  // Content-type detection from title/notes
  const isPressRelease  = /press release|press-release|news release/i.test(lower);
  const isPoster        = /poster|banner|flyer|billboard/i.test(lower);
  const isSocialMedia   = /social media|instagram|twitter|facebook|linkedin|tiktok|post/i.test(lower);
  const isVideo         = /video|reel|clip|animation|motion/i.test(lower) || files.some(f => /\.(mp4|mov|webm|avi)$/i.test(f.originalName || ''));
  const isReport        = /report|brief|memo|document|summary|minutes|proposal/i.test(lower);
  const isCampaign      = /campaign|promotion|launch|ad |advert|advertisement/i.test(lower);
  const isEmail         = /email|newsletter|mailer/i.test(lower);
  const isPresentation  = /presentation|slide|deck|powerpoint|keynote/i.test(lower);
  const isGraphic       = /graphic|design|logo|artwork|visual|infographic/i.test(lower);
  const isPhoto         = /photo|photograph|image/i.test(lower) || files.some(f => /\.(jpg|jpeg|png|gif)$/i.test(f.originalName || ''));

  return {
    title, notes, lower, files, fileNames, firstFile, hasFiles,
    priority, status, deptName,
    isPressRelease, isPoster, isSocialMedia, isVideo, isReport,
    isCampaign, isEmail, isPresentation, isGraphic, isPhoto,
  };
}

/**
 * Build a feedback string for a specific criterion that references the actual task.
 */
function buildCriterionFeedback(criterionName, ctx, baseScore) {
  const { title, notes, firstFile, hasFiles, fileNames, isPressRelease, isPoster,
          isSocialMedia, isVideo, isReport, isCampaign, isEmail, isPresentation,
          isGraphic, isPhoto, priority, deptName } = ctx;

  const fileRef  = firstFile  ? `"${firstFile}"` : `the submission for "${title}"`;
  const taskRef  = `"${title}"`;
  const quality  = baseScore >= 22 ? 'strong' : baseScore >= 18 ? 'adequate' : 'limited';
  const impact   = baseScore >= 22 ? 'effectively' : baseScore >= 18 ? 'partially' : 'insufficiently';

  // Map criterion to department-aware, content-aware feedback
  const feedbacks = {
    // PR & Media
    'Brand Voice & Tone': () => {
      if (isPressRelease) return `${fileRef} uses formal language appropriate for a press release, though the opening paragraph would benefit from a stronger authority statement that positions Capital One Group more definitively. The tone across the body ${impact} maintains the gravitas expected of a leading Nigerian financial institution — ${priority === 'High' ? 'given the high priority of this release, tightening the executive language is critical before distribution' : 'a peer review pass focusing on sentence formality would strengthen the final output'}.`;
      if (isCampaign)     return `The campaign copy in ${taskRef} ${impact} reflects Capital One Group's authoritative voice — the promotional language occasionally veers toward a casual register that may undermine brand credibility. ${priority === 'High' ? 'As a high-priority campaign, ensuring every sentence projects confidence and trustworthiness is non-negotiable before sign-off' : 'Revising the headline and subheadings to maintain a consistent formal-yet-approachable tone will improve overall brand alignment'}.`;
      return `${fileRef} demonstrates a ${quality} grasp of Capital One Group's required brand voice — the content ${impact} balances professionalism with accessibility for the target financial audience. ${notes ? `The notes indicate "${notes.slice(0, 60)}…", which ${baseScore >= 20 ? 'aligns well with' : 'should be more directly reflected in'} the tone choices throughout` : `For a ${priority.toLowerCase()}-priority submission, the tonal consistency ${baseScore >= 20 ? 'meets expectations' : 'needs closer review against the brand guidelines'}`}.`;
    },
    'Message Clarity': () => {
      if (isPressRelease) return `The headline in ${taskRef} ${impact} communicates the core announcement — ${baseScore >= 20 ? 'the inverted pyramid structure is followed and the key news value surfaces within the first two sentences' : 'the lead paragraph buries the main announcement and readers may disengage before reaching the core message'}. ${hasFiles ? `The attached ${fileRef} should ensure every paragraph serves a clear communicative purpose, with unnecessary background moved to the boilerplate section` : 'Without an attached draft, a full clarity assessment is limited — submitting the document file will allow a more precise review'}.`;
      if (isEmail)        return `The subject line and opening hook in ${taskRef} ${impact} capture reader attention — ${baseScore >= 20 ? 'the value proposition is stated early, which improves open and read-through rates' : 'the value proposition is unclear in the opening, which risks high drop-off before the CTA'}. The body structure of ${fileRef} would benefit from ${baseScore >= 20 ? 'minor tightening around the secondary message points' : 'a cleaner single-message focus with supporting points consolidated into a scannable format'}.`;
      return `${taskRef} ${impact} conveys its central message — ${hasFiles ? `${fileRef} ${baseScore >= 20 ? 'presents information in a logical sequence that aids comprehension' : 'requires restructuring so the primary message surfaces within the first third of the content'}` : 'without an attached file, the clarity can only be inferred from the task description, which is ' + (baseScore >= 20 ? 'reasonably clear' : 'somewhat vague')}. ${priority === 'High' ? 'High-priority content demands unambiguous messaging; any ambiguity here could damage audience trust' : 'A secondary review for clarity and conciseness is recommended before final submission'}.`;
    },
    'Media Readiness': () => {
      if (isPressRelease) return `${fileRef} ${impact} meets press distribution standards — ${baseScore >= 20 ? 'the standard AP-style formatting, dateline, and "###" end marker indicate strong readiness for newswire submission' : 'missing elements such as a dateline, media contact block, or boilerplate section prevent immediate distribution'}. ${priority === 'High' ? 'For a high-priority release, every structural element must be verified against the newswire checklist before sending' : 'Running through a pre-distribution checklist will resolve the outstanding formatting gaps'}.`;
      if (isPoster || isGraphic) return `${fileRef} ${impact} achieves production-ready quality — ${baseScore >= 20 ? 'the resolution and colour mode appear appropriate for both digital and print output' : 'the file may require resolution upscaling or colour profile correction (RGB→CMYK) before going to print'}. ${hasFiles ? `Review that ${fileRef} includes bleed marks and safe-zone margins if it is intended for physical printing` : 'Attaching the actual design file would allow a definitive check of print specifications'}.`;
      return `${fileRef} is ${quality === 'strong' ? 'close to' : quality === 'adequate' ? 'partially at' : 'not yet at'} a publish-ready standard — ${hasFiles ? `${baseScore >= 20 ? 'the submission appears polished and requires only minor finishing touches' : 'several areas need revision before the content is ready for external audiences'}` : 'media-readiness cannot be fully assessed without the actual file attached'}. ${priority === 'High' ? 'Expedite the outstanding revisions given the high-priority classification of this task' : 'Factor in at least one round of editorial review before marking this as media-ready'}.`;
    },
    'Compliance & Accuracy': () => {
      return `${fileRef} ${impact} addresses the compliance requirements expected for Capital One Group's financial communications — ${baseScore >= 20 ? 'no misleading claims or unsupported statements were identified in the reviewed content' : 'certain claims require supporting data citations or regulatory disclaimers to avoid potential compliance issues'}. ${notes ? `The brief notes "${notes.slice(0, 50)}…" ${baseScore >= 20 ? 'do not raise compliance red flags' : 'should be cross-checked with the Legal and Compliance team before distribution'}` : `All financial figures or product references in ${taskRef} must be verified against the latest approved rate sheets and regulatory guidance before sign-off`}.`;
    },

    // Digital
    'Platform Suitability': () => {
      if (isSocialMedia) return `${fileRef} ${impact} matches the format requirements of its target social platform — ${baseScore >= 20 ? 'dimensions, aspect ratio, and copy length appear optimised for feed and story placement' : 'the current dimensions or copy length may cause cropping or truncation on the target platform, reducing impact'}. ${hasFiles ? `Verify that ${firstFile ? `"${firstFile}"` : 'the attached asset'} meets the specific pixel requirements and safe-zone guidelines of each platform it will be posted to` : 'Attaching the actual creative asset will allow a platform-fit check against Instagram, LinkedIn, and Twitter specifications'}.`;
      if (isVideo)       return `The video content in ${taskRef} ${impact} suits its intended digital platform — ${baseScore >= 20 ? 'the aspect ratio and duration are appropriate for social feed autoplay behaviour' : 'the video duration or aspect ratio may be misaligned with the target platform\'s best practices for autoplay and engagement'}. Ensure ${fileRef} includes captions, as ${baseScore >= 20 ? 'this is already a strong practice for accessibility and muted-autoplay environments' : 'up to 85% of social video is watched without sound, making captions critical for message delivery'}.`;
      return `${taskRef} ${impact} demonstrates platform-appropriate formatting — ${hasFiles ? `${fileRef} ${baseScore >= 20 ? 'uses dimensions and content structure suited to its digital destination' : 'needs dimension and content adjustments to fully meet the target platform\'s technical requirements'}` : 'platform suitability cannot be confirmed without the attached asset — submit the file for a full technical check'}. ${priority === 'High' ? 'As a high-priority digital asset, platform compliance must be confirmed before scheduling' : 'Run the asset through a platform preview tool to confirm rendering on mobile and desktop'}.`;
    },
    'Engagement Potential': () => {
      if (isSocialMedia) return `The copy and creative direction of ${taskRef} ${impact} signal engagement potential — ${baseScore >= 20 ? 'the hook is compelling and the content structure encourages interaction through questions or relatable scenarios' : 'the opening hook is weak and the content lacks a clear emotional or informational trigger that would drive shares or comments'}. ${hasFiles ? `${firstFile ? `"${firstFile}"` : 'The attached asset'} ${baseScore >= 20 ? 'should perform well in the first 3 seconds of scroll-stop testing' : 'needs a stronger visual or copy hook within the first frame to pass scroll-stop testing'}` : 'An A/B test of at least two headline variations is recommended to identify the highest-performing creative direction'}.`;
      if (isCampaign)   return `The campaign concept in ${taskRef} ${impact} motivates target audience action — ${baseScore >= 20 ? 'the value proposition and emotional appeal are well-balanced, which typically correlates with above-average click-through rates' : 'the value proposition needs strengthening — the current copy does not differentiate Capital One Group\'s offer clearly enough to drive meaningful engagement'}. ${notes ? `The campaign notes "${notes.slice(0, 50)}…" ${baseScore >= 20 ? 'support a coherent and engaging narrative' : 'indicate a scope that may be too broad, diluting the single-minded engagement trigger'}` : 'Defining one primary engagement goal (awareness, sign-up, or product inquiry) will sharpen the creative focus'}.`;
      return `${fileRef} ${impact} demonstrates the potential to engage Capital One Group's digital audience — ${baseScore >= 20 ? 'the content topic and framing are timely and relevant, which are the strongest predictors of organic reach' : 'the content lacks a clear engagement trigger — consider adding a question, poll, or data point that invites audience response'}. ${priority === 'High' ? 'High-priority digital content should be validated with at least a small paid boost or internal team preview before full publication' : 'Piloting this with a smaller audience segment first will provide performance data to optimise the broader rollout'}.`;
    },
    'Brand Consistency': () => {
      return `${fileRef} ${impact} maintains Capital One Group's visual and verbal brand identity — ${baseScore >= 20 ? 'the brand colour palette, typography, and logo usage appear consistent with the established brand system' : 'deviations in colour usage or typography were noted that could create an inconsistent brand experience across touchpoints'}. ${hasFiles ? `Cross-reference ${firstFile ? `"${firstFile}"` : 'the attached file'} against the latest Capital One Group brand guidelines, particularly for logo clear-space rules and approved font weights` : 'Attach the creative file so brand consistency can be verified against the official style guide'}.`;
    },
    'Call to Action': () => {
      return `The CTA in ${taskRef} ${impact} drives the desired user behaviour — ${baseScore >= 20 ? 'it is visually prominent, uses action-oriented language, and is positioned at a natural decision point in the content flow' : 'the CTA is either absent, too passive, or buried within the content, which will reduce conversion rate significantly'}. ${notes ? `Based on the stated intent "${notes.slice(0, 50)}…", the CTA should ${baseScore >= 20 ? 'continue to emphasise' : 'more clearly emphasise'} the specific next step the audience should take` : `For ${taskRef}, the CTA must clearly state one action (e.g., "Apply Now", "Learn More", "Visit our branch") with a direct link or contact detail`}.`;
    },

    // Creative
    'Visual Impact': () => {
      if (isPoster || isGraphic) return `${fileRef} ${impact} achieves the immediate visual stop-power expected of a Capital One Group asset — ${baseScore >= 20 ? 'the composition hierarchy draws the eye to the key message before moving to supporting elements, which is a hallmark of effective poster design' : 'the composition lacks a clear focal point, causing the eye to wander without landing on the key message, which weakens first-impression impact'}. ${hasFiles ? `The ${firstFile ? `"${firstFile}"` : 'attached file'} would benefit from ${baseScore >= 20 ? 'minor refinements to whitespace use to further increase breathing room around the hero element' : 'a redesign of the hero element to create a stronger visual entry point'}` : 'Submit the design file to assess whether the visual hierarchy effectively guides the viewer through the intended reading order'}.`;
      if (isVideo)       return `${taskRef}'s motion content ${impact} captures and holds viewer attention — ${baseScore >= 20 ? 'the opening frame delivers an immediate visual hook within the critical first 2 seconds of autoplay' : 'the opening sequence is slow to establish visual interest, risking drop-off before the key message is delivered'}. ${hasFiles ? `Ensure ${fileRef} maintains visual energy throughout — ${baseScore >= 20 ? 'the pacing appears well-calibrated for the target platform' : 'the mid-section pacing slows considerably and may lose viewer attention before the CTA appears'}` : 'Attaching the video file will allow a frame-by-frame assessment of attention retention across the full runtime'}.`;
      return `${fileRef} ${impact} creates a memorable visual impression for Capital One Group — ${baseScore >= 20 ? 'the overall aesthetic is polished and the visual language is consistent throughout the piece' : 'the visual execution needs further refinement to achieve the level of impact expected for a Capital One Group deliverable'}. ${priority === 'High' ? 'Given the high priority of this asset, a final creative review by the department head is recommended before approval' : 'Consider seeking peer critique within the Creative team to identify opportunities to elevate the visual impact further'}.`;
    },
    'Brand Alignment': () => {
      return `${fileRef} ${impact} applies Capital One Group's brand identity — ${baseScore >= 20 ? 'the use of the brand red (#FF6600) and navy (#0D2B4F) is correct and the logo placement respects the required clear-space rules' : 'inconsistencies in colour application were noted — verify that hex values #FF6600 (red) and #0D2B4F (navy) are used exactly, with no approximations or substitutions'}. ${hasFiles ? `Typography in ${firstFile ? `"${firstFile}"` : 'the attached file'} should be cross-checked against the approved typeface list — ${baseScore >= 20 ? 'the current font choices appear within the approved set' : 'one or more font choices appear outside the approved brand typeface family'}` : 'Brand alignment across colour, logo, and typography can only be fully verified once the design file is attached'}.`;
    },
    'Technical Quality': () => {
      if (isPoster || isGraphic) return `${fileRef} ${impact} meets the technical quality bar for a Capital One Group design asset — ${baseScore >= 20 ? 'the file resolution and export settings appear appropriate for both screen and print reproduction' : 'the resolution may be insufficient for large-format print output — export at a minimum of 300 DPI for print or 72 DPI at 2× for digital retina screens'}. ${hasFiles ? `Confirm that ${firstFile ? `"${firstFile}"` : 'the submitted file'} includes a separate high-resolution version with bleed and crop marks if it is destined for physical print production` : 'Submit the source file (AI, PSD, or Figma export) for a complete technical quality review'}.`;
      if (isVideo)       return `The production quality of ${taskRef} ${impact} reflects the technical standards required for Capital One Group's digital channels — ${baseScore >= 20 ? 'the video resolution, audio clarity, and colour grading appear consistent and broadcast-quality' : 'the video requires colour correction and audio level normalisation before it meets the minimum technical standard for publication'}. ${hasFiles ? `Export ${fileRef} at a minimum of 1080p (1920×1080) with H.264 encoding for digital platforms, or ProRes for broadcast delivery` : 'Attaching the video file will allow a full technical audit of resolution, codec, and audio specifications'}.`;
      return `${fileRef} ${impact} achieves the technical execution standard expected of Capital One Group creative output — ${baseScore >= 20 ? 'the composition, spacing, and asset rendering are clean and professional throughout' : 'several technical areas need attention — spacing inconsistencies and rendering artefacts reduce the overall professional quality'}. ${priority === 'High' ? 'High-priority creative assets must pass a technical QA review (resolution, colour mode, export settings) before submission to external vendors or media buyers' : 'A technical QA pass covering resolution, bleed, and colour mode is recommended before this asset is finalised'}.`;
    },
    'Creative Concept': () => {
      return `The concept behind ${taskRef} ${impact} communicates its intended message with originality — ${baseScore >= 20 ? 'the creative idea is distinctive, avoids generic stock-image thinking, and anchors the communication in a specific, memorable insight' : 'the concept is currently too conventional — it relies on familiar visual or messaging tropes that will not differentiate Capital One Group in a competitive media environment'}. ${notes ? `The brief notes "${notes.slice(0, 60)}…" ${baseScore >= 20 ? 'are well-reflected in the conceptual direction' : 'suggest a stronger strategic intent than the current concept delivers — revisit the core insight and push the idea further'}` : `For ${taskRef}, consider how the concept can surprise the audience while still driving the desired action — the most effective creative work balances memorability with clarity of purpose`}.`;
    },

    // Admin / Ops
    'Completeness': () => {
      if (isReport)        return `${fileRef} ${impact} contains the required sections for a Capital One Group ${isPresentation ? 'presentation' : 'report'} — ${baseScore >= 20 ? 'all standard sections (executive summary, body, conclusions, and recommendations) appear to be present' : 'key sections such as the executive summary or recommendations appear to be missing or underdeveloped'}. ${notes ? `The task notes "${notes.slice(0, 50)}…" outline specific deliverables — verify that each point in the brief is addressed within the document before final submission` : `Cross-reference ${taskRef} against the department's standard document template to ensure no mandatory sections have been omitted`}.`;
      if (isPresentation)  return `${fileRef} ${impact} covers the full scope outlined for ${taskRef} — ${baseScore >= 20 ? 'all key topic areas and supporting slides appear to be present, providing a complete narrative arc' : 'several topic areas appear to be missing slides or have placeholder content that has not been replaced with final information'}. ${hasFiles ? `The ${firstFile ? `"${firstFile}"` : 'attached presentation'} should include an agenda slide, section dividers, and a clear conclusion slide to meet Capital One Group's presentation standards` : 'Attaching the presentation file will allow a slide-count and content-coverage review against the agreed brief'}.`;
      return `${fileRef} ${impact} addresses the full scope of ${taskRef} — ${baseScore >= 20 ? 'all required information appears to be present and the document covers its stated purpose comprehensively' : 'the submission is incomplete — certain sections or data points mentioned in the task description are absent from the current version'}. ${priority === 'High' ? `As a high-priority task, any gaps in ${taskRef} must be resolved before the document is circulated to senior stakeholders` : `Review the original task brief for ${taskRef} and confirm that every specified deliverable has been addressed before marking as complete`}.`;
    },
    'Clarity & Structure': () => {
      if (isReport)        return `The structure of ${fileRef} ${impact} aids navigation and comprehension — ${baseScore >= 20 ? 'the use of clear headings, numbered sections, and logical information flow makes the document easy to navigate' : 'the document would benefit from a clearer heading hierarchy and more consistent section formatting to improve readability'}. ${notes ? `Given the stated context "${notes.slice(0, 50)}…", the audience is likely ${baseScore >= 20 ? 'well-served by the current structure' : 'expecting a more structured layout with clearer signposting between sections'}` : `For ${taskRef}, adding a table of contents and numbered sections will significantly improve navigability for senior reviewers`}.`;
      return `${fileRef} ${impact} presents its information in a clear, structured manner — ${baseScore >= 20 ? 'the logical sequencing of information and consistent formatting make the document accessible to its intended audience' : 'the current structure is inconsistent — varying formatting styles and unclear section breaks make the document harder to follow than it should be'}. ${priority === 'High' ? `High-priority documents like ${taskRef} will receive close scrutiny from leadership; a final formatting review to ensure consistency throughout is strongly recommended` : `A structural review of ${taskRef} focusing on logical flow and formatting consistency will enhance the document's overall professionalism`}.`;
    },
    'Accuracy': () => {
      return `${fileRef} ${impact} appears factually accurate and internally consistent — ${baseScore >= 20 ? 'the data, figures, and statements reviewed do not contain obvious contradictions or unsupported claims' : 'certain figures or statements require verification — internal inconsistencies were noted that should be resolved before the document is circulated'}. ${notes ? `The context noted "${notes.slice(0, 50)}…" — all data in ${taskRef} should be traced to an authoritative source and cited appropriately` : `All numerical data and factual claims in ${taskRef} must be verified against primary sources before final submission, particularly any financial figures or regulatory references`}.`;
    },
    'Operational Standards': () => {
      return `${fileRef} ${impact} conforms to Capital One Group's operational and procedural standards — ${baseScore >= 20 ? 'the document follows the required format, includes appropriate version control information, and meets the organisation\'s documentation policies' : 'key operational elements are missing — the document lacks version control details (author, date, version number) and may not have been reviewed against the current procedural checklist'}. ${priority === 'High' ? `For a high-priority operational document like ${taskRef}, formal sign-off from the Head of Operations is required before distribution` : `Add a document control footer to ${taskRef} containing the version number, author name, creation date, and review date to meet standard operational requirements`}.`;
    },

    // Default / Generic
    'Relevance': () => {
      return `${fileRef} ${impact} addresses the scope and objectives of ${taskRef} — ${baseScore >= 20 ? 'the content is directly relevant to Capital One Group\'s operational context and the task\'s stated purpose' : 'parts of the submission appear off-scope or tangential to the core task objectives — a tighter focus on the stated deliverable is needed'}. ${notes ? `The task notes "${notes.slice(0, 50)}…" define the expected output clearly; ${baseScore >= 20 ? 'the submission aligns well with this scope' : 'the submission does not fully reflect this stated scope and should be revised accordingly'}` : `For ${taskRef}, ensure every element of the submission directly serves the task's stated goal with no extraneous material`}.`;
    },
    'Quality': () => {
      return `The overall quality of ${fileRef} is ${quality} — ${baseScore >= 20 ? 'the work is produced to a standard that reflects well on Capital One Group\'s internal quality bar' : 'the production quality falls below the standard expected for official Capital One Group output and requires revision'}. ${priority === 'High' ? `Given the high-priority classification of ${taskRef}, an additional quality review pass by a senior team member is strongly recommended` : `For ${taskRef}, a self-review checklist covering formatting, accuracy, and completeness before submission will help close the quality gap`}.`;
    },
    'Clarity': () => {
      return `${fileRef} ${impact} communicates its content clearly — ${baseScore >= 20 ? 'the language is precise and the intended message is immediately accessible to the target audience' : 'the content uses overly complex language or lacks sufficient explanation, which may confuse the intended audience'}. ${notes ? `The task notes "${notes.slice(0, 50)}…" imply a specific audience; the clarity of ${taskRef} should be calibrated to that audience's level of domain knowledge` : `Revising ${taskRef} with the intended reader in mind — asking "will someone unfamiliar with this topic understand this immediately?" — will surface the key clarity gaps`}.`;
    },
    'Completeness': () => {
      return `${fileRef} ${impact} covers the full scope required for ${taskRef} — ${baseScore >= 20 ? 'all stated deliverables appear to be addressed and no major gaps were identified' : 'the submission is missing components that were outlined in the task description — a gap analysis against the original brief is needed'}. ${priority === 'High' ? `Completeness is critical for high-priority deliverables; ensure every aspect of the ${taskRef} brief has been addressed before final submission` : `Review the original task description for ${taskRef} side-by-side with the submission to confirm that no required element has been left out`}.`;
    },
  };

  const fn = feedbacks[criterionName];
  return fn ? fn() : `${fileRef} was assessed against the ${criterionName} dimension for ${deptName || 'Capital One Group'} standards — the submission ${impact} meets expectations for this criterion, with ${quality === 'strong' ? 'minimal' : quality === 'adequate' ? 'moderate' : 'significant'} revision required to reach the optimal standard for ${taskRef}.`;
}

/**
 * Build task-specific strengths for demo mode.
 */
function buildStrengths(ctx, total, template) {
  const { title, firstFile, hasFiles, isPressRelease, isPoster, isSocialMedia,
          isVideo, isReport, isCampaign, deptName, priority, notes } = ctx;
  const fileRef = firstFile ? `"${firstFile}"` : `the submission for "${title}"`;

  const specific = [];

  if (hasFiles) {
    if (isVideo)        specific.push(`The video format chosen for "${title}" is appropriate for digital distribution and demonstrates strong production awareness.`);
    else if (isPoster)  specific.push(`The poster/banner format of ${fileRef} is well-suited to the campaign objective and the file has been submitted in a workable format.`);
    else if (isPressRelease) specific.push(`"${title}" follows the structural conventions of a press release, which will ease the editorial review process.`);
    else if (isReport)  specific.push(`"${title}" demonstrates sound document discipline — the structured format aids the review and approval workflow.`);
    else if (isSocialMedia) specific.push(`The social media format of ${fileRef} reflects an understanding of platform content expectations.`);
    else                specific.push(`${fileRef} has been submitted in an appropriate file format, enabling direct review and feedback without format conversion.`);
  }

  if (priority === 'High') specific.push(`The high-priority classification of "${title}" has been acknowledged and the submission is timely relative to the expected delivery window.`);
  if (notes)              specific.push(`The accompanying task notes provide useful context that aids the reviewer's understanding of the intent behind "${title}".`);
  if (total >= 75)        specific.push(`The overall quality of "${title}" positions it as a ${deptName || 'departmental'} reference piece that future submissions can benchmark against.`);

  // Fill remaining from template if needed
  const templateStrengths = template.strengths.map(s =>
    s.replace(/\.$/, ` — as observed in "${title}".`)
  );
  const merged = [...new Set([...specific, ...templateStrengths])];
  return merged.slice(0, 3);
}

/**
 * Build task-specific improvements for demo mode.
 */
function buildImprovements(ctx, total, template) {
  const { title, firstFile, hasFiles, isPressRelease, isPoster, isSocialMedia,
          isVideo, isReport, isCampaign, isEmail, deptName, priority, notes } = ctx;
  const fileRef = firstFile ? `"${firstFile}"` : `the submission for "${title}"`;

  const specific = [];

  if (isPressRelease) specific.push(`Add a media contact block at the end of "${title}" including a named spokesperson, direct phone number, and email address — this is mandatory for all Capital One Group press releases.`);
  if (isPoster)       specific.push(`Ensure ${fileRef} is exported at 300 DPI with 3mm bleed on all sides for any physical print production; supply an RGB version separately for digital placements.`);
  if (isSocialMedia)  specific.push(`Strengthen the CTA in "${title}" with a platform-specific directive (e.g., "Swipe up", "Link in bio", "Comment below") that ties directly to the campaign's conversion goal.`);
  if (isVideo)        specific.push(`Add burnt-in captions to ${fileRef} — at least 85% of social video is consumed without sound, making captions essential for message delivery and accessibility compliance.`);
  if (isReport)       specific.push(`Prepend an executive summary (maximum one page) to "${title}" — senior leadership reviewers need to extract key decisions and recommendations without reading the full document.`);
  if (isEmail)        specific.push(`Test "${title}" across at least three email clients (Gmail, Outlook, Apple Mail) and two screen sizes before sending — rendering inconsistencies in Outlook are the most common cause of failed email campaigns.`);
  if (isCampaign)     specific.push(`Develop a measurement framework for "${title}" before launch — define KPIs (reach, engagement rate, click-through, conversion) and set up tracking so performance can be reported within 48 hours of going live.`);

  if (!specific.length && hasFiles) specific.push(`Include a version number, author name, and submission date in ${fileRef} to facilitate version control and audit trail requirements.`);
  if (!notes)         specific.push(`Add a notes field to "${title}" describing the intended audience, distribution channel, and campaign objective — this context will significantly improve the quality of future AI evaluations.`);

  const templateImprovements = template.improvements.map(s =>
    s.replace(/\.$/, ` — apply this specifically to the "${title}" submission.`)
  );
  const merged = [...new Set([...specific, ...templateImprovements])];
  return merged.slice(0, 3);
}

// ── Department mock templates (base scores and fallback text) ─────────────────
const MOCK_TEMPLATES = {
  'PR & Media': {
    criteria: [
      { name: 'Brand Voice & Tone',    base: 20 },
      { name: 'Message Clarity',       base: 19 },
      { name: 'Media Readiness',       base: 18 },
      { name: 'Compliance & Accuracy', base: 21 },
    ],
    strengths: [
      'Content aligns with Capital One Group\'s professional communication standards.',
      'Key messaging is positioned well for the intended media audience.',
      'Tone is appropriate for a financial services brand.',
    ],
    improvements: [
      'Include a direct quote from a senior spokesperson to strengthen credibility.',
      'Add specific data points or statistics to support key claims.',
      'Ensure all regulatory disclaimers are clearly visible.',
    ],
  },
  'Digital': {
    criteria: [
      { name: 'Platform Suitability', base: 20 },
      { name: 'Engagement Potential', base: 18 },
      { name: 'Brand Consistency',    base: 22 },
      { name: 'Call to Action',       base: 17 },
    ],
    strengths: [
      'Visual format is well-suited to the target social platform.',
      'Brand colours and logo are correctly applied.',
      'Content topic is timely and relevant to the audience.',
    ],
    improvements: [
      'Strengthen the call-to-action — it should be more specific and prominent.',
      'Consider A/B testing the headline copy to improve click-through rate.',
      'Add relevant hashtags and platform-specific SEO keywords.',
    ],
  },
  'Creative': {
    criteria: [
      { name: 'Visual Impact',     base: 21 },
      { name: 'Brand Alignment',   base: 20 },
      { name: 'Technical Quality', base: 19 },
      { name: 'Creative Concept',  base: 22 },
    ],
    strengths: [
      'Strong use of brand colours creates immediate visual recognition.',
      'Composition and layout demonstrate professional design sensibility.',
      'Creative concept effectively communicates the intended message.',
    ],
    improvements: [
      'Logo placement could be more prominent for better brand recall.',
      'Typography contrast needs improvement for accessibility compliance.',
      'Ensure final export resolution meets print and digital specifications.',
    ],
  },
  'Admin / Ops': {
    criteria: [
      { name: 'Completeness',          base: 22 },
      { name: 'Clarity & Structure',   base: 20 },
      { name: 'Accuracy',              base: 21 },
      { name: 'Operational Standards', base: 19 },
    ],
    strengths: [
      'Document structure is logical and easy to navigate.',
      'Key operational information is present and clearly presented.',
      'Content is consistent with organisational procedures.',
    ],
    improvements: [
      'Add a version control footer with date and author information.',
      'Include a summary or executive overview at the top of the document.',
      'Cross-reference with the latest compliance guidelines before distribution.',
    ],
  },
};

const DEFAULT_MOCK = {
  criteria: [
    { name: 'Relevance',    base: 20 },
    { name: 'Quality',      base: 19 },
    { name: 'Clarity',      base: 20 },
    { name: 'Completeness', base: 18 },
  ],
  strengths: [
    'Work submitted on time and meets basic task requirements.',
    'Content is relevant to the department\'s objectives.',
    'Overall quality is satisfactory for the current stage.',
  ],
  improvements: [
    'Review content against department-specific brand guidelines.',
    'Seek peer feedback before final submission.',
    'Ensure all required sections are complete and accurate.',
  ],
};

function gradeFromScore(score) {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

function recommendationFromScore(score) {
  if (score >= 75) return 'Approved';
  if (score >= 55) return 'Needs Revision';
  return 'Not Recommended';
}

/**
 * Build a task-specific mock evaluation with unique, contextual feedback
 * for each criterion, strength, and improvement — no generic repeated text.
 */
function buildMockEvaluation(task, deptName) {
  const template = MOCK_TEMPLATES[deptName] || DEFAULT_MOCK;
  const ctx      = analyseTask(task, deptName);

  // Vary scores based on task properties
  const seed         = task.title.length + (task.attachments?.length ?? 0) * 3;
  const priorityBonus = { High: 2, Medium: 0, Low: -2 }[task.priority] ?? 0;
  const hasFiles      = (task.attachments?.length ?? 0) > 0;

  const criteria = template.criteria.map((c, i) => {
    const variation = ((seed + i * 7) % 5) - 2;  // –2 to +2
    const score     = Math.min(25, Math.max(10, c.base + variation + priorityBonus + (hasFiles ? 1 : 0)));
    const feedback  = buildCriterionFeedback(c.name, ctx, score);
    return { name: c.name, score, maxScore: 25, feedback };
  });

  const total  = criteria.reduce((s, c) => s + c.score, 0);
  const grade  = gradeFromScore(total);
  const rec    = recommendationFromScore(total);

  const strengths    = buildStrengths(ctx, total, template);
  const improvements = buildImprovements(ctx, total, template);

  const fileDetail = ctx.firstFile ? ` The submitted file "${ctx.firstFile}" was reviewed as part of this assessment.` : '';
  const notesDetail = task.notes   ? ` Task notes: "${task.notes.slice(0, 80)}${task.notes.length > 80 ? '…' : ''}".` : '';
  const summary = `This ${deptName || 'departmental'} evaluation covers the submission "${task.title}" (Priority: ${task.priority}, Status: ${task.status}).${fileDetail}${notesDetail} The work ${total >= 75 ? 'demonstrates a commendable standard overall' : total >= 55 ? 'shows satisfactory effort with clear areas for improvement' : 'requires significant revision before it is ready for approval'}. ${rec === 'Approved' ? 'The submission is ready to progress to the next stage of the workflow.' : rec === 'Needs Revision' ? 'Address the specific improvement points below and resubmit for a follow-up review.' : 'A substantial rework is required — refer to the detailed criteria feedback and improvement recommendations below.'}`;

  return { score: total, grade, summary, criteria, strengths, improvements, recommendation: rec };
}

// ── Main handler ──────────────────────────────────────────────────────────────
// POST /api/evaluate/:taskId
export const evaluateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate('department', 'name')
      .populate('assignedTo', 'fullName')
      .populate('createdBy',  'fullName');

    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const deptName = task.departmentName || task.department?.name || '';

    // ── Demo mode: no API key configured ─────────────────────────────────────
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'your_anthropic_api_key_here') {
      const evaluation = buildMockEvaluation(task, deptName);
      return res.json({
        taskId:     task._id,
        taskTitle:  task.title,
        department: deptName,
        imageCount: 0,
        demo:       true,
        evaluation,
      });
    }

    // ── Live mode: call Claude ────────────────────────────────────────────────
    const systemText = (DEPT_SYSTEM[deptName] || DEFAULT_SYSTEM) + JSON_INSTRUCTION;

    const taskContextLines = [
      `Task title: "${task.title}"`,
      `Department: ${deptName || 'General'}`,
      `Priority: ${task.priority}`,
      `Status: ${task.status}`,
      task.notes        ? `Task notes / brief: "${task.notes}"` : null,
      `Submitted by: ${task.createdBy?.fullName ?? 'Unknown'}`,
      task.assignedTo   ? `Assigned to: ${task.assignedTo.fullName}` : null,
    ].filter(Boolean);

    const attachments = task.attachments ?? [];
    taskContextLines.push(
      attachments.length > 0
        ? `Attached files (${attachments.length}): ${attachments.map(a => `"${a.originalName}" (${a.mimetype})`).join(', ')}`
        : 'No files attached.'
    );

    const content = [];
    content.push({ type: 'text', text: taskContextLines.join('\n') });

    let imageCount = 0;

    for (const att of attachments) {
      if (IMAGE_TYPES.has(att.mimetype) && att.size <= MAX_IMAGE_BYTES) {
        const filePath = path.join(UPLOADS_DIR, att.filename);
        if (fs.existsSync(filePath)) {
          const data = fs.readFileSync(filePath).toString('base64');
          content.push({ type: 'image', source: { type: 'base64', media_type: att.mimetype, data } });
          content.push({ type: 'text', text: `[Image above is the file named "${att.originalName}" — evaluate what you can observe in this image directly.]` });
          imageCount++;
        }
      } else {
        const sizeKb = att.size ? `${(att.size / 1024).toFixed(1)} KB` : 'unknown size';
        content.push({
          type: 'text',
          text: `Non-image file: "${att.originalName}" (${att.mimetype ?? 'unknown type'}, ${sizeKb}) — infer quality from the file name, type, and the task context above. Reference this file by name in your feedback.`,
        });
      }
    }

    content.push({
      type: 'text',
      text: `REMINDER: Every criterion feedback sentence must reference "${task.title}" or the specific file names listed above. Do NOT write feedback that could apply to any task — each sentence must be tied to THIS specific submission. Provide your evaluation JSON now.`,
    });

    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1500,
      system:     systemText,
      messages:   [{ role: 'user', content }],
    });

    const raw     = message.content[0]?.text?.trim() ?? '';
    const jsonStr = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    const result  = JSON.parse(jsonStr);

    res.json({ taskId: task._id, taskTitle: task.title, department: deptName, imageCount, demo: false, evaluation: result });

  } catch (err) {
    console.error('evaluateTask error:', err);

    const status = err.status ?? err.statusCode;
    if (status === 401) {
      return res.status(500).json({ message: 'Invalid Anthropic API key. Open Backend/.env, replace ANTHROPIC_API_KEY with your real key from console.anthropic.com, then restart the server.' });
    }
    if (status === 403) {
      return res.status(500).json({ message: 'Your Anthropic API key does not have permission to use this model. Check your plan at console.anthropic.com.' });
    }
    if (status === 429) {
      return res.status(500).json({ message: 'Anthropic rate limit reached. Please wait a moment and try again.' });
    }
    if (status === 529 || status === 503) {
      return res.status(500).json({ message: 'The AI service is temporarily overloaded. Please try again in a few seconds.' });
    }
    if (err instanceof SyntaxError) {
      return res.status(500).json({ message: 'AI returned an unexpected response format. Please try again.' });
    }

    res.status(500).json({ message: err.message || 'Evaluation failed.' });
  }
};
