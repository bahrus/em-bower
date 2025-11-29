# em-bower (WIP)

Surround the adorned element with content from a common, reusable template.

Specifically, what *em-bower* does is it takes the following HTML:



```html
<template id=myWrappingContent>
    <fieldset>
        <legend>{{dataset.label}}</legend>
        <label>
            <span>{{dataset.label}}</span>
            <slot></slot>
        </label>
    </fieldset>
</template>

...

<select 
    data-label=Country
    em-bower=myWrappingContent>
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
    <option value="au">Australia</option>
    <option value="de">Germany</option>
    <option value="fr">France</option>
    <option value="jp">Japan</option>
</select>
```

and does the following:

1.  Clones the "myWrappingContent" template.
2.  Substitutes in values from the select element properties into the double brace expressions.
3.  Inserts the clone right after the select element.
4.  Moves the select element right after the slot element.
5.  Deletes the slot element.

So the markup above results in:

```html
<fieldset>
    <legend>Country></legend>
    <label>
        <span>Country</span>
        <select 
            data-label=Country
            em-bower=myWrappingContent>
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="jp">Japan</option>
        </select>
    </label>
</fieldset>
```

> [!NOTE]
> A vscode extension to make navigation from the element adorned by the em-bower attribute to the target element [is available](https://marketplace.visualstudio.com/items?itemName=andersonbruceb.idref).

[TODO]

1.  Support em-bower-h that points to importmap