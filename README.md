jasc
================================

This jQuery plugin lets you create a loan amortization schedule. It calculates base, %, installment and remaining balance per month. Plugin uses bootstrap for layout, but it is not required for correct functioning.

Include relevant files (in the `<head>`, or before closing `</body>` tag):

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="jquery.asc.js"></script>
```

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

Android app by @nodoze313 based on jasc: https://play.google.com/store/apps/details?id=com.zemlyaozer.simplamort
