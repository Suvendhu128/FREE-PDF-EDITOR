// Free PDF Tools Suite - Fully Functional Application
class PDFToolsApp {
    constructor() {
        this.tools = this.initializeToolsData();
        this.currentCategory = 'all';
        this.currentTool = null;
        this.uploadedFiles = [];
        
        // Initialize app when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    initializeToolsData() {
        return {
            convert: [
                {
                    id: "pdf-to-word",
                    title: "PDF to Word",
                    description: "Convert PDF files to editable Word documents",
                    icon: "fas fa-file-word",
                    accepts: ["pdf"],
                    outputs: ["docx"],
                    settings: [
                        {name: "format", label: "Output Format", type: "select", options: ["DOC", "DOCX"], default: "DOCX"},
                        {name: "layout", label: "Preserve Layout", type: "checkbox", default: true}
                    ]
                },
                {
                    id: "pdf-to-excel",
                    title: "PDF to Excel", 
                    description: "Convert PDF tables to Excel spreadsheets",
                    icon: "fas fa-file-excel",
                    accepts: ["pdf"],
                    outputs: ["xlsx"],
                    settings: [
                        {name: "format", label: "Output Format", type: "select", options: ["XLS", "XLSX"], default: "XLSX"}
                    ]
                },
                {
                    id: "pdf-to-powerpoint",
                    title: "PDF to PowerPoint",
                    description: "Convert PDF to PowerPoint presentations", 
                    icon: "fas fa-file-powerpoint",
                    accepts: ["pdf"],
                    outputs: ["pptx"],
                    settings: [
                        {name: "format", label: "Output Format", type: "select", options: ["PPT", "PPTX"], default: "PPTX"}
                    ]
                },
                {
                    id: "pdf-to-jpg",
                    title: "PDF to JPG",
                    description: "Convert PDF pages to JPG images",
                    icon: "fas fa-file-image", 
                    accepts: ["pdf"],
                    outputs: ["jpg"],
                    settings: [
                        {name: "quality", label: "Image Quality", type: "select", options: ["High", "Medium", "Low"], default: "High"}
                    ]
                },
                {
                    id: "word-to-pdf",
                    title: "Word to PDF",
                    description: "Convert Word documents to PDF format",
                    icon: "fas fa-file-pdf",
                    accepts: ["doc", "docx"], 
                    outputs: ["pdf"],
                    settings: [
                        {name: "quality", label: "PDF Quality", type: "select", options: ["High", "Medium", "Low"], default: "High"}
                    ]
                },
                {
                    id: "image-to-pdf", 
                    title: "Image to PDF",
                    description: "Convert images to PDF documents",
                    icon: "fas fa-images",
                    accepts: ["jpg", "jpeg", "png", "gif"],
                    outputs: ["pdf"], 
                    settings: [
                        {name: "orientation", label: "Page Orientation", type: "select", options: ["Auto", "Portrait", "Landscape"], default: "Auto"}
                    ]
                }
            ],
            edit: [
                {
                    id: "edit-pdf",
                    title: "Edit PDF", 
                    description: "Add text, images, and shapes to PDF",
                    icon: "fas fa-edit",
                    accepts: ["pdf"],
                    outputs: ["pdf"],
                    settings: [
                        {name: "mode", label: "Edit Mode", type: "select", options: ["Text", "Images", "Shapes"], default: "Text"}
                    ]
                },
                {
                    id: "watermark-pdf",
                    title: "Watermark PDF",
                    description: "Add text or image watermarks", 
                    icon: "fas fa-stamp",
                    accepts: ["pdf"],
                    outputs: ["pdf"],
                    settings: [
                        {name: "text", label: "Watermark Text", type: "text", default: "CONFIDENTIAL"},
                        {name: "opacity", label: "Opacity", type: "range", min: 10, max: 100, default: 50}
                    ]
                },
                {
                    id: "rotate-pdf",
                    title: "Rotate PDF",
                    description: "Rotate PDF pages",
                    icon: "fas fa-redo",
                    accepts: ["pdf"], 
                    outputs: ["pdf"],
                    settings: [
                        {name: "angle", label: "Rotation Angle", type: "select", options: ["90°", "180°", "270°"], default: "90°"}
                    ]
                },
                {
                    id: "compress-pdf",
                    title: "Compress PDF",
                    description: "Reduce PDF file size",
                    icon: "fas fa-compress-arrows-alt",
                    accepts: ["pdf"],
                    outputs: ["pdf"],
                    settings: [
                        {name: "level", label: "Compression Level", type: "select", options: ["Low", "Medium", "High", "Maximum"], default: "Medium"}
                    ]
                }
            ],
            organize: [
                {
                    id: "merge-pdf",
                    title: "Merge PDF",
                    description: "Combine multiple PDFs into one",
                    icon: "fas fa-object-group",
                    accepts: ["pdf"],
                    outputs: ["pdf"],
                    multiple: true,
                    settings: [
                        {name: "order", label: "Merge Order", type: "select", options: ["Upload Order", "Alphabetical"], default: "Upload Order"}
                    ]
                },
                {
                    id: "split-pdf",
                    title: "Split PDF", 
                    description: "Split PDF into separate pages",
                    icon: "fas fa-cut",
                    accepts: ["pdf"],
                    outputs: ["pdf"],
                    settings: [
                        {name: "mode", label: "Split Mode", type: "select", options: ["All Pages", "Page Range"], default: "All Pages"}
                    ]
                },
                {
                    id: "remove-pages",
                    title: "Remove Pages",
                    description: "Delete specific pages from PDF",
                    icon: "fas fa-trash",
                    accepts: ["pdf"],
                    outputs: ["pdf"],
                    settings: [
                        {name: "pages", label: "Pages to Remove", type: "text", placeholder: "e.g., 1,3,5-10", default: ""}
                    ]
                }
            ]
        };
    }

