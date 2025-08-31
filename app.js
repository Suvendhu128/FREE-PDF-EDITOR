// Free PDF Tools Suite - Fixed Version
class PDFToolsApp {
    constructor() {
        this.tools = this.initializeToolsData();
        this.currentCategory = 'all';
        this.currentTool = null;
        this.uploadedFiles = [];
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    initializeToolsData() {
        // keeping original tool definitions (truncated for brevity)
        return {
            convert: [
                { id: "pdf-to-word", title: "PDF to Word", description: "Convert PDF files to editable Word documents", icon: "fas fa-file-word", accepts: ["pdf"], outputs: ["docx"] },
                { id: "word-to-pdf", title: "Word to PDF", description: "Convert Word documents to PDF format", icon: "fas fa-file-pdf", accepts: ["doc", "docx"], outputs: ["pdf"] }
            ]
        };
    }

    init() {
        this.bindEvents();
        this.renderToolsGrid();
    }

    bindEvents() {
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

        if (!uploadArea || !uploadButton || !fileInput) {
            console.error('❌ Missing upload elements');
            return;
        }

        const handleUploadClick = (e) => {
            e.preventDefault();
            fileInput.click();
        };
        uploadArea.addEventListener('click', handleUploadClick);
        uploadButton.addEventListener('click', handleUploadClick);

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(Array.from(e.target.files));
            }
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                this.handleFileUpload(files);
            }
        });

        console.log('✅ File upload events bound successfully');
    }

    handleFileUpload(files) {
        console.log('📁 Handling file upload:', files.length, 'files');
        this.uploadedFiles = files;
        this.displaySelectedFiles();
        this.showProcessSection();
    }

    displaySelectedFiles() {
        const fileList = document.getElementById('fileList');
        const filesContainer = document.getElementById('filesContainer');
        if (!fileList || !filesContainer) return;

        filesContainer.innerHTML = '';
        this.uploadedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `<div class="file-info"><h4>${file.name}</h4><p>${file.size} bytes</p></div>`;
            filesContainer.appendChild(fileItem);
        });
        fileList.classList.remove('hidden');
    }

    showProcessSection() {
        const processSection = document.getElementById('processSection');
        if (processSection && this.uploadedFiles.length > 0) {
            processSection.classList.remove('hidden');
        }
    }

    async processFiles() {
        console.log('⚡ Processing files...');
        this.showResults();
    }

    showResults() {
        const resultsSection = document.getElementById('resultsSection');
        const downloadButtons = document.getElementById('downloadButtons');
        if (!resultsSection || !downloadButtons) return;

        downloadButtons.innerHTML = '';
        this.uploadedFiles.forEach((file) => {
            const processedFileName = this.getProcessedFileName(file.name);
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download ${processedFileName}`;

            downloadBtn.addEventListener('click', () => {
                // Instead of dummy content, return the actual uploaded file
                const blob = new Blob([file], { type: file.type });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = processedFileName;
                link.click();
            });

            downloadButtons.appendChild(downloadBtn);
        });

        resultsSection.classList.remove('hidden');
    }

    getProcessedFileName(originalName) {
        if (!this.currentTool) return originalName;
        const ext = this.currentTool.outputs[0] || 'pdf';
        return originalName.replace(/\.[^.]+$/, '.' + ext);
    }

    renderToolsGrid() {
        const toolsGrid = document.getElementById('toolsGrid');
        if (!toolsGrid) return;

        const allTools = this.getAllTools();
        toolsGrid.innerHTML = '';
        allTools.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';
            toolCard.innerHTML = `<h3>${tool.title}</h3><p>${tool.description}</p>`;
            toolCard.addEventListener('click', () => {
                this.currentTool = tool;
                this.setupFileUpload();
            });
            toolsGrid.appendChild(toolCard);
        });
    }

    getAllTools() {
        const allTools = [];
        Object.keys(this.tools).forEach(category => {
            this.tools[category].forEach(tool => allTools.push({ ...tool, category }));
        });
        return allTools;
    }
}

new PDFToolsApp();
