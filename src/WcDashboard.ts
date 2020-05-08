import { html, css, LitElement, property } from 'lit-element';

export class WcDashboard extends LitElement {
  static styles =css`
      section {
        display: grid;
        grid-gap: 15px;
        grid-template-rows: repeat(var(--wc-dashboard-rows, 2), 1fr);
        grid-template-columns: repeat(var(--wc-dashboard-cols, 4), 1fr);
        grid-auto-rows: 1fr;
          grid-column-gap: 30px;
          grid-row-gap: 30px;
       /* grid-template-rows: repeat(5, 200px);
        grid-template-columns: repeat(5, 1fr);
         grid-template-columns: repeat(auto-fit, minmax(300px, 300px));
        grid-template-rows: repeat(5, 200px);
        grid-auto-flow: row dense;
        min-height: 100vh;*/
      }

      slot::slotted(*) {
          cursor: move;
      }

      slot::slotted(.divRec) {
          cursor: move;
          padding: 35px 20px;
          font-size: 20px;
          background-color: #ff0000;
      }

      slot::slotted(.ghost) {
        border: 1px dashed #000;
        background-color: #fff;
      }

      slot::slotted(.custom-drag-ghost) {
        /* The original cloned element must not take place up in the page and must not be visible */
        position: absolute;
        top: -99999px;
        left: -99999px;
        /* Just for appearance */
        background-color: #edb458;
        border: 1px solid #e8871e;
      }

      slot::slotted(.hidden-drag-ghost) {
        opacity: 0;
      }

      slot::slotted(.transition) {
        transition: all 2s ease-out .5s;
        top: 0;
      }
  `;
/*
  static get properties() {
    return {
      title: { type: String },
      counter: { type: Number },
      dragEl: { type: Element },
      nextEl: { type: Element },
      gridRows: { type: Number },
      gridColumns: { type: Number },
      elementConfiguration: { type: Array, reflect: true },
    };
  }*/

  @property({type: String}) title = 'Hey there';

  @property({type: Number}) counter = 5;

  @property({type:  HTMLElement}) dragEl: HTMLElement | null = null;
  @property({type: Element}) nextEl = null;

  @property({type: Number}) gridRows = 4;
  @property({type: Number}) gridColumns = 4;
  @property({type: Array, reflect: true}) elementConfiguration: { row: number; col: number; order: number; }[] = [];

  __onSlotchange() {
    console.log("_onSlotchange");
    this.__updateSlotConfiguration();
  }

  updated(changedProperties: any) {
    this.style.setProperty('--wc-dashboard-cols', this.gridColumns + "");
    this.style.setProperty('--wc-dashboard-rows', this.gridRows + "");
    if (changedProperties.has("elementConfiguration")) {
      console.log(this.elementConfiguration);
      this.__updateSlotConfiguration();
    }
  }

  __onDragstart(e:DragEvent) {
    this.dragEl = e.target as HTMLElement;
    if (this.dragEl != null) {
      // @ts-ignore
      this.nextEl = this.dragEl.nextSibling;

      e.dataTransfer!.effectAllowed = 'move';
      //e.dataTransfer.setData('Text', this.dragEl.textContent);
      /*
          section.addEventListener('dragover', this._onDragOver, false);
          section.addEventListener('dragend', this._onDragEnd, false);
      */
      setTimeout(() => this.__addGhost(this.dragEl), 0);
    }
  }


  __onDragover(e: DragEvent) {
    const node = e.target as HTMLElement;
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';

    if( node && node !== this.dragEl && node.nodeName === 'DIV'){
      // getBoundinClientRect contains location-info about the element (relative to the viewport)
      const targetPos = node.getBoundingClientRect();
      // checking that dragEl is dragged over half the target y-axis or x-axis. (therefor the .5)
      const next = (e.clientY - targetPos.top) / (targetPos.bottom - targetPos.top) > .5 || (e.clientX - targetPos.left) / (targetPos.right - targetPos.left) > .5;
      if (this.shadowRoot !== undefined) {
        const slotted = this.shadowRoot!.querySelector('slot');
        if (next && slotted != null) {
          // switch order
          /*const targetOrder = target.style.order;
          target.style.order = this.dragEl.style.order;
          this.dragEl.style.order = targetOrder;*/
          // switch element
          const indexTarget = Array.from(slotted!.assignedElements()).indexOf(node);
          // const targetConfiguration = this.elementConfiguration[indexTarget];
          const indexDragEl = Array.from(slotted!.assignedElements()).indexOf(this.dragEl!);
          const targetOrder = this.elementConfiguration[indexTarget].order;
          this.elementConfiguration[indexTarget].order = this.elementConfiguration[indexDragEl].order;

          this.elementConfiguration[indexDragEl].order = targetOrder;

          this.__updateSlotConfiguration();

          console.log('Order switched');
          /*
          target.style.order--;
          this.dragEl.style.order++;
           */
        }
      }
      //slotted.insertBefore(this.dragEl, next && target.nextSibling || target);

      /*  console.log("oldPos:" + JSON.stringify(oldPos));
       console.log("newPos:" + JSON.stringify(newPos)); */
      /* console.log(newPos.top === oldPos.top ? 'They are the same' : 'Not the same'); */
      // console.log(oldPos);
    }
  }

  __onDragend(evt: any) {
    evt.preventDefault();
    /*newPos = [...section.children].map(child => {
         let pos = document.getElementById(child.id).getBoundingClientRect();
         return pos;
       });
    console.log(newPos);*/
    this.dragEl!.classList!.remove('ghost');
    /*section.removeEventListener('dragover', _onDragOver, false);
    section.removeEventListener('dragend', _onDragEnd, false);

    nextEl !== dragEl.nextSibling ? onUpdate(dragEl) : false;*/
  }

  __addGhost(dragEl: any) {
    dragEl.classList.add('ghost');
  }

  __updateSlotConfiguration() {
    const slotted = this.shadowRoot!.querySelector('slot');
    let index = 0;
    slotted!.assignedElements().forEach( (element ) => {
      let htmlElement = element as HTMLElement;
      if (index < this.elementConfiguration.length) {
        htmlElement.style.order = String(this.elementConfiguration[index].order);
        if (typeof this.elementConfiguration[index].col !== 'undefined') {
          htmlElement.style.gridColumnStart = "span " + this.elementConfiguration[index].col;
        } else {
          htmlElement.style.gridColumnStart = "span 1";
        }
        if (typeof this.elementConfiguration[index].row !== 'undefined') {
          htmlElement.style.gridRowStart = "span " + this.elementConfiguration[index].row;
        } else {
          htmlElement.style.gridRowStart = "span 1";
        }
      } else {
        htmlElement.style.order = String(index);
        this.elementConfiguration.push( {row: 1, col: 1, order: index});
      }
      index++;
      element.setAttribute("draggable", "true");
    });
  }

  render() {
    return html`
      <section @dragstart="${this.__onDragstart}" @dragover="${this.__onDragover}"  @dragend="${this.__onDragend}">
        <slot @slotchange="${this.__onSlotchange}"></slot>
    </section>
    `;
  }
}
