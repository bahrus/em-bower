//https://claude.ai/public/artifacts/9b45e13a-2330-4005-8646-5e013c516a41

/**
 * Implements em-bower functionality:
 * - Clones a template specified by selector
 * - Substitutes values from element's dataset into {{}} expressions
 * - Inserts clone after the element
 * - Moves element into the slot position
 * - Removes the slot element
 * 
 * @param {HTMLElement} element - The element with em-bower attribute
 */
function emBower(element) {
    // Get the template selector from em-bower attribute
    const templateSelector = element.getAttribute('em-bower');
    if (!templateSelector) {
        console.error('em-bower attribute is missing or empty');
        return;
    }

    // Find the template
    const template = document.querySelector(templateSelector);
    if (!template || !(template instanceof HTMLTemplateElement)) {
        console.error(`Template not found: ${templateSelector}`);
        return;
    }

    // Clone the template content
    const clone = template.content.cloneNode(true);

    // Substitute {{dataset.xxx}} expressions with values from element's dataset
    const walker = document.createTreeWalker(
        clone,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        null
    );

    const nodesToProcess = [];
    let node;
    while ((node = walker.nextNode())) {
        nodesToProcess.push(node);
    }

    nodesToProcess.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            // Process text nodes for {{}} expressions
            const text = node.textContent;
            const substituted = text.replace(/\{\{dataset\.(\w+)\}\}/g, (match, key) => {
                return element.dataset[key] || '';
            });
            if (text !== substituted) {
                node.textContent = substituted;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Process attributes for {{}} expressions
            Array.from(node.attributes).forEach(attr => {
                const value = attr.value;
                const substituted = value.replace(/\{\{dataset\.(\w+)\}\}/g, (match, key) => {
                    return element.dataset[key] || '';
                });
                if (value !== substituted) {
                    attr.value = substituted;
                }
            });
        }
    });

    // Convert clone to a container to work with
    const container = document.createElement('div');
    container.appendChild(clone);

    // Find the slot element
    const slot = container.querySelector('slot');
    if (!slot) {
        console.error('No <slot> element found in template');
        return;
    }

    // Insert the cloned content after the original element
    const clonedFragment = document.createDocumentFragment();
    while (container.firstChild) {
        clonedFragment.appendChild(container.firstChild);
    }

    // Get reference to slot's parent before we modify anything
    const slotParent = clonedFragment.querySelector('slot')?.parentNode;

    // Insert the fragment after the element
    element.parentNode.insertBefore(clonedFragment, element.nextSibling);

    // Find the slot again in the now-inserted DOM
    const insertedSlot = element.nextSibling.nodeType === Node.ELEMENT_NODE
        ? element.nextSibling.querySelector('slot')
        : null;

    if (!insertedSlot && slotParent) {
        // Walk the siblings to find the slot
        let current = element.nextSibling;
        let foundSlot = null;

        const findSlot = (node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName.toLowerCase() === 'slot') {
                    return node;
                }
                const slotInside = node.querySelector('slot');
                if (slotInside) return slotInside;
            }
            return null;
        };

        while (current && !foundSlot) {
            foundSlot = findSlot(current);
            if (foundSlot) break;
            current = current.nextSibling;
        }

        if (foundSlot) {
            // Move the original element to replace the slot
            const parent = foundSlot.parentNode;
            parent.insertBefore(element, foundSlot);
            foundSlot.remove();
        }
    } else if (insertedSlot) {
        // Move the original element to replace the slot
        const parent = insertedSlot.parentNode;
        parent.insertBefore(element, insertedSlot);
        insertedSlot.remove();
    }
}

/**
 * Initialize em-bower for all elements with em-bower attribute
 */
function initEmBower() {
    const elements = document.querySelectorAll('[em-bower]');
    elements.forEach(element => emBower(element));
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmBower);
} else {
    initEmBower();
}

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { emBower, initEmBower };
}