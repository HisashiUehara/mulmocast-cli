# RELEASE NOTE

# v1.1.0
## RELEASE NOTE

**MulmoCast CLI v1.1.0** introduces major architectural improvements with schema version 1.1, advanced sound effects, and enhanced video model management.

### Breaking Changes

**Schema Version 1.1**
- Updated MulmoScript schema from 1.0 to 1.1 requiring file updates
- In `mulmoPresentationStyleSchema`, the `provider` and `model` fields have been removed from top-level `speechParams` and moved into each individual `speaker` object
- Each speaker must specify own provider field

**Before (0.x.y):**
```json
"speechParams": {
  "provider": "nijivoice",
  "speakers": {
    "Presenter": {
      "voiceId": "9d9ed276-49ee-443a-bc19-26e6136d05f0"
    }
  }
}
```

**After (1.1.x):**

```json
"speechParams": {
  "speakers": {
    "Presenter": {
      "provider": "nijivoice",
      "voiceId": "9d9ed276-49ee-443a-bc19-26e6136d05f0"
    }
  }
}
```

**Migration Notes**
- This change breaks compatibility with some existing Mulmo Scripts.  
  However, when using the CLI, scripts are automatically transformed before execution, so no action is needed in most cases.
- CLI automatically transforms scripts with `$mulmocast.version: "1.0"` during execution
- For programmatic usage, use `MulmoScriptMethod.validate()` for transformation
- Please set `$mulmocast.version` to `1.1` for new scripts

### New Features

