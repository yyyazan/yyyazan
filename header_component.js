class CustomHeader extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `

      <header>
            <div class="header-container">
            <img src="owl.jpg" alt="owl" class="logo">
            <h1><a href="index.html">lilli garden</a></h1>
        </div>

        <nav>
            <a href="about.html">about</a>
            <a href="index.html">work</a>
            <a href="guitar lesson.html">guitar lesson</a>
        </nav>
    </header>
        `;

           shadow.appendChild(template.content.cloneNode(true));

           this.loadStyles();
       }
   
       loadStyles() {
           // Create a link element for the external CSS file
           const linkElem = document.createElement('link');
           linkElem.setAttribute('rel', 'stylesheet');
           linkElem.setAttribute('href', 'main_style.css');
   
           // Append the link element to the shadow DOM
           this.shadowRoot.appendChild(linkElem);
       }
   }

customElements.define('custom-header', CustomHeader);
