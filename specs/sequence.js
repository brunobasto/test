{
    // the context is the top most element in which the sequence selectors are
    // going to try to find its elements
    context: 'html > body > div.login',
    // triggers are the elements that are going to trigger your sequence. When
    // the ClickerEngine finds this element, it will start your sequence. If no
    // value is specified, it will default to the context selector.
    trigger: 'input[type=submit]',
    actions: [
        {
            // selectors by default use parent context.
            selector: 'html > body > div.login',
            // context can be changed. Its value can either be another selector
            // or the special values #parent and #last. It defaults to #parent.
            context: '#parent',
            event: 'click',
            // actions can wait for AJAX requests to complete. It defaults to
            // false
            waitAjaxRequests: true
        },
        {
            selector: 'input.login',
            event: 'click',
        }
    ]
}