- **Default Speaker System**: Mark speakers with `default: true` to auto-assign throughout presentations
- **Sound Effect Generation**: AI-powered audio effects via Replicate's zsxkib/mmaudio synchronized with video ([sample](https://github.com/receptron/mulmocast-cli/blob/1.1.0/scripts/test/test_sound_effect.json))
- **Centralized Video Models**: Unified configuration for 11 Replicate models with duration validation and pricing ([sample](https://github.com/receptron/mulmocast-cli/blob/1.1.0/scripts/test/test_replicate.json))

### Technical Improvements

- **BGM Asset Library**: Added 9 commercially licensed BGM tracks with Suno AI metadata for Electron app
- **Model Parameter Fix**: Corrected minimax/hailuo-02 image input mapping (first_frame_image) ([sample](https://github.com/receptron/mulmocast-cli/blob/1.1.0/scripts/test/test_replicate.json))
- **Data-Driven Models**: Replaced hardcoded video model handling with centralized configuration
- **Code Cleanup**: Removed deprecated helper methods and updated 38 templates for new speaker system
- **Enhanced Providers**: Improved provider2agent mapping with sound effect agent integration

This release significantly modernizes the speech system architecture while introducing powerful new audio-visual capabilities for content creation.

# v.0.1.7
## RELEASE NOTE

**MulmoCast CLI v0.1.7** significantly expands video generation capabilities with new AI models and introduces character-based presentation templates, while improving system performance and reliability.

### Expanded Video Generation Models

**New AI Models for Video Creation**
- **minimax/hailuo-02**: Physics-specialized model excellent for realistic motion and complex physics simulations ([sample](https://github.com/receptron/mulmocast-cli/blob/0.1.7/scripts/test/test_replicate.json))
- **Google Veo Models**: Added Veo-2 and Veo-3 support for versatile video generation
- **ByteDance Seedance**: Both lite and pro versions for different quality/speed trade-offs
- **Additional Models**: Pixverse v4.5, Kwaivgi Kling models, and Minimax video-01 for diverse visual styles

### Character-Based Presentations

**Ani Character Templates**
- New bilingual character templates with anime/manga styling and personality-driven narration ([English template](https://github.com/receptron/mulmocast-cli/blob/0.1.7/assets/templates/ani.json), [Japanese template](https://github.com/receptron/mulmocast-cli/blob/0.1.7/assets/templates/ani_ja.json))
- Enhanced voice customization with speech parameter controls for character-specific audio
- Supports both English and Japanese presentations with consistent character personality

### Performance & System Improvements
- **Audio Processing Optimizations**: BGM processing now automatically skips when volume is set to 0, improving generation speed
- **Configuration & Setup**: Updated default video provider from Google to Replicate with optimized model selection

### Technical Improvements & Bug Fixes
- **Reliability**: Fixed a critical audio detection bug to prevent race conditions and improve movie audio quality.
- **Type Safety**: Enhanced TypeScript safety with new image asset definitions and refined schemas.
- **Dependencies**: Updated core dependencies, including GraphAI packages and security patches for `marked`.
- **Code Quality**: Improved module organization, eliminated circular dependencies, and standardized default values.
- **Documentation**: Updated OpenAI image generation setup guides.
- **Test Maintenance**: Refreshed expired Nijivoice voice IDs in test configurations.

This release expands your creative possibilities with more AI video models and character-based storytelling while making the system faster and more reliable.

# v.0.1.6
## RELEASE NOTE

**MulmoCast CLI v0.1.6** focuses on code quality improvements and creative sample expansion through comprehensive refactoring and enhanced development tooling.

### Samples & Templates

**Google Veo-3-Fast Creative Showcase**
- Comprehensive sample script with 8 diverse video generation scenarios including ASMR fruit cutting, Arctic fox drone footage, stand-up comedy, and clay animation ([sample](https://github.com/receptron/mulmocast-cli/blob/0.1.6/scripts/snakajima/veo3_sample.json))
- Optimized 8-second clips for pure visual content with professional caption formatting
- Reference-driven content with Twitter/X inspiration links for creative guidance

### Technical Improvements
- Audio processing and type safety improvements in combine_audio_files_agent.ts
- Google Cloud config centralization, ESLint/browser support, and API key cleanup
- Unified formatting, enhanced tests, and clearer type annotations

### Bug Fixes
- Nijivoice voice IDs in test configs updated for continued TTS functionality

This release emphasizes developer experience and code maintainability while providing new creative examples for video generation workflows.

# v.0.1.5
## RELEASE NOTE

**MulmoCast CLI v0.1.5** enhances TTS capabilities with comprehensive model selection and improves video generation with Google Veo3 support.

### Video Generation

**Google Veo3 Support**
- Enhanced video generation with Google Veo3 integration through improved Replicate support ([sample](https://github.com/receptron/mulmocast-cli/blob/0.1.5/scripts/test/test_replicate.json))
- Smart audio handling with automatic detection of audio tracks in generated content
- Better audio mixing when combining multiple video sources

### TTS & Audio Enhancements

**ElevenLabs Model Selection**
- Configure ElevenLabs models with fine-grained control: eleven_multilingual_v2, eleven_turbo_v2_5, eleven_flash_v2_5 ([sample](https://github.com/receptron/mulmocast-cli/blob/0.1.5/scripts/test/test_elevenlabs_models.json))
- Set models at system, speaker, or speechParams level with environment variable support
- Updated default from eleven_monolingual_v1 to eleven_multilingual_v2

**Advanced Audio Control**
- Implemented audio track detection for both external and AI-generated videos
- Enhanced TTS processing with improved type safety for Nijivoice and OpenAI agents

### Breaking Changes

**Audio Schema Changes**
- Added `audioParams.movieVolume` parameter for controlling audio levels from videos ([sample](https://github.com/receptron/mulmocast-cli/blob/0.1.5/scripts/test/test_audio.json))

### Documentation & Configuration

**Comprehensive Setup Guides**
- API configuration documentation covering baseURL setup, Azure OpenAI integration, and service-specific API key management ([docs](https://github.com/receptron/mulmocast-cli/blob/0.1.5/docs/faq_en.md))
- Image generation configuration guide with practical examples ([docs](https://github.com/receptron/mulmocast-cli/blob/0.1.5/docs/faq_ja.md))

### Technical Improvements
- **Browser Compatibility**: Exported provider utilities for browser environments, enabling MulmoCast components usage in web applications
- Enhanced schema descriptions and parameter definitions
- Removed obsolete generatedVoice parameter from Nijivoice implementation

This release provides greater control over audio generation quality, speed, and language support while improving video integration and expanding platform versatility.

# v.0.1.4
## RELEASE NOTE

**MulmoCast CLI v0.1.4** introduces beat-specific movie model configuration and significantly expands movie generation capabilities with 8 new AI models.

### New Features

**Beat-Specific Movie Model Configuration**
- Configure different movie generation models for individual beats within a single presentation ([sample](https://github.com/receptron/mulmocast-cli/blob/0.1.4/scripts/test/test_replicate.json))
- Set global default movie models and override them per beat for optimal results
- Mix and match movie models to leverage each model's unique strengths

**Expanded Movie Generation Models**
- **ByteDance SeedAnce**: `bytedance/seedance-1-lite` (fast, efficient) and `bytedance/seedance-1-pro` (higher quality)
- **Kling Models**: `kwaivgi/kling-v1.6-pro` and `kwaivgi/kling-v2.1` (great for image-to-video)
- **Google Veo**: `google/veo-2`, `google/veo-3`, and `google/veo-3-fast` (versatile and reliable)
- **Minimax**: `minimax/video-01` and `minimax/hailuo-02` (unique artistic styles)
- Comprehensive test suite showing effective usage of each new model ([sample file](https://github.com/receptron/mulmocast-cli/blob/0.1.4/scripts/test/test_replicate.json))

### System Improvements
- **Centralized Configuration**: Improved provider system makes it easier to switch between AI services
- **Better Resource Management**: Enhanced handling of API rate limits and processing constraints
- **Enhanced Type Safety**: Improved TypeScript definitions for better development experience

This release enables greater creative control by allowing you to choose the perfect AI model for each moment in your presentation, opening new possibilities for educational content, marketing materials, and artistic projects.

# v.0.1.3
## RELEASE NOTE

**MulmoCast CLI v0.1.3** introduces advanced character consistency features, template expansion, and significant system improvements for enhanced multimedia content creation.

### New Features

**Reference Images for Character Consistency**
- Generate reference images directly from prompts to maintain consistent character appearance across multiple scenes ([sample](https://github.com/receptron/mulmocast-cli/blob/0.1.3/scripts/test/test_image_refs.json))
- Support for multi-scene storytelling with unified character design

**HTML Templates and Multi-Character Support**
- New templates for HTML-based presentations and complex multi-character storytelling ([templates](https://github.com/receptron/mulmocast-cli/tree/0.1.3/assets/templates/))
- Added 5 new template files: html.json, characters.json, image_refs.json, voice_over.json, and html.json (scripts)

### Breaking Changes (Developers Only)

**Image API Function Signatures Changed**
- `generateBeatImage()` and `generateReferenceImage()` now use single object parameter instead of multiple positional parameters
- **Before:** `generateBeatImage(index, context, settings, callbacks)`
- **After:** `generateBeatImage({ index, context, settings, callbacks })`
- Only affects library users, not CLI users

### Creative Samples

**New Story and Movie Examples**
- "The Girl Who Listened" - Complete multimedia story with Studio Ghibli-style visuals ([sample](https://github.com/receptron/mulmocast-cli/blob/0.1.3/scripts/snakajima/girl_and_cat.json))
- Japanese short animation movie sample with Replicate provider integration ([sample](https://github.com/receptron/mulmocast-cli/blob/0.1.3/scripts/snakajima/replicate_movie_sample.json))

### Technical Improvements

- **Enhanced Type Safety**: Added explicit type definitions to agent functions for better development experience
- **Configuration Management**: Improved settings integration with environment variables
- **Code Quality Enhancements**: Applied comprehensive linting rules and refactored image processing components
- **Logging Improvements**: Reduced console noise during processing

### System Updates
- Updated core dependencies for better performance and stability

This release focuses on character consistency, template expansion, and improved creative workflows for multimedia content creation.

# v.0.1.2
## RELEASE NOTE

**MulmoCast CLI v0.1.2** focuses on performance optimization and dependency maintenance for improved HTML generation efficiency.

- Technical Improvements
  - **HTML Caching Optimization**: Implemented caching for HTML generation to prevent unnecessary regeneration when images are already cached
  - **Package Updates**: Updated core dependencies

# v.0.1.1
## RELEASE NOTE

**MulmoCast CLI v0.1.1** includes improved error handling, code refactoring, and various sample scripts for better development experience.

- New Features
  - **Improved BGM Error Handling**: Clear error messages when BGM file paths are incorrect, HTTP URLs skip file existence validation

- Technical Improvements
  - **Schema Refactoring**: Migrated union literals to enum syntax for cleaner code
  - **Utility Functions**: Extracted file extension logic into reusable `getExtention` function with unit tests
  - **Beat ID File Naming**: When beat has ID specified, that ID is used as name for imageFile and movieFile
  - **UI-Only Movie Model Schemas**: App (UI) focused schema definitions for Google Veo 2.0 and Replicate models
  - **GraphAI Update**: Updated to GraphAI version 2.0.11

- Samples & Templates
  - **Mixed Image Generation**: Added sample demonstrating alternating imagePrompt and htmlPrompt usage ([sample](https://github.com/receptron/mulmocast-cli/blob/0.1.1/scripts/snakajima/peter_lynch.json))
  - **Voice-Over Samples**: Added voice-over samples with Gemini 2.5 Pro auto-generated narration and improved error handling ([fsd_demo](https://github.com/receptron/mulmocast-cli/blob/0.1.1/scripts/snakajima/fsd_demo.json), [template](https://github.com/receptron/mulmocast-cli/blob/0.1.1/scripts/templates/voice_over.json))
  - **Dockerfile Sample**: Added example Dockerfile for running MulmoCast in containers ([docs](https://github.com/receptron/mulmocast-cli/blob/0.1.1/README.md#installation))

- Others
  - **Template Clarity**: Updated Ghibli Shorts template title for better understanding

# v.0.1.0
## RELEASE NOTE

**MulmoCast CLI v0.1.0** introduces voice-over capabilities and enhanced video control features.

- New Features
  - **Voice-Over Narration**: Add narration to existing videos using `voice_over` image type with timing control ([sample](https://github.com/receptron/mulmocast-cli/blob/0.1.0/scripts/test/test_voice_over.json), [docs](https://github.com/receptron/mulmocast-cli/blob/0.1.0/docs/image.md#voice_over))
  - **Video Speed Control**: Adjust playback speed at beat level using `movieParams.speed` parameter ([sample](https://github.com/receptron/mulmocast-cli/blob/0.1.0/scripts/test/test_video_speed.json))
  - **Per-Beat AI Providers**: Specify text-to-image providers at individual beat level ([sample](https://github.com/receptron/mulmocast-cli/blob/0.1.0/scripts/test/test_images.json))

- Technical Updates
  - **Imagen 3.0 Schema**: Added UI-only schema definitions for Google's Imagen 3.0 models
  - **Bug Fixes**: Fixed interactive scripting exit issue and updated Nijivoice voice ID
  - **Error Messages**: Updated error message content

- Others
  - **Voice-Over Documentation**: Added voice-over feature documentation to [image.md](https://github.com/receptron/mulmocast-cli/blob/0.1.0/docs/image.md#voice_over)
  - **Release Notes**: Added documentation for versions 0.0.25-0.0.28
  - **README Updates**: Added `--input-file` option documentation and mode exclusivity notes

# v.0.0.28
## RELEASE NOTE

**MulmoCast CLI v0.0.28** enhances deployment flexibility with custom FFmpeg path configuration.

- System Improvements
  - **FFmpeg Path Configuration**: Added `setFfmpegPath` and `setFfprobePath` functions for custom executable paths
  - **Enhanced Compatibility**: Better support for containerized deployments and non-standard FFmpeg installations

This technical release improves deployment flexibility across different environments while maintaining full backward compatibility.

# v.0.0.27
## RELEASE NOTE

**MulmoCast CLI v0.0.27** introduces music video creation capabilities with caption display while maintaining system stability through comprehensive refactoring.

- New Features
  - **Music Video Mode**: New `suppressSpeech` flag enables creation of music videos with visual captions while suppressing speech audio synthesis

- Others
  - **System Refactoring**: Context initialization improvements and general code quality enhancements
  - **Documentation Updates**: Fixed file references in README.md for accurate template names
  - **Dependency Maintenance**: Updated project packages for security and compatibility

This new feature enables music-focused content creation, expanding creative possibilities beyond traditional speech-based presentations.

# v.0.0.26
## RELEASE NOTE

**MulmoCast CLI v0.0.26** introduces experimental Model Context Protocol (MCP) server implementation.

- New Features
  - **MCP Server Implementation**: Added experimental MCP server with JSON schemas for HTML prompts and MulmoScript configuration

This experimental release introduces MCP server infrastructure for enhanced configuration management and validation capabilities.

# v.0.0.25
## RELEASE NOTE

**MulmoCast CLI v0.0.25** enhances HTML-based image generation with debugging capabilities and lays the foundation for future AI improvements.

- HTML Image Generation Enhancements
  - **HTML Saving**: Automatically save generated HTML files when using htmlPrompt feature for debugging and reuse
  - **Improved LLM Configuration**: Centralized configuration management for better consistency across providers
  - **Token Optimization**: Fixed max_tokens handling to prevent response truncation and optimize API usage

- Others
  - **Educational Content Samples**: Added RL educational scripts demonstrating htmlPrompt vs traditional image generation
  - **Enhanced Documentation**: Comprehensive Anthropic API integration guide and detailed release notes for v0.0.23-v0.0.24
  - **System Stability**: Various maintenance updates to keep the codebase current and reliable

This release strengthens the HTML-based image generation pipeline with improved debugging capabilities and enhanced documentation.

# v.0.0.24
## RELEASE NOTE

**MulmoCast CLI v0.0.24** introduces flexible caption styling with CSS and includes system improvements.

- New Features
  - **CSS-Based Caption Styling**: Replace fixed caption properties with flexible CSS styles, supporting animations, shadows, and gradients

- System Improvements
  - **Centralized API Configuration**: New `settings2GraphAIConfig()` for better multi-provider support
  - **Code Organization**: Unified import paths and centralized prompt management

This release enables unlimited caption customization through CSS while improving code maintainability.

# v.0.0.23
## RELEASE NOTE

**MulmoCast CLI v0.0.23** brings powerful AI video generation, automated content import from URLs, and enhanced creative control for multimedia presentations.

- AI Video Generation
  - **Replicate Integration**: Generate dynamic videos from text descriptions using state-of-the-art AI models
  - **Text-to-Movie**: Create video clips directly from text prompts with Replicate API support
  - **Long Duration Support**: Generate extended content without timeouts or processing limitations

- Content Creation & Import
  - **URL to Script**: Convert any web page into a MulmoScript presentation automatically
  - **Web Content Extraction**: Intelligently structure online articles, documentation, or tutorials
  - **Streamlined Workflow**: Reduce manual effort in content creation

- Creative Enhancements
  - **Vibe Coding Style**: New music video template perfect for programming tutorials ([sample](https://github.com/receptron/mulmocast-cli/blob/0.0.23/scripts/snakajima/vibe_coding.json))
  - **Aspect Fill Support**: Professional image and video framing without distortion
  - **Caption as Style**: Flexible caption control through presentation style system
  - **Non-Interactive Mode**: Automatic template selection for automated workflows

- AI Provider Expansion
  - **Anthropic Claude Support**: Use Claude API for HTML image generation
  - **Provider Flexibility**: Choose between OpenAI, Anthropic, and other providers
  - **Enhanced AI Capabilities**: Better content understanding and generation

- Others
  - **Error Fixes**: Improved speaker validation with clear error messages
  - **Documentation**: Added CLAUDE.md for AI assistance guidelines, updated environment setup docs, fixed header formatting

This release significantly expands MulmoCast's creative possibilities with AI-powered video generation and seamless web content integration.

# v.0.0.22
## RELEASE NOTE

**MulmoCast CLI v0.0.22** introduces AI-powered HTML slide generation and ensures continuous background music in longer presentations.

- New Features
  - **HTML Prompt Support**: Generate data-rich slides using AI-powered HTML generation ([documentation](https://github.com/receptron/mulmocast-cli/blob/0.0.22/docs/image.md#2-htmlprompt))
  - **Data Visualization**: Create charts and infographics with automatic Tailwind CSS and Chart.js integration
  - **Complex Layouts**: Build sophisticated slide designs that were previously difficult with image generation

- Audio Enhancement
  - **BGM Looping**: Background music now loops seamlessly for videos longer than the music duration (contributed by @asuhacoder)
  - **Continuous Audio**: No more silent BGM sections in extended presentations

- Documentation
  - **Updated Image Guide**: Comprehensive documentation for the new htmlPrompt feature
  - **Usage Examples**: Added data visualization and text-based slide examples

This release empowers creators with advanced data presentation capabilities while ensuring professional audio throughout their content.

# v.0.0.21
## RELEASE NOTE

**MulmoCast CLI v0.0.21** focuses on documentation clarity and error handling improvements for a better developer and creator experience.

- Documentation & Guides
  - **Character Control Documentation**: Added comprehensive guide for `beat.imageNames` feature to control character appearances
  - **Audio Spillover Guide**: New documentation explaining how to share narration across multiple beats
  - **FAQ Enhancements**: Added TTS configuration methods and 429 error troubleshooting guides
  - **Historical Release Notes**: Completed documentation for versions 0.0.18-0.0.20

- Error Handling & User Experience
  - **Content Policy Visibility**: Clearer error messages when generation fails due to safety reasons
  - **Reduced Retry Attempts**: Optimized image generation retries from 3 to 2 attempts

- Code Quality
  - **Type Organization**: Refactored session types to centralized location
  - **Bug Fixes**: Fixed typo in audio combination agent

This maintenance release strengthens MulmoCast's foundation through better documentation and clearer communication with users.

# v.0.0.20
## RELEASE NOTE

**MulmoCast CLI v0.0.20** enhances library integration and documentation clarity while introducing artistic new creative possibilities.

- Library Integration & Packaging
  - **Fixed TypeScript Integration**: Resolved critical type errors when importing MulmoCast as a library dependency
  - **Browser Compatibility**: Eliminated `https-proxy-agent` errors and improved cross-environment support
  - **Extended Agent Access**: Made agents directory available for comprehensive API integration in external projects

- New Creative Features
  - **Ghibli Image-Only Template**: Beautiful new template combining Studio Ghibli aesthetic with image-only presentations

- Documentation & User Experience
  - **Documentation Updates**: Clarified `-p` option usage and added multilingual FAQ sections

This focused release resolves critical packaging issues while making custom presentation styles more accessible to creators.

# v.0.0.19
## RELEASE NOTE

**MulmoCast CLI v0.0.19** introduces sophisticated audio mixing controls and creative new presentation features, making multimedia content creation more professional and dynamic.

- Audio Mastery & Mixing Controls
  - **Independent Volume Controls**: Separate `bgmVolume` (default: 0.2) and `audioVolume` (default: 1.0) settings for professional audio balance
  - **Music Video Creation**: New workflow to disable BGM and sync all visuals to a single audio track - perfect for promotional content
  - **Enhanced Spillover**: Intelligent time distribution across beats when durations aren't specified, maintaining minimum 1-second visibility

- Visual Effects & Transitions
  - **Slideout Left Transition**: Dynamic new transition where slides exit stage left, creating engaging progression and flow
  - **Image-Only Templates**: New template for purely visual presentations without text - ideal for photo essays and portfolios

- Architecture & Developer Experience
  - **Image Plugin System**: Split image processing into modular `preprocessor` and `imagePlugin` agents for better extensibility
  - **Context Method Refactoring**: Centralized access patterns through `MulmoStudioContextMethods` for improved maintainability
  - **Enhanced Documentation**: Comprehensive `image.md` updates with detailed prompt interaction examples and generation rules table

- Bug Fixes & Improvements
  - **Multilingual Sync**: Fixed array length mismatches between multilingual data and beats
  - **Movie-Only Beat Timing**: Resolved duration calculation issues for video-only content
  - **Browser Compatibility**: Proper exports configuration for web-based tools and applications
  - **Security Updates**: Patched vulnerabilities in dependencies for improved security posture

This release empowers creators with professional-grade audio control while strengthening the platform's technical foundation for future innovations.

# v.0.0.18
## RELEASE NOTE

**MulmoCast CLI v0.0.18** - Bug fixes and stability improvements

- **Multilingual Fix**: Fixed timing issues in multilingual presentations
- **Code Improvements**: Internal refactoring for better maintainability
- **Documentation**: Enhanced release notes process
- **Dependencies**: Updated GraphAI to v2.0.8

# v.0.0.17
## RELEASE NOTE

**MulmoCast CLI v0.0.17** brings a game-changing audio feature and significant architectural improvements for better performance and reliability.

- Audio Spillover Support
  - **Continuous Narration**: Create presentations where narration flows seamlessly across multiple beats - start speaking in one beat and continue through subsequent beats without text
  - **Precise Timing Control**: Each beat displays for its specified duration while audio continues playing, with the final beat staying visible until narration completes
  - **Creative Freedom**: Perfect for educational content and storytelling where visuals change while maintaining uninterrupted narration

- Performance & Architecture
  - **Parallel Processing**: Multiple media files now process simultaneously, significantly reducing generation time for complex projects
  - **Multilingual Data Separation**: Translation data now stored in separate `{filename}_lang.json` files for better organization

- Others
  - **Browser Compatibility**: Fixed Node.js dependencies to enable MulmoCast schemas in web browsers
  - **Improved Test Visibility**: Validation errors now throw immediately during testing for easier debugging
  - **Enhanced Context Management**: Better state handling throughout the audio generation pipeline
  - **Code Quality**: Extensive refactoring with extracted helper functions for improved maintainability
  - **Dependency Updates**: Updated packages for security and compatibility

This release focuses on giving creators more control over audio timing while significantly improving the tool's internal architecture and reliability.

# v.0.0.16
## RELEASE NOTE

**MulmoCast CLI v0.0.16** introduces revolutionary presentation customization and major performance improvements, making content creation more flexible and powerful than ever.

- Revolutionary Presentation Style System
  - **Independent Style Control**: Use the new `-p` option with file paths to apply different visual styles to the same content without editing scripts
    - Download example styles from [GitHub](https://github.com/receptron/mulmocast-cli/tree/main/assets/styles) or **create your own**
    - Examples:
      - `-p ./downloaded-styles/style.json`
      - `-p ./my-project/custom-style.json`
  - **Built-in Anime Templates**: Choose from professional templates inspired by popular anime (Ghibli, AKIRA, One Piece, Ghost in the Shell)
  - **Mix and Match**: Apply any style to any script - create a Ghibli-style business presentation or an AKIRA-style children's story
  - **Simple Templates**: `text_only` and `text_and_image` options for clean, minimalist presentations

- Enhanced User Experience
  - **Real-time Progress Tracking**: New progress callback system shows exactly what's happening during generation
  - **Faster Processing**: Multiple concurrency improvements for faster image and audio generation
  - **Smart Image Handling**: Automatically extracts images from videos when needed for PDF generation

- Deep Search (Experimental)
  - **AI-Powered Research**: Proof-of-concept feature using web search and reflection agents to enhance content research during script generation

- Others
  - **Translation Bug Fix**: Fixed critical typo that would have broken translation functionality completely
  - **Video Transitions**: Fixed transition handling for single video segments
  - **Legal Compliance**: Switched to properly licensed background music for worry-free distribution
  - **Multilingual FAQ**: Added extensive help documentation in English and Japanese covering workflows, troubleshooting, and upgrade guidance
  - **Concurrency Overhaul**: System-wide improvements to parallel processing and resource management
  - **Modular Audio Processing**: Better code organization with individual beat audio processing
  - **Technical Debt Reduction**: Removed unused code and simplified system components

This release transforms MulmoCast from a content generation tool into a complete creative platform where your imagination is the only limit!

# v.0.0.15
## RELEASE NOTE

**MulmoCast CLI v0.0.15** adds exciting features and improvements to enhance your creative workflows with rich visuals and streamlined production.

- Beat Images & Visual Content
  - Images in Beats: Attach or auto-generate images directly within each beat (scene), enriching your videos with engaging visuals.
  - Multiple Image Types Supported: Easily use URLs, local images, slides, markdown content, charts (Chart.js), diagrams (Mermaid), and HTML-based visuals.
  - Intelligent Image Generation: Automatically creates visuals based on provided prompts or beat text.
  - Explore these features in detail in the updated documentation ([docs/image.md](https://github.com/receptron/mulmocast-cli/blob/0.0.15/docs/image.md)).
  - Sample: [test_beats.json](https://github.com/receptron/mulmocast-cli/blob/0.0.15/scripts/test/test_beats.json)

- Smooth Video Transitions
  - Automatically add smooth transitions between scenes, making your video flow naturally without manual editing.
  - Sample: [test_transition.json](https://github.com/receptron/mulmocast-cli/blob/0.0.15/scripts/test/test_transition.json)

- PDF Output Improvements
  - Standardized PDF output on Puppeteer for selectable text and flexible layouts
  - Enhanced PDF file path handling for better organization
  - Removed the pdf-engine option in favor of the superior Puppeteer implementation

- Improved Error Messages
  - Clearer, helpful error messages, especially for audio generation—no more guessing when something goes wrong.

- Release Readiness
  - Added a release test to verify functionality before publishing a new version. Details: [CONTRIBUTING.md#L144](https://github.com/receptron/mulmocast-cli/blob/0.0.15/CONTRIBUTING.md#L144)

- Other Improvements
  - Documentation improvements for ElevenLabs setup. Details: [README.md#L111-L112](https://github.com/receptron/mulmocast-cli/blob/0.0.15/README.md#L111-L112)
  - Enhanced stability with additional automated tests
  - Minor internal optimizations and typo fixes for smoother operations

Enjoy creating more compelling content effortlessly!

# v.0.0.12
## RELEASE NOTE

**MulmoCast CLI v0.0.12** introduces powerful new features to enhance creative workflows with voice, image, and video generation.

- Customize Background Music
  - You can now specify your own BGM to play behind narration in generated videos.
  - Sample: [trailer.json](https://github.com/receptron/mulmocast-cli/blob/0.0.12/assets/templates/trailer.json)

- Ghibli Comic Style Template
  - Generate whimsical, Ghibli-inspired vertical videos using a ready-made comic-style template.
  - Template: [ghibli_shorts.json](https://github.com/receptron/mulmocast-cli/blob/0.0.12/assets/templates/ghibli_shorts.json)

- ElevenLabs Voice Support
  - Use natural, expressive narration with ElevenLabs TTS voices (API key required).
  - You need to add `ELEVENLABS_API_KEY` to your `.env` file. 
  - Sample: [test_voices.json](https://github.com/receptron/mulmocast-cli/blob/0.0.12/scripts/test/test_voices.json)

- Mixed TTS Providers
  - Assign different TTS providers (e.g., OpenAI + ElevenLabs) to different speakers in the same script.
  - Sample: [test_mixed_providers.json](https://github.com/receptron/mulmocast-cli/blob/0.0.12/scripts/test/test_mixed_providers.json)

- Image Type "beat" 
  - Supports image type 'beat' to reference the output of earlier beats. Each beat can now have an id and refer to another beat’s image.
  - Sample: [test_beats.json](https://github.com/receptron/mulmocast-cli/blob/0.0.12/scripts/test/test_beats.json)

- Fade Transitions Between Scenes
  - Scenes can now fade between images for a smoother, more polished visual flow.

- JPEG Image Support
  - JPEG images are now supported as inputs alongside PNG for editing or composition.


- Other Improvements
  - Simplified audio filenames (beat index removed)
  - Fixed rebuildStudio errors and improved error handling
  - Removed unused code for leaner performance

- Google Image Generation Setup
  - A new guide explains how to enable Google’s Vertex AI for image generation (linked from README).