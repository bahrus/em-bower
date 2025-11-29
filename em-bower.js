// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import { dispatchEvent as de } from 'trans-render/positractions/dispatchEvent.js';
import { upShadowSearch } from 'mount-observer/upShadowSearch.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP, BAP} from './ts-refs/em-bower/types' */;

/** @type {WeakSet<HTMLTemplateElement>} */
const cleansed = new WeakSet();

/** @type {WeakMap<HTMLTemplateElement, string>} */
const styleLookup = new WeakMap();

const rnGuid = Symbol.for('NFweAigLiEKNat98Vdnf5w');

/**
 * @implements {Actions}
 * 
 */
class EmBower extends BE {
    /**
     * @type {BEConfig<BAP, Actions & IEnhancement>}
     */
    static config = {
        propInfo: {
            ...propInfo,
            path: {}
        },
        positractions: [resolved, rejected],
        compacts: {
            when_path_changes_call_act: 0,
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

        if(!cleansed.has(template)){
            cleansed.add(template);
            const style = template.content.querySelector('style');
            if(style){
                styleLookup.set(template, style.innerHTML);
                style.remove();
            }
            
        }
        const styleS = styleLookup.get(template);
        if(styleS !== undefined){
            const rn = /** @type {any} */ (enhancedElement.getRootNode());
            /**
             * @type {WeakSet<HTMLTemplateElement> | undefined}
             */
            let rnStyleLookup = rn[rnGuid];
            if(!rnStyleLookup){
                rnStyleLookup = new WeakSet();
                rn[rnGuid] = rnStyleLookup;
            };
            if(!rnStyleLookup.has(template)){
                rnStyleLookup.add(template);
                const style = document.createElement('style');
                style.innerHTML = styleS;
                (rn.head || rn).appendChild(style);
            }
        }
        

        // Clone the template content
        const clone = /** @type {DocumentFragment} */ (template.content.cloneNode(true));

        // Substitute {{dataset.xxx}} expressions with values from element's dataset
        const walker = document.createTreeWalker(
            clone,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            null
        );

        
        const nodesToProcess = [];
        let node;
        while ((node = walker.nextNode())) {
            // why not just do all the logic below, right here, Claude?
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

        // Find the slot element
        const slot = clone.querySelector('slot');
        if (!slot) throw 404;

        enhancedElement.after(clone);
        const parentOfSlot = slot.parentElement;
        if(parentOfSlot && 'moveBefore' in parentOfSlot){
            parentOfSlot.moveBefore(enhancedElement, slot);
        }else{
            slot.after(enhancedElement);
        }
        
        slot.remove();

        

        return /** @type {PAP} */ ({
            resolved: true,
        });
    }
}

await EmBower.bootUp();
export { EmBower };