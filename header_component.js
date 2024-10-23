class CustomHeader extends HTMLElement {
    constructor() {
        super();

        // Attach a shadow DOM to the element
        const shadow = this.attachShadow({ mode: 'open' });

        // Create a template for the header
        const template = document.createElement('template');
        template.innerHTML = `

      <header>
        <h1><a href="index.html">lilli garden</a></h1>
    
        <nav>
            <a href="about.html">about</a>
            <a href="work.html">work</a>
            <a href="contact.html">contact</a>
        </nav>
    </header>
        `;

           // Append the template content to the shadow DOM
           shadow.appendChild(template.content.cloneNode(true));

           // Fetch the external CSS file and apply it to the shadow DOM
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

// Define the new custom element
customElements.define('custom-header', CustomHeader);
