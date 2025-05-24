import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumbersonly]',
})
export class NumbersonlyDirective {
  private regex = '^[0-9]+(.[0-9]{0,3})?$';

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: any) {
    const initalValue = this.el.nativeElement.value;
    let pattern = new RegExp(this.regex);
    let matchPattern = pattern.test(initalValue);

    if (!matchPattern) {
      this.el.nativeElement.value = '';
    }
    return;
  }
}