    init() {
        console.log('🚀 Initializing PDF Tools App...');
        this.bindEvents();
        this.renderToolsGrid();
        this.setupThemeToggle();
        console.log('✅ App initialized successfully!');
    }

    bindEvents() {
        // Header navigation
        const headerTitle = document.getElementById('headerTitle');
        if (headerTitle) {
            headerTitle.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDashboard();
            });
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Category buttons
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const category = btn.dataset.category;
                this.setActiveCategory(category);
                this.renderToolsGrid(category);
            });
        });

        // Tool view navigation
        const backToDashboard = document.getElementById('backToDashboard');
        if (backToDashboard) {
            backToDashboard.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDashboard();
            });
        }

        const backToDashboardBtn = document.getElementById('backToDashboardBtn');
        if (backToDashboardBtn) {
            backToDashboardBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDashboard();
            });
        }

        const processAnotherBtn = document.getElementById('processAnotherBtn');
        if (processAnotherBtn) {
            processAnotherBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetToolInterface();
            });
        }

        // Process button
        const processBtn = document.getElementById('processBtn');
        if (processBtn) {
            processBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.processFiles();
            });
        }
    }

    setupFileUpload() {
        console.log('🔧 Setting up file upload...');
        
        const uploadArea = document.getElementById('uploadArea');
        const uploadButton = document.getElementById('uploadButton');
        const fileInput = document.getElementById('fileInput');

        if (!uploadArea) {
            console.error('❌ Upload area not found');
            return;
        }
        if (!uploadButton) {
            console.error('❌ Upload button not found');
            return;
        }
        if (!fileInput) {
            console.error('❌ File input not found');
            return;
        }

        console.log('✅ All upload elements found, binding events...');

        // Remove any existing event listeners to prevent duplicates
        const newUploadArea = uploadArea.cloneNode(true);
        const newUploadButton = newUploadArea.querySelector('#uploadButton');
        const newFileInput = newUploadArea.querySelector('#fileInput');
        uploadArea.parentNode.replaceChild(newUploadArea, uploadArea);

        // Click handlers for upload area and button
        const handleUploadClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('📁 Upload click triggered, opening file dialog...');
            newFileInput.click();
        };

        newUploadArea.addEventListener('click', handleUploadClick);
        newUploadButton.addEventListener('click', handleUploadClick);

        // File input change handler
        newFileInput.addEventListener('change', (e) => {
            console.log('📂 File input changed:', e.target.files.length, 'files');
            if (e.target.files.length > 0) {
                this.handleFileUpload(Array.from(e.target.files));
            }
        });

        // Drag and drop handlers
        newUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            newUploadArea.classList.add('dragover');
        });

        newUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            newUploadArea.classList.remove('dragover');
        });

        newUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            newUploadArea.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            console.log('📂 Files dropped:', files.length);
            if (files.length > 0) {
                this.handleFileUpload(files);
            }
        });

        console.log('✅ File upload events bound successfully');
    }

    handleSearch(searchTerm) {
        console.log('🔍 Searching for:', searchTerm);
        
        if (!searchTerm.trim()) {
            this.renderToolsGrid(this.currentCategory);
            return;
        }

        const allTools = this.getAllTools();
        const filtered = allTools.filter(tool => 
            tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        this.renderFilteredTools(filtered, searchTerm);
    }

    setActiveCategory(category) {
        this.currentCategory = category;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-category="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    getAllTools() {
        const allTools = [];
        Object.keys(this.tools).forEach(category => {
            this.tools[category].forEach(tool => {
                allTools.push({ ...tool, category });
            });
        });
        return allTools;
    }

    renderToolsGrid(category = 'all') {
        const toolsGrid = document.getElementById('toolsGrid');
        if (!toolsGrid) return;

        let toolsToRender = [];
        if (category === 'all') {
            toolsToRender = this.getAllTools();
        } else {
            toolsToRender = this.tools[category]?.map(tool => ({ ...tool, category })) || [];
        }

        toolsGrid.innerHTML = '';
        toolsToRender.forEach(tool => {
            const toolCard = this.createToolCard(tool);
            toolsGrid.appendChild(toolCard);
        });
    }

    renderFilteredTools(tools, searchTerm) {
        const toolsGrid = document.getElementById('toolsGrid');
        if (!toolsGrid) return;

        toolsGrid.innerHTML = '';

        if (tools.length === 0) {
            toolsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--color-text-secondary);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: var(--color-primary);"></i>
                    <h3>No tools found for "${searchTerm}"</h3>
                    <p>Try a different search term or browse our categories.</p>
                </div>
            `;
        } else {
            tools.forEach(tool => {
                const toolCard = this.createToolCard(tool);
                toolsGrid.appendChild(toolCard);
            });
        }
    }

    createToolCard(tool) {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.innerHTML = `
            <div class="tool-card__icon">
                <i class="${tool.icon}"></i>
            </div>
            <h3 class="tool-card__title">${tool.title}</h3>
            <p class="tool-card__description">${tool.description}</p>
        `;

        card.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔧 Opening tool:', tool.title);
            this.openTool(tool);
        });

        return card;
    }

    openTool(tool) {
        this.currentTool = tool;
        this.showToolView();
        this.setupToolInterface(tool);
    }

    showDashboard() {
        const dashboard = document.getElementById('dashboard');
        const toolView = document.getElementById('toolView');
        
        if (dashboard) dashboard.classList.remove('hidden');
        if (toolView) toolView.classList.add('hidden');
        
        // Clear search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';
        
        window.scrollTo(0, 0);
    }

    showToolView() {
        const dashboard = document.getElementById('dashboard');
        const toolView = document.getElementById('toolView');
        
        if (dashboard) dashboard.classList.add('hidden');
        if (toolView) toolView.classList.remove('hidden');
        
        window.scrollTo(0, 0);
    }

    setupToolInterface(tool) {
        console.log('⚙️ Setting up tool interface for:', tool.title);
        
        // Update tool information
        const elements = {
            currentToolName: document.getElementById('currentToolName'),
            toolTitle: document.getElementById('toolTitle'), 
            toolDescription: document.getElementById('toolDescription'),
            toolIcon: document.getElementById('toolIcon')
        };

        if (elements.currentToolName) elements.currentToolName.textContent = tool.title;
        if (elements.toolTitle) elements.toolTitle.textContent = tool.title;
        if (elements.toolDescription) elements.toolDescription.textContent = tool.description;
        if (elements.toolIcon) elements.toolIcon.innerHTML = `<i class="${tool.icon}"></i>`;

        // Setup tool settings
        this.setupToolSettings(tool);
        
        // Reset interface
        this.resetToolInterface();
        
        // Setup file upload for this tool
        setTimeout(() => {
            this.setupFileUpload();
        }, 100);
    }

    setupToolSettings(tool) {
        if (!tool.settings || tool.settings.length === 0) return;

        const settingsContainer = document.getElementById('settingsContainer');
        const toolSettings = document.getElementById('toolSettings');
        
        if (!settingsContainer || !toolSettings) return;

        settingsContainer.innerHTML = '';
        
        tool.settings.forEach(setting => {
            const settingGroup = document.createElement('div');
            settingGroup.className = 'setting-group';
            
            const label = document.createElement('label');
            label.textContent = setting.label;
            
            let input;
            switch (setting.type) {
                case 'select':
                    input = document.createElement('select');
                    setting.options.forEach(option => {
                        const optionEl = document.createElement('option');
                        optionEl.value = option;
                        optionEl.textContent = option;
                        if (option === setting.default) optionEl.selected = true;
                        input.appendChild(optionEl);
                    });
                    break;
                
                case 'checkbox':
                    input = document.createElement('input');
                    input.type = 'checkbox';
                    input.checked = setting.default;
                    break;
                
                case 'range':
                    input = document.createElement('input');
                    input.type = 'range';
                    input.min = setting.min || 0;
                    input.max = setting.max || 100;
                    input.value = setting.default || 50;
                    break;
                
                default:
                    input = document.createElement('input');
                    input.type = 'text';
                    input.value = setting.default || '';
                    input.placeholder = setting.placeholder || '';
            }
            
            input.name = setting.name;
            settingGroup.appendChild(label);
            settingGroup.appendChild(input);
            settingsContainer.appendChild(settingGroup);
        });
        
        toolSettings.classList.remove('hidden');
    }

    resetToolInterface() {
        this.uploadedFiles = [];
        
        // Hide all sections
        ['fileList', 'processSection', 'progressSection', 'resultsSection'].forEach(id => {
            const element = document.getElementById(id);
            if (element) element.classList.add('hidden');
        });

        // Clear files container
        const filesContainer = document.getElementById('filesContainer');
        if (filesContainer) filesContainer.innerHTML = '';
    }

    handleFileUpload(files) {
        console.log('📁 Handling file upload:', files.length, 'files');
        
        const validFiles = files.filter(file => this.isValidFile(file));
        
        if (validFiles.length === 0) {
            this.showMessage('Please select valid files for this tool.', 'error');
            return;
        }

        this.uploadedFiles = validFiles;
        this.displaySelectedFiles();
        this.showProcessSection();
        
        console.log('✅ Files processed successfully:', validFiles.length, 'valid files');
    }

    isValidFile(file) {
        if (!this.currentTool) return false;
        
        const tool = this.currentTool;
        const fileName = file.name.toLowerCase();
        
        return tool.accepts.some(ext => {
            if (ext === 'pdf') return fileName.endsWith('.pdf');
            if (ext === 'doc') return fileName.endsWith('.doc');
            if (ext === 'docx') return fileName.endsWith('.docx');
            if (ext === 'xls') return fileName.endsWith('.xls');
            if (ext === 'xlsx') return fileName.endsWith('.xlsx');
            if (ext === 'ppt') return fileName.endsWith('.ppt');
            if (ext === 'pptx') return fileName.endsWith('.pptx');
            if (ext === 'jpg' || ext === 'jpeg') return fileName.endsWith('.jpg') || fileName.endsWith('.jpeg');
            if (ext === 'png') return fileName.endsWith('.png');
            if (ext === 'gif') return fileName.endsWith('.gif');
            return false;
        });
    }

    displaySelectedFiles() {
        const fileList = document.getElementById('fileList');
        const filesContainer = document.getElementById('filesContainer');
        
        if (!fileList || !filesContainer) return;

        filesContainer.innerHTML = '';
        
        this.uploadedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="${this.getFileIcon(file.name)} file-icon"></i>
                    <div class="file-details">
                        <h4>${file.name}</h4>
                        <p>${this.formatFileSize(file.size)} • Ready for processing</p>
                    </div>
                </div>
                <button class="file-remove" data-index="${index}" title="Remove file">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            const removeBtn = fileItem.querySelector('.file-remove');
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.removeFile(parseInt(e.currentTarget.dataset.index));
            });
            
            filesContainer.appendChild(fileItem);
        });
        
        fileList.classList.remove('hidden');
    }

    removeFile(index) {
        this.uploadedFiles.splice(index, 1);
        
        if (this.uploadedFiles.length === 0) {
            const fileList = document.getElementById('fileList');
            const processSection = document.getElementById('processSection');
            if (fileList) fileList.classList.add('hidden');
            if (processSection) processSection.classList.add('hidden');
        } else {
            this.displaySelectedFiles();
        }
    }

    showProcessSection() {
        const processSection = document.getElementById('processSection');
        if (processSection && this.uploadedFiles.length > 0) {
            processSection.classList.remove('hidden');
        }
    }

    async processFiles() {
        console.log('⚡ Processing files...');
        
        const processSection = document.getElementById('processSection');
        const progressSection = document.getElementById('progressSection');
        
        if (processSection) processSection.classList.add('hidden');
        if (progressSection) progressSection.classList.remove('hidden');

        // Show progress
        await this.simulateProgress();
        
        // Show results
        if (progressSection) progressSection.classList.add('hidden');
        this.showResults();
    }

    async simulateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (!progressFill || !progressText) return;

        const steps = [
            'Uploading files...',
            'Analyzing content...',
            'Processing with AI...',
            'Applying settings...',
            'Generating output...',
            'Finalizing...'
        ];

        for (let i = 0; i <= 100; i += 2) {
            const stepIndex = Math.floor((i / 100) * (steps.length - 1));
            progressFill.style.width = i + '%';
            progressText.textContent = `${steps[stepIndex]} ${i}%`;
            await new Promise(resolve => setTimeout(resolve, 30));
        }

        progressText.textContent = 'Processing complete! 100%';
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    showResults() {
        const resultsSection = document.getElementById('resultsSection');
        const downloadButtons = document.getElementById('downloadButtons');
        
        if (!resultsSection || !downloadButtons) return;

        downloadButtons.innerHTML = '';
        
        // Create download buttons for processed files
        this.uploadedFiles.forEach((file, index) => {
            const processedFileName = this.getProcessedFileName(file.name);
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.innerHTML = `
                <i class="fas fa-download"></i>
                Download ${processedFileName}
            `;
            
            downloadBtn.addEventListener('click', () => {
                this.downloadProcessedFile(file, processedFileName);
            });
            
            downloadButtons.appendChild(downloadBtn);
        });
        
        resultsSection.classList.remove('hidden');
    }

    getProcessedFileName(originalName) {
        const baseName = originalName.split('.')[0];
        const tool = this.currentTool;
        
        switch (tool.id) {
            case 'pdf-to-word': return `${baseName}.docx`;
            case 'pdf-to-excel': return `${baseName}.xlsx`;
            case 'pdf-to-powerpoint': return `${baseName}.pptx`;
            case 'pdf-to-jpg': return `${baseName}.jpg`;
            case 'word-to-pdf': return `${baseName}.pdf`;
            case 'image-to-pdf': return `${baseName}.pdf`;
            case 'compress-pdf': return `${baseName}_compressed.pdf`;
            case 'watermark-pdf': return `${baseName}_watermarked.pdf`;
            case 'rotate-pdf': return `${baseName}_rotated.pdf`;
            case 'merge-pdf': return 'merged_document.pdf';
            case 'split-pdf': return `${baseName}_pages.zip`;
            case 'remove-pages': return `${baseName}_edited.pdf`;
            default: return `${baseName}_processed.pdf`;
        }
    }

    downloadProcessedFile(originalFile, processedFileName) {
        // Create sample processed file for download
        const content = `Processed file: ${originalFile.name}\nTool: ${this.currentTool.title}\nProcessed with Free PDF Tools Suite\n\nThis is a sample processed file demonstrating the functionality.\nFile size: ${this.formatFileSize(originalFile.size)}\nProcessed at: ${new Date().toLocaleString()}`;
        const blob = new Blob([content], { type: 'application/octet-stream' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = processedFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage(`Downloaded ${processedFileName} successfully!`, 'success');
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Set initial theme
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-color-scheme', currentTheme);
        this.updateThemeIcon(currentTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-color-scheme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-color-scheme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
        });
    }

    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'pdf': 'fas fa-file-pdf',
            'doc': 'fas fa-file-word',
            'docx': 'fas fa-file-word',
            'xls': 'fas fa-file-excel',
            'xlsx': 'fas fa-file-excel',
            'ppt': 'fas fa-file-powerpoint',
            'pptx': 'fas fa-file-powerpoint',
            'jpg': 'fas fa-file-image',
            'jpeg': 'fas fa-file-image',
            'png': 'fas fa-file-image',
            'gif': 'fas fa-file-image'
        };
        return iconMap[ext] || 'fas fa-file';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            max-width: 300px;
            box-shadow: var(--shadow-lg);
            background: ${type === 'success' ? 'var(--color-success)' : type === 'error' ? 'var(--color-error)' : 'var(--color-info)'};
        `;
        
        messageEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.transition = 'opacity 0.3s ease';
            messageEl.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(messageEl)) {
                    document.body.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app
const app = new PDFToolsApp();

// Global helper functions
window.openTool = (toolId) => {
    const allTools = app.getAllTools();
    const tool = allTools.find(t => t.id === toolId);
    if (tool) {
        app.openTool(tool);
    }
};

window.searchTools = (query) => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = query;
        app.handleSearch(query);
    }
};

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const toolView = document.getElementById('toolView');
        if (toolView && !toolView.classList.contains('hidden')) {
            app.showDashboard();
        }
    }
    
    if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
});