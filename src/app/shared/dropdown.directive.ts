import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  exportAs: 'appDropdown'
})
export class DropdownDirective {
  private isInside = false;
  @HostBinding('class.show') isOpen = false;
  constructor() { }
  @HostListener('click') onToggle(): void {
    this.isOpen = !this.isOpen;
    this.isInside = true;
  }
  @HostListener('document:click') onClickOutside(): void {
    if (!this.isInside) {
      this.isOpen = false;
    } else {
      this.isInside = false;
    }
  }

}
