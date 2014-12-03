jasc
================================

This jQuery plugin lets you create a loan amortization schedule. It calculates base, %, installment and remaining balance per month. Plugin uses bootstrap for layout, but it is not required for correct functioning.

You will need two divs:

```html
<div id="schedule-controls"></div>
<div id="schedule-container"></div>
```

And init:
```javascript
$(function(){
    $("#schedule-container").jasc({
      controlsID : 'schedule-controls'
    });
});
```
