// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import { dispatchEvent as de } from 'trans-render/positractions/dispatchEvent.js';
import { upShadowSearch } from 'mount-observer/upShadowSearch.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP, BAP} from './ts-refs/em-bower/types' */;


/**
 * @implements {Actions}
 * 
 */
class EmBower extends BE {
    /**
     * @type {BEConfig<BAP, Actions & IEnhancement>}
     */
    static config = {
        propDefaults: {
        },
        propInfo: {
            ...propInfo,
        },
        positractions: [resolved, rejected],
        actions: {

        }
    };

    de = de;

    /**
     * 
     * @param {BAP} self 
     */
    act(self) {
        const { path, enhancedElement } = self;
        // Get the template selector from em-bower attribute
        const template = upShadowSearch(enhancedElement, path);
        if (!(template instanceof HTMLTemplateElement)) throw 404;

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
        if (enhancedElement instanceof HTMLElement) {
            nodesToProcess.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    // Process text nodes for {{}} expressions
                    const text = node.textContent;
                    if (text !== null) {
                        const substituted = text.replace(/\{\{dataset\.(\w+)\}\}/g, (match, key) => {
                            return enhancedElement.dataset[key] || '';
                        });
                        if (text !== substituted) {
                            node.textContent = substituted;
                        }
                    }

                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // Process attributes for {{}} expressions
                    Array.from(node.attributes).forEach(attr => {
                        /**
                         * @type {string}
                         */
                        const value = attr.value;
                        const substituted = value.replace(/\{\{dataset\.(\w+)\}\}/g, (match, key) => {
                            return enhancedElement.dataset[key] || '';
                        });
                        if (value !== substituted) {
                            attr.value = substituted;
                        }
                    });
                }
            });
        }


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
        return /** @type {PAP} */ ({
            resolved: true,
        });
    }
}

await EmBower.bootUp();
export { EmBower };