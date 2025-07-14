 // Handling both canvases
 const languagesCanvas = document.getElementById('languagesCanvas');
 const toolsCanvas = document.getElementById('toolsCanvas');
 const librariesCanvas = document.getElementById('librariesCanvas'); // New canvas for libraries/frameworks

 // Context for each canvas
 const ctx1 = languagesCanvas.getContext('2d');
 const ctx2 = toolsCanvas.getContext('2d');
 const ctx3 = librariesCanvas.getContext('2d');

 // Set canvas sizes
 languagesCanvas.width = languagesCanvas.offsetWidth;
 languagesCanvas.height = 300;
 toolsCanvas.width = toolsCanvas.offsetWidth;
 toolsCanvas.height = 300;
 librariesCanvas.width = librariesCanvas.offsetWidth;
 librariesCanvas.height = 300;

 const gravity = 0.2;
 const bounceFactor = 0.7;
 const languageCircles = [];
 const toolCircles = [];
 const libFrameCircles = [];
 let draggingCircle = null;
 let offsetX, offsetY;
 
 // Circle constructor
 function Circle(x, y, radius, dx, dy, label, imgSrc = null, ctx) {
     this.x = x;
     this.y = y;
     this.radius = radius;
     this.dx = dx;
     this.dy = dy;
     this.label = label;
     this.imgSrc = imgSrc;
     this.ctx = ctx;  // Each circle knows which canvas context to draw in
     this.img = null;
     this.isDragging = false;
 
     // Load the image if imgSrc is provided
     if (this.imgSrc) {
         this.img = new Image();
         this.img.src = this.imgSrc;
 
         this.img.onload = () => {
             console.log(`Image ${this.label} loaded successfully.`);
         };
 
         this.img.onerror = () => {
             console.error(`Failed to load image for ${this.label}`);
         };
     }
 
     // Draw method
     this.draw = function() {
         // Draw the circle
         this.ctx.beginPath();
         this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
         this.ctx.fillStyle = '#000000';  // Black fill color
         this.ctx.fill();
         this.ctx.strokeStyle = '#00FF00';  // Green border
         this.ctx.lineWidth = 3;
         this.ctx.stroke();
         this.ctx.closePath();
 
         // Draw the image if available and fully loaded
         if (this.img && this.img.complete) {
             const imageSize = this.radius * 1.2; // Resize image to be smaller than the circle
             this.ctx.drawImage(this.img, this.x - imageSize / 2, this.y - imageSize / 2, imageSize, imageSize);
         } else {
             // Draw label if no image or image not loaded
             this.ctx.fillStyle = '#00FF00';  // Green text color
             this.ctx.font = 'bold 14px Courier New';
             this.ctx.textAlign = 'center';
             this.ctx.textBaseline = 'middle';
             this.ctx.fillText(this.label, this.x, this.y);
         }
     };
 
     // Update method for movement and bouncing, with stricter boundary enforcement
     this.update = function(circles, canvasWidth, canvasHeight) {
         // Apply gravity if not dragging
         if (!this.isDragging) {
             this.dy += gravity;
 
             // Ensure the circle doesn't fall out of the canvas vertically
             if (this.y + this.radius + this.dy > canvasHeight) {
                 this.dy = -this.dy * bounceFactor;
                 this.y = canvasHeight - this.radius;
             } else if (this.y - this.radius + this.dy < 0) {
                 this.dy = -this.dy * bounceFactor;
                 this.y = this.radius;
             }
 
             // Ensure the circle doesn't escape horizontally
             if (this.x + this.radius + this.dx > canvasWidth) {
                 this.dx = -this.dx * bounceFactor;
                 this.x = canvasWidth - this.radius;
             } else if (this.x - this.radius + this.dx < 0) {
                 this.dx = -this.dx * bounceFactor;
                 this.x = this.radius;
             }
 
             // Move the circle
             this.x += this.dx;
             this.y += this.dy;
         }
 
         // Check for collisions with other circles
         for (let i = 0; i < circles.length; i++) {
             if (this !== circles[i]) {
                 const dist = Math.hypot(this.x - circles[i].x, this.y - circles[i].y);
                 const minDist = this.radius + circles[i].radius;
 
                 if (dist < minDist) {
                     // Resolve overlap by moving circles apart
                     const angle = Math.atan2(circles[i].y - this.y, circles[i].x - this.x);
                     const overlap = minDist - dist;
                     const resolveX = Math.cos(angle) * overlap / 2;
                     const resolveY = Math.sin(angle) * overlap / 2;
 
                     this.x -= resolveX;
                     this.y -= resolveY;
                     circles[i].x += resolveX;
                     circles[i].y += resolveY;
 
                     // Exchange velocities (basic collision physics)
                     const tempDx = this.dx;
                     const tempDy = this.dy;
                     this.dx = circles[i].dx;
                     this.dy = circles[i].dy;
                     circles[i].dx = tempDx;
                     circles[i].dy = tempDy;
                 }
             }
         }
 
         // Draw the circle
         this.draw();
     };
 }
 
 // Create circles for programming languages
 function createLanguageCircles() {
     const languages = [
         { label: 'HTML', imgSrc:  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-plain-wordmark.svg'},
         { label: 'CSS', imgSrc:  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-plain-wordmark.svg'},
         { label: 'Javascript', imgSrc:  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-plain.svg'},
         { label: 'C', imgSrc:  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg'},
         { label: 'Python', imgSrc:  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg'},
         { label: 'Java', imgSrc:  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original-wordmark.svg'},
         { label: 'Ocaml', imgSrc:  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ocaml/ocaml-original-wordmark.svg'},
         { label: 'PHP', imgSrc:  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg'}
     ];
 
     languages.forEach(lang => {
         const radius = 40;
         const x = Math.random() * (languagesCanvas.width - 2 * radius) + radius;
         const y = Math.random() * (languagesCanvas.height - 2 * radius) + radius;
         const dx = (Math.random() - 0.5) * 2;
         const dy = (Math.random() - 0.5) * 2;
         languageCircles.push(new Circle(x, y, radius, dx, dy, lang.label, lang.imgSrc, ctx1));
     });
 }
 
 // Create circles for tools
 function createToolCircles() {
     const tools = [
         { label: 'Unix', imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unix/unix-original.svg' },
         { label: 'Git', imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
         { label: 'Github', imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original-wordmark.svg' },
         { label: 'Eclipse', imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/eclipse/eclipse-original.svg' },
         { label: 'VSCode', imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
         { label: 'MongoDB', imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
         {label: 'NPM', imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg'},
     ];
 
     tools.forEach(tool => {
         const radius = 40;
         const x = Math.random() * (toolsCanvas.width - 2 * radius) + radius;
         const y = Math.random() * (toolsCanvas.height - 2 * radius) + radius;
         const dx = (Math.random() - 0.5) * 2;
         const dy = (Math.random() - 0.5) * 2;
         toolCircles.push(new Circle(x, y, radius, dx, dy, tool.label, tool.imgSrc, ctx2));
     });
 }
 function createLibFrameCircles() {
     const tools = [
         { label: 'Numpy', imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
         { label: 'Matplotlib', imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg' },
         { label: 'Cv2', imgSrc: 'https://upload.wikimedia.org/wikipedia/commons/3/32/OpenCV_Logo_with_text_svg_version.svg' },
         {label: 'React', imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg'},
         {label: 'Node.js', imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg'},
         {label: 'Express', imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg'},
     ];
 
     tools.forEach(tool => {
         const radius = 40;
         const x = Math.random() * (librariesCanvas.width - 2 * radius) + radius;
         const y = Math.random() * (librariesCanvas.height - 2 * radius) + radius;
         const dx = (Math.random() - 0.5) * 2;
         const dy = (Math.random() - 0.5) * 2;
         libFrameCircles.push(new Circle(x, y, radius, dx, dy, tool.label, tool.imgSrc, ctx3));
     });
 }
 
 // Animate both canvases
 function animateLanguages() {
     ctx1.clearRect(0, 0, languagesCanvas.width, languagesCanvas.height);
     languageCircles.forEach(circle => circle.update(languageCircles, languagesCanvas.width, languagesCanvas.height));
     requestAnimationFrame(animateLanguages);
 }
 
 function animateTools() {
     ctx2.clearRect(0, 0, toolsCanvas.width, toolsCanvas.height);
     toolCircles.forEach(circle => circle.update(toolCircles, toolsCanvas.width, toolsCanvas.height));
     requestAnimationFrame(animateTools);
 }

function animateLibFrame() {
     ctx3.clearRect(0, 0, librariesCanvas.width, librariesCanvas.height);
     libFrameCircles.forEach(circle => circle.update(libFrameCircles, librariesCanvas.width, librariesCanvas.height));
     requestAnimationFrame(animateLibFrame);
 }

 // Initialize
 createLanguageCircles();
 createToolCircles();
 createLibFrameCircles(); 
 animateLanguages();
 animateTools();
 animateLibFrame();

 // Add dragging functionality for both canvases
 [languagesCanvas, toolsCanvas, librariesCanvas].forEach(canvas => {
     canvas.addEventListener('mousedown', (e) => {
         const mouseX = e.offsetX;
         const mouseY = e.offsetY;
         const circles = canvas === languagesCanvas ? languageCircles : canvas === toolsCanvas ? toolCircles : libFrameCircles;
         const ctx = canvas === languagesCanvas ? ctx1 : canvas === toolsCanvas ? ctx2 : ctx3;
 
         // Find the circle the user is trying to drag
         circles.forEach(circle => {
             if (isMouseOnCircle(circle, mouseX, mouseY)) {
                 draggingCircle = circle;
                 offsetX = mouseX - circle.x;
                 offsetY = mouseY - circle.y;
                 circle.isDragging = true;
             }
         });
     });
 
     canvas.addEventListener('mousemove', (e) => {
         if (draggingCircle) {
             const mouseX = e.offsetX;
             const mouseY = e.offsetY;
 
             // Move the dragging circle
             draggingCircle.x = mouseX - offsetX;
             draggingCircle.y = mouseY - offsetY;
 
             // Ensure the circle stays within the canvas bounds
             const canvasWidth = canvas === languagesCanvas ? languagesCanvas.width : toolsCanvas.width;
             const canvasHeight = canvas === languagesCanvas ? languagesCanvas.height : toolsCanvas.height;
 
             if (draggingCircle.x - draggingCircle.radius < 0) draggingCircle.x = draggingCircle.radius;
             if (draggingCircle.x + draggingCircle.radius > canvasWidth) draggingCircle.x = canvasWidth - draggingCircle.radius;
             if (draggingCircle.y - draggingCircle.radius < 0) draggingCircle.y = draggingCircle.radius;
             if (draggingCircle.y + draggingCircle.radius > canvasHeight) draggingCircle.y = canvasHeight - draggingCircle.radius;
         }
     });
 
     canvas.addEventListener('mouseup', () => {
         if (draggingCircle) {
             draggingCircle.isDragging = false;
             draggingCircle = null; // Release the circle
         }
     });
 });
 
 // Function to check if the mouse is over a circle
 function isMouseOnCircle(circle, mouseX, mouseY) {
     const distance = Math.hypot(mouseX - circle.x, mouseY - circle.y);
     return distance < circle.radius;
 }
 
 // Resize canvases when window resizes
 window.addEventListener('resize', () => {
     languagesCanvas.width = languagesCanvas.offsetWidth;
     languagesCanvas.height = 300;
     toolsCanvas.width = toolsCanvas.offsetWidth;
     toolsCanvas.height = 300;
 });
 
 
 
          // Observe each section and add the .section-visible class when it enters the viewport
     const sections = document.querySelectorAll('section');
 
 const observerOptions = {
     threshold: 0.2 // Trigger when 20% of the section is visible
 };
 
 const observer = new IntersectionObserver((entries, observer) => {
     entries.forEach(entry => {
         if (entry.isIntersecting) {
             entry.target.classList.add('section-visible');
             observer.unobserve(entry.target); // Stop observing once it's visible
         }
     });
 }, observerOptions);
 
 sections.forEach(section => {
     observer.observe(section); // Start observing each section
 });