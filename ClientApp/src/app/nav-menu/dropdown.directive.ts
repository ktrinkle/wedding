import {Directive, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})

export class DropdownDirective {

  constructor( private renderer: Renderer2) {}

  @HostListener('click', ['$event.target.id'])
  onClick(target: any) {
    this.actionElement('show', target, false);
  }

  @HostListener('touch', ['$event.target.id'])
  onTouch(target: any) {
    this.actionElement('show', target, true);
  }

  @HostListener('mouseover', ['$event.target.id'])
  onMouseover(target: any) {
    this.actionElement('show', target, true);
  }

  @HostListener('mouseleave', ['$event.target.id'])
  onMouseLeave(target: any) {
    this.actionElement('show', target, false);
  }

  actionElement(className: string, target: any, addFlag: boolean) {

    var parent: NodeList;

    if (document.getElementById(target)?.children.length == undefined)
    {
      return;
    }

    parent = document.getElementById(target)!.querySelectorAll('ul');
    parent.forEach(
      (node) => {
        if (addFlag)
        {
          this.renderer.removeClass(node, 'hide');
          this.renderer.addClass(node, 'show');
        }
        else
        {
          this.renderer.removeClass(node, 'show');
          this.renderer.addClass(node, 'hide');
        }
      }
    );

  }


}
